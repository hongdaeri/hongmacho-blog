import { useState, useEffect, useRef } from 'react';

interface TocItem {
  depth: number;
  text: string;
  slug: string;
}

interface Props {
  toc: TocItem[];
}

export default function TOC({ toc }: Props) {
  const [activeSlug, setActiveSlug] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (toc.length === 0) return;

    const headingEls = toc
      .map((item) => document.getElementById(item.slug))
      .filter((el): el is HTMLElement => el !== null);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topmost = visible.reduce((prev, curr) =>
            prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr
          );
          setActiveSlug(topmost.target.id);
        }
      },
      {
        rootMargin: '-88px 0px -60% 0px',
        threshold: 0,
      }
    );

    headingEls.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav aria-label="목차" className="toc">
      <div className="toc__title">목차</div>
      <ul className="toc__list">
        {toc.map((item) => (
          <li key={item.slug} className={`toc__item toc__item--depth-${item.depth}`}>
            <a
              href={`#${item.slug}`}
              className={`toc__link ${activeSlug === item.slug ? 'is-active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(item.slug);
                if (el) {
                  const top = el.getBoundingClientRect().top + window.scrollY - 120;
                  window.scrollTo({ top, behavior: 'smooth' });
                }
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
      <style>{`
        .toc {
          font-size: 13px;
        }
        .toc__title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-tertiary);
          margin-bottom: 10px;
        }
        .toc__list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .toc__item--depth-3 {
          padding-left: 14px;
        }
        .toc__link {
          display: block;
          padding: 5px 8px;
          border-radius: 6px;
          text-decoration: none;
          color: var(--text-tertiary);
          line-height: 1.4;
          transition: color 0.1s, background 0.1s;
          border-left: 2px solid transparent;
        }
        .toc__link:hover {
          color: var(--text-primary);
          background: var(--surface-2, rgba(0,0,0,0.04));
        }
        .toc__link.is-active {
          color: var(--c-blue-50, #0066ff);
          font-weight: 600;
          border-left-color: var(--c-blue-50, #0066ff);
          background: var(--c-blue-10, rgba(0,102,255,0.06));
        }
      `}</style>
    </nav>
  );
}
