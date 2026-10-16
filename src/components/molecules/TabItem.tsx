import {
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { CountBadge } from '@/components/atoms/CountBadge';
import { cn } from '@/lib/utils';

export interface TabItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Aba selecionada (contador ativo; o traço animado fica no `TabList`). */
  active?: boolean;
  /** Contador à direita (some com 0, salvo `showZero`). */
  count?: number | null;
  showZero?: boolean;
  children: ReactNode;
}

/** Uma aba: texto + contador opcional. Use dentro de `TabList`. */
export function TabItem({
  active = false,
  count,
  showZero = false,
  className,
  type = 'button',
  children,
  ...rest
}: TabItemProps) {
  return (
    <button
      {...rest}
      type={type}
      role="tab"
      aria-selected={active}
      className={cn(
        'relative z-0 inline-flex min-h-12 shrink-0 cursor-pointer items-center gap-2 border-0 bg-transparent px-3.5 text-[15px] font-semibold whitespace-nowrap',
        'text-muted transition-colors duration-200',
        active && 'text-ink',
        className,
      )}
    >
      {children}
      <CountBadge value={count} active={active} showZero={showZero} />
    </button>
  );
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * No celular, estica até a borda da página (margem negativa + padding) para a
   * rolagem ficar só aqui — a página não rola de lado.
   */
  bleed?: boolean;
  /** Rótulo acessível do grupo de abas. */
  'aria-label': string;
}

type Ink = { left: number; width: number };

/**
 * Fila de abas com rolagem horizontal interna e traço framboesa que **desliza**
 * até a aba ativa (respeita `prefers-reduced-motion`).
 */
export function TabList({ bleed = false, className, children, ...rest }: TabListProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [ink, setInk] = useState<Ink | null>(null);
  const [canAnimate, setCanAnimate] = useState(false);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const scroller = scrollerRef.current;
    if (!track || !scroller) return;

    const reduceMotion = () =>
      typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const update = () => {
      const active = track.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
      if (!active) {
        setInk(null);
        return;
      }
      const inset = 10;
      setInk({
        left: active.offsetLeft + inset,
        width: Math.max(0, active.offsetWidth - inset * 2),
      });
      active.scrollIntoView?.({
        inline: 'nearest',
        block: 'nearest',
        behavior: reduceMotion() ? 'auto' : 'smooth',
      });
    };

    update();
    // Liga a transição só depois da 1ª medida (evita o traço “voar” na montagem).
    const enableAnim = requestAnimationFrame(() => setCanAnimate(true));

    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(update)
        : null;
    ro?.observe(track);
    track.querySelectorAll('[role="tab"]').forEach((tab) => ro?.observe(tab));

    const mo = new MutationObserver(update);
    mo.observe(track, { attributes: true, subtree: true, attributeFilter: ['aria-selected'] });

    return () => {
      cancelAnimationFrame(enableAnim);
      ro?.disconnect();
      mo.disconnect();
    };
  }, [children]);

  return (
    <div
      className={cn(
        'max-w-full min-w-0 border-b border-line',
        bleed && '-mx-4 px-4 sm:-mx-0 sm:px-0',
        className,
      )}
    >
      <div
        ref={scrollerRef}
        {...rest}
        role="tablist"
        className={cn(
          'max-w-full min-w-0 overflow-x-auto overscroll-x-contain',
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        )}
      >
        <div ref={trackRef} className="relative inline-flex min-w-full gap-1">
          {children}
          {ink ? (
            <span
              aria-hidden
              className={cn(
                'pointer-events-none absolute bottom-0 z-10 h-[3px] rounded-t-[3px] bg-brand',
                canAnimate &&
                  'motion-safe:transition-[transform,width] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]',
              )}
              style={{
                width: ink.width,
                transform: `translate3d(${ink.left}px, 0, 0)`,
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
