<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-22 | Updated: 2026-05-22 -->

# layouts

## Purpose
페이지를 감싸는 셸 컴포넌트. `BaseLayout`이 HTML 스캐폴딩(head, 폰트, 테마 복원 스크립트, app-shell), `ArticleLayout`이 그 위에 헤더/푸터/메인/사이드 TOC 슬롯을 추가. 모든 `pages/*.astro`는 둘 중 하나로 감싸인다.

## Key Files

| File | Description |
|------|-------------|
| `BaseLayout.astro` | `<html>` ~ `<body>` 스캐폴딩. SEOHead 호출, Pretendard/JetBrains Mono 로드, `tokens.css` + `app.css` import, **FOUC 방지 inline script** (line 62-77 — 테마와 `--content-width`를 blocking 복원), skip link, `<slot/>` |
| `ArticleLayout.astro` | `BaseLayout`을 상속해 `Header`/`Footer`/`main#main-content` 추가. `toc.length > 0`일 때 `<aside slot="toc">` 렌더, 본문은 default slot |

## For AI Agents

### Working In This Directory
- **FOUC 방지 스크립트는 blocking 필수** — `is:inline`이고 head에서 실행됨. 함부로 수정 금지 (`BaseLayout.astro:62-77`)
- `localStorage` 키 이름: `blog-theme`, `blog-content-width` — 다른 위치(`ThemeToggle.tsx`, `WidthPicker.tsx`)와 반드시 일치
- 새 레이아웃 추가 시 `BaseLayout`을 감싸는 방식 권장 (SEO, 폰트, 테마 일관성 유지)
- `<html lang="ko" data-theme="light">` — 기본 light, JS가 dark/light 결정 후 덮어씀

### Testing Requirements
- 빌드 후 view-source로 `<head>`에 폰트/메타/JSON-LD가 정확히 들어갔는지 확인
- 테마 토글 → 새로고침 → 깜빡임 없음 확인 (FOUC 회귀 검증)

### Common Patterns
- Props에 SEO 필드(`title`, `description`, `ogImage`, `publishDate`, `author`, `tags`) 전달
- `publishDate` 유무로 `type: 'article' | 'website'` 자동 분기

## Dependencies

### Internal
- `../components/layout/SEOHead.astro` — 메타 태그 생성
- `../components/layout/Header.astro` / `Footer.astro` (ArticleLayout)
- `../styles/tokens.css` + `../styles/app.css` — BaseLayout에서 import

### External
- Pretendard Variable (jsDelivr CDN)
- JetBrains Mono (Google Fonts)

<!-- MANUAL: -->
