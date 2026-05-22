<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-22 | Updated: 2026-05-22 -->

# layout

## Purpose
사이트 셸 — 모든 페이지(홈/블로그/포스트/about/검색) 상하단에 일관되게 등장하는 헤더, 푸터, 모바일 햄버거 메뉴, SEO 메타 헤드. 또한 검색 오버레이(`SearchOverlay`)와 위젯들(`ThemeToggle`, `WidthPicker`)을 마운트하는 진입점이다.

## Key Files

| File | Description |
|------|-------------|
| `Header.astro` | 고정 헤더. 브랜드 로고("🚀 홍마초의 잡생각"), 1차 네비(`/`, `/blog`, `/about`), 검색 버튼(⌘K), `WidthPicker`/`ThemeToggle` React Island, 모바일 햄버거. 스크롤 시 `.scrolled` 클래스 토글. `hongmacho:open-search` 커스텀 이벤트로 SearchOverlay와 통신 |
| `Footer.astro` | 사이트 푸터. 카피라이트, 링크. 버전 칩(`style(ui): drop text-wrap:balance` 커밋 — 줄바꿈 자연스럽게) |
| `MobileMenu.astro` | 모바일 햄버거 메뉴. `hongmacho:close-mobile-menu` 이벤트로 검색 열기 등과 협조 |
| `SEOHead.astro` | head 메타 — Open Graph, Twitter Card, JSON-LD(Article 타입), canonical, keywords. props `type: 'article' | 'website'`로 분기 |

## For AI Agents

### Working In This Directory
- **커스텀 이벤트 컨벤션**: `hongmacho:<action>` (예: `open-search`, `close-mobile-menu`) — 새 이벤트 추가 시 prefix 유지
- `Header`의 `WidthPicker` / `ThemeToggle`은 `client:load` — 헤더가 모든 페이지에 나오므로 hydration 비용 큼. 미루기 어려운 위젯이지만 신규 위젯은 `client:idle`/`client:visible` 우선 고려
- `SEOHead`는 `BaseLayout`에서만 호출 (페이지마다 직접 호출하지 말 것)
- 활성 링크 판정: `path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(path + '/')` — 루트는 정확 일치, 그 외는 prefix

### Testing Requirements
- 모든 페이지에서 헤더 활성 링크가 현재 경로와 일치하는지 확인 (`aria-current="page"`)
- 모바일 폭에서 햄버거 → 메뉴 → 검색 버튼 흐름 확인
- view-source로 OG/Twitter/JSON-LD 태그가 페이지 타입에 맞게 출력되는지 확인

### Common Patterns
- `<script>` 블록은 빌드 시 처리됨 — 이벤트 리스너는 inline `<script>`로 등록
- 아이콘은 inline SVG (외부 의존성 없이 즉시 렌더, `aria-hidden="true"` + 인접 텍스트로 라벨 제공)

## Dependencies

### Internal
- `../ui/ThemeToggle.tsx`, `../ui/WidthPicker.tsx`, `../ui/SearchOverlay.tsx` — Header
- `astro:content` — Header에서 검색용 `allPosts` 전달

### External
- (SEOHead에 추가 라이브러리 없음 — 직접 메타 출력)

<!-- MANUAL: -->
