// Espelho do que a painel-shopee-api devolve.

export type Role = 'admin' | 'expedicao' | 'atendimento' | 'estoque' | 'financeiro';

/** Mesma lista de api/src/modules/auth/permissions.ts. */
export type Permission =
  | 'pedidos.ver'
  | 'pedidos.imprimir'
  | 'pedidos.cancelar'
  | 'conversas.responder'
  | 'produtos.ver'
  | 'produtos.editar'
  | 'estoque.repor'
  | 'turbinar.usar'
  | 'campanhas.ver'
  | 'campanhas.editar'
  | 'financeiro.ver'
  | 'equipe.gerir'
  | 'config.gerir';

export interface Me {
  id: string;
  name: string;
  email: string;
  role: Role;
  roleLabel: string;
  permissions: Permission[];
}

export interface SyncStatus {
  resource: string;
  label: string;
  lastRunAt: string | null;
  lastSuccessAt: string | null;
  lastError: string | null;
  lastCount: number | null;
  running: boolean;
}

export interface ConnectionStatus {
  mode: 'mock' | 'live';
  connected: boolean;
  needsReauth: boolean;
  shopId: string | null;
  shopName: string | null;
  region: string | null;
  authExpiresAt: string | null;
  daysLeft: number | null;
  warn: boolean;
  lastRefreshAt: string | null;
  lastError: string | null;
}

export interface CategoryNode {
  id: number;
  parentId: number;
  name: string;
  hasChildren: boolean;
  path: string;
}

export type AttributeInput = 'dropdown' | 'multi_select' | 'text' | 'combo' | 'multi_combo';

export interface Attribute {
  id: number;
  name: string;
  mandatory: boolean;
  input: AttributeInput;
  valueType: string | null;
  units: string[];
  options: { id: number; name: string }[];
}

export interface BrandList {
  mandatory: boolean;
  brands: { id: number; name: string }[];
}

export interface LogisticsChannel {
  id: number;
  name: string;
  enabled: boolean;
}

export interface UploadedImage {
  imageId: string;
  url: string | null;
}

export interface AttributeValue {
  attributeId: number;
  valueId: number;
  text?: string;
  unit?: string;
}

/** Variação no cadastro (cor × tamanho). */
export interface NewProductModel {
  color: string;
  size: string;
  price: number;
  stock: number;
  sku?: string;
}

export interface NewProduct {
  name: string;
  description: string;
  categoryId: number;
  price: number;
  stock: number;
  weight: number;
  dimension?: { length: number; width: number; height: number };
  sku?: string;
  imageIds: string[];
  attributes: AttributeValue[];
  brand: { id: number; name: string } | null;
  logisticsIds: number[];
  condition: 'NEW' | 'USED';
  /** Grade cor × tamanho; se omitido, peça sem variação. */
  models?: NewProductModel[];
}

export interface ItemSummary {
  itemId: number;
  name: string;
  status: string;
  imageUrl: string | null;
  price: number | null;
  stock: number | null;
  hasVariations: boolean;
  sku: string | null;
  categoryName?: string | null;
  /** Vendidas nos últimos 30 dias (0 até a primeira sincronização). */
  sold30d?: number;
  /** Só com variação: menor e maior preço entre as variações. */
  priceRange?: { min: number; max: number } | null;
  /** Estoque somado (com variação, soma das variações). */
  stockTotal?: number | null;
}

/** Variação (model da Shopee), ex.: cor × tamanho. */
export interface ItemModel {
  modelId: number;
  name: string | null;
  color: string | null;
  size: string | null;
  sku: string | null;
  price: number;
  stock: number;
  sold30d?: number;
}

export interface ItemDetail extends ItemSummary {
  variations: ItemModel[];
}

/** Linha de PATCH preço (modelId 0 = peça sem variação). */
export interface PriceLine {
  modelId: number;
  price: number;
}

export interface StockLine {
  modelId: number;
  stock: number;
}

