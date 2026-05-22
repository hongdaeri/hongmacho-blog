<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-22 | Updated: 2026-05-22 -->

# pages

## Purpose
Astro 파일 기반 라우팅 루트. 각 파일이 URL 경로 1개에 대응. 정적 페이지(`.astro`), 동적 라우트(`blog/[slug].astro`), 엔드포인트(`feed.xml.ts`, `sitemap.xml.ts`)를 포함. 모든 페이지는 빌드 시 정적 HTML/XML로 출력됨.

## Key Files

| File | Description |
|------|-------------|
| `index.astro` | `/` — 홈. Hero + CategoriesSection + LatestPosts(최신 6개). 정렬: `date` desc |
| `about.astro` | `/about` — 소개 페이지 |
| `404.astro` | 빌드 시 정적 404 페이지 |
| `search.astro` | `/search?q=...` — 검색 결과 페이지. `<mark>` 하이라이트 |
| `feed.xml.ts` | `/feed.xml` — RSS 2.0 엔드포인트 (export GET handler) |
| `sitemap.xml.ts` | `/sitemap.xml` — Sitemap 엔드포인트 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `blog/` | `/blog` 목록 + `/blog/[slug]` 동적 라우트 (see `blog/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- **모든 페이지는 레이아웃으로 감싸기**: `BaseLayout` 또는 `ArticleLayout` 사용
- **getStaticPaths 필수**: 동적 라우트(`[slug].astro`)는 빌드 시 모든 경로를 정적 생성
- 엔드포인트(`.ts`)는 `export async function GET()` 패턴 — Astro v6 컨벤션
- 새 라우트 추가 시 `sitemap.xml.ts` 갱신 여부 확인

### Testing Requirements
- `npm run build` 후 `dist/`에 해당 HTML/XML 파일 생성 확인
- 동적 라우트는 모든 slug별 `dist/blog/<slug>/index.html` 존재 확인

### Common Patterns
- **콘텐츠 페치**: `const allPosts = await getCollection('blog')` 후 sort/filter/slice
- **검색 파라미터**: `Astro.url.searchParams.get('q')`
- **정렬**: 항상 `new Date(b.data.date).getTime() - new Date(a.data.date).getTime()` (desc)
- 페이지에서 클라이언트 JS가 필요하면 `.tsx` Island를 import + `client:*` 디렉티브

## Dependencies

### Internal
- `../layouts/BaseLayout.astro` / `ArticleLayout.astro`
- `../components/layout/Header.astro` / `Footer.astro`
- `../components/home/*`, `../components/hero/*` (홈)
- `../components/blog/*` (블로그)

### External
- `astro:content` — `getCollection`, `render`
- Node `URL` API — 쿼리 스트링 파싱

<!-- MANUAL: -->
