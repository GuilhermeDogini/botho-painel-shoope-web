import { Avatar } from '@/components/atoms/Avatar';
import { ColorDot } from '@/components/atoms/ColorDot';
import { LabelLogo } from '@/components/atoms/LabelLogo';
import { Logo } from '@/components/atoms/Logo';
import { Thumbnail } from '@/components/atoms/Thumbnail';
import pantalona from './assets/pantalona-caramelo.svg';
import vestido from './assets/vestido-midi-anil.svg';
import { VitrineGroup, VitrineSection } from './VitrineSection';

const COLORS = [
  ['#E9A6B9', 'Rosa'],
  ['#2F4A9A', 'Anil'],
  ['#9C6640', 'Caramelo'],
  ['#1D1512', 'Preto'],
  ['#FFFFFF', 'Branco'],
  ['#F3EBDF', 'Off-white'],
] as const;

const TEAM = ['Gisele Botho', 'Rafaela Souza', 'Bruna Lima', 'Camila Rocha', 'Márcio Alves', 'Érica Nunes'];

export function MediaSection() {
  return (
    <VitrineSection
      id="midia"
      task="SHP-46"
      title="Mídia e marca"
      note="Foto de peça 3:4 ou quadrada, sempre cortada (nunca esticada), com cabide quando não há foto ou ela falha. Bolinha de cor, avatar com inicial e o logo."
    >
      <VitrineGroup label="Foto da peça">
        <div className="flex flex-wrap items-end gap-4">
          <Thumbnail src={vestido} alt="Vestido midi azul anil" size="sm" />
          <Thumbnail src={vestido} alt="Vestido midi azul anil" size="md" />
          <Thumbnail src={vestido} alt="Vestido midi azul anil" size="lg" />
          <Thumbnail src={pantalona} alt="Pantalona caramelo" size="lg" shape="square" />
          <Thumbnail src={null} alt="Conjunto moletom flanelado" size="lg" />
          <Thumbnail src="/nao-existe.jpg" alt="Foto que falhou" size="lg" />
          <div className="w-32">
            <Thumbnail src={pantalona} alt="Pantalona caramelo" size="fluid" />
          </div>
        </div>
      </VitrineGroup>

      <VitrineGroup label="Cores da variação">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {COLORS.map(([hex, name]) => (
            <span key={name} className="inline-flex items-center gap-2">
              <ColorDot color={hex} size="lg" />
              {name}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5">
            {COLORS.map(([hex, name]) => (
              <ColorDot key={name} color={hex} label={name} />
            ))}
          </span>
        </div>
      </VitrineGroup>

      <VitrineGroup label="Avatar">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {TEAM.map((name) => (
            <span key={name} className="inline-flex items-center gap-2">
              <Avatar name={name} />
              {name}
            </span>
          ))}
          <Avatar name="Gisele Botho" size="sm" />
          <Avatar name="Gisele Botho" size="lg" />
        </div>
      </VitrineGroup>

      <VitrineGroup label="Logo">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-8">
            <Logo size="sm" />
            <Logo variant="mark" size="md" />
            <Logo size="md" />
          </div>
          <div className="overflow-hidden">
            <Logo size="lg" />
          </div>
          <div className="flex flex-wrap items-center gap-6 rounded-md bg-surface-2 p-6">
            <LabelLogo size="lg" word="botho brasil" subtitle="feito com carinho no Brasil" />
            <LabelLogo size="sm" />
            <LabelLogo size="sm" tone="cream" />
          </div>
        </div>
      </VitrineGroup>
    </VitrineSection>
  );
}
