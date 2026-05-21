import { useState, useEffect, useRef } from 'react';

const WIDTH_OPTIONS = [
  { label: '좁게', value: '600px' },
  { label: '보통', value: '720px' },
  { label: '넓게', value: '860px' },
];

const DEFAULT_WIDTH = '720px';

export default function WidthPicker() {
  const [contentWidth, setContentWidth] = useState(DEFAULT_WIDTH);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('blog-content-width');
    if (stored) {
      setContentWidth(stored);
      document.documentElement.style.setProperty('--content-width', stored);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleChange(value: string) {
    setContentWidth(value);
    localStorage.setItem('blog-content-width', value);
    document.documentElement.style.setProperty('--content-width', value);
    setOpen(false);
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="icon-btn"
        aria-label="콘텐츠 너비 설정"
        title="콘텐츠 너비"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '220px',
            background: 'var(--surface-overlay, #fff)',
            border: '1px solid var(--border-subtle, rgba(0,0,0,0.1))',
            borderRadius: '12px',
            padding: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            zIndex: 100,
          }}
        >
          <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
            콘텐츠 너비
          </p>
          {WIDTH_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: contentWidth === opt.value ? 'var(--c-blue-10, rgba(0,102,255,0.08))' : 'transparent',
              }}
            >
              <input
                type="radio"
                name="content-width"
                value={opt.value}
                checked={contentWidth === opt.value}
                onChange={() => handleChange(opt.value)}
                style={{ accentColor: 'var(--c-blue-50, #0066ff)' }}
              />
              <span style={{ fontSize: '14px' }}>{opt.label}</span>
              <span style={{ marginLeft: 'auto', fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-tertiary)' }}>{opt.value}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
