import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, test } from 'vitest';
import { FilterChip, FilterChipList } from './FilterChip';
import { SegmentedControl } from './SegmentedControl';
import { TabItem, TabList } from './TabItem';

afterEach(cleanup);

function TabsDemo() {
  const [tab, setTab] = useState('a');
  return (
    <TabList aria-label="Status">
      <TabItem active={tab === 'a'} count={6} onClick={() => setTab('a')}>
        A enviar
      </TabItem>
      <TabItem active={tab === 'b'} count={4} onClick={() => setTab('b')}>
        Aguardando
      </TabItem>
    </TabList>
  );
}

describe('TabItem / TabList', () => {
  test('seleciona a aba e marca aria-selected', async () => {
    render(<TabsDemo />);
    const second = screen.getByRole('tab', { name: /Aguardando/ });
    expect(screen.getByRole('tab', { name: /A enviar/ }).getAttribute('aria-selected')).toBe('true');
    await userEvent.click(second);
    expect(second.getAttribute('aria-selected')).toBe('true');
  });

  test('TabList usa overflow-x para não vazar a página', () => {
    const { container } = render(
      <TabList aria-label="Status">
        <TabItem active>A</TabItem>
      </TabList>,
    );
    const scroller = container.querySelector('[role="tablist"]');
    expect(scroller?.className).toMatch(/overflow-x-auto/);
    expect(container.firstElementChild?.className).toMatch(/max-w-full/);
  });
});

describe('FilterChip', () => {
  test('aria-pressed acompanha active', async () => {
    function Demo() {
      const [on, setOn] = useState(false);
      return (
        <FilterChip active={on} onClick={() => setOn((v) => !v)}>
          Vence hoje · 2
        </FilterChip>
      );
    }
    render(<Demo />);
    const chip = screen.getByRole('button', { name: /Vence hoje/ });
    expect(chip.getAttribute('aria-pressed')).toBe('false');
    await userEvent.click(chip);
    expect(chip.getAttribute('aria-pressed')).toBe('true');
  });

  test('lista scroll tem overflow-x', () => {
    const { container } = render(
      <FilterChipList layout="scroll" aria-label="Filtros">
        <FilterChip>A</FilterChip>
      </FilterChipList>,
    );
    expect(container.firstElementChild?.className).toMatch(/overflow-x-auto/);
  });
});

describe('SegmentedControl', () => {
  test('troca o valor e marca aria-checked', async () => {
    function Demo() {
      const [v, setV] = useState('grade');
      return (
        <SegmentedControl
          aria-label="Visualização"
          value={v}
          onValueChange={setV}
          options={[
            { value: 'grade', label: 'Grade' },
            { value: 'lista', label: 'Lista' },
          ]}
        />
      );
    }
    render(<Demo />);
    expect(screen.getByRole('radio', { name: 'Grade' }).getAttribute('aria-checked')).toBe('true');
    await userEvent.click(screen.getByRole('radio', { name: 'Lista' }));
    expect(screen.getByRole('radio', { name: 'Lista' }).getAttribute('aria-checked')).toBe('true');
  });
});
