import { Plus, Rocket, X } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { EMPTY_ILLUSTRATIONS } from '@/components/illustrations';
import { EmptyState } from '@/components/molecules/EmptyState';
import { VitrineGroup, VitrineSection } from './VitrineSection';

export function EmptyStateSection() {
  return (
    <VitrineSection
      id="empty"
      task="SHP-54"
      title="EmptyState e ilustrações"
      note="Celular primeiro: bloco centralizado a ~390 px; no desktop o card alarga e o texto mantém max-width. Mesmo componente em Pedidos, Produtos e Conversas."
    >
      <VitrineGroup label="Pedidos · Produtos · Conversas">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-line bg-surface shadow-1">
            <EmptyState
              illustration="arara"
              title="Nenhum pedido para enviar"
              description="Tudo despachado por hoje. Que tal turbinar umas peças para chegar mais pedido?"
              action={
                <Button variant="soft" icon={Rocket}>
                  Turbinar peças
                </Button>
              }
            />
          </div>
          <div className="rounded-lg border border-line bg-surface shadow-1">
            <EmptyState
              illustration="cabide"
              title='Nenhuma peça com “macacão”'
              description="Confira a escrita ou tente outra palavra, como a cor ou o tecido."
              action={
                <Button variant="outline" icon={X}>
                  Limpar busca
                </Button>
              }
            />
          </div>
          <div className="rounded-lg border border-line bg-surface shadow-1 md:col-span-2 lg:col-span-1">
            <EmptyState
              illustration="carretel"
              title="Nenhuma conversa esperando"
              description="Você respondeu todo mundo. As novas mensagens aparecem aqui."
              action={<Button variant="outline">Ver todas as conversas</Button>}
            />
          </div>
        </div>
      </VitrineGroup>

      <VitrineGroup label="Catálogo vazio (agulha)">
        <div className="max-w-md rounded-lg border border-line bg-surface shadow-1">
          <EmptyState
            illustration="agulha"
            title="Ainda não tem peça cadastrada"
            description="Cadastre a primeira com fotos 3:4, cor e tamanho."
            action={
              <Button variant="primary" icon={Plus} fullWidth className="sm:w-auto">
                Cadastrar peça
              </Button>
            }
          />
        </div>
      </VitrineGroup>

      <VitrineGroup label="Ilustrações">
        <div className="flex flex-wrap items-end gap-4">
          {EMPTY_ILLUSTRATIONS.map((kind) => (
            <div
              key={kind}
              className="flex min-w-[7.5rem] flex-col items-center rounded-md border border-line bg-surface-2 px-3 py-4"
            >
              <EmptyState illustration={kind} title={kind} className="gap-1.5 px-0 py-0" />
            </div>
          ))}
        </div>
      </VitrineGroup>
    </VitrineSection>
  );
}
