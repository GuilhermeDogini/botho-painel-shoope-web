import { describe, expect, test } from 'vitest';
import type { InicioSummary } from '@/lib/types';
import {
  alertCta,
  alertTone,
  buildDueLabel,
  buildInicioSubtitle,
  greetingForHour,
  isExpedicaoInicio,
  shouldShowMoneyCard,
} from './inicioModel';

const withMoney: InicioSummary = {
  dinheiro: {
    hoje: 10,
    seteDias: 20,
    mes: 30,
    aReceber: 40,
    carteira: 50,
    adsGasto: 5,
  },
  alertas: [],
};

describe('inicioModel', () => {
  test('Expedição nunca mostra MoneyCard mesmo com dinheiro na API', () => {
    expect(isExpedicaoInicio('expedicao')).toBe(true);
    expect(shouldShowMoneyCard('expedicao', withMoney)).toBe(false);
    expect(shouldShowMoneyCard('admin', withMoney)).toBe(true);
    expect(shouldShowMoneyCard('admin', { alertas: [] })).toBe(false);
  });

  test('saudação por horário', () => {
    expect(greetingForHour(8)).toBe('Bom dia');
    expect(greetingForHour(14)).toBe('Boa tarde');
    expect(greetingForHour(21)).toBe('Boa noite');
  });

  test('subtítulo admin vs expedição', () => {
    expect(buildInicioSubtitle({ expedicao: false, aEnviar: 6, vencendoHoje: 2 })).toMatch(
      /6 pedidos para enviar/,
    );
    expect(buildInicioSubtitle({ expedicao: true, aEnviar: 6, vencendoHoje: 2 })).toMatch(
      /separar e embalar/,
    );
    expect(buildInicioSubtitle({ expedicao: true, aEnviar: 6, vencendoHoje: 2 })).not.toMatch(/R\$/);
  });

  test('due label e alerta CTA', () => {
    expect(buildDueLabel(2)).toBe('2 vencem hoje às 18h');
    expect(buildDueLabel(0)).toBeUndefined();
    expect(alertTone('danger', 'prazo_envio')).toBe('danger');
    expect(alertTone('info', 'chat_sem_resposta')).toBe('brand');
    expect(alertCta('estoque_reposicao')).toBe('Repor');
  });
});
