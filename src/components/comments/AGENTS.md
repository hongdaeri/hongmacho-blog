<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-22 | Updated: 2026-05-22 -->

# comments

## Purpose
Giscus 댓글(GitHub Discussions) React Island. 포스트 페이지 하단에 마운트되어 환경변수의 repo/category ID로 giscus 위젯을 로드. 사이트 테마(`data-theme`)와 자동 동기화.

## Key Files

| File | Description |
|------|-------------|
| `GiscusComments.tsx` | React Island. `useEffect`에서 `<script src="https://giscus.app/client.js">` 동적 삽입. `data-repo`, `data-repo-id`, `data-category-id` 등은 `import.meta.env.PUBLIC_GISCUS_*`에서 읽음. 테마 변경 이벤트 listening → giscus iframe에 `postMessage` 송신 |

## For AI Agents

### Working In This Directory
- **환경 변수 4종**: `PUBLIC_GISCUS_REPO`, `PUBLIC_GISCUS_REPO_ID`, `PUBLIC_GISCUS_CATEGORY_ID`, `PUBLIC_SITE_URL` — 모두 `.env.local` 또는 Vercel 환경 변수에 등록. `astro.config.mjs:17-22`의 define 블록에도 명시되어 있어야 클라이언트 번들에 주입됨
- `PUBLIC_` prefix 필수 (Astro는 `PUBLIC_` 외 env를 클라이언트에 노출하지 않음)
- 테마 동기화는 `MutationObserver`로 `<html data-theme>` 감시 → giscus `setConfig` postMessage
- 호출 시 반드시 `client:load` 또는 `client:visible` (인터랙티브 위젯)

### Testing Requirements
- 로컬에서 `.env.local`에 실제 giscus 발급값 넣고 빌드 → 포스트 페이지 하단에 위젯 표시 확인
- 테마 토글 → giscus iframe 색상도 변경되는지 확인 (light↔dark)

### Common Patterns
- giscus 스크립트는 `dataset` 속성으로 설정 전달 (`script.setAttribute('data-repo', ...)`)
- 서버에서는 `import.meta.env.PUBLIC_*`가 빈 문자열일 수 있음 → 빌드 시 define으로 주입됨

## Dependencies

### External
- React 19
- giscus (https://giscus.app/client.js) — 런타임 외부 스크립트

<!-- MANUAL: -->
