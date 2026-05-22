import { useEffect, useState } from 'react';

interface GiscusCommentsProps {
  articleId: string;
  articleTitle: string;
}

export default function GiscusComments({
  articleId,
  articleTitle,
}: GiscusCommentsProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Listen for theme changes on <html> element
  useEffect(() => {
    // Read initial theme
    const htmlTheme = document.documentElement.getAttribute('data-theme');
    setTheme(htmlTheme === 'dark' ? 'dark' : 'light');

    // Create observer for theme attribute changes
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute('data-theme');
      setTheme(newTheme === 'dark' ? 'dark' : 'light');
    });

    // Observe data-theme attribute changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // Cleanup observer on unmount
    return () => observer.disconnect();
  }, []);

  // Inject Giscus script when theme or articleId changes
  useEffect(() => {
    const giscusContainer = document.getElementById('giscus-container');
    if (!giscusContainer) return;

    // Clear existing script if present (for theme/article changes)
    const existingScript = giscusContainer.querySelector('script');
    if (existingScript) {
      existingScript.remove();
    }

    // Create and inject Giscus script
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    // Set Giscus configuration data attributes
    script.setAttribute('data-repo', import.meta.env.PUBLIC_GISCUS_REPO || '');
    script.setAttribute(
      'data-repo-id',
      import.meta.env.PUBLIC_GISCUS_REPO_ID || ''
    );
    script.setAttribute('data-category', 'Announcements');
    script.setAttribute(
      'data-category-id',
      import.meta.env.PUBLIC_GISCUS_CATEGORY_ID || ''
    );
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-lang', 'ko');

    // Append script to container
    giscusContainer.appendChild(script);

    // Cleanup: remove script on unmount or when dependencies change
    return () => {
      const scriptToRemove = giscusContainer.querySelector('script');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [theme, articleId]);

  return (
    <div className="comments-section mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
        Comments
      </h2>
      <div id="giscus-container" />
    </div>
  );
}
