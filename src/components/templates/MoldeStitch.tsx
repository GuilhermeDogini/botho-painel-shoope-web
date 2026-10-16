import { useEffect, useId, useRef, useState } from 'react';

type Size = { w: number; h: number };

/**
 * Pesponto do molde: a agulha costura o traçado ao montar (Login.dc.html).
 * Com prefers-reduced-motion, mostra só o estado final (sem agulha).
 */
export function MoldeStitch() {
  const maskId = useId().replace(/:/g, '');
  const hostRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size>({ w: 420, h: 600 });

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) setSize({ w: Math.round(width), h: Math.round(height) });
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;
  const rw = Math.max(w - 24, 1);
  const rh = Math.max(h - 24, 1);
  const path = `M 20 12 H ${w - 12} V ${h - 12} H 12 V 12 Z`;
  const notches = [
    `M 0 ${h / 2 - 7} L 9 ${h / 2} L 0 ${h / 2 + 7} Z`,
    `M ${w / 2 - 7} ${h} L ${w / 2} ${h - 9} L ${w / 2 + 7} ${h} Z`,
    `M ${w} ${h / 3 - 7} L ${w - 9} ${h / 3} L ${w} ${h / 3 + 7} Z`,
  ].join(' ');

  return (
    <div ref={hostRef} className="bt-molde-stitch-host pointer-events-none absolute inset-0" aria-hidden>
      <svg className="bt-stitch-svg absolute inset-0 size-full overflow-visible" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <defs>
          <mask id={maskId}>
            <rect
              x={12}
              y={12}
              width={rw}
              height={rh}
              rx={8}
              className="bt-stitch-reveal"
              pathLength={1000}
            />
          </mask>
        </defs>
        <rect
          x={12}
          y={12}
          width={rw}
          height={rh}
          rx={8}
          className="bt-stitch-line"
          mask={`url(#${maskId})`}
        />
        <path d={notches} className="bt-molde-notch" />
      </svg>
      <div className="bt-molde-needle" style={{ offsetPath: `path('${path}')` }}>
        <svg viewBox="0 0 40 10" width={40} height={10}>
          <path d="M8 5 L36 4.2 L40 5 L36 5.8 Z" fill="#9AA3AD" />
          <ellipse cx={12} cy={5} rx={3} ry={1.3} fill="none" stroke="#5C6570" strokeWidth={1} />
          <path d="M9 5 Q4 7 0 5" stroke="#B3134F" strokeWidth={1.4} fill="none" />
        </svg>
      </div>
      <svg
        width={12}
        height={130}
        viewBox="0 0 12 130"
        className="absolute top-1/2 right-[18px] -mt-[65px] opacity-45"
      >
        <path
          d="M6 6 V124 M2 12 L6 4 L10 12 M2 118 L6 126 L10 118"
          stroke="#8A6E52"
          strokeWidth={1.3}
          fill="none"
        />
      </svg>
    </div>
  );
}
