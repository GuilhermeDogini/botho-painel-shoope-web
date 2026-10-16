import { useState } from 'react';
import {
  Home,
  MessageCircle,
  MoreHorizontal,
  Package,
  Shirt,
} from 'lucide-react';
import { NavItem, NavList } from '@/components/molecules/NavItem';
import { StepIndicator } from '@/components/molecules/StepIndicator';
import { VitrineGroup, VitrineSection } from './VitrineSection';

const CADASTRO_STEPS = ['Fotos', 'Categoria', 'Detalhes', 'Variações', 'Preço e envio', 'Revisar'];

type SideKey = 'pedidos' | 'conversas' | 'produtos';
type BottomKey = 'inicio' | 'pedidos' | 'conversas' | 'produtos' | 'mais';

export function NavStepSection() {
  const [side, setSide] = useState<SideKey>('pedidos');
  const [bottom, setBottom] = useState<BottomKey>('inicio');
  const [step, setStep] = useState(2);

  return (
    <VitrineSection
      id="nav-steps"
      task="SHP-55"
      title="NavItem e StepIndicator"
      note="Clique nos itens e nos passos: o destaque desliza (lateral e barra) e o ícone ativo dá um pop. Celular: barra inferior + resumo da fita. Desktop: menu lateral + nomes completos."
    >
      <VitrineGroup label="Menu lateral (clique para ativar)">
        <NavList aria-label="Menu lateral" className="w-full max-w-[220px] rounded-md border border-line p-2">
          <NavItem icon={Package} active={side === 'pedidos'} count={6} onClick={() => setSide('pedidos')}>
            Pedidos
          </NavItem>
          <NavItem icon={MessageCircle} active={side === 'conversas'} count={3} onClick={() => setSide('conversas')}>
            Conversas
          </NavItem>
          <NavItem icon={Shirt} active={side === 'produtos'} onClick={() => setSide('produtos')}>
            Produtos
          </NavItem>
        </NavList>
      </VitrineGroup>

      <VitrineGroup label="Barra inferior (clique para ativar)">
        <NavList
          variant="bottom"
          aria-label="Principal"
          className="mx-auto w-full max-w-md rounded-md border border-line bg-surface px-1 pt-1 pb-3.5 shadow-[0_-6px_20px_-12px_rgba(0,0,0,.25)]"
        >
          <NavItem variant="bottom" icon={Home} active={bottom === 'inicio'} onClick={() => setBottom('inicio')}>
            Início
          </NavItem>
          <NavItem
            variant="bottom"
            icon={Package}
            active={bottom === 'pedidos'}
            count={6}
            onClick={() => setBottom('pedidos')}
          >
            Pedidos
          </NavItem>
          <NavItem
            variant="bottom"
            icon={MessageCircle}
            active={bottom === 'conversas'}
            onClick={() => setBottom('conversas')}
          >
            Conversas
          </NavItem>
          <NavItem variant="bottom" icon={Shirt} active={bottom === 'produtos'} onClick={() => setBottom('produtos')}>
            Produtos
          </NavItem>
          <NavItem variant="bottom" icon={MoreHorizontal} active={bottom === 'mais'} onClick={() => setBottom('mais')}>
            Mais
          </NavItem>
        </NavList>
      </VitrineGroup>

      <VitrineGroup label="Assistente (clique nos passos)">
        <div className="rounded-md border border-line bg-surface p-3">
          <StepIndicator steps={CADASTRO_STEPS} current={step} onStepClick={setStep} />
        </div>
      </VitrineGroup>
    </VitrineSection>
  );
}
