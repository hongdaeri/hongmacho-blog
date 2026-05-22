import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

export default defineConfig({
  site: env.PUBLIC_SITE_URL || 'https://hongmacho.dev',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    envPrefix: 'PUBLIC_',
    optimizeDeps: {
      include: ['react-dom/client'],
    },
    define: {
      'import.meta.env.PUBLIC_GISCUS_REPO': JSON.stringify(env.PUBLIC_GISCUS_REPO ?? ''),
      'import.meta.env.PUBLIC_GISCUS_REPO_ID': JSON.stringify(env.PUBLIC_GISCUS_REPO_ID ?? ''),
      'import.meta.env.PUBLIC_GISCUS_CATEGORY_ID': JSON.stringify(env.PUBLIC_GISCUS_CATEGORY_ID ?? ''),
      'import.meta.env.PUBLIC_SITE_URL': JSON.stringify(env.PUBLIC_SITE_URL ?? ''),
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
  compressHTML: true,
  prefetch: {
    defaultStrategy: 'tap',
  },
});
