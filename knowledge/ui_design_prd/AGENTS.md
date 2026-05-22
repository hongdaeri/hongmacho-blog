<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-22 | Updated: 2026-05-22 -->

# ui_design_prd

## Purpose
UI 디자인 요구사항 명세(`UI_PRD.md`)와 그것을 시각화한 React + CSS 프로토타입(`design_reference/`). 실제 Astro 구현(`src/`)의 디자인 의도·토큰·인터랙션을 검증하는 원본 자료. 빌드/배포에 포함되지 않음.

## Key Files

| File | Description |
|------|-------------|
| `UI_PRD.md` | 37KB. UI/UX 요구사항 — 레이아웃, 인터랙션, 색상, 타이포, 접근성 기준 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `design_reference/` | React JSX + CSS 프로토타입 (Hero variants, overlays, pages, components) (see `design_reference/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- **참조 전용** — 코드를 직접 import하지 말 것. 실제 구현은 `src/`에 있음
- 디자인 변경 요청 시 1차로 `UI_PRD.md` 확인 → 의도 파악 후 `src/`에 반영
- `design_reference/`의 토큰(`wds-tokens.css`)은 `src/styles/tokens.css`의 원본 — 토큰 추가/변경은 양쪽 동시에

### Testing Requirements
- 해당 없음 — 산출물에 포함되지 않음

### Common Patterns
- PRD 톤: 한국어, 정량적 기준(예: WCAG 2.1 AA, 본문 너비 600/720/860px) 명시

## Dependencies

### Internal
- `src/styles/tokens.css` ← `design_reference/styles/wds-tokens.css` (이식 관계)

<!-- MANUAL: -->
