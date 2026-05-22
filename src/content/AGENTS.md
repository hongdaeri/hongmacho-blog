<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-22 | Updated: 2026-05-22 -->

# content

## Purpose
Astro Content Collections의 데이터 루트. 마크다운 포스트가 `blog/` 하위에 저장되고, 스키마는 상위 `src/content.config.ts`에서 zod로 정의됨. 빌드 시 `getCollection('blog')`로 정렬·필터링 가능한 타입 안전 콜렉션이 됨.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `blog/` | `YYYY-MM-DD-slug.md` 형식의 블로그 포스트 (see `blog/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- 신규 컬렉션을 추가하려면 `src/content.config.ts`에 `defineCollection` 등록 + 디렉토리 생성
- 스키마는 `src/content.config.ts`에서만 변경 — 여기서 직접 schema 변경 금지
- `.DS_Store` 같은 OS 부산물은 무시 (Astro 빌드 시 자동 스킵되나 가능하면 `.gitignore`에 추가)

### Testing Requirements
- 마크다운 추가 후 `npm run build` 통과 = frontmatter 스키마 검증 통과

### Common Patterns
- 컬렉션 디렉토리명 = `defineCollection`의 키 = `getCollection('blog')`의 인자

## Dependencies

### Internal
- `src/content.config.ts` — 컬렉션 스키마
- `src/lib/categories.ts` — `category` enum 값(`dev|invest|learn|daily`)의 의미

### External
- `astro:content` (`defineCollection`, `glob` loader, zod) — 컬렉션 정의 API

<!-- MANUAL: -->