/** Resposta de GET /estoque (SHP-98). */
export type StockAlertStatus = 'out' | 'low' | 'ok';

export interface EstoqueSummary {
  totalUnits: number;
  lowCount: number;
  outCount: number;
  idleCount: number;
  defaultReorderPoint: number;
}

export interface StockAlertRow {
  itemId: number;
  modelId: number;
  name: string;
  variation: string | null;
  color: string | null;
  imageUrl: string | null;
  sku: string | null;
  stock: number;
  sold14d: number;
  dailyRate: number;
  daysLeft: number | null;
  reorderPoint: number;
  status: StockAlertStatus;
}

export interface BuySuggestion {
  itemId: number;
  modelId: number;
  name: string;
  variation: string | null;
  qty: number;
}

export interface IdleProduct {
  itemId: number;
  name: string;
  imageUrl: string | null;
  stock: number;
  status: string;
  lastSaleAt: string | null;
}

export interface EstoqueOverview {
  summary: EstoqueSummary;
  alerts: StockAlertRow[];
  buyList: BuySuggestion[];
  idle: IdleProduct[];
}

export interface RestockLine {
  itemId: number;
  modelId: number;
  quantity: number;
}

export interface RestockLineResult {
  itemId: number;
  modelId: number;
  previous: number;
  added: number;
  stock: number;
}

export interface RestockResult {
  success: RestockLineResult[];
  failed: { itemId: number; modelId: number; error: string }[];
}

export interface ItemPage {
  items: ItemSummary[];
  total: number;
  nextOffset: number | null;
}

export interface BoostedItem {
  itemId: number;
  cooldownSeconds: number;
  /** true se o último Bump ok deste item (ainda na janela) foi automático. */
  auto?: boolean;
  name?: string | null;
  imageUrl?: string | null;
}

export interface BoostResult {
  success: number[];
  failed: { itemId: number; reason: string }[];
}

export interface AutoBoostQueueItem {
  itemId: number;
  position: number;
  reason: string | null;
  name: string | null;
  imageUrl: string | null;
}

export interface AutoBoostState {
  enabled: boolean;
  queue: AutoBoostQueueItem[];
  nextItemId: number | null;
}

export interface BoostDayResult {
  date: string;
  boostedCount: number;
  salesDuringBoost: number;
  cost: 0;
}

export interface BoostSuggestion {
  itemId: number;
  name: string;
  imageUrl: string | null;
  reason: string;
  tag: 'parada' | 'vendas' | 'estoque';
}

/** Resultado de pausar/reativar peças em lote. */
export interface UnlistResult {
  success: number[];
  failed: { itemId: number; reason: string }[];
}

/** Papéis que podem ser convidados (API: sem admin). */
export type InviteRole = Exclude<Role, 'admin'>;

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  roleLabel: string;
  status: 'active' | 'disabled';
  disabledAt: string | null;
  createdAt: string;
  lastSeenAt: string | null;
  isYou: boolean;
}

export interface TeamInvite {
  id: string;
  email: string;
  role: Role;
  roleLabel: string;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
  status: 'pending' | 'accepted' | 'expired';
}

/** Espelho de api/src/modules/inicio (GET /inicio). Seções omitidas = papel sem permissão. */
export type InicioAlertSeverity = 'info' | 'warn' | 'danger';

export type InicioAlertType =
  | 'conexao_vencendo'
  | 'conexao_caida'
  | 'estoque_reposicao'
  | 'prazo_envio'
  | 'chat_sem_resposta'
  | 'ads_saldo_baixo';

export interface InicioAlert {
  id: string;
  type: InicioAlertType;
  severity: InicioAlertSeverity;
  title: string;
  body?: string;
  href?: string;
}

