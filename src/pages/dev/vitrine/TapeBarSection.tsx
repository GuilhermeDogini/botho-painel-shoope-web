import { BarRow } from '@/components/molecules/BarRow';
import { TapeProgress } from '@/components/molecules/TapeProgress';
import { VitrineGroup, VitrineSection } from './VitrineSection';

export function TapeBarSection() {
  return (
    <VitrineSection
      id="fita-barras"
      task="SHP-52"
      title="TapeProgress e BarRow"
      note="Fita métrica (0% / parcial / 100%) e barras “para onde foi o dinheiro”. Confira claro e escuro."
    >
      <VitrineGroup label="Fita métrica">
        <div className="flex max-w-md flex-col gap-4">
          <TapeProgress aria-label="Vazio" value={0} max={100} />
          <TapeProgress
            aria-label="Meta de outubro"
            value={5876}
            max={18000}
            scale={['0', '4,5 mil', '9 mil', '13,5 mil', '18 mil']}
          />
          <TapeProgress aria-label="Completo" value={100} max={100} tone="ok" />
          <div className="flex flex-col gap-2">
            <TapeProgress aria-label="Ok" value={66} size="sm" tone="ok" />
            <TapeProgress aria-label="Atenção" value={20} size="sm" tone="warn" />
            <TapeProgress aria-label="Perigo" value={8} size="sm" tone="danger" />
          </div>
        </div>
      </VitrineGroup>

      <VitrineGroup label="Para onde foi o dinheiro">
        <div className="flex max-w-md flex-col gap-2.5">
          <BarRow label="Comissão" value={822} ratio={1} tone="brand" />
          <BarRow label="Frete" value={352} ratio={0.43} tone="mostarda" />
          <BarRow label="Ads" value={186.2} ratio={0.23} tone="anil" />
          <BarRow label="Taxas" value={98} ratio={0.12} tone="danger" />
        </div>
      </VitrineGroup>
    </VitrineSection>
  );
}
