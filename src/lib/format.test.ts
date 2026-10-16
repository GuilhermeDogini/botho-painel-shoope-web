import { describe, expect, test } from 'vitest';
import { countText, formatMoneyInput, formatMoneyInputBlur, moneyText, parseMoney } from './format';

// O Intl põe espaço sem quebra entre "R$" e o número; normaliza para comparar.
const plain = (s: string) => s.replace(/\u00a0/g, ' ');

describe('moneyText', () => {
  test('neutro positivo sem sinal', () => {
    expect(plain(moneyText(3412.85))).toBe('R$ 3.412,85');
  });

  test('neutro negativo ganha o menos tipográfico', () => {
    expect(plain(moneyText(-42.5))).toBe('− R$ 42,50');
  });

  test('entrada e saída: o sinal vem do tipo, não do número', () => {
    expect(plain(moneyText(119.9, 'in'))).toBe('+ R$ 119,90');
    expect(plain(moneyText(-119.9, 'in'))).toBe('+ R$ 119,90');
    expect(plain(moneyText(16.79, 'out'))).toBe('− R$ 16,79');
    expect(plain(moneyText(-16.79, 'out'))).toBe('− R$ 16,79');
  });

  test('zero e menos zero ficam sem sinal no neutro', () => {
    expect(plain(moneyText(0))).toBe('R$ 0,00');
    expect(plain(moneyText(-0))).toBe('R$ 0,00');
  });
});

describe('countText', () => {
  test('vazio para 0, negativo, nulo e inválido', () => {
    for (const n of [0, -3, null, undefined, Number.NaN, Number.POSITIVE_INFINITY]) expect(countText(n)).toBeNull();
  });

  test('número inteiro e teto de 99+', () => {
    expect(countText(4)).toBe('4');
    expect(countText(4.7)).toBe('4');
    expect(countText(99)).toBe('99');
    expect(countText(100)).toBe('99+');
  });
});

describe('parseMoney e máscara', () => {
  test('vírgula decimal e ponto de milhar', () => {
    expect(parseMoney('129,90')).toBe(129.9);
    expect(parseMoney('1.202.022,00')).toBe(1202022);
    expect(parseMoney('1.202.022')).toBe(1202022);
  });

  test('um ponto com 1–2 decimais continua válido (29.90)', () => {
    expect(parseMoney('29.90')).toBe(29.9);
  });

  test('formatMoneyInput coloca milhar e preserva a vírgula', () => {
    expect(formatMoneyInput('1202022')).toBe('1.202.022');
    expect(formatMoneyInput('129,9')).toBe('129,9');
    expect(formatMoneyInput('129,90')).toBe('129,90');
    expect(formatMoneyInput('')).toBe('');
  });

  test('formatMoneyInputBlur completa os centavos', () => {
    expect(formatMoneyInputBlur('1.202.022')).toBe('1.202.022,00');
    expect(formatMoneyInputBlur('129,9')).toBe('129,90');
  });
});
