import { useEffect, useState } from 'react';

interface GiscusCommentsProps {
  articleId: string;
  articleTitle: string;
}

export default function GiscusComments({ articleId }: GiscusCommentsProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const htmlTheme = document.documentElement.getAttribute('data-theme');
    setTheme(htmlTheme === 'dark' ? 'dark' : 'light');

    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute('data-theme');
      setTheme(newTheme === 'dark' ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = document.getElementById('giscus-container');
    if (!container) return;

    const existing = container.querySelector('script');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.setAttribute('data-repo', import.meta.env.PUBLIC_GISCUS_REPO || '');
    script.setAttribute('data-repo-id', import.meta.env.PUBLIC_GISCUS_REPO_ID || '');
    script.setAttribute('data-category', 'Announcements');
    script.setAttribute('data-category-id', import.meta.env.PUBLIC_GISCUS_CATEGORY_ID || '');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-reactions-enabled', '0');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-lang', 'ko');

    container.appendChild(script);

    return () => {
      const s = container.querySelector('script');
      if (s) s.remove();
    };
  }, [theme, articleId]);

  return <div id="giscus-container" />;
}
