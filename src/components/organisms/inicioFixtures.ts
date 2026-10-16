import { Megaphone, Package, Plus, Rocket, Truck } from 'lucide-react';
import { mockPantalonaSrc, mockVestidoSrc } from '@/stories/mocks';
import type { ActiveCampaignItem } from './ActiveCampaignsCard';
import type { ChatsWaitingItem } from './ChatsWaitingCard';
import type { HomeGreetingPill, HomeGreetingShortcut } from './HomeGreeting';
import type { LowStockItem } from './LowStockCard';
import type { MoneyCardChart, MoneyCardGoal } from './MoneyCard';
import type { OrdersToShipOrder } from './OrdersToShipCard';

export const INICIO_ORDERS: OrdersToShipOrder[] = [
  {
    id: '1',
    name: 'Vestido midi estampa floral',
    variant: 'Azul anil · M',
    buyer: 'Ana Paula',
    total: 129.9,
    deadlineLabel: 'Hoje, 18h',
    deadlineUrgency: 'today',
    imageSrc: mockVestidoSrc,
  },
  {
    id: '2',
    name: 'Conjunto moletom flanelado',
    variant: 'Rosa · G',
    buyer: 'Juliana',
    total: 159.9,
    deadlineLabel: 'Hoje, 18h',
    deadlineUrgency: 'today',
    imageSrc: mockVestidoSrc,
  },
  {
    id: '3',
    name: 'Pijama americano de malha',
    variant: 'Listrado anil · P + 1 item',
    buyer: 'Fernanda',
    total: 189.8,
    deadlineLabel: 'Amanhã',
    deadlineUrgency: 'tomorrow',
    imageSrc: mockPantalonaSrc,
  },
  {
    id: '4',
    name: 'Camisa de viscose manga longa',
    variant: 'Mostarda geométrica · GG',
    buyer: 'Patrícia',
    total: 99.9,
    deadlineLabel: 'Amanhã',
    deadlineUrgency: 'tomorrow',
    imageSrc: mockPantalonaSrc,
  },
  {
    id: '5',
    name: 'Calça pantalona alfaiataria',
    variant: 'Caramelo · G1',
    buyer: 'Camila',
    total: 139.9,
    deadlineLabel: '10/10',
    deadlineUrgency: 'date',
    imageSrc: mockPantalonaSrc,
  },
  {
    id: '6',
    name: 'Blusa animal print',
    variant: 'Bege onça · M',
    buyer: 'Mariana',
    total: 59.9,
    deadlineLabel: '10/10',
    deadlineUrgency: 'date',
    imageSrc: mockVestidoSrc,
  },
];

export const INICIO_STOCK: LowStockItem[] = [
  {
    id: 's1',
    name: 'Vestido midi estampa floral',
    variacao: 'Azul anil · P',
    qty: 1,
    hint: 'acaba em ~2 dias',
    qtyTone: 'danger',
    imageSrc: mockVestidoSrc,
  },
  {
    id: 's2',
    name: 'Conjunto moletom flanelado',
    variacao: 'Rosa · M',
    qty: 2,
    hint: 'acaba em ~3 dias',
    qtyTone: 'warn',
    imageSrc: mockVestidoSrc,
  },
  {
    id: 's3',
    name: 'Calça pantalona alfaiataria',
    variacao: 'Preta · M',
    qty: 2,
    hint: 'acaba em ~4 dias',
    qtyTone: 'warn',
    imageSrc: mockPantalonaSrc,
  },
  {
    id: 's4',
    name: 'Pijama americano de malha',
    variacao: 'Listrado anil · G',
    qty: 3,
    hint: 'acaba em ~5 dias',
    qtyTone: 'warn',
    imageSrc: mockPantalonaSrc,
  },
  {
    id: 's5',
    name: 'Camisa de viscose manga longa',
    variacao: 'Mostarda · G',
    qty: 0,
    qtyLabel: 'Esgotou',
    hint: 'vendeu 4 esta semana',
    qtyTone: 'danger',
    imageSrc: mockVestidoSrc,
  },
];

export const INICIO_CAMPAIGNS: ActiveCampaignItem[] = [
  {
    id: 'c1',
    name: 'Moletons de inverno',
    gasto: 98.4,
    vendas: 612,
    roasLabel: '6,2×',
    health: 'bom',
  },
  {
    id: 'c2',
    name: 'Vestidos floral',
    gasto: 54.1,
    vendas: 189.9,
    roasLabel: '3,5×',
    health: 'atencao',
  },
  {
    id: 'c3',
    name: 'Pijamas de malha',
    gasto: 33.7,
    vendas: 0,
    roasLabel: '0×',
    health: 'ruim',
  },
];

export const INICIO_CHATS: ChatsWaitingItem[] = [
  {
    id: 'ch1',
    name: 'Ana Paula',
    message: 'Oi! Consegue enviar hoje ainda?',
    waitLabel: '42 min',
    avatarTone: 'brand',
  },
  {
    id: 'ch2',
    name: 'Luciana',
    message: 'Tem a tabela de medidas da pantalona?',
    waitLabel: '1h10',
    avatarTone: 'anil',
  },
  {
    id: 'ch3',
    name: 'Rosângela',
    message: 'Esse vestido serve em quem veste 44?',
    waitLabel: '2h05',
    avatarTone: 'mostarda',
  },
];

export const INICIO_CHART: MoneyCardChart = {
  categories: ['02/10', '03/10', '04/10', '05/10', '06/10', '07/10', '08/10'],
  entradas: [520, 610, 480, 702, 655, 601, 650],
  saidas: [132, 150, 118, 171, 160, 148, 159],
};

export const INICIO_GOAL: MoneyCardGoal = {
  current: 5876,
  target: 18000,
  label: 'Meta de outubro',
  scale: ['0', '4,5 mil', '9 mil', '13,5 mil', '18 mil'],
};

export const INICIO_ADMIN_SHORTCUTS: HomeGreetingShortcut[] = [
  { id: 'cad', label: 'Cadastrar peça', icon: Plus, variant: 'soft' },
  { id: 'turb', label: 'Turbinar', icon: Rocket },
  { id: 'camp', label: 'Nova campanha', icon: Megaphone },
];

export const INICIO_EXP_PILLS: HomeGreetingPill[] = [
  { id: 'coleta', label: 'Coleta hoje, 15h–18h', icon: Truck },
  { id: 'emb', label: '4 já embalados', icon: Package },
];
