<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-22 | Updated: 2026-05-22 -->

# lib

## Purpose
프레임워크 비종속 순수 헬퍼 함수 모음. 컴포넌트와 페이지에서 공통으로 쓰는 카테고리 메타데이터, 읽기 시간 계산, 검색 스코어링, 날짜 포매팅·슬러그 유틸. 사이드 이펙트 없음 — Astro/React 모두에서 import 가능.

## Key Files

| File | Description |
|------|-------------|
| `categories.ts` | 4개 카테고리(`dev`/`invest`/`learn`/`daily`)의 메타데이터 — id, 한글 이름, 설명, hex 색상, CSS 변수명. `CATEGORIES` record + `CATEGORY_LIST` 배열 export |
| `readTime.ts` | `calcReadTime(content)` — 공백 기준 단어 수 / 200 WPM, 최소 1분 |
| `search.ts` | `searchPosts(posts, query)` — 제목 contains+10, 제목 prefix +5, excerpt +4, tag +6, category +3 가중치로 스코어링 후 점수 내림차순 정렬. 빈 쿼리는 원본 반환 |
| `utils.ts` | `formatDate(dateStr)` — `ko-KR` long 포맷(예: "2026년 5월 22일"). `slugify(str)` — lowercase + non-word 제거 + 공백→하이픈 |

## For AI Agents

### Working In This Directory
- **순수 함수만** — DOM, localStorage, fetch 등 사이드 이펙트 추가 금지. 그런 코드는 컴포넌트로
- 신규 카테고리 추가 시 `CategoryId` union + `CATEGORIES` record + `src/content.config.ts` zod enum + `src/styles/tokens.css`의 `--cat-*` CSS 변수까지 동시에 업데이트 필요
- 색상은 `cssVar` 필드(`--cat-dev` 등)와 `color` 필드(hex)를 모두 가짐 — CSS 우선, hex는 JS 폴백/문서용

### Testing Requirements
- 유닛 테스트 없음. 동작 변경 시 호출처(목록 페이지, 검색 페이지, 헤더) 수동 검증
- `searchPosts` 가중치 변경은 검색 UX 큰 영향 → `SearchOverlay`와 `/search` 페이지 양쪽 확인

### Common Patterns
- 타입 export 분리: `import type { CategoryId } from './categories'`
- `BlogPost` 인터페이스(`search.ts`)는 검색용 단순화 형태 — `CollectionEntry<'blog'>`와 다름

## Dependencies

### Internal
- `categories.ts` ← `search.ts` (CategoryId 타입)

### External
- (없음 — 표준 JS/TS만 사용)

<!-- MANUAL: -->
