/** Erro da API já com a mensagem em português que o back manda em { error }. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }

  /** 409 = a loja precisa reconectar à Shopee. */
  get needsReconnect(): boolean {
    return this.status === 409;
  }
}

const BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '') + '/api';

export async function request<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, ...rest } = init;
  const headers = new Headers(rest.headers);
  if (json !== undefined) headers.set('Content-Type', 'application/json');
  let res: Response;
  try {
    res = await fetch(BASE + path, { credentials: 'include', ...rest, headers, body: json !== undefined ? JSON.stringify(json) : rest.body });
  } catch {
    throw new ApiError(0, 'sem conexão com o servidor — confira a internet e tente de novo');
  }
  if (res.status === 204) return undefined as T;
  const body = (await res.json().catch(() => null)) as { error?: string } | null;
  if (!res.ok) throw new ApiError(res.status, body?.error ?? `erro ${res.status}`);
  return body as T;
}

/** Resposta binária (PDF de etiquetas). Em erro, tenta ler `{ error }` do JSON. */
export async function requestBlob(path: string, init: RequestInit & { json?: unknown } = {}): Promise<Blob> {
  const { json, ...rest } = init;
  const headers = new Headers(rest.headers);
  if (json !== undefined) headers.set('Content-Type', 'application/json');
  let res: Response;
  try {
    res = await fetch(BASE + path, {
      credentials: 'include',
      ...rest,
      headers,
      body: json !== undefined ? JSON.stringify(json) : rest.body,
    });
  } catch {
    throw new ApiError(0, 'sem conexão com o servidor — confira a internet e tente de novo');
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new ApiError(res.status, body?.error ?? `erro ${res.status}`);
  }
  return res.blob();
}