export interface InicioSummary {
  pedidos?: { aEnviar: number; vencendoHoje: number };
  dinheiro?: {
    hoje: number;
    seteDias: number;
    mes: number;
    aReceber: number;
    carteira: number;
    adsGasto: number;
  };
  estoque?: {
    topAcabando: Array<{ name: string; sku?: string; qty: number; variacao?: string }>;
  };
  campanhas?: { ativas: number };
  conversas?: { semResposta: number };
  alertas: InicioAlert[];
}

/**
 * Espelho de api/src/modules/orders (GET /orders e /orders/:orderSn).
 * Campos em R$ são opcionais: somem da resposta para quem não tem financeiro.ver (ex.: Expedição).
 */
export type OrderTab = 'a_enviar' | 'aguardando_coleta' | 'enviados' | 'entregues' | 'cancelados' | 'devolucoes';

export type OrderStatus =
  | 'UNPAID'
  | 'READY_TO_SHIP'
  | 'RETRY_SHIP'
  | 'INVOICE_PENDING'
  | 'PROCESSED'
  | 'SHIPPED'
  | 'TO_CONFIRM_RECEIVE'
  | 'COMPLETED'
  | 'IN_CANCEL'
  | 'CANCELLED'
  | 'TO_RETURN'
  | 'UNKNOWN';

export interface OrderItem {
  itemId: number;
  modelId: number;
  name: string;
  /** Como a Shopee manda, ex.: "Azul anil,M". */
  variation: string | null;
  sku: string | null;
  quantity: number;
  imageUrl: string | null;
  unitPrice?: number;
  itemTotal?: number;
}

export interface OrderSummary {
  orderSn: string;
  status: OrderStatus;
  tab: OrderTab | null;
  createdAt: string;
  paidAt: string | null;
  /** Prazo de envio da Shopee. */
  shipByDate: string | null;
  buyerUsername: string | null;
  /** Nome no endereço, já mascarado pela Shopee. */
  recipientName: string | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
  itemCount: number;
  items: OrderItem[];
  currency: string | null;
  orderTotal?: number | null;
  updatedAt: string;
  /** Status interno: já separado/embalado (SHP-80). */
  packedAt?: string | null;
  packedByName?: string | null;
  /** Quando a etiqueta foi impressa pelo painel (SHP-79). */
  labelPrintedAt?: string | null;
}

export type OrderCounts = Record<OrderTab, number>;

export interface OrderPage {
  items: OrderSummary[];
  total: number;
  page: number;
  pageSize: number;
  counts: OrderCounts;
  /** A enviar com prazo até o fim de hoje (inclui atrasados). */
  venceHoje: number;
}

/** Breakdown do escrow (só no detalhe). Ausente sem financeiro.ver. */
export interface OrderEscrow {
  bruto: number;
  comissao: number;
  taxaItem: number;
  frete: number;
  liquido: number;
  liberacaoEm: string | null;
}

export interface OrderDetail extends OrderSummary {
  messageToSeller: string | null;
  address: {
    name: string | null;
    phone: string | null;
    line: string | null;
    district: string | null;
    city: string | null;
    state: string | null;
    zipcode: string | null;
  };
  paymentMethod: string | null;
  shippingCarrier: string | null;
  cancelBy: string | null;
  cancelReason: string | null;
  trackingNumber?: string | null;
  packageNumber?: string | null;
  shippingDocStatus?: string | null;
  labelPrintedAt?: string | null;
  /** Pedidos dessa compradora no banco (inclui este). */
  buyerOrderCount: number;
  buyerSince: string;
  syncedAt: string;
  /** Somem da resposta sem financeiro.ver. */
  escrow?: OrderEscrow | null;
}

/** Motivos de cancelamento (espelho de CANCEL_REASON_OPTIONS no back). */
export type CancelReasonCode =
  | 'OUT_OF_STOCK'
  | 'UNDELIVERABLE_AREA'
  | 'CUSTOMER_REQUEST'
  | 'COD_NOT_SUPPORTED'
  | 'WRONG_ADDRESS';

export interface CancelReasonOption {
  code: CancelReasonCode;
  label: string;
}

