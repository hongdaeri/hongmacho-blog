<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-22 | Updated: 2026-05-22 -->

# article

## Purpose
개별 포스트 페이지(`/blog/[slug]`)에서 본문 위/아래/옆을 둘러싸는 영역. 헤더(타이틀·메타), 푸터(태그·관련 글·공유), 그리고 스크롤 스파이가 동작하는 사이드 TOC. `[slug].astro`가 이 셋과 본문(`<Content />`)을 조립한다.

## Key Files

| File | Description |
|------|-------------|
| `ArticleHeader.astro` | 포스트 상단 — 카테고리 배지, 타이틀(h1), 발행일, 읽기 시간 |
| `ArticleFooter.astro` | 포스트 하단 — 태그 칩, 관련 글 2개 카드, 공유/네비게이션 |
| `TOC.tsx` | 우측 사이드 220px 목차. React Island (`client:load`). IntersectionObserver로 현재 heading 추적 → 활성 상태 토글 |

## For AI Agents

### Working In This Directory
- `TOC.tsx`는 부모(`[slug].astro`)에서 `slot="toc"` 명명 슬롯으로 주입됨 — `ArticleLayout.astro`가 `toc.length > 0`일 때만 `<aside>` 렌더
- TOC는 depth 2~3 heading만 표시 (`[slug].astro:20`에서 필터링) — 변경 시 양쪽 일치
- `prose.css`의 `scroll-margin-top: 88px`은 TOC 점프 시 헤더 가림 방지 — 헤더 높이 변경 시 동기화

### Testing Requirements
- 임의 포스트로 진입 후 스크롤 → 현재 섹션이 TOC에서 하이라이트되는지 확인
- 키보드 Tab으로 TOC 링크 포커스 가능 확인 (focus-visible)

### Common Patterns
- React 컴포넌트 props는 부모 `.astro`에서 plain 객체로 전달 (`{ depth, text, slug }` 배열)
- `post.id` = 파일명 = slug (Astro v6 컨벤션)

## Dependencies

### Internal
- `../../lib/utils.ts` — `formatDate` (ArticleHeader)
- `../ui/CategoryBadge.astro` — 카테고리 라벨

### External
- `astro:content` — `CollectionEntry<'blog'>` 타입
- React 19 — TOC.tsx
- `lucide-react` — 푸터/공유 아이콘 (있을 경우)

<!-- MANUAL: -->
