<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-22 | Updated: 2026-05-22 -->

# public

## Purpose
빌드 시 그대로 복사되어 사이트 루트(`/`)에서 제공되는 정적 자산. Astro가 변환/번들링하지 않으므로 favicon, robots.txt, 폰트/이미지 원본 등 변경 불필요한 리소스만 배치.

## Key Files

| File | Description |
|------|-------------|
| `favicon.svg` | 사이트 파비콘 — `BaseLayout.astro` line 57에서 `/favicon.svg` 참조 |
| `robots.txt` | 크롤러 정책 |

## For AI Agents

### Working In This Directory
- 여기에 둔 파일은 빌드/번들 변환을 거치지 않음 — 최종 산출물 그대로 배포됨
- 이미지 최적화가 필요하면 `src/assets/`로 옮기고 `astro:assets`의 `<Image>` 사용 (현재 디렉토리 없음)
- 파일명 변경 시 코드 내 참조(`<link href="/...">`, `<img src="/...">`)도 함께 업데이트

### Testing Requirements
- `npm run build` 후 `dist/` 루트에 파일이 동일 경로로 존재하는지 확인

### Common Patterns
- 루트 경로 절대 URL로 참조: `<link rel="icon" href="/favicon.svg" />`

## Dependencies

### Internal
- `src/layouts/BaseLayout.astro` — favicon 참조

<!-- MANUAL: -->
