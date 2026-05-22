<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-22 | Updated: 2026-05-22 -->

# ui

## Purpose
도메인 비종속 범용 위젯. 버튼, 카테고리 배지, 태그 칩, 테마 토글, 본문 너비 선택, 검색 오버레이(Cmd+K). 작은 정적 `.astro` 위젯과 인터랙티브 React Island가 섞여 있음.

## Key Files

| File | Description |
|------|-------------|
| `Button.astro` | `variant: 'primary' | 'white' | 'ghost'`, `href` 있으면 `<a>`, 없으면 `<button>`. `class:list`로 클래스 합성 |
| `CategoryBadge.astro` | 카테고리 라벨 칩. `CATEGORIES`의 색상/이름 사용 |
| `Tag.astro` | 태그 칩 (`#tag` 형태) |
| `ThemeToggle.tsx` | React Island. `data-theme` 토글 + `localStorage.blog-theme` 저장. 시스템 prefers-color-scheme 폴백. `lucide-react` Sun/Moon 아이콘 |
| `WidthPicker.tsx` | React Island. 본문 너비 600/720/860px 순환 선택 → `document.documentElement.style.setProperty('--content-width', ...)` + `localStorage.blog-content-width` |
| `SearchOverlay.tsx` | 13KB React Island. Cmd+K 검색 모달. `hongmacho:open-search` 이벤트로 열림. `searchPosts` 스코어 정렬 + 키보드 네비(↑/↓/Enter) + focus trap |

## For AI Agents

### Working In This Directory
- **localStorage 키 통일**: `blog-theme`(테마), `blog-content-width`(본문 너비) — `BaseLayout.astro:62-77`의 inline 복원 스크립트와 반드시 일치
- **검색 오버레이 열기**: `document.dispatchEvent(new CustomEvent('hongmacho:open-search'))` — Header 버튼과 모바일 메뉴 모두 이 패턴 사용
- focus trap 동작 유지 — Tab/Shift+Tab이 모달 내부 순환, Esc로 닫기
- 너비 선택값은 600/720/860 셋 외로 확장 금지 (CSS 토큰과 lock-step)

### Testing Requirements
- Cmd+K (Mac) / Ctrl+K (Win/Linux) → 검색 오버레이 열림 확인
- 검색 입력 → 결과 키보드 네비 → Enter로 이동 확인
- 테마/너비 토글 → 새로고침 → 상태 유지 확인 (FOUC 없음)

### Common Patterns
- `client:load` (Header에서 즉시 필요한 위젯) vs `client:visible` (스크롤하면 보이는 위젯) 적절히 사용
- 모달은 `role="dialog"` + `aria-modal="true"` + 첫 인풋에 autofocus

## Dependencies

### Internal
- `../../lib/search.ts` — `searchPosts`, `BlogPost` 타입 (SearchOverlay)
- `../../lib/categories.ts` — CategoryBadge

### External
- React 19
- `lucide-react` — 아이콘 (Sun, Moon, Search, X 등)

<!-- MANUAL: -->
