// Endpoints da painel-shopee-api. Só os hooks (src/hooks) importam daqui; componentes de UI nunca.
import type {
  AdsCredit,
  Attribute,
  AutoBoostState,
  BoostDayResult,
  BoostedItem,
  BoostResult,
  BoostSuggestion,
  BrandList,
  CampaignBudgetResult,
  CampaignDetailPeriod,
  CampaignDetailResponse,
  CampaignFilter,
  CampaignListResponse,
  CampaignView,
  CategoryNode,
  ConnectionStatus,
  CreateCampaignResult,
  InviteRole,
  InicioSummary,
  ItemDetail,
  ItemPage,
  LogisticsChannel,
  Me,
  NewProduct,
  CancelOrderResult,
  CancelReasonCode,
  CancelReasonOption,
  MarkPackedResult,
  OrderDetail,
  OrderPage,
  OrderQuery,
  PackingListResponse,
  PriceLine,
  Role,
  StockLine,
  SyncStatus,
  TeamInvite,
  TeamMember,
  EstoqueOverview,
  ExtratoListResponse,
  ExtratoQuery,
  FinancePeriodPreset,
  RestockLine,
  RestockResult,
  AReceberResponse,
  ChatFilter,
  ChatKind,
  ChatList,
  ChatThread,
  NotificationKind,
  NotificationPrefView,
  QuickReplyView,
  ResumoResponse,
  ShopProfile,
  UnlistResult,
  UploadedImage,
} from '../types';
import { request, requestBlob } from './client';

export { ApiError } from './client';

function orderSearch(q: OrderQuery): string {
  const params = new URLSearchParams();
  if (q.tab) params.set('tab', q.tab);
  if (q.venceHoje) params.set('venceHoje', '1');
  if (q.multiItem) params.set('multiItem', '1');
  if (q.from) params.set('from', q.from);
  if (q.to) params.set('to', q.to);
  if (q.q?.trim()) params.set('q', q.q.trim());
  if (q.page) params.set('page', String(q.page));
  if (q.pageSize) params.set('pageSize', String(q.pageSize));
  const s = params.toString();
  return s ? `?${s}` : '';
}

function extratoSearch(q: ExtratoQuery): string {
  const params = new URLSearchParams();
  if (q.from) params.set('from', q.from);
  if (q.to) params.set('to', q.to);
  if (q.kind) params.set('kind', q.kind);
  if (q.q?.trim()) params.set('q', q.q.trim());
  if (q.limit != null) params.set('limit', String(q.limit));
  if (q.offset != null) params.set('offset', String(q.offset));
  const s = params.toString();
  return s ? `?${s}` : '';
}

export type InvitePreview = {
  email: string;
  role: string;
  roleLabel: string;
  invitedBy: string;
  expiresAt: string;
};

