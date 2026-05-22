<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-22 | Updated: 2026-05-22 -->

# design_reference/src

## Purpose
디자인 참조 프로토타입의 React JSX 모듈. ESM으로 직접 로드되는 단일 페이지 데모 — Hero 변형, 오버레이, 페이지 와이어프레임, 아티클 본문 샘플, 데이터 픽스처를 포함. 실제 Astro 구현(`/src/components/`)으로 옮기기 전 단계의 스케치.

## Key Files

| File | Description |
|------|-------------|
| `app.jsx` | 엔트리 컴포넌트. 라우팅/탭 전환으로 다양한 변형 진열 |
| `hero-variants.jsx` | 17KB. Hero 섹션 여러 변형(aurora/tree 등) 비교 |
| `overlays.jsx` | 16KB. 검색 오버레이, 모달, 토스트 등 오버레이 패턴 |
| `pages.jsx` | 18KB. 홈/블로그/포스트/about 페이지 와이어 |
| `article-bodies.jsx` | 12KB. 마크다운 prose 렌더 샘플 (h2/h3, blockquote, code, table, image 등) |
| `components.jsx` | 12KB. 버튼/배지/카드/태그 등 컴포넌트 카탈로그 |
| `data.jsx` | 픽스처 — 가상의 포스트 데이터 (실제 콘텐츠와 무관) |

## For AI Agents

### Working In This Directory
- **참조 전용** — Astro 빌드에서 import되지 않음. 실제 컴포넌트는 [[components-tree]] (`/src/components/`)
- 새 디자인 아이디어를 여기서 먼저 시각화 → 확정되면 `.jsx`를 `.astro` 또는 `.tsx`로 변환해 `/src/components/`로 이식
- 픽스처(`data.jsx`)는 실제 콘텐츠와 분리 — 마크다운(`/src/content/blog/`)을 변경해도 영향 없음

### Testing Requirements
- 정적 서버(예: `npx serve` 또는 `python3 -m http.server`)로 `design_reference/index.html` 열어 시각 검증

### Common Patterns
- 함수형 컴포넌트 + Hooks
- CSS 클래스는 `../styles/app.css` 정의 (실제 사이트의 `src/styles/app.css`와 동일 클래스명)

## Dependencies

### Internal
- `../styles/app.css`, `../styles/wds-tokens.css` — 스타일링

### External
- React 19 (CDN ESM 추정)

<!-- MANUAL: -->
