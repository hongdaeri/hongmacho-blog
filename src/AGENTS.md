<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-22 | Updated: 2026-05-22 -->

# src

## Purpose
Astro 애플리케이션의 모든 소스. 페이지 라우팅(`pages/`), 마크다운 콘텐츠 컬렉션(`content/`), 재사용 컴포넌트(`components/`), 레이아웃 래퍼(`layouts/`), 헬퍼(`lib/`), CSS 토큰/베이스(`styles/`)로 구성. 정적 SSG 빌드 진입점.

## Key Files

| File | Description |
|------|-------------|
| `content.config.ts` | `blog` 컬렉션 zod 스키마 — title, date(YYYY-MM-DD regex), category enum(dev\|invest\|learn\|daily), excerpt(max 140), featured, tags(min 1), readTime 옵션 |
| `env.d.ts` | Astro types reference. `.astro/types.d.ts` + `astro/client` |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `components/` | 재사용 UI 단위 — article, blog, comments, hero, home, layout, ui (see `components/AGENTS.md`) |
| `content/` | 마크다운 포스트 + Content Collections 데이터 (see `content/AGENTS.md`) |
| `layouts/` | 페이지 셸 — BaseLayout, ArticleLayout (see `layouts/AGENTS.md`) |
| `lib/` | 순수 헬퍼 함수 — categories, readTime, search, utils (see `lib/AGENTS.md`) |
| `pages/` | 파일 기반 라우트 — `/`, `/about`, `/blog`, `/search`, `/feed.xml`, `/sitemap.xml` (see `pages/AGENTS.md`) |
| `styles/` | 글로벌 CSS — tokens, app, prose, global (see `styles/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- 신규 파일 추가 시 `@/*` alias 임포트 활용 (`tsconfig.json` paths)
- 모든 `.astro` 파일은 frontmatter(`---` 블록)에서 데이터 로드 → 템플릿 렌더
- React 컴포넌트는 `.tsx`, hydration 디렉티브는 사용처(부모 `.astro`)에서 명시
- 새 컬렉션 필드 추가 시 `content.config.ts` zod 스키마 + 모든 사용처 `post.data.X` 동시 업데이트

### Testing Requirements
- `npm run build`로 zod 스키마 검증 통과 확인 (스키마 위반 시 빌드 실패)
- 신규 페이지/라우트는 빌드 후 `dist/` 출력 존재 확인

### Common Patterns
- **콘텐츠 로딩**: `import { getCollection } from 'astro:content'` → `await getCollection('blog')`
- **렌더링**: `const { Content, headings } = await render(post)` (slug 페이지)
- **날짜 정렬**: `.sort((a,b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())`
- **타입 임포트**: `import type { CollectionEntry } from 'astro:content'` → `CollectionEntry<'blog'>`

## Dependencies

### Internal
- `styles/tokens.css` + `styles/app.css` — `BaseLayout.astro`에서 import (모든 페이지에 자동 적용)

### External
- `astro:content` — Content Collections API
- `astro:assets` — (현재 미사용, 향후 OG 이미지 생성 시 활용 가능)

<!-- MANUAL: -->
