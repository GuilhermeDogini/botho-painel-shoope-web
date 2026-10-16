import { type LucideIcon } from 'lucide-react';
import { Slot } from 'radix-ui';
import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { CountBadge } from '@/components/atoms/CountBadge';
import { cn } from '@/lib/utils';

export type NavItemVariant = 'side' | 'bottom';

/** Dentro de um `NavList`, o destaque do ativo é desenhado (e animado) pela lista. */
const NavListContext = createContext(false);

export interface NavItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Ícone lucide (obrigatório — status nunca só por cor). */
  icon: LucideIcon;
  /** Lateral (desktop) ou barra inferior (celular). */
  variant?: NavItemVariant;
  /** Item da rota/aba atual. */
  active?: boolean;
  /** Contador (some com 0, salvo `showZero`). */
  count?: number | null;
  showZero?: boolean;
  /** Renderiza o filho (ex.: `<Link>`) com o estilo do item. */
  asChild?: boolean;
  children: ReactNode;
}

/**
 * Item de navegação: ícone + rótulo + contador.
 * `side` = menu lateral; `bottom` = barra inferior do celular.
 * Use dentro de `NavList` para o destaque deslizar entre os itens.
 */
export function NavItem({
  icon: Icon,
  variant = 'side',
  active = false,
  count,
  showZero = false,
  asChild = false,
  className,
  children,
  type = 'button',
  ...rest
}: NavItemProps) {
  const managed = useContext(NavListContext);
  const Comp = asChild ? Slot.Root : 'button';
  const common = {
    ...rest,
    ...(asChild ? {} : { type }),
    'data-nav-item': '',
    'data-variant': variant,
    'data-active': active ? 'true' : 'false',
    'aria-current': active ? ('page' as const) : undefined,
  };

  if (variant === 'bottom') {
    return (
      <Comp
        {...common}
        className={cn(
          'relative z-10 flex min-h-[52px] w-full min-w-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-[12px] border-0 bg-transparent px-0.5',
          'text-[11.5px] font-semibold no-underline transition-colors duration-300',
          active ? 'text-brand-text' : 'text-muted',
          className,
        )}
      >
        {managed ? null : (
          <span
            aria-hidden
            className={cn(
              'absolute top-0 right-[28%] left-[28%] h-[3px] rounded-b-[3px] bg-brand',
              active ? 'opacity-100' : 'opacity-0',
            )}
          />
        )}
        <span
          aria-hidden
          className={cn(
            'mt-1 inline-flex size-8 items-center justify-center rounded-[10px] transition-colors duration-300',
            active && 'animate-[bt-nav-pop_.42s_cubic-bezier(.22,1,.36,1)] bg-brand text-brand-ink',
          )}
        >
          <Icon size={22} strokeWidth={1.75} className="shrink-0" />
        </span>
        {asChild ? (
          <Slot.Slottable>{children}</Slot.Slottable>
        ) : (
          <span className="max-w-full truncate leading-tight">{children}</span>
        )}
        <CountBadge
          value={count}
          active
          showZero={showZero}
          className="absolute top-0.5 left-[calc(50%+8px)] z-10 h-[18px] min-w-[18px] px-[5px] text-[11px] leading-[18px]"
        />
      </Comp>
    );
  }

  return (
    <Comp
      {...common}
      className={cn(
        'relative z-10 flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-sm border-0 bg-transparent px-3 text-[15px] font-semibold no-underline',
        'transition-colors duration-300',
        active ? 'text-brand-text' : 'text-ink-2 hover:bg-surface-2 hover:text-ink',
        active && !managed && SIDE_ACTIVE_SURFACE,
        className,
      )}
    >
      <Icon size={20} strokeWidth={1.75} aria-hidden className="shrink-0" />
      {asChild ? (
        <Slot.Slottable>{children}</Slot.Slottable>
      ) : (
        <span className="min-w-0 flex-1 truncate text-left">{children}</span>
      )}
      <CountBadge
        value={count}
        active={active}
        showZero={showZero}
        className="ml-auto transition-colors duration-300"
      />
    </Comp>
  );
}

const SIDE_ACTIVE_SURFACE =
  'bg-brand-soft outline outline-[1.5px] outline-offset-[-4px] outline-dashed outline-[color-mix(in_srgb,var(--bt-brand)_45%,transparent)]';

export interface NavListProps extends HTMLAttributes<HTMLElement> {
  /** Mesmo `variant` dos itens: lateral (coluna) ou barra inferior (grade). */
  variant?: NavItemVariant;
  /** Rótulo acessível do menu. */
  'aria-label': string;
}

type Box = { left: number; top: number; width: number; height: number };

/**
 * `<nav>` que desenha o destaque do item ativo e o faz **deslizar** até o novo ativo:
 * pílula tracejada na lateral, traço no topo na barra inferior.
 * Os itens precisam ser filhos diretos (sem wrapper posicionado entre a lista e o item).
 */
export function NavList({ variant = 'side', className, children, ...rest }: NavListProps) {
  const navRef = useRef<HTMLElement>(null);
  const [box, setBox] = useState<Box | null>(null);
  const [canAnimate, setCanAnimate] = useState(false);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const update = () => {
      const active = nav.querySelector<HTMLElement>('[data-nav-item][data-active="true"]');
      setBox(
        active
          ? { left: active.offsetLeft, top: active.offsetTop, width: active.offsetWidth, height: active.offsetHeight }
          : null,
      );
    };

    update();
    // Liga a transição só depois da 1ª medida (evita o destaque “voar” na montagem).
    const enableAnim = requestAnimationFrame(() => setCanAnimate(true));

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    ro?.observe(nav);
    nav.querySelectorAll('[data-nav-item]').forEach((item) => ro?.observe(item));

    const mo = new MutationObserver(update);
    mo.observe(nav, { attributes: true, subtree: true, attributeFilter: ['data-active'] });

    return () => {
      cancelAnimationFrame(enableAnim);
      ro?.disconnect();
      mo.disconnect();
    };
  }, [children]);

  const motion =
    canAnimate && 'transition-[transform,width,height,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]';

  return (
    <NavListContext.Provider value>
      <nav
        ref={navRef}
        {...rest}
        className={cn(
          'relative',
          variant === 'bottom' ? 'grid grid-cols-5' : 'flex flex-col gap-0.5',
          className,
        )}
      >
        {box && variant === 'side' ? (
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute top-0 left-0 z-0 rounded-sm',
              SIDE_ACTIVE_SURFACE,
              motion,
            )}
            style={{
              width: box.width,
              height: box.height,
              transform: `translate3d(${box.left}px, ${box.top}px, 0)`,
            }}
          />
        ) : null}
        {box && variant === 'bottom' ? (
          <span
            aria-hidden
            className={cn('pointer-events-none absolute top-0 left-0 z-20 h-[3px] rounded-b-[3px] bg-brand', motion)}
            style={{
              width: box.width * 0.44,
              transform: `translate3d(${box.left + box.width * 0.28}px, ${box.top}px, 0)`,
            }}
          />
        ) : null}
        {children}
      </nav>
    </NavListContext.Provider>
  );
}
