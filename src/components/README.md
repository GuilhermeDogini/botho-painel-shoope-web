# Componentes: atomic design

A regra que vale para tudo nesta pasta:

> **Componente de UI só recebe props.** Não busca dados, não importa `@/lib/api`, não usa hooks de
> dados (`useOrders`, `useMe`...). Quem busca dados são as **páginas** (`src/pages`) e as rotas-moldura
> (`src/app`), via hooks de `src/hooks`. Assim o mesmo componente serve em várias telas e aparece na Vitrine
> (`/vitrine`, só em dev) com dados de exemplo.

| Pasta | O que é | Exemplos da Botho |
|---|---|---|
| `primitives/` | Base do shadcn/Radix (gerada pelo CLI, `components.json` → alias `ui`). Comportamento e acessibilidade; **não usar direto nas telas**, só dentro de átomos/moléculas/organismos. | dialog, sheet, dropdown-menu, switch, checkbox, tooltip |
| `atoms/` | Menor peça com sentido próprio. Um elemento visual, sem composição de outros átomos. | Button, Input, Tag (etiqueta), Money, Thumbnail, ColorDot, Skeleton |
| `molecules/` | Poucos átomos juntos com um propósito. | … EmptyState (54); NavItem, StepIndicator (55) |
| `illustrations/` | SVGs de costura (arara, cabide, carretel, tesoura, agulha). | usados no EmptyState |
| `organisms/` | Bloco de tela completo, reutilizável, feito de moléculas. | Modal… (56); DataTable (57); … |
| `templates/` | Esqueleto de página: onde cada bloco fica, sem dados. | AppShell, AuthLayout, ListPage, DetailPage, WizardPage, PrintPage |
| `legacy/` | Telas antigas, antes do design. **Não usar em código novo**; some quando as telas novas chegarem. | ui.tsx, ConnectionBanner |

## Convenções

- **Um componente por arquivo**, nome em PascalCase igual ao do arquivo (`ProductLine.tsx`). Props tipadas
  e exportadas (`export interface ProductLineProps`).
- **Estilo só com as classes do tema** (`bg-surface`, `text-ink-2`, `bg-brand`, `tag`, `stitch`, `tape`, `money`).
  Nada de cor solta (`#B3134F`, `bg-pink-700`): o tema escuro depende disso.
- **Variações com `cva`** (class-variance-authority) e junção de classes com `cn()` de `@/lib/utils`.
- **Ícones:** `lucide-react` com `strokeWidth={1.75}`. Ilustrações de costura (arara, cabide, carretel) e o logo
  são SVG próprios, tirados do design (`design/opcao-a`).
- **Acessibilidade:** alvo de toque ≥ 44 px, foco visível (o tema já põe o anel), status nunca só por cor
  (sempre texto ou ícone), animação desligada com `prefers-reduced-motion` (o tema já faz).
- **Celular primeiro:** testar a 390 px. Fila de abas ou filtros rola de lado **dentro** do componente,
  nunca a página inteira.
- **Componente novo = seção na Vitrine** na mesma tarefa: um arquivo em `src/pages/dev/vitrine/` (com `id`),
  ligado em `src/pages/dev/Vitrine.tsx`, e o item sai da lista `PENDING`.
- **Junte classes sempre com `cn()`**: ele conhece a escala da Botho (`text-h1`, `text-big`, `shadow-1`...).
  O `twMerge` puro trataria `text-h1` como cor e o descartaria ao lado de `text-ink`.
- **Ícone obrigatório onde há status** (ex.: `Tag` exige `icon` no tipo).

## Como conferir

- **Storybook** (principal para revisão isolada): `npm run storybook` → http://localhost:6006.
  Pastas Atoms / Molecules / Organisms / Templates. Cada story tem mocks, Docs ("como deve funcionar" +
  "como testar") e toolbar **Tema** (claro/escuro). Dados de exemplo em `src/stories/mocks.ts`.
  Molecules+ ainda só têm a intro (chegam junto com SHP-48+).
- `npx tsc -b` (typecheck).
- `npx vitest run <arquivo>`: só para componentes **com lógica** (formatação, estados, teclado). Teste ao lado
  do componente (`Money.test.tsx`). Visual puro não ganha teste unitário.
- `npm run capture -- --section <id>` com o `npm run dev` rodando: tira a seção da Vitrine a 390 e 1440 px, em
  claro e escuro, em `web/.captures/` (fora do git). Falha se a página rolar de lado ou houver erro no console.
  Sem `--section`, tira a página inteira; `--path /produtos` tira outra rota.
  A Vitrine (`/vitrine`) continua; o Storybook é o lugar para revisar cada peça fora do app.

