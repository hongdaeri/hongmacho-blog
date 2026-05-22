---
title: "Spring Boot API 성능 최적화: 실전에서 배운 교훈"
date: "2026-05-08"
category: "dev"
excerpt: "프로덕션 환경에서 API 응답 시간이 치솟았다. N+1 쿼리 문제부터 캐싱 전략까지, 실제로 효과가 있었던 방법들을 공유한다."
featured: false
tags: ["Spring Boot", "Java", "JPA", "성능 최적화"]
readTime: 7
---

프로덕션 배포 직후 모니터링 알람이 울렸다. API 응답 시간이 갑자기 3초를 넘기 시작했다. 로컬에선 100ms 이하였는데. 이 글은 그 문제를 해결하며 배운 것들이다.

## 문제의 시작: N+1 쿼리

가장 먼저 의심한 건 N+1 쿼리 문제였다. JPA를 사용할 때 가장 흔하게 만나는 함정이다.

```java
// 문제가 있는 코드
@Entity
public class Post {
    @ManyToOne(fetch = FetchType.LAZY)
    private Author author;
    
    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY)
    private List<Tag> tags;
}

// 컨트롤러에서
List<Post> posts = postRepository.findAll(); // 1개 쿼리
posts.forEach(post -> {
    post.getAuthor().getName(); // N개 쿼리 발생
    post.getTags().size();       // 또 N개 쿼리 발생
});
```

게시물 100개를 조회하면 1 + 100 + 100 = 201개의 쿼리가 실행된다. 데이터가 많아질수록 선형적으로 악화된다.

## 해결: Fetch Join과 EntityGraph

```java
// Repository에 JPQL fetch join 적용
@Query("SELECT p FROM Post p JOIN FETCH p.author LEFT JOIN FETCH p.tags")
List<Post> findAllWithAuthorAndTags();
```

혹은 `@EntityGraph`를 사용할 수도 있다.

```java
@EntityGraph(attributePaths = {"author", "tags"})
List<Post> findAll();
```

이 변경 하나로 201개 쿼리가 2개로 줄었다. 응답 시간이 3초에서 200ms로 떨어졌다.

## 인덱스 점검

쿼리 수를 줄였는데도 특정 필터링 API가 느렸다. 실행 계획을 보니 풀 테이블 스캔이 일어나고 있었다.

```sql
-- 실행 계획 확인
EXPLAIN ANALYZE
SELECT * FROM post 
WHERE category = 'dev' AND created_at > '2026-01-01'
ORDER BY created_at DESC;
```

`category`와 `created_at` 복합 인덱스가 없었다.

```sql
CREATE INDEX idx_post_category_created 
ON post (category, created_at DESC);
```

인덱스 추가 후 응답 시간이 200ms에서 30ms로 줄었다.

## 캐싱 전략

자주 조회되지만 자주 바뀌지 않는 데이터(카테고리별 포스트 목록)에 Spring Cache를 적용했다.

```java
@Service
public class PostService {

    @Cacheable(value = "posts", key = "#category")
    public List<PostSummaryDto> getPostsByCategory(String category) {
        return postRepository.findByCategory(category)
            .stream()
            .map(PostSummaryDto::from)
            .toList();
    }

    @CacheEvict(value = "posts", allEntries = true)
    public Post createPost(CreatePostRequest request) {
        return postRepository.save(Post.from(request));
    }
}
```

| 최적화 방법 | 적용 전 | 적용 후 |
|---|---|---|
| N+1 쿼리 제거 | 3,000ms | 200ms |
| 인덱스 추가 | 200ms | 30ms |
| 캐싱 적용 | 30ms | 3ms |

## 교훈

> "섣부른 최적화는 만악의 근원이다. 하지만 측정 없는 최적화는 더 나쁘다."

성능 문제는 항상 측정 먼저다. 실행 계획을 확인하고, 쿼리 수를 세고, 병목을 찾은 다음 최적화한다. 추측으로 최적화하면 잘못된 곳에 에너지를 쏟게 된다.

APM 도구(Datadog, New Relic, 혹은 오픈소스 Pinpoint)를 도입했다면 처음부터 훨씬 빠르게 문제를 찾을 수 있었을 것이다.
