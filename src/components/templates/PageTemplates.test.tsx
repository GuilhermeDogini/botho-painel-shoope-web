import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { DetailPage } from './DetailPage';
import { ListPage } from './ListPage';
import { PrintPage } from './PrintPage';
import { WizardPage } from './WizardPage';

afterEach(cleanup);

describe('Page templates (SHP-63)', () => {
  test('ListPage monta título, filtros e conteúdo', () => {
    render(
      <ListPage title="Pedidos" description="Agora" filters={<span>Filtros</span>} footer={<span>Rodapé</span>}>
        <p>Tabela</p>
      </ListPage>,
    );
    expect(screen.getByRole('heading', { name: 'Pedidos' })).toBeTruthy();
    expect(screen.getByText('Agora')).toBeTruthy();
    expect(screen.getByText('Filtros')).toBeTruthy();
    expect(screen.getByText('Tabela')).toBeTruthy();
    expect(screen.getByText('Rodapé')).toBeTruthy();
  });

  test('DetailPage volta e mostra colunas', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(
      <DetailPage title="Pedido #1" backLabel="Pedidos" onBack={onBack} sidebar={<aside>Lateral</aside>}>
        <p>Principal</p>
      </DetailPage>,
    );
    await user.click(screen.getByRole('button', { name: /pedidos/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Principal')).toBeTruthy();
    expect(screen.getByText('Lateral')).toBeTruthy();
  });

  test('WizardPage avança com Continuar', async () => {
    const user = userEvent.setup();
    const onPrimary = vi.fn();
    render(
      <WizardPage
        title="Cadastrar"
        steps={['Fotos', 'Categoria']}
        currentStep={1}
        onPrimary={onPrimary}
        onPrevious={() => undefined}
        disableBack
      >
        <p>Passo</p>
      </WizardPage>,
    );
    await user.click(screen.getByRole('button', { name: /continuar/i }));
    expect(onPrimary).toHaveBeenCalledTimes(1);
  });

  test('PrintPage tem título e rodapé', () => {
    render(
      <PrintPage title="Lista de separação" pageLabel="Página 1 de 1">
        <p>Linhas</p>
      </PrintPage>,
    );
    expect(screen.getByRole('heading', { name: 'Lista de separação' })).toBeTruthy();
    expect(screen.getByText('Página 1 de 1')).toBeTruthy();
    expect(screen.getByText('botho')).toBeTruthy();
  });
});
