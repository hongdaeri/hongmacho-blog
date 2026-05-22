<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-22 | Updated: 2026-05-22 -->

# knowledge

## Purpose
프로젝트 사양·기획·디자인 참조 문서 보관소. 빌드에 포함되지 않는 산출물 — PRD(제품 요구사항), ROADMAP(개발 로드맵), 그리고 UI 디자인 참조(React 프로토타입 + CSS 토큰)를 모아둠. 새 기능을 구현하기 전 톤과 원칙을 확인할 1차 자료.

## Key Files

| File | Description |
|------|-------------|
| `PRD.md` | 제품 요구사항 명세 — 35KB, 카테고리/페이지/기능 상세 |
| `ROADMAP.md` | 개발 로드맵 — 27KB, 단계별 마일스톤 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `ui_design_prd/` | UI 디자인 PRD + 디자인 시스템 참조 구현 (see `ui_design_prd/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- 이 디렉토리는 **참고용**. 코드를 여기서 import하지 말 것 — 실제 구현은 `src/`에 있음
- `design_reference/` 의 JSX/CSS는 디자인 의도를 보여주는 프로토타입이며, 실제 Astro 컴포넌트와는 별개로 유지됨
- 문서 수정 시 코드와의 정합성을 별도로 보장해야 함 (PRD/ROADMAP은 freeze된 스냅샷일 수 있음)

### Testing Requirements
- 해당 없음 — 빌드 산출물에 포함되지 않음

### Common Patterns
- 새 기능 설계 시 `PRD.md` / `UI_PRD.md` 의 톤과 어휘 차용
- 디자인 토큰은 `ui_design_prd/design_reference/styles/wds-tokens.css`가 원본 — `src/styles/tokens.css`로 이식됨

## Dependencies

### Internal
- (없음 — 런타임에서 참조되지 않음)

<!-- MANUAL: -->
