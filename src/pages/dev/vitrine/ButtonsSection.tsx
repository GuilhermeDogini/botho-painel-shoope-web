import { Bell, ChevronRight, Plus, Printer, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/atoms/Button';
import { IconButton } from '@/components/atoms/IconButton';
import { VitrineGroup, VitrineSection } from './VitrineSection';

export function ButtonsSection() {
  const [saving, setSaving] = useState(false);

  const fakeSave = () => {
    setSaving(true);
    window.setTimeout(() => setSaving(false), 1600);
  };

  return (
    <VitrineSection
      id="botoes"
      task="SHP-42"
      title="Botões"
      note="Seis estilos do design: primário, suave, padrão (contorno), ghost, perigo e link. Tamanhos 52, 44 e 40 (o compacto tem área de toque de 44)."
    >
      <VitrineGroup label="Estilos">
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="primary" icon={Printer}>
            Imprimir etiquetas
          </Button>
          <Button variant="soft" icon={Plus}>
            Cadastrar peça
          </Button>
          <Button>Lista de separação</Button>
          <Button variant="ghost">Cancelar</Button>
          <Button variant="danger" icon={Trash2}>
            Sim, cancelar pedido
          </Button>
          <Button variant="link" iconRight={ChevronRight}>
            Ver todos
          </Button>
        </div>
      </VitrineGroup>

      <VitrineGroup label="Tamanhos">
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="primary" size="lg">
            Grande · 52
          </Button>
          <Button variant="primary">Padrão · 44</Button>
          <Button variant="primary" size="sm" icon={Printer}>
            Compacto · 40
          </Button>
          <Button size="sm">Compacto</Button>
        </div>
      </VitrineGroup>

      <VitrineGroup label="Estados">
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="primary" loading={saving} onClick={fakeSave}>
            {saving ? 'Salvando…' : 'Salvar (clique)'}
          </Button>
          <Button variant="primary" loading>
            Enviando
          </Button>
          <Button disabled>Desabilitado</Button>
          <Button variant="primary" disabled>
            Desabilitado
          </Button>
          <Button variant="soft" asChild icon={Search}>
            <Link to="/vitrine">Como link (asChild)</Link>
          </Button>
        </div>
      </VitrineGroup>

      <VitrineGroup label="Largura total (celular)">
        <div className="max-w-sm">
          <Button variant="primary" size="lg" fullWidth icon={Printer}>
            Imprimir 6 etiquetas
          </Button>
        </div>
      </VitrineGroup>

      <VitrineGroup label="Botão de ícone">
        <div className="flex flex-wrap items-center gap-2.5">
          <IconButton icon={Bell} label="Notificações" />
          <IconButton icon={Bell} label="Notificações" bordered badge={4} />
          <IconButton icon={Bell} label="Notificações" bordered badge={128} />
          <IconButton icon={Trash2} label="Apagar" disabled />
        </div>
      </VitrineGroup>
    </VitrineSection>
  );
}
