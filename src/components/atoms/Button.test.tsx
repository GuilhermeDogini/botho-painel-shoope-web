import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Printer } from 'lucide-react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Button } from './Button';
import { IconButton } from './IconButton';

afterEach(cleanup);

describe('Button', () => {
  test('por padrão é type="button" (não envia formulário sem querer)', () => {
    render(<Button>Salvar</Button>);
    expect(screen.getByRole('button', { name: 'Salvar' }).getAttribute('type')).toBe('button');
  });

  test('carregando: trava o clique, marca aria-busy e troca o ícone pelo giro', () => {
    const onClick = vi.fn();
    render(
      <Button loading icon={Printer} onClick={onClick}>
        Imprimir
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'Imprimir' });
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
    expect((btn as HTMLButtonElement).disabled).toBe(true);
    expect(btn.getAttribute('aria-busy')).toBe('true');
    expect(btn.querySelectorAll('svg')).toHaveLength(1);
    expect(btn.querySelector('svg')?.getAttribute('class')).toContain('animate-spin');
  });

  test('asChild usa o elemento filho (link) com o estilo e os ícones do botão', () => {
    render(
      <Button asChild variant="primary" icon={Printer}>
        <a href="/separacao">Separação</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Separação' });
    expect(link.getAttribute('href')).toBe('/separacao');
    expect(link.className).toContain('bg-brand');
    expect(link.querySelector('svg')).not.toBeNull();
    expect(link.hasAttribute('type')).toBe(false);
  });

  test('o tamanho do design sobrevive ao className de quem usa', () => {
    render(
      <Button size="lg" className="text-ink">
        Grande
      </Button>,
    );
    const cls = screen.getByRole('button', { name: 'Grande' }).className;
    expect(cls).toContain('min-h-13');
    expect(cls).toContain('text-[16px]');
    expect(cls).toContain('text-ink');
  });
});

describe('IconButton', () => {
  test('nome acessível inclui o contador, e 99+ acima de 99', () => {
    render(
      <>
        <IconButton icon={Printer} label="Notificações" badge={4} />
        <IconButton icon={Printer} label="Alertas" badge={250} />
        <IconButton icon={Printer} label="Sem nada" badge={0} />
      </>,
    );
    expect(screen.getByRole('button', { name: 'Notificações (4)' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Alertas (99+)' }).textContent).toBe('99+');
    expect(screen.getByRole('button', { name: 'Sem nada' }).textContent).toBe('');
  });
});
