---
title: "Astro로 블로그를 만들며 배운 것들"
date: "2026-05-20"
category: "dev"
excerpt: "정적 사이트 생성기 Astro 6를 선택하고, 직접 블로그를 구축하며 겪은 고민과 배움을 공유합니다."
featured: true
tags: ["Astro", "TypeScript", "TailwindCSS", "블로그"]
readTime: 8
---

개인 블로그를 만들기로 결심한 건 오래전 일이다. 노션에 글을 쓰다가, 벨로그를 써보다가, 결국 "내가 직접 만들자"는 결론에 이르렀다. 그 과정에서 Astro를 선택한 이유와, 구축하면서 배운 것들을 정리해본다.

## 왜 Astro인가

정적 사이트 생성기는 선택지가 많다. Next.js, Gatsby, Hugo, Jekyll… 블로그 하나 만드는 데 이걸 다 고려해야 하나 싶었지만, 결국 **콘텐츠 중심 사이트에 최적화된 도구**를 기준으로 좁혔다.

Astro를 선택한 이유는 세 가지였다.

1. **Zero JS by default** — JavaScript를 기본적으로 클라이언트에 보내지 않는다. 블로그는 대부분 읽기 전용이므로 불필요한 JS가 없는 게 맞다.
2. **Islands Architecture** — 인터랙티브한 컴포넌트(다크모드 토글, 검색)만 선택적으로 hydration한다.
3. **Content Collections** — 마크다운 파일을 Zod 스키마로 타입 안전하게 관리할 수 있다.

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    category: z.enum(['dev', 'invest', 'learn', 'daily']),
    excerpt: z.string().max(140),
    featured: z.boolean().optional().default(false),
    tags: z.array(z.string()).min(1),
    readTime: z.number().optional(),
  }),
});

export const collections = { blog };
```

타입 오류가 빌드 타임에 잡힌다. 날짜 형식이 틀리거나 카테고리가 잘못 입력되면 그 자리에서 에러가 난다. 이게 생각보다 큰 안심이다.

## TailwindCSS v4와의 씨름

Astro 6에서 TailwindCSS를 연결하는 방식이 v4부터 달라졌다. 기존의 `@astrojs/tailwind` 인테그레이션은 Astro 6와 호환되지 않는다.

대신 `@tailwindcss/vite` Vite 플러그인을 사용한다.

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

처음에 이걸 몰라서 `npm install` 중 ERESOLVE 오류를 한참 마주했다. peer dependency 충돌이었는데, 공식 문서보다 GitHub Issues에서 먼저 답을 찾았다.

## CSS Container Queries로 반응형 구현

이번 블로그에서 `@media`를 쓰지 않고 CSS Container Queries만 사용했다. 처음엔 낯설었지만, 컴포넌트 단위로 반응형을 제어하는 게 훨씬 자연스럽다는 걸 금방 느꼈다.

```css
.app-shell {
  container-name: app;
  container-type: inline-size;
}

@container app (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
```

뷰포트가 아닌 컨테이너 기준으로 레이아웃이 바뀌니, 컴포넌트를 다른 컨텍스트에 옮겨도 레이아웃이 깨지지 않는다.

## Islands 전략

| 컴포넌트 | 전략 | 이유 |
|---|---|---|
| ThemeToggle | `client:load` | 첫 렌더에 즉시 필요 |
| SearchOverlay | `client:idle` | 즉각적이지 않아도 됨 |
| TOC | `client:load` | 스크롤과 동기화 필요 |
| GiscusComments | `client:visible` | 뷰포트 진입 시 로드 |

`client:visible`로 Giscus를 지연 로딩하면 초기 번들 크기를 크게 줄일 수 있다. 댓글은 대부분 글을 다 읽은 후에야 보게 되므로 이 전략이 적합하다.

## 마치며

블로그를 직접 만드는 건 단순히 "플랫폼 종속에서 벗어나기"가 아니었다. 웹 기술 전반을 다시 돌아보는 좋은 기회였다. Astro의 Islands, CSS Container Queries, Content Collections — 모두 평소 프로젝트에서 잘 쓰지 않던 기술들이었다.

> "당신이 만든 도구가 당신의 사고를 형성한다."

다음 포스트에서는 TOC 자동 생성과 검색 기능 구현에 대해 다룰 예정이다.
