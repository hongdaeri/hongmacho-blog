<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-22 | Updated: 2026-05-22 -->

# blog

## Purpose
블로그 목록 페이지(`/blog`)와 홈 섹션이 쓰는 카드·리스트·사이드바·태그 클라우드. 모든 컴포넌트가 `CollectionEntry<'blog'>`(또는 그 데이터)를 받아 카테고리/태그/날짜 메타와 함께 렌더한다.

## Key Files

| File | Description |
|------|-------------|
| `ListItem.astro` | **hot path (7x 수정)**. `/blog` 목록의 한 줄. 카테고리 배지 + 날짜 + 읽기 시간 + 타이틀(h3) + excerpt + 태그 칩. `data-category` / `data-tags` 속성으로 클라이언트 필터링 가능. `[hidden]` 속성으로 숨김 처리 |
| `PostCard.astro` | 카드형 포스트 (홈 LatestPosts 등에서 사용). 3열 균일 그리드 친화 |
| `Sidebar.astro` | 목록 페이지 사이드바 — 카테고리 필터, 인기 태그 등 |
| `TagCloud.astro` | 태그를 빈도순/가나다순으로 표시 |

## For AI Agents

### Working In This Directory
- `ListItem.astro`는 hot path — 변경 시 `/blog` 목록 페이지의 필터링/숨김 동작 회귀 확인
- **`[hidden]` 속성 주의**: 과거 `[hidden]` 셀렉터가 리스트 아이템을 숨기지 못한 버그가 있었음 (커밋 `f8157c9` 참조). CSS에서 `[hidden] { display: none !important; }` 보장 필요
- 클라이언트 사이드 필터링은 부모(`/blog/index.astro`)의 스크립트가 `data-category` / `data-tags` 속성을 읽어 `hidden` 토글
- 태그 URL: `/blog?tag=<encodeURIComponent(tag)>` — 디코딩과 일치 필수

### Testing Requirements
- `/blog` 페이지에서 카테고리 필터/태그 필터 → 매칭 안 되는 아이템이 시각적으로 사라지는지 확인
- 태그 칩 클릭 → 해당 태그로 필터링된 목록 진입 확인

### Common Patterns
- `data-` 속성 기반 클라이언트 필터링 (서버 분기 없이 정적 + JS 토글)
- 카테고리 정렬은 `lib/categories.ts`의 `CATEGORY_LIST` 순서 사용

## Dependencies

### Internal
- `../../lib/utils.ts` — `formatDate`
- `../ui/CategoryBadge.astro` — 카테고리 칩

### External
- `astro:content` — `CollectionEntry<'blog'>`

<!-- MANUAL: -->
