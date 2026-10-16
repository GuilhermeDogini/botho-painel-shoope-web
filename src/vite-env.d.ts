/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Endereço da API em produção. Em dev fica vazio: o Vite repassa /api. */
  readonly VITE_API_URL?: string;
}
