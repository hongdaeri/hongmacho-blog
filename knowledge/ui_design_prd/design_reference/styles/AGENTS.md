<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-22 | Updated: 2026-05-22 -->

# design_reference/styles

## Purpose
디자인 참조의 CSS 원본. `wds-tokens.css`가 디자인 토큰의 단일 진실 공급원이며, 실제 사이트의 `src/styles/tokens.css`로 이식되었다. `app.css`는 컴포넌트 클래스 정의의 원본이고, `wds-fonts.css`는 사용 폰트(Pretendard/JetBrains Mono)를 정의한다.

## Key Files

| File | Description |
|------|-------------|
| `wds-tokens.css` | 21KB. 색상 팔레트(`--c-*`), 시맨틱 토큰, 다크모드 분기, 카테고리 색상, 본문 너비. **`src/styles/tokens.css`의 원본** |
| `app.css` | 80KB. 컴포넌트 클래스 정의(`hero`, `site-header`, `list-item` 등). 실제 사이트 `src/styles/app.css`의 원본/형제 |
| `wds-fonts.css` | Pretendard Variable / JetBrains Mono `@font-face` 또는 import 선언 |

## For AI Agents

### Working In This Directory
- **양쪽 동기화**: `wds-tokens.css` 변경 시 `src/styles/tokens.css`도 함께 — 변수명/값 lock-step
- **`app.css`는 거대 파일**: 부분 변경 시 영향 범위 추적 어려움. 가능한 한 토큰 추가/조정으로 해결
- 폰트 추가 시 `wds-fonts.css` + `BaseLayout.astro`의 `<link>` 둘 다 갱신

### Testing Requirements
- `design_reference/index.html`을 정적 서버로 열어 토큰 변경이 시각화되는지 확인
- Astro 사이트 빌드 후 `src/styles/`로 이식된 토큰 값이 동일한지 시각 비교

### Common Patterns
- **2-tier 토큰**: 원시(`--c-blue-50`) → 시맨틱(`--color-bg-normal: var(--c-gray-0)`) 참조 체인
- **다크모드**: `[data-theme="dark"] { --color-bg-normal: ...; }` 분기

## Dependencies

### Internal
- `src/styles/tokens.css` (실제 사이트) — 이 디렉토리의 `wds-tokens.css`가 원본
- `src/styles/app.css` (실제 사이트) — 이 디렉토리의 `app.css`와 동기 유지

### External
- Pretendard Variable (jsDelivr CDN)
- JetBrains Mono (Google Fonts)

<!-- MANUAL: -->
