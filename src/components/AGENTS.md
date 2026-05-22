<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-22 | Updated: 2026-05-22 -->

# components

## Purpose
사이트 전반에서 재사용되는 UI 단위. 도메인별로 7개 서브디렉토리로 분리됨 — article(개별 글 영역), blog(목록/사이드바), comments(Giscus), hero(랜딩 영웅), home(홈 섹션), layout(헤더/푸터/SEO), ui(범용 위젯). 대부분 `.astro` 정적, 인터랙티브 위젯만 `.tsx` React Island.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `article/` | 개별 포스트 페이지의 헤더/푸터/TOC (see `article/AGENTS.md`) |
| `blog/` | 블로그 목록 페이지의 카드/리스트/사이드바/태그 클라우드 (see `blog/AGENTS.md`) |
| `comments/` | Giscus React Island (see `comments/AGENTS.md`) |
| `hero/` | 홈 영웅 섹션 + 마우스 패럴렉스 SVG 그래프 (see `hero/AGENTS.md`) |
| `home/` | 홈 페이지 전용 카테고리/최신글 섹션 (see `home/AGENTS.md`) |
| `layout/` | 사이트 셸 — 헤더, 푸터, 모바일 메뉴, SEO 메타 (see `layout/AGENTS.md`) |
| `ui/` | 도메인 비종속 위젯 — 버튼, 배지, 태그, 검색 오버레이, 테마 토글, 너비 선택 (see `ui/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- **`.astro` 우선, `.tsx` 최소화**: 인터랙션이 필요한 경우만 React Island 사용
- **Hydration 디렉티브는 호출자에서 결정**: 컴포넌트 자체는 `client:*` 디렉티브를 알지 못함
- **Props 타입**: `interface Props { ... }` 패턴 사용 (`.astro` frontmatter 내부에서)
- **CategoryBadge / Tag / formatDate** 등은 `.astro` 컴포넌트 간 자유롭게 임포트

### Testing Requirements
- 컴포넌트 변경 시 사용처(grep로 import 추적) 모두 빌드 통과 확인
- 키보드 접근성(focus-visible)과 ARIA 속성 손상 여부 점검

### Common Patterns
- Astro `class:list={[...]}` 으로 조건부 클래스 합성
- `slot` / 명명 슬롯(`slot="toc"`) 으로 콘텐츠 주입
- 카테고리 색상은 `data-category={category}` 속성 → CSS 선택자 `[data-category="dev"]`로 분기

## Dependencies

### Internal
- `src/lib/utils.ts` — `formatDate` (목록/카드 컴포넌트)
- `src/lib/categories.ts` — `CATEGORIES` (배지, 카테고리 섹션)
- `src/styles/app.css` — 모든 클래스 정의 (BaseLayout이 한번 import)

### External
- `lucide-react` — `.tsx` 컴포넌트의 아이콘 (SearchOverlay 등)
- `astro:content` — 포스트 타입 (`CollectionEntry<'blog'>`)

<!-- MANUAL: -->
