import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

export interface PrintPreviewFrameProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode;
}

/**
 * Encaixa folhas A4 (`.bt-print-page`) na largura da tela — zoom-out como prévia de PDF.
 * Em `@media print` a escala some e a folha volta ao tamanho real.
 */
export function PrintPreviewFrame({ children, className, ...rest }: PrintPreviewFrameProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [innerHeight, setInnerHeight] = useState(0);

  useLayoutEffect(() => {
    const host = hostRef.current;
    const inner = innerRef.current;
    if (!host || !inner) return;

    const measure = () => {
      const page = inner.querySelector<HTMLElement>('.bt-print-page');
      const pageW = page?.offsetWidth ?? inner.offsetWidth;
      const avail = host.clientWidth;
      const next = pageW > 0 ? Math.min(1, (avail - 2) / pageW) : 1;
      setScale(next);
      setInnerHeight(inner.scrollHeight);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    ro.observe(inner);
    const imgs = inner.querySelectorAll('img');
    imgs.forEach((img) => img.addEventListener('load', measure));
    return () => {
      ro.disconnect();
      imgs.forEach((img) => img.removeEventListener('load', measure));
    };
  }, [children]);

  const scaledStyle: CSSProperties =
    scale < 1
      ? {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }
      : {};

  const hostStyle: CSSProperties =
    scale < 1 && innerHeight > 0
      ? {
          height: Math.ceil(innerHeight * scale),
        }
      : {};

  return (
    <div
      {...rest}
      ref={hostRef}
      className={cn(
        'bt-print-preview relative w-full',
        scale < 1 ? 'overflow-hidden' : 'overflow-x-auto',
        'print:!h-auto print:!overflow-visible',
        className,
      )}
      style={hostStyle}
    >
      <div
        ref={innerRef}
        className="bt-print-preview-inner flex w-[210mm] max-w-none flex-col gap-8 print:!w-auto print:!transform-none print:!gap-0"
        style={scaledStyle}
      >
        {children}
      </div>
    </div>
  );
}