## Átomos prontos (SHP-42 a 47)

| Átomo | Para quê |
|---|---|
| `Button`, `IconButton` | 6 estilos (`primary`, `soft`, `outline`, `ghost`, `danger`, `link`), 52/44/40 px, `loading`, `asChild` para `<Link>` |
| `Heading`, `Eyebrow`, `Text` | escala xl/big/h1/h2/h3; `level` (semântico) separado de `size` (visual) |
| `Money` | valor em R$ com sinal por tipo (`in`, `out`, `neutral`); `null`/`undefined` (valor escondido pelo `@RedactMoney`) vira "—" |
| `Input`, `Textarea`, `Select`, `Checkbox`, `Switch` | `invalid` marca erro; `Select` lista Botho (Radix, aceita `<option>`); `Checkbox` com `indeterminate`; `Switch` do Radix |
| `Tag`, `CountBadge` | etiqueta com furinho (tons `ok`, `warn`, `info`, `danger`, `brand`, `solid`, `neutral`); contador com 99+ |
| `Thumbnail`, `ColorDot`, `Avatar`, `Logo`, `LabelLogo` | foto 3:4/quadrada com cabide de reserva; bolinha de cor; inicial; flor + "botho BRASIL"; etiqueta de gola |
| `Skeleton`, `Spinner`, `Divider` | carregando (pulso e linha costurando); divisor liso ou pesponto |

## Moléculas prontas

| Molécula | Para quê |
|---|---|
| `FormField` | rótulo + controle + ajuda ou erro (`aria-describedby`, `invalid`) |
| `MoneyField` | FormField com prefixo R$, máscara pt-BR (milhar/centavos) e `onValueChange` (número / `null`) |
| `SearchField` | ícone de busca + limpar; com ou sem rótulo (barra) |
| `TabItem` / `TabList` | abas com contador; rolagem horizontal só na lista |
| `FilterChip` / `FilterChipList` | filtros em pílula; `layout="scroll"` no celular |
| `SegmentedControl` | Grade/Lista, períodos (`radiogroup`) |
| `StatCard` | KPI: rótulo, valor, delta (±) e hint |
| `KeyValueRow` / `KeyValueList` | linhas rótulo ↔ valor (pedido, extrato) |
| `InlineAlert` | faixa info/warn/danger/ok |
| `Toast` / `AppToaster` / `notify` | aviso no topo (Sonner), ação Desfazer |
| `TapeProgress` | fita métrica (metas / %). Utilitário `tape` |
| `BarRow` | barra horizontal + rótulo + valor |
| `ProductLine` | foto + nome + variação/SKU (lista e card) |
| `Deadline` | prazo com urgência (Tag + ícone) |
| `EmptyState` | vazio com ilustração + título + texto + ação |
| `NavItem` / `NavList` | item de menu lateral ou barra inferior (ícone + contador); a lista faz o destaque deslizar |
| `StepIndicator` | passos do assistente (fita com ✓ / número) |

## Organismos prontos

| Organismo | Para quê |
|---|---|
| `Modal` | diálogo centralizado (desktop); foco preso, Esc fecha |
| `BottomSheet` | folha de baixo (celular); mesma API do Modal |
| `ConfirmDialog` | confirmação com resumo; escolhe Modal ou BottomSheet pelo viewport; `tone="danger"` |
| `DataTable` | tabela no desktop / cards no celular; seleção, ordenação, paginação, skeleton, vazio |
| `BulkActionBar` | barra ink de ações em lote; sticky acima da nav no celular |
| `BarChart` | barras agrupadas (CSS); legenda texto + cor |
| `LineChart` | linha SVG (+ barras de fundo opcionais); eixos estilo fita |
| `GlobalConnectionBanner` | faixa danger no topo (conexão vencida/caída) |
| `AlertStrip` / `AlertChip*` | chips de aviso do Início (scroll ou wrap; texto sem cortar) |

## Primitivos do shadcn

```bash
npx shadcn@latest add dialog
```

O arquivo cai em `primitives/`. Antes de usar, troque `bg-muted` por `bg-surface-2`: na Botho, `muted` é
cor de **texto**. As outras classes (`bg-background`, `bg-primary`, `border-border`...) já usam as cores da
Botho pela ponte em `src/index.css`.
