<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-22 | Updated: 2026-05-22 -->

# home

## Purpose
홈 페이지(`/`) 전용 섹션 컴포넌트. Hero 아래 영역에서 4개 카테고리를 카드로 진열하고, 최신 글 6개를 균일 3열 그리드로 표시한다.

## Key Files

| File | Description |
|------|-------------|
| `CategoriesSection.astro` | 4개 카테고리(`dev`/`invest`/`learn`/`daily`) 카드. `CATEGORY_LIST` 순회. props로 `posts: CollectionEntry<'blog'>[]` 받아 카테고리별 개수 표시 |
| `LatestPosts.astro` | 최신 6개 포스트의 **균일 3열 그리드** (커밋 `740f686` — 과거 carousel/staggered였던 것을 uniform grid로 변경). `PostCard.astro` 재사용 |

## For AI Agents

### Working In This Directory
- **LatestPosts는 균일 그리드 유지**: featured span, staggered layout 등 비대칭 변형은 의도적으로 제거됨 — 회귀 금지
- 카테고리 카드는 `CATEGORIES`의 `cssVar`(`--cat-*`) 활용 — 색상 하드코딩 금지
- 새 카테고리 추가 시 `lib/categories.ts`만 갱신하면 자동 반영되어야 함 (CategoriesSection은 list 순회)

### Testing Requirements
- 홈 진입 → 카테고리 카드 4개 표시 + 각 카드의 게시글 수 정확한지 확인
- 화면 좁힘 → 그리드가 1열/2열/3열로 반응형 변환되는지 확인

### Common Patterns
- 부모(`pages/index.astro`)에서 `allPosts` 전체와 `latestPosts.slice(0, 6)`을 각각 props로 전달
- 카테고리 카운트: `allPosts.filter(p => p.data.category === c.id).length`

## Dependencies

### Internal
- `../../lib/categories.ts` — `CATEGORY_LIST`, `CATEGORIES`
- `../blog/PostCard.astro` — LatestPosts에서 카드 렌더

### External
- `astro:content` — `CollectionEntry<'blog'>`

<!-- MANUAL: -->