export interface CancelOrderResult {
  orderSn: string;
  status: OrderStatus;
  cancelReason: string;
}

export interface OrderQuery {
  tab?: OrderTab;
  venceHoje?: boolean;
  multiItem?: boolean;
  /** AAAA-MM-DD (horário de Brasília), pela data da compra. */
  from?: string;
  to?: string;
  q?: string;
  page?: number;
  /** Máximo 100. */
  pageSize?: number;
}

/** Lista de separação (SHP-80 / SHP-84) — espelho de PackingListResponse da API. */
export type PackingNoteKind = 'message' | 'multi_item';

export interface PackingNote {
  orderSn: string;
  kind: PackingNoteKind;
  text: string;
}

export interface PackingVariantLine {
  orderSn: string;
  quantity: number;
}

export interface PackingVariant {
  modelId: number;
  variation: string | null;
  color: string | null;
  size: string | null;
  sku: string | null;
  quantity: number;
  lines: PackingVariantLine[];
}

export interface PackingGroup {
  itemId: number;
  name: string;
  imageUrl: string | null;
  /** Local físico nosso (ex.: "Arara 2 · prateleira de cima"). */
  location: string | null;
  quantity: number;
  variants: PackingVariant[];
}

export interface PackingOrderSummary {
  orderSn: string;
  buyerUsername: string | null;
  recipientName: string | null;
  shipByDate: string | null;
  itemCount: number;
  messageToSeller: string | null;
  packedAt: string | null;
  packedByName: string | null;
}

export interface PackingListResponse {
  orders: PackingOrderSummary[];
  groups: PackingGroup[];
  notes: PackingNote[];
  summary: {
    orderCount: number;
    packedCount: number;
    pieceCount: number;
    groupCount: number;
  };
}

export interface MarkPackedResult {
  orderSns: string[];
  packed: boolean;
  packedAt: string | null;
  packedByName: string | null;
}

/** GET /ads/credit (SHP-106). */
export interface AdsCredit {
  total: number;
  paid: number;
  free: number;
  spendPerDay: number;
  daysLeft: number | null;
  autoTopupEnabled: boolean;
  rechargeUrl: string;
}

export type CampaignFilter = 'all' | 'active' | 'paused';
export type CampaignUiStatus = 'active' | 'paused';
export type RoasTone = 'good' | 'warn' | 'bad' | 'starting';

/** Item de GET /ads/campaigns (SHP-107). */
export interface CampaignView {
  id: string;
  name: string;
  piecesLabel: string;
  itemIds: number[];
  status: CampaignUiStatus;
  on: boolean;
  dailyBudget: number;
  spend: number;
  clicks: number | null;
  sales: number;
  roas: number | null;
  roasTone: RoasTone;
  adType: 'manual' | 'auto';
}

export interface CampaignListResponse {
  periodDays: number;
  counts: { all: number; active: number; paused: number };
  campaigns: CampaignView[];
}

export interface CampaignBudgetResult {
  id: string;
  dailyBudget: number;
  previousDailyBudget: number;
}

export interface CreateCampaignResult {
  id: string;
  name: string;
  itemIds: number[];
  dailyBudget: number;
  durationDays: number;
  totalBudgetCap: number | null;
  status: CampaignUiStatus;
  startsAt: string;
  creditAvailable: number;
  daysCoveredByCredit: number;
  summary: string;
}

export type CampaignDetailPeriod = 7 | 14 | 30 | 180;

export interface CampaignDetailResponse {
  id: string;
  name: string;
  status: CampaignUiStatus;
  on: boolean;
  adType: 'manual' | 'auto';
  dailyBudget: number;
  periodDays: CampaignDetailPeriod;
  historyMaxDays: 180;
  kpis: {
    dailyBudget: number;
    spend: number;
    sales: number;
    orders: number;
    clicks: number;
    cpc: number | null;
    roas: number | null;
    roasTone: RoasTone;
  };
  series: { date: string; spend: number; sales: number }[];
  keywords: {
    keyword: string;
    clicks: number;
    spend: number;
    sales: number;
    roas: number | null;
    roasTone: RoasTone;
  }[] | null;
  products: {
    itemId: number;
    name: string;
    imageUrl: string | null;
    orders: number | null;
    sales: number | null;
  }[];
}

