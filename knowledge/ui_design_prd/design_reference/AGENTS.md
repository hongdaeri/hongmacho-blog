<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-22 | Updated: 2026-05-22 -->

# design_reference

## Purpose
UI 디자인을 검증하기 위한 React + CSS 프로토타입. 실제 Astro 구현(`src/`)에 옮기기 전 hero/overlay/페이지 컴포넌트의 시각·인터랙션을 미리 본다. `index.html` + JSX 모듈 + `wds-tokens.css` 토큰 시스템으로 구성.

## Key Files

| File | Description |
|------|-------------|
| `index.html` | 엔트리. JSX 모듈을 ESM으로 로드해 프로토타입 렌더 |
| `tweaks-panel.jsx` | 26KB. 디자인 토큰을 실시간 조정하는 사이드 패널 (색상, 간격, shadow 슬라이더) |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `src/` | React JSX 컴포넌트 모듈 — app, components, data, hero-variants, overlays, pages, article-bodies (see `src/AGENTS.md`) |
| `styles/` | CSS — `app.css`(80KB 컴포넌트 스타일), `wds-tokens.css`(원본 토큰), `wds-fonts.css`(폰트 정의) (see `styles/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- **참조 전용 — 빌드에 포함되지 않음**. `src/` 디렉토리의 실제 컴포넌트와 혼동 금지
- `wds-tokens.css`는 `src/styles/tokens.css`의 원본. 토큰 추가/변경은 양쪽 동시에 반영
- `app.css`도 `src/styles/app.css`로 이식되어 있음 — 클래스명 일관성 유지
- 새 변형 실험 시 이 디렉토리에서 시각화 → 합의 후 `src/`로 옮김

### Testing Requirements
- `index.html`을 정적 서버(예: `npx serve .`)로 열어 시각 확인
- Astro 빌드에는 영향 없음

### Common Patterns
- JSX는 ESM 모듈로 import — `<script type="module">` 사용 (별도 번들러 없음)
- 토큰 우선 — hex 색상 하드코딩 금지

## Dependencies

### Internal
- 부모 `UI_PRD.md`가 의도 설명

### External
- React 19 (CDN ESM 추정)

<!-- MANUAL: -->
