<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-22 | Updated: 2026-05-22 -->

# hero

## Purpose
홈 페이지 상단의 영웅 섹션. 정적 헤더 카피(`HeroSection.astro`)와 그 뒤에 깔리는 인터랙티브 SVG 지식 그래프(`HeroVariants.tsx`, React Island). 최근 포스트 15개의 타이틀을 그래프 노드로 사용하며, 마우스 위치에 따른 패럴렉스가 적용된다.

## Key Files

| File | Description |
|------|-------------|
| `HeroSection.astro` | 정적 컨테이너. `recentTitles`(최근 15개) 계산 후 `HeroVariants client:load`로 hydrate. greeting 칩, h1 타이틀, sub-copy, CTA 버튼 2개("최신 글 보기"/"About") |
| `HeroVariants.tsx` | 19KB React Island. SVG 노드/엣지 그래프 + 마우스 패럴렉스. `hostId="hero-root"` 의 boundingRect로 마우스 좌표 정규화. `prefers-reduced-motion: reduce`일 때 패럴렉스 비활성화 |

## For AI Agents

### Working In This Directory
- `HeroSection`의 `hero--aurora` 클래스가 `app.css`의 배경 그라디언트를 활성화 — 변형 추가 시 modifier 클래스 매칭
- `recentTitles.slice(0, 15)` — 15개 미만일 때도 안전하게 동작해야 함
- 패럴렉스는 `prefers-reduced-motion: reduce` 시 비활성화 (WCAG 요구사항) — 회귀 금지
- React 컴포넌트는 `hostId` props로 마우스 추적 범위 지정 → 부모 `<header id="hero-root">`의 id와 일치 필수

### Testing Requirements
- 홈 진입 → 마우스 호버 시 SVG가 미세하게 따라오는지 확인
- 시스템 설정 "동작 줄이기" 켜고 진입 → 정지된 상태 확인
- 키보드 Tab으로 CTA 버튼 포커스 가능 확인

### Common Patterns
- `var(--c-green-50)` 등 토큰 사용 — hex 색상 하드코딩 금지
- SVG는 inline + `aria-hidden="true"` (장식 요소)

## Dependencies

### Internal
- `astro:content` `getCollection('blog')` → 최근 타이틀 추출

### External
- React 19, `lucide-react` (사용 가능)

<!-- MANUAL: -->
