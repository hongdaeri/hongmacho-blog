<!-- Generated: 2026-05-22 | Updated: 2026-05-22 -->

# hongmacho-blog

## Purpose
홍마초의 잡생각 — Astro 6 기반의 한국어 개인 블로그. 개발 / 투자 / 학습 / 일상 4개 카테고리, Hero 마우스 패럴렉스(React Island), Cmd+K 검색, Giscus 댓글, WCAG 2.1 AA 접근성, SSG 정적 사이트. Vercel 호스팅. 마크다운 콘텐츠 컬렉션 + zod 스키마.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | Astro 6 + React 19 + TailwindCSS 4 + TypeScript 6 의존성, `dev`/`build`/`preview` 스크립트 |
| `astro.config.mjs` | site URL/PUBLIC_ env 주입, React+Tailwind 통합, Shiki(github-dark) 마크다운, prefetch=tap, compressHTML |
| `tsconfig.json` | `astro/tsconfigs/strict` 확장, `@/*` → `./src/*` paths alias |
| `tailwind.config.mjs` | `darkMode: ['class', '[data-theme="dark"]']`, src 전체 content 스캔 |
| `vercel.json` | X-Frame-Options DENY, nosniff, XSS, Referrer-Policy 헤더 + `/assets/*` immutable 캐싱 + `/feed`→`/feed.xml` 리다이렉트 |
| `.env.example` | `PUBLIC_GISCUS_REPO/REPO_ID/CATEGORY_ID`, `PUBLIC_SITE_URL` 템플릿 |
| `README.md` | 한국어 프로젝트 가이드 (스택, 시작하기, 포스트 작성, Vercel 배포, Giscus, 디자인 토큰) |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `src/` | Astro 애플리케이션 소스 (see `src/AGENTS.md`) |
| `public/` | 정적 자산 - favicon, robots.txt (see `public/AGENTS.md`) |
| `knowledge/` | PRD / ROADMAP / UI 디자인 참조 (see `knowledge/AGENTS.md`) |
| `dist/` | `astro build` 결과물 (gitignore) |
| `node_modules/` | npm 의존성 (gitignore) |

## For AI Agents

### Working In This Directory
- 패키지 매니저는 npm. `npm install`로 의존성 설치
- 환경 변수는 반드시 `PUBLIC_` prefix (React Island 노출 위해 — astro.config.mjs:13에서 `envPrefix: 'PUBLIC_'`)
- 새 환경 변수 추가 시 `astro.config.mjs`의 `define` 블록에도 등록 필요 (line 17-22)
- Vercel preset은 자동 감지되므로 별도 어댑터 미설치 (default static output)
- `tsconfig.json`의 `@/*` alias로 `src/` 절대 임포트 가능

### Testing Requirements
- 테스트 프레임워크 없음. 빌드 성공 + 수동 브라우저 검증으로 회귀 확인
- 빌드: `npm run build 2>&1 | tail -5` (프로젝트 표준)
- 로컬 미리보기: `npm run preview` (port 4321 → 4322 등 변동 가능)

### Common Patterns
- **Astro Islands**: 인터랙티브 React 컴포넌트는 `.tsx`, 정적은 `.astro`. 필요할 때만 `client:load` / `client:idle` / `client:visible` 디렉티브 부여
- **CSS 토큰 우선**: 색상/간격/shadow는 `src/styles/tokens.css` 또는 `app.css`의 시맨틱 토큰 참조 — 하드코딩 금지
- **FOUC 방지**: 테마/`--content-width`는 `BaseLayout.astro`의 inline `<script is:inline>`에서 blocking 복원
- **콘텐츠 컬렉션**: zod 스키마(`src/content.config.ts`)로 frontmatter 강제 검증

## Dependencies

### External
- **astro** 6.3.6 — SSG 프레임워크
- **@astrojs/react** 4.3 + **react/react-dom** 19 — 인터랙티브 Island
- **lucide-react** 0.475 — 아이콘 (React Island에서 사용)
- **tailwindcss** 4.3 + **@tailwindcss/vite** 4.1 + **@tailwindcss/typography** 0.5
- **typescript** 6 (strict)

### Internal
- Giscus (GitHub Discussions) — 댓글
- Pretendard Variable (jsDelivr CDN) — 본문 폰트
- JetBrains Mono (Google Fonts) — 코드 폰트

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
