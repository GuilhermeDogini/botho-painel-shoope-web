import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { AppToaster } from '@/components/molecules/AppToaster';
import { router } from '@/app/routes';
import { keys } from '@/hooks/keys';
import { ApiError } from '@/lib/api';
import './index.css';

// Tratamento global de erro da API:
//  - 401 (sessão acabou no meio do uso): relê o "me" → a rota protegida leva ao login.
//    Só para erro de OUTRA chamada: se o próprio "me" der 401, relê-lo de novo viraria um laço.
//  - 409 (loja precisa reconectar): relê a conexão → a faixa de aviso aparece em qualquer tela.
const onError = (err: unknown, fromMe: boolean) => {
  if (!(err instanceof ApiError)) return;
  if (err.status === 401 && !fromMe && queryClient.getQueryData(keys.me)) void queryClient.invalidateQueries({ queryKey: keys.me });
  if (err.needsReconnect) void queryClient.invalidateQueries({ queryKey: keys.connection });
};

const queryClient: QueryClient = new QueryClient({
  queryCache: new QueryCache({ onError: (err, query) => onError(err, query.queryKey[0] === keys.me[0]) }),
  mutationCache: new MutationCache({ onError: (err) => onError(err, false) }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // Erro de regra (4xx) não melhora tentando de novo.
      retry: (count, err) => !(err instanceof ApiError && err.status >= 400 && err.status < 500) && count < 2,
    },
  },
});

const root = document.getElementById('root');
if (!root) throw new Error('elemento #root não encontrado');

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <AppToaster />
    </QueryClientProvider>
  </StrictMode>,
);
