import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import type { ThemePreference } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { ButtonsSection } from './vitrine/ButtonsSection';
import { FeedbackSection } from './vitrine/FeedbackSection';
import { FieldsSection } from './vitrine/FieldsSection';
import { MediaSection } from './vitrine/MediaSection';
import { AlertsSection } from './vitrine/AlertsSection';
import { AppShellSection } from './vitrine/AppShellSection';
import { AuthLayoutSection } from './vitrine/AuthLayoutSection';
import { BannersSection } from './vitrine/BannersSection';
import { PageTemplatesSection } from './vitrine/PageTemplatesSection';
import { BulkActionSection } from './vitrine/BulkActionSection';
import { ChartsSection } from './vitrine/ChartsSection';
import { DataTableSection } from './vitrine/DataTableSection';
import { DialogsSection } from './vitrine/DialogsSection';
import { EmptyStateSection } from './vitrine/EmptyStateSection';
import { EquipeSection } from './vitrine/EquipeSection';
import { InicioSection } from './vitrine/InicioSection';
import { MoleculesFieldsSection } from './vitrine/MoleculesFieldsSection';
import { NavStepSection } from './vitrine/NavStepSection';
import { ProductLineSection } from './vitrine/ProductLineSection';
import { StatKeyValueSection } from './vitrine/StatKeyValueSection';
import { TabsFiltersSection } from './vitrine/TabsFiltersSection';
import { TagsSection } from './vitrine/TagsSection';
import { TapeBarSection } from './vitrine/TapeBarSection';
import { TypographySection } from './vitrine/TypographySection';
import { VitrineSection } from './vitrine/VitrineSection';

/**
 * Vitrine (só em desenvolvimento, /vitrine): onde cada átomo, molécula e organismo é conferido
 * em claro e escuro antes de entrar numa tela. Espelha design/opcao-a/DesignSystem.dc.html.
 * Componente novo do design system → ganha uma seção em ./vitrine na mesma tarefa e sai de PENDING.
 * Capturas: `npm run capture` (página inteira) ou `npm run capture -- --section <id>`.
 */

const COLORS: [token: string, use: string][] = [
  ['bg', 'Fundo · algodão cru'],
  ['surface', 'Cards e campos'],
  ['surface-2', 'Áreas internas'],
  ['line', 'Divisórias'],
  ['ink', 'Texto principal'],
  ['ink-2', 'Texto de apoio'],
  ['muted', 'Legendas'],
  ['brand', 'Framboesa · ação principal'],
  ['brand-soft', 'Fundo de destaque'],
  ['mostarda', 'Carretel · atenção'],
  ['anil', 'Carretel · informação'],
  ['salvia', 'Carretel · sucesso'],
  ['danger', 'Erro e urgência'],
];

/** Componentes do design system que ainda não têm seção aqui, e a tarefa de cada um. */
const PENDING: [name: string, task: string][] = [
  ['Tooltip (e no IconButton)', 'SHP-128'],
];

export function VitrinePage() {
  const theme = useTheme();
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold tracking-widest text-muted uppercase">Botho · design system · só em dev</div>
          <h1 className="font-display text-h1 font-bold">Vitrine de componentes</h1>
          <p className="mt-1 text-sm text-ink-2">Confira cada componente aqui, em claro e escuro, antes de usar numa tela.</p>
        </div>
        <ThemeSwitch value={theme.preference} onChange={theme.setPreference} />
      </header>

      <VitrineSection id="cores" title="Cores" note="Tokens de src/styles/botho-theme.css. Trocam sozinhos no tema escuro.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {COLORS.map(([token, use]) => (
            <div key={token} className="overflow-hidden rounded-md border border-line bg-surface">
              <div className="h-14 border-b border-line" style={{ background: `var(--bt-${token})` }} />
              <div className="p-2.5">
                <div className="font-mono text-xs font-semibold">--{token}</div>
                <div className="text-xs text-muted">{use}</div>
              </div>
            </div>
          ))}
        </div>
      </VitrineSection>

      <TypographySection />
      <ButtonsSection />
      <FieldsSection />
      <MoleculesFieldsSection />
      <TabsFiltersSection />
      <StatKeyValueSection />
      <AlertsSection />
      <TapeBarSection />
      <ProductLineSection />
      <EmptyStateSection />
      <NavStepSection />
      <DialogsSection />
      <DataTableSection />
      <BulkActionSection />
      <EquipeSection />
      <InicioSection />
      <ChartsSection />
      <BannersSection />
      <AppShellSection />
      <AuthLayoutSection />
      <PageTemplatesSection />
      <TagsSection />
      <MediaSection />
      <FeedbackSection />

      <VitrineSection id="utilitarios" title="Utilitários da Botho" note="stitch (pesponto) no tema. A fita métrica está em TapeProgress (SHP-52); a etiqueta (tag) na seção própria.">
        <div className="stitch rounded-lg bg-surface p-6 text-sm">Card com pesponto</div>
      </VitrineSection>

      <VitrineSection id="pendentes" title="Ainda por fazer" note="Entram aqui conforme as tarefas do design system (épico SHP-20) forem feitas.">
        <ul className="grid gap-x-6 sm:grid-cols-2">
          {PENDING.map(([name, task]) => (
            <li key={name} className="flex justify-between gap-3 border-b border-line py-2 text-sm">
              <span>{name}</span>
              <span className="shrink-0 font-mono text-xs text-muted">{task}</span>
            </li>
          ))}
        </ul>
      </VitrineSection>
    </div>
  );
}

const THEMES: [ThemePreference, string, typeof Sun][] = [
  ['light', 'Claro', Sun],
  ['dark', 'Escuro', Moon],
  ['auto', 'Automático', Monitor],
];

function ThemeSwitch({ value, onChange }: { value: ThemePreference; onChange: (v: ThemePreference) => void }) {
  return (
    <div role="radiogroup" aria-label="Tema" className="inline-flex rounded-md border border-line bg-surface-2 p-1">
      {THEMES.map(([v, label, Icon]) => (
        <button
          key={v}
          role="radio"
          aria-checked={value === v}
          onClick={() => onChange(v)}
          className={cn('flex min-h-10 items-center gap-1.5 rounded-sm px-3 text-sm', value === v ? 'bg-surface font-semibold shadow-1' : 'text-ink-2')}
        >
          <Icon className="size-4" strokeWidth={1.75} />
          {label}
        </button>
      ))}
    </div>
  );
}
