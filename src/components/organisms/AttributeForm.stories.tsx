import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import type { AttributeValue } from '@/lib/types';
import { AttributeForm } from './AttributeForm';
import { ATTRIBUTE_FIXTURES, ATTRIBUTE_VALUES_SAMPLE } from './attributeFormFixtures';

function Demo(args: { loading?: boolean; error?: string | null; empty?: boolean }) {
  const [values, setValues] = useState<Record<number, AttributeValue[]>>(ATTRIBUTE_VALUES_SAMPLE);
  return (
    <div className="mx-auto max-w-xl p-4">
      <AttributeForm
        attributes={args.empty ? [] : ATTRIBUTE_FIXTURES}
        values={values}
        onChange={(id, next) => setValues((prev) => ({ ...prev, [id]: next }))}
        loading={args.loading}
        error={args.error}
      />
    </div>
  );
}

const meta = {
  title: 'Organisms/AttributeForm',
  component: AttributeForm,
  parameters: {
    docs: {
      description: {
        component: `
Características dinâmicas da Shopee (SHP-95): dropdown, multi (chips), texto, combo + unidade.

## Como testar
1. Troque o tecido no select.
2. Marque/desmarque Ocasião (multi).
3. Abra “Mais detalhes” e digite composição / gramatura.
4. Em gramatura, use os chips (180 / 220) ou digite — sem seta de select.
5. Número inválido mostra erro.
        `,
      },
    },
  },
  args: {
    attributes: ATTRIBUTE_FIXTURES,
    values: ATTRIBUTE_VALUES_SAMPLE,
    onChange: fn(),
  },
} satisfies Meta<typeof AttributeForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Preenchido: Story = {
  render: () => <Demo />,
};

export const Carregando: Story = {
  render: () => <Demo loading />,
};

export const Erro: Story = {
  render: () => <Demo error="Falha ao carregar atributos." />,
};

export const SemAtributos: Story = {
  render: () => <Demo empty />,
};
