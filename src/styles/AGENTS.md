<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-22 | Updated: 2026-05-22 -->

# styles

## Purpose
글로벌 CSS의 단일 진실 공급원. 디자인 토큰(`tokens.css`), 컴포넌트 스타일 본체(`app.css`, 80KB+ — 모든 클래스의 정의), 마크다운 본문 타이포(`prose.css`), 그리고 두 파일을 묶는 진입점(`global.css`). `BaseLayout.astro`가 `tokens.css` + `app.css`를 import해 전체 사이트에 적용.

## Key Files

| File | Description |
|------|-------------|
| `tokens.css` | 21KB. 색상 팔레트(`--c-blue-50` 등 wds-tokens 이식) + 시맨틱 토큰(`--color-bg-normal`, `--shadow-strong`) + `[data-theme="dark"]` 분기 + 카테고리 변수(`--cat-dev/invest/learn/daily`) + `--content-width` |
| `app.css` | 81KB. 거의 모든 클래스 정의 — `.hero`, `.site-header`, `.list-item`, `.btn`, `.app-shell`, `.skip-link`, `@container` 쿼리, 반응형 분기 등. **`hot path` (11x 수정)** |
| `prose.css` | 마크다운 본문 타이포 — `.prose h2/h3/h4/p/a/blockquote/code/pre/ul/table/img`. 다크모드 분기 포함. scroll-margin-top 88px(TOC 점프 대비) |
| `global.css` | `@import './tokens.css'; @import './app.css';` — 단순 진입점 (현재 BaseLayout이 두 파일을 직접 import하므로 사용되지 않을 수 있음) |

## For AI Agents

### Working In This Directory
- **CSS 변수 우선 — 하드코딩 금지**: 색상/간격/shadow는 반드시 `--c-*` 또는 시맨틱 토큰 참조
- **`app.css`는 hot path** — 11회 수정된 파일. 변경 시 영향 범위 확인, 토큰 추가는 `tokens.css`에 우선
- 다크모드는 `[data-theme="dark"] .selector { ... }` 분기로 추가
- 새 카테고리 색상 추가 시 `tokens.css`의 `--cat-*` + `src/lib/categories.ts` 동시 업데이트
- `--content-width`는 600/720/860px만 사용 (WidthPicker UI에 노출됨)

### Testing Requirements
- 빌드 후 다크/라이트 토글 + 너비 토글로 시각 검증
- `prose.css` 변경 시 임의 마크다운 포스트로 렌더 확인 (h2~h4, blockquote, code, table, img)

### Common Patterns
- **시맨틱 → 원시 토큰 참조 체인**: `--color-bg-normal: var(--c-gray-0)` 같은 2-tier 구조
- **카테고리별 색상**: `data-category="dev"` 셀렉터로 `--cat-dev` 적용
- **scroll-margin-top**: 헤더(88px) 가림 방지 — 모든 heading에 적용

## Dependencies

### Internal
- 호출처: `src/layouts/BaseLayout.astro` (`tokens.css` + `app.css` import)
- `src/lib/categories.ts`의 `cssVar` 필드와 `--cat-*` 변수명 일치 필요

### External
- TailwindCSS 4 (`@tailwindcss/vite`) — utility 클래스도 사용 가능하나 본 프로젝트는 커스텀 CSS 위주

<!-- MANUAL: -->
