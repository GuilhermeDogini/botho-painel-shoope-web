import { type ReactNode, useState } from 'react';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Switch } from '@/components/atoms/Switch';
import { Textarea } from '@/components/atoms/Textarea';
import { VitrineGroup, VitrineSection } from './VitrineSection';

const ORDERS = ['#K7Q2M', '#F6B4D', '#P3X9A'];

function DemoField({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-sm leading-tight font-semibold">
        {label}
      </label>
      {children}
    </div>
  );
}

export function FieldsSection() {
  const [picked, setPicked] = useState<string[]>(['#K7Q2M']);
  const [gift, setGift] = useState(true);
  const [auto, setAuto] = useState(true);

  const all = picked.length === ORDERS.length;
  const some = picked.length > 0 && !all;
  const toggle = (o: string) => setPicked((p) => (p.includes(o) ? p.filter((x) => x !== o) : [...p, o]));

  return (
    <VitrineSection
      id="campos"
      task="SHP-43"
      title="Campos"
      note="Normal, foco (borda framboesa e anel), erro e desabilitado. Select com lista Botho (não o menu azul do navegador). Teste com Tab, Espaço e setas."
    >
      <VitrineGroup label="Texto e lista">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DemoField id="vt-i1" label="Campo">
            <Input id="vt-i1" placeholder="Nome da peça" />
          </DemoField>
          <DemoField id="vt-i1f" label="Com foco (visual fixo)">
            <Input id="vt-i1f" defaultValue="Vestido midi" className="border-brand shadow-[0_0_0_3px_color-mix(in_srgb,var(--bt-brand)_18%,transparent)]" />
          </DemoField>
          <DemoField id="vt-i2" label="Com erro">
            <Input id="vt-i2" defaultValue="abc" invalid />
          </DemoField>
          <DemoField id="vt-i3" label="Desabilitado">
            <Input id="vt-i3" defaultValue="Vestido midi" disabled />
          </DemoField>
          <DemoField id="vt-i4" label="Tecido">
            <Select id="vt-i4" defaultValue="viscose">
              <option value="viscose">Viscose</option>
              <option value="algodao">Algodão</option>
              <option value="moletom">Moletom flanelado</option>
              <option value="linho">Linho</option>
            </Select>
          </DemoField>
        </div>
      </VitrineGroup>

      <VitrineGroup label="Texto longo">
        <div className="grid gap-4 lg:grid-cols-2">
          <DemoField id="vt-t1" label="Descrição">
            <Textarea id="vt-t1" placeholder="Conte o tecido, o caimento e as medidas." />
          </DemoField>
          <DemoField id="vt-t2" label="Descrição (erro)">
            <Textarea id="vt-t2" invalid defaultValue="Curta demais" rows={3} />
          </DemoField>
        </div>
      </VitrineGroup>

      <VitrineGroup label="Marcar">
        <div className="flex flex-col">
          <Checkbox
            label={<span className="font-semibold">Selecionar todos</span>}
            checked={all}
            indeterminate={some}
            onChange={() => setPicked(all ? [] : [...ORDERS])}
          />
          {ORDERS.map((o) => (
            <Checkbox key={o} label={`Pedido ${o}`} checked={picked.includes(o)} onChange={() => toggle(o)} className="pl-6" />
          ))}
          <Checkbox label="Embalar para presente" checked={gift} onChange={(e) => setGift(e.target.checked)} />
          <Checkbox label="Desabilitado" disabled />
        </div>
      </VitrineGroup>

      <VitrineGroup label="Liga/desliga">
        <div className="flex flex-col">
          <Switch label={auto ? 'Turbinar automático ligado' : 'Turbinar automático desligado'} checked={auto} onCheckedChange={setAuto} />
          <Switch label="Avisar por e-mail" defaultChecked={false} />
          <Switch label="Desabilitado" disabled defaultChecked />
        </div>
      </VitrineGroup>
    </VitrineSection>
  );
}
