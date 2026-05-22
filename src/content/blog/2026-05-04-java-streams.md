---
title: "Java Stream API 제대로 쓰기"
date: "2026-05-04"
category: "dev"
excerpt: "Java 8 이후 Stream API가 나왔지만, 잘못 쓰면 오히려 가독성과 성능이 나빠진다. 올바른 사용법과 흔한 실수를 정리했다."
featured: false
tags: ["Java", "Stream", "함수형 프로그래밍"]
readTime: 5
---

Java 8에서 Stream API가 나온 지 10년이 넘었다. 그런데 코드 리뷰를 하다 보면 Stream을 쓰면서 오히려 복잡해진 코드를 자주 만난다. 무조건 Stream이 좋은 게 아니다.

## Stream의 기본 구조

Stream 파이프라인은 세 단계로 구성된다.

```java
List<String> result = list.stream()      // 1. 생성
    .filter(s -> s.startsWith("A"))      // 2. 중간 연산 (lazy)
    .map(String::toUpperCase)            // 2. 중간 연산 (lazy)
    .collect(Collectors.toList());       // 3. 최종 연산 (eager)
```

중요한 건 중간 연산은 **lazy**하다는 것이다. 최종 연산이 호출되기 전까지 실행되지 않는다.

## 흔한 실수 1: collect를 중간에 쓰기

```java
// 잘못된 코드 — Stream을 불필요하게 중단시킴
List<String> filtered = list.stream()
    .filter(s -> s.length() > 3)
    .collect(Collectors.toList()); // 여기서 끊고

List<String> result = filtered.stream() // 다시 시작
    .map(String::toUpperCase)
    .collect(Collectors.toList());

// 올바른 코드
List<String> result = list.stream()
    .filter(s -> s.length() > 3)
    .map(String::toUpperCase)
    .collect(Collectors.toList());
```

## 흔한 실수 2: forEach로 외부 상태 변경

```java
// 잘못된 코드 — 외부 상태 변경은 부수 효과를 만든다
List<String> results = new ArrayList<>();
list.stream()
    .filter(s -> s.startsWith("A"))
    .forEach(results::add); // 외부 리스트 수정

// 올바른 코드
List<String> results = list.stream()
    .filter(s -> s.startsWith("A"))
    .collect(Collectors.toList());
```

병렬 스트림에서 외부 상태를 변경하면 스레드 안전 문제가 생긴다.

## 유용한 패턴들

**그룹핑**

```java
Map<String, List<Post>> byCategory = posts.stream()
    .collect(Collectors.groupingBy(Post::getCategory));
```

**Optional과 조합**

```java
Optional<User> user = users.stream()
    .filter(u -> u.getEmail().equals(email))
    .findFirst();

String name = user.map(User::getName).orElse("Unknown");
```

**flatMap으로 중첩 리스트 펼치기**

```java
List<String> allTags = posts.stream()
    .flatMap(post -> post.getTags().stream())
    .distinct()
    .sorted()
    .collect(Collectors.toList());
```

## Stream vs for-loop 선택 기준

| 상황 | 권장 |
|---|---|
| 변환/필터링 파이프라인 | Stream |
| 복잡한 break/continue 로직 | for-loop |
| 외부 상태 변경 | for-loop |
| 병렬 처리 필요 | parallelStream |
| 단순 합산/집계 | Stream (reduce, sum) |

> "Stream은 '어떻게'가 아닌 '무엇을'에 집중하게 해준다. 하지만 모든 상황에서 더 나은 건 아니다."

Stream이 for-loop보다 느릴 수 있는 경우도 있다. 특히 작은 컬렉션이나 primitive 타입을 많이 다룰 때는 `IntStream`, `LongStream`을 쓰는 것이 박싱/언박싱 비용을 줄이는 데 도움이 된다.
