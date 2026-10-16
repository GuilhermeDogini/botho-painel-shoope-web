import type { Meta, StoryObj } from '@storybook/react-vite';
import { PrintPage } from './PrintPage';
import { PrintPreviewFrame } from './PrintPreviewFrame';

const meta = {
  title: 'Templates/PrintPage',
  component: PrintPage,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'gray' },
    docs: {
      description: {
        component: `
Folha A4 (SHP-63): cabeçalho Botho + rodapé com assinatura — SeparacaoA4.dc.html.
Em tela estreita, \`PrintPreviewFrame\` faz zoom-out como prévia de PDF. Em \`@media print\`, só a folha fica visível.
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-[#E9E1D6] p-4 print:bg-white print:p-0 sm:p-6">
        <PrintPreviewFrame>
          <Story />
        </PrintPreviewFrame>
      </div>
    ),
  ],
} satisfies Meta<typeof PrintPage>;

export default meta;
type Story = StoryObj<typeof PrintPage>;

export const Separacao: Story = {
  name: 'Lista de separação',
  args: {
    title: 'Lista de separação',
    meta: 'Quinta, 08/10/2026 · 6 pedidos · 7 peças · impresso às 10:32 por Rafaela',
    children: (
      <table className="w-full border-collapse text-left text-[13px]">
        <thead>
          <tr className="border-b-[1.5px] border-[#1D1512]">
            <th className="px-1.5 py-2">OK</th>
            <th className="px-1.5 py-2">Peça</th>
            <th className="px-1.5 py-2">Cor</th>
            <th className="px-1.5 py-2">Tam.</th>
            <th className="px-1.5 py-2 text-right">Qtd.</th>
            <th className="px-1.5 py-2">Pedido</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Vestido midi floral', 'Azul anil', 'M', '1', '#251008K7Q2M'],
            ['Blusa animal print', 'Bege onça', 'M', '1', '#251006D1C8V'],
            ['Pijama flanelado', 'Rosa', 'P', '2', '#251005H8W1R'],
          ].map(([name, color, size, qty, order]) => (
            <tr key={order} className="border-b border-[#B9AEA6]">
              <td className="px-1.5 py-2">
                <span className="inline-block size-[18px] rounded-[3px] border-[1.5px] border-[#1D1512]" />
              </td>
              <td className="px-1.5 py-2 font-bold">{name}</td>
              <td className="px-1.5 py-2">{color}</td>
              <td className="px-1.5 py-2 font-bold">{size}</td>
              <td className="px-1.5 py-2 text-right font-display text-lg font-extrabold">{qty}</td>
              <td className="px-1.5 py-2 tabular-nums">{order}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ),
  },
};
