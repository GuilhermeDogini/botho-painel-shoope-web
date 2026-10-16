import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { PHOTO_FIXTURES } from './photoUploaderFixtures';
import { PhotoUploader, type PhotoUploadItem } from './PhotoUploader';

function Demo(args: {
  initial?: PhotoUploadItem[];
  showTips?: boolean;
}) {
  const [photos, setPhotos] = useState<PhotoUploadItem[]>(args.initial ?? PHOTO_FIXTURES);

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-3">
        <h2 className="text-lg font-bold">Fotos da peça</h2>
        <p className="text-sm text-muted">Até 9 fotos. A primeira é a capa. Arraste para mudar a ordem.</p>
      </div>
      <PhotoUploader
        photos={photos}
        showTips={args.showTips}
        onChange={setPhotos}
        onAddFiles={(files) => {
          const room = 9 - photos.length;
          const added = files.slice(0, room).map((file, i) => ({
            id: `local-${Date.now()}-${i}`,
            previewUrl: URL.createObjectURL(file),
            status: 'done' as const,
            imageId: `local-${i}`,
          }));
          setPhotos((ps) => [...ps, ...added]);
        }}
        onRetry={(id) => {
          setPhotos((ps) =>
            ps.map((p) => (p.id === id ? { ...p, status: 'uploading', progress: 20, error: undefined } : p)),
          );
          window.setTimeout(() => {
            setPhotos((ps) =>
              ps.map((p) => (p.id === id ? { ...p, status: 'done', progress: 100, imageId: `retry-${id}` } : p)),
            );
          }, 800);
        }}
      />
    </div>
  );
}

const meta = {
  title: 'Organisms/PhotoUploader',
  component: PhotoUploader,
  parameters: {
    docs: {
      description: {
        component: `
Upload de fotos do cadastro (SHP-94): até 9, capa, arrastar para ordenar, dropzone com pesponto, progresso e tentar de novo.

## Como testar
1. Arraste pelo ícone de grip (ou a própria foto no desktop) para reordenar — capa é a primeira.
2. Estrela “Tornar capa” sobe a foto.
3. Solte arquivos na área tracejada (ou clique).
4. Em Erro, clique “Tentar de novo”.
5. Viewport 390: grade 3 colunas; arraste no toque pelo grip.
        `,
      },
    },
  },
} satisfies Meta<typeof PhotoUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComFotos: Story = {
  args: {
    photos: PHOTO_FIXTURES,
    onChange: () => undefined,
    onAddFiles: () => undefined,
  },
  render: () => <Demo />,
};

export const Vazio: Story = {
  args: {
    photos: [],
    onChange: () => undefined,
    onAddFiles: () => undefined,
  },
  render: () => <Demo initial={[]} />,
};

export const SemDicas: Story = {
  args: {
    photos: PHOTO_FIXTURES,
    onChange: () => undefined,
    onAddFiles: () => undefined,
  },
  render: () => <Demo showTips={false} />,
};
