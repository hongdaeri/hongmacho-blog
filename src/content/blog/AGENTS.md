<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-22 | Updated: 2026-05-22 -->

# blog (content)

## Purpose
실제 블로그 포스트 마크다운. 파일명 컨벤션 `YYYY-MM-DD-slug.md`. `src/content.config.ts`의 zod 스키마로 frontmatter가 검증되고, 빌드 시 `getCollection('blog')`로 정렬·필터링 가능한 컬렉션이 된다. 현재 26편(2026-05-02 ~ 2026-05-22).

## Key Files

| File pattern | Description |
|------|-------------|
| `YYYY-MM-DD-slug.md` | 한 편의 포스트. 파일명 = URL slug = `post.id`. 예: `2026-05-22-english-listening-30d.md` → `/blog/2026-05-22-english-listening-30d` |

## Frontmatter Schema

```yaml
---
title: "포스트 제목"
date: "2026-05-22"             # YYYY-MM-DD regex (zod)
category: dev                  # dev | invest | learn | daily (enum)
excerpt: "140자 이내 요약"     # max 140
featured: false                # 옵션 — true면 홈에서 강조
tags: ["astro", "blog"]        # min 1
readTime: 5                    # 옵션 — 미지정 시 자동 계산
---

본문 (Markdown)
```

## For AI Agents

### Working In This Directory
- **파일명 = slug = URL** 일관성 유지. `[slug].astro:11`의 `params: { slug: post.id }`
- date frontmatter는 **문자열** (`'2026-05-22'`) — `Date` 객체 아님. 사용처에서 `new Date(post.data.date)`로 변환
- category는 4개 enum만 허용 — 새 카테고리 도입 시 [[categories]]도 함께 (`src/lib/categories.ts` + `src/content.config.ts` zod enum + `src/styles/tokens.css`의 `--cat-*`)
- excerpt 140자 초과 시 빌드 실패 (zod max(140))
- tags 최소 1개 필수 (zod min(1))
- readTime 생략 시 [[readTime]] (`src/lib/readTime.ts`)이 200 WPM로 계산

### Testing Requirements
- 새 포스트 추가 후 `npm run build` 통과 — frontmatter 스키마 위반 시 빌드 실패
- `/blog/<slug>` 직접 진입해서 정상 렌더 + 카테고리 배지/태그/날짜 정확한지 확인
- RSS(`/feed.xml`)와 sitemap(`/sitemap.xml`) 양쪽에 새 포스트 포함 확인

### Common Patterns
- 코드 블록: ` ```language ... ``` ` — Shiki(github-dark) 테마 적용
- 이미지: `![alt](URL)` — 외부 호스팅 권장 (Astro `<Image>` 미사용)
- TOC는 h2/h3만 표시 (`[slug].astro:20`)
- `.DS_Store`는 무시 (Astro가 자동 스킵)

## Dependencies

### Internal
- `../../content.config.ts` — zod 스키마
- `../../pages/blog/[slug].astro` — 동적 라우트 (모든 포스트를 정적 생성)
- `../../lib/categories.ts` — category enum 색상
- `../../lib/readTime.ts` — readTime 미지정 시 폴백

### External
- `astro:content` (glob loader, zod 검증)
- Shiki — 코드 하이라이트 (github-dark)

<!-- MANUAL: -->
