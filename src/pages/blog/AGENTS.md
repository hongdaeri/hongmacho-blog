<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-22 | Updated: 2026-05-22 -->

# blog (pages)

## Purpose
블로그 도메인의 라우트 — 목록(`/blog`)과 동적 포스트 페이지(`/blog/[slug]`). 목록은 클라이언트 사이드 카테고리/태그 필터링, 동적 라우트는 `getStaticPaths`로 모든 포스트를 빌드 시 정적 HTML로 생성한다.

## Key Files

| File | Description |
|------|-------------|
| `index.astro` | **hot path (6x 수정)**. `/blog` 목록 페이지. 모든 포스트를 날짜 desc 정렬, `Sidebar` + `ListItem` 반복 렌더. 쿼리(`?tag=...`, `?category=...`) 또는 클라이언트 JS로 필터 |
| `[slug].astro` | 동적 포스트 페이지. `getStaticPaths`로 모든 포스트 정적 생성. `render(post)`로 `Content` + `headings` 추출, depth 2~3만 TOC로. 같은 카테고리 관련 글 2개 랜덤 선택 |

## For AI Agents

### Working In This Directory
- **`getStaticPaths`는 빌드 타임 전용** — 런타임 동적 라우트는 본 프로젝트에서 사용하지 않음 (정적 출력)
- 관련 글 정렬에 `Math.random() - 0.5` 사용 — 빌드 시점에 고정되며 새 빌드마다 달라짐 (의도된 동작)
- `index.astro`는 hot path — 필터링 로직 변경 시 `ListItem`의 `data-category` / `data-tags` 속성과 동기화
- slug = `post.id` = 파일명 (확장자 제외)
- `/blog?tag=<tag>` URL 진입 시 클라이언트 스크립트가 `?tag` 읽어 필터 적용해야 함

### Testing Requirements
- 빌드 후 `dist/blog/index.html` + 모든 `dist/blog/<slug>/index.html` 존재 확인
- 카테고리 필터: 사이드바에서 카테고리 클릭 → 매칭 안 되는 아이템 hidden
- 태그 필터: ListItem의 태그 클릭 → `/blog?tag=<tag>` 진입 → 매칭 아이템만 표시
- 포스트 페이지: TOC depth 2~3 정확히 표시, scroll spy 동작, 관련 글 카드 2개 표시

### Common Patterns
- Astro 동적 라우트: `[slug].astro` + `export async function getStaticPaths()`
- 콘텐츠 렌더: `const { Content, headings } = await render(post); <Content />`
- 정렬: `new Date(b.data.date).getTime() - new Date(a.data.date).getTime()` (desc)

## Dependencies

### Internal
- `../../layouts/ArticleLayout.astro` ([slug])
- `../../layouts/BaseLayout.astro` (index 추정)
- `../../components/article/*` ([slug] — Header/Footer/TOC)
- `../../components/blog/*` (index — ListItem/Sidebar/TagCloud)

### External
- `astro:content` — `getCollection`, `render`

<!-- MANUAL: -->