export const api = {
  me: () => request<Me>('/auth/me'),
  login: (email: string, password: string) => request<Me>('/auth/login', { method: 'POST', json: { email, password } }),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
  forgotPassword: (email: string) =>
    request<void>('/auth/forgot-password', { method: 'POST', json: { email } }),
  resetPassword: (token: string, password: string) =>
    request<void>('/auth/reset-password', { method: 'POST', json: { token, password } }),
  invitePreview: (token: string) =>
    request<InvitePreview>(`/auth/invite?token=${encodeURIComponent(token)}`),
  acceptInvite: (token: string, name: string, password: string) =>
    request<Me>('/auth/invite/accept', { method: 'POST', json: { token, name, password } }),

  connection: () => request<ConnectionStatus>('/connection'),
  startConnection: () => request<{ url: string }>('/connection/start', { method: 'POST' }),
  disconnect: () => request<void>('/connection', { method: 'DELETE' }),

  syncStatus: () => request<SyncStatus[]>('/sync/status'),

  /** Resumo agregado do Início (seções filtradas por permissão). */
  inicio: () => request<InicioSummary>('/inicio'),

  categories: () => request<CategoryNode[]>('/catalog/categories'),
  attributes: (categoryId: number) => request<Attribute[]>(`/catalog/categories/${categoryId}/attributes`),
  brands: (categoryId: number) => request<BrandList>(`/catalog/categories/${categoryId}/brands`),
  logistics: () => request<LogisticsChannel[]>('/catalog/logistics'),

  uploadImage: (file: File) => {
    const form = new FormData();
    form.append('image', file);
    return request<UploadedImage>('/images', { method: 'POST', body: form });
  },

  products: (offset = 0) => request<ItemPage>(`/products?offset=${offset}&pageSize=20`),
  product: (itemId: number) => request<ItemDetail>(`/products/${itemId}`),
  createProduct: (p: NewProduct) => request<{ itemId: number }>('/products', { method: 'POST', json: p }),
  /** `price` sozinho (peça sem variação) ou `updates` em lote (grade). */
  updatePrice: (itemId: number, body: { price?: number; updates?: PriceLine[] }) =>
    request<void>(`/products/${itemId}/price`, { method: 'PATCH', json: body }),
  updateStock: (itemId: number, body: { stock?: number; updates?: StockLine[] }) =>
    request<void>(`/products/${itemId}/stock`, { method: 'PATCH', json: body }),
  /** Pausar (unlist true) ou reativar; exige confirm: true. */
  unlistProducts: (itemIds: number[], unlist: boolean) =>
    request<UnlistResult>('/products/unlist', {
      method: 'POST',
      json: { itemIds, unlist, confirm: true },
    }),

  estoque: () => request<EstoqueOverview>('/estoque'),
  updateEstoqueSettings: (defaultReorderPoint: number) =>
    request<{ defaultReorderPoint: number }>('/estoque/settings', {
      method: 'PATCH',
      json: { defaultReorderPoint },
    }),
  updateReorderPoint: (body: { itemId: number; modelId: number; reorderPoint: number | null }) =>
    request<void>('/estoque/reorder-point', { method: 'PATCH', json: body }),
  restock: (lines: RestockLine[]) =>
    request<RestockResult>('/estoque/restock', { method: 'POST', json: { lines } }),
  /** Baixa o CSV da lista de compra (blob). */
  estoqueBuyCsv: () => requestBlob('/estoque/compra.csv'),

  orders: (q: OrderQuery = {}) => request<OrderPage>(`/orders${orderSearch(q)}`),
  order: (orderSn: string) => request<OrderDetail>(`/orders/${encodeURIComponent(orderSn)}`),
  packingList: (orderSns: string[]) =>
    request<PackingListResponse>('/orders/packing-list', { method: 'POST', json: { orderSns } }),
  markPacked: (orderSns: string[], packed: boolean) =>
    request<MarkPackedResult>('/orders/packed', { method: 'POST', json: { orderSns, packed } }),
  /** PDF das etiquetas (application/pdf). */
  printLabels: (orderSns: string[]) =>
    requestBlob('/orders/labels', { method: 'POST', json: { orderSns } }),
  cancelReasons: () => request<CancelReasonOption[]>('/orders/cancel-reasons'),
  cancelOrder: (orderSn: string, reason: CancelReasonCode) =>
    request<CancelOrderResult>(`/orders/${encodeURIComponent(orderSn)}/cancel`, {
      method: 'POST',
      json: { reason, confirm: true },
    }),

  boosted: () => request<{ slots: number; items: BoostedItem[] }>('/boost'),
  boost: (itemIds: number[]) => request<BoostResult>('/boost', { method: 'POST', json: { itemIds } }),
  boostAuto: () => request<AutoBoostState>('/boost/auto'),
  setBoostAuto: (enabled: boolean) =>
    request<AutoBoostState>('/boost/auto', { method: 'PUT', json: { enabled } }),
  setBoostQueue: (itemIds: number[]) =>
    request<AutoBoostState>('/boost/auto/queue', { method: 'PUT', json: { itemIds } }),
  addBoostQueue: (itemId: number, reason?: string) =>
    request<AutoBoostState>('/boost/auto/queue', { method: 'POST', json: { itemId, reason } }),
  removeBoostQueue: (itemId: number) =>
    request<AutoBoostState>(`/boost/auto/queue/${itemId}`, { method: 'DELETE' }),
  boostDayResult: (date?: string) =>
    request<BoostDayResult>(`/boost/day-result${date ? `?date=${encodeURIComponent(date)}` : ''}`),
  boostSuggestions: () => request<BoostSuggestion[]>('/boost/suggestions'),

  adsCredit: () => request<AdsCredit>('/ads/credit'),
  adsCampaigns: (q?: { status?: CampaignFilter; periodDays?: number }) => {
    const params = new URLSearchParams();
    if (q?.status && q.status !== 'all') params.set('status', q.status);
    if (q?.periodDays) params.set('periodDays', String(q.periodDays));
    const qs = params.toString();
    return request<CampaignListResponse>(`/ads/campaigns${qs ? `?${qs}` : ''}`);
  },
  adsCampaignDetail: (id: string, periodDays?: CampaignDetailPeriod) =>
    request<CampaignDetailResponse>(
      `/ads/campaigns/${encodeURIComponent(id)}${periodDays ? `?periodDays=${periodDays}` : ''}`,
    ),
  pauseCampaign: (id: string) =>
    request<CampaignView>(`/ads/campaigns/${encodeURIComponent(id)}/pause`, {
      method: 'POST',
      json: { confirm: true },
    }),
  resumeCampaign: (id: string) =>
    request<CampaignView>(`/ads/campaigns/${encodeURIComponent(id)}/resume`, {
      method: 'POST',
      json: { confirm: true },
    }),
  updateCampaignBudget: (id: string, dailyBudget: number) =>
    request<CampaignBudgetResult>(`/ads/campaigns/${encodeURIComponent(id)}/budget`, {
      method: 'PATCH',
      json: { dailyBudget, confirm: true },
    }),
  createCampaign: (body: {
    itemIds: number[];
    dailyBudget: number;
    durationDays: number;
    acknowledgedCredit: true;
  }) => request<CreateCampaignResult>('/ads/campaigns', { method: 'POST', json: body }),

  financeiroExtrato: (q: ExtratoQuery = {}) =>
    request<ExtratoListResponse>(`/financeiro/extrato${extratoSearch(q)}`),
  financeiroAReceber: () => request<AReceberResponse>('/financeiro/a-receber'),
  financeiroResumo: (period: FinancePeriodPreset = 'mes', from?: string, to?: string) => {
    const p = new URLSearchParams({ period });
    if (from) p.set('from', from);
    if (to) p.set('to', to);
    return request<ResumoResponse>(`/financeiro/resumo?${p}`);
  },
  financeiroExtratoCsv: (q: ExtratoQuery = {}) => requestBlob(`/financeiro/extrato.csv${extratoSearch(q)}`),
  financeiroExtratoPdf: (q: ExtratoQuery = {}) => requestBlob(`/financeiro/extrato.pdf${extratoSearch(q)}`),

  chatList: (filter: ChatFilter = 'unanswered', q?: string) => {
    const p = new URLSearchParams({ filter });
    if (q?.trim()) p.set('q', q.trim());
    return request<ChatList>(`/chat?${p}`);
  },
  chatThread: (id: string) => request<ChatThread>(`/chat/${encodeURIComponent(id)}`),
  sendChatMessage: (id: string, body: { kind: ChatKind; text: string; ref?: string }) =>
    request<ChatThread>(`/chat/${encodeURIComponent(id)}/messages`, { method: 'POST', json: body }),
  chatReplies: () => request<QuickReplyView[]>('/chat/replies'),
  replaceChatReplies: (replies: Array<{ id?: string; label: string; body: string }>) =>
    request<QuickReplyView[]>('/chat/replies', { method: 'PUT', json: { replies } }),

  shopProfile: () => request<ShopProfile>('/config/loja'),
  updateShopProfile: (body: Partial<Omit<ShopProfile, 'shopName' | 'region'>>) =>
    request<ShopProfile>('/config/loja', { method: 'PATCH', json: body }),
  notificationPrefs: () => request<NotificationPrefView[]>('/config/notifications'),
  updateNotificationPref: (body: { kind: NotificationKind; push: boolean; email: boolean }) =>
    request<NotificationPrefView>('/config/notifications', { method: 'PATCH', json: body }),
  testNotification: (kind: NotificationKind) =>
    request<{ kind: NotificationKind; title: string; body: string }>('/config/notifications/test', {
      method: 'POST',
      json: { kind },
    }),

  teamMembers: () => request<TeamMember[]>('/team/members'),
  updateMemberRole: (id: string, role: Role) =>
    request<TeamMember>(`/team/members/${id}`, { method: 'PATCH', json: { role } }),
  deactivateMember: (id: string) =>
    request<TeamMember>(`/team/members/${id}/deactivate`, { method: 'POST' }),
  reactivateMember: (id: string) =>
    request<TeamMember>(`/team/members/${id}/reactivate`, { method: 'POST' }),

  teamInvites: () => request<TeamInvite[]>('/team/invites'),
  createInvite: (email: string, role: InviteRole) =>
    request<TeamInvite>('/team/invites', { method: 'POST', json: { email, role } }),
  resendInvite: (id: string) => request<TeamInvite>(`/team/invites/${id}/resend`, { method: 'POST' }),
  cancelInvite: (id: string) => request<void>(`/team/invites/${id}`, { method: 'DELETE' }),
};
