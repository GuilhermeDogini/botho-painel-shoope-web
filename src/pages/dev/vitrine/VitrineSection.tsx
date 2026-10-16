import type { ReactNode } from 'react';

export interface VitrineSectionProps {
  /** Vira o id `vt-<id>`, usado por `npm run capture -- --section <id>`. */
  id: string;
  title: string;
  note: string;
  /** Tarefa do Kanban que criou o componente. */
  task?: string;
  children: ReactNode;
}

export function VitrineSection({ id, title, note, task, children }: VitrineSectionProps) {
  return (
    <section id={`vt-${id}`} aria-labelledby={`vt-${id}-t`} className="mb-6 rounded-lg border border-line bg-surface p-5 shadow-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h2 id={`vt-${id}-t`} className="font-display text-h2 font-bold">
          {title}
        </h2>
        {task && <span className="font-mono text-xs text-muted">{task}</span>}
      </div>
      <p className="mt-1 mb-4 text-sm text-muted">{note}</p>
      {children}
    </section>
  );
}

export function VitrineGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="mb-2 text-xs font-bold tracking-[.08em] text-muted uppercase">{label}</div>
      {children}
    </div>
  );
}