// ------------------------------------------------------------- financeiro (SHP-113..118)

export type WalletTxnKind =
  | 'SALE_RELEASE'
  | 'COMMISSION'
  | 'SHIPPING'
  | 'ADS_TOPUP'
  | 'REFUND'
  | 'PAYOUT'
  | 'OTHER';

export type FinancePeriodPreset = 'hoje' | 'sete' | 'mes' | 'pers';

export interface ExtratoLine {
  id: string;
  transactionId: string;
  kind: WalletTxnKind;
  kindLabel: string;
  amount: number;
  balance: number;
  description: string | null;
  subtitle: string | null;
  orderSn: string | null;
  buyerName: string | null;
  createTime: string;
}

export interface ExtratoListResponse {
  items: ExtratoLine[];
  total: number;
}

export interface AReceberGroup {
  date: string | null;
  label: string;
  orderCount: number;
  amount: number;
}

export interface RepasseLine {
  id: string;
  createTime: string;
  label: string;
  amount: number;
}

export interface AReceberResponse {
  amount: number;
  orderCount: number;
  groups: AReceberGroup[];
  balance: number | null;
  repasses: RepasseLine[];
}

export interface PeriodWhereParts {
  commission: number;
  fees: number;
  shippingFee: number;
  ads: number;
  refunds: number;
}

export interface PeriodSummary {
  preset: FinancePeriodPreset;
  title: string;
  from: string;
  to: string;
  amount: number;
  out: number;
  net: number;
  orderCount: number;
  per100: number | null;
  marginPct: number | null;
  where: PeriodWhereParts;
}

export interface MonthPoint {
  month: string;
  label: string;
  amount: number;
  out: number;
  net: number;
}

export interface ResumoResponse {
  period: PeriodSummary;
  months: MonthPoint[];
}

export interface ExtratoQuery {
  from?: string;
  to?: string;
  kind?: WalletTxnKind;
  q?: string;
  limit?: number;
  offset?: number;
}

export type NotificationKind = 'STOCK_LOW' | 'CHAT_UNANSWERED' | 'SHIP_DEADLINE' | 'CONNECTION';

export interface ShopProfile {
  shopName: string | null;
  region: string | null;
  shopeeUsername: string | null;
  contactEmail: string | null;
  whatsapp: string | null;
  pickupAddress: string | null;
  pickupHours: string | null;
}

export interface NotificationPrefView {
  kind: NotificationKind;
  label: string;
  description: string;
  push: boolean;
  email: boolean;
}

export type ChatFilter = 'unanswered' | 'all' | 'order';
export type ChatKind = 'TEXT' | 'PHOTO' | 'PRODUCT' | 'ORDER';

export interface ChatListItem {
  id: string;
  buyerName: string;
  buyerNote: string | null;
  preview: string;
  lastMessageAt: string;
  unread: number;
  waitingSince: string | null;
  orderSn: string | null;
  orderTitle: string | null;
  orderAmount: number | null;
  orderDueLabel: string | null;
}

export interface ChatList {
  enabled: boolean;
  unanswered: number;
  items: ChatListItem[];
}

export interface ChatMessageView {
  id: string;
  direction: 'BUYER' | 'SELLER';
  kind: ChatKind;
  body: string;
  ref: string | null;
  createdAt: string;
}

export interface ChatThread {
  conversation: ChatListItem;
  messages: ChatMessageView[];
  streak: number;
  atLimit: boolean;
  limitLabel: string;
}

export interface QuickReplyView {
  id: string;
  label: string;
  body: string;
  position: number;
}
