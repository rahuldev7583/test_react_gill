'use client';

import { ClusterType, createSolanaClient } from 'gill';
import { SolanaProvider } from '@gillsdk/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  },
});

const solanaClient = createSolanaClient({
  urlOrMoniker:
    'https://devnet.helius-rpc.com/?api-key=50378b40-aff1-4501-bdc2-62e60046e3d0',
  cluster: ClusterType.Devnet,
});

export function GillProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SolanaProvider client={solanaClient}>{children}</SolanaProvider>
    </QueryClientProvider>
  );
}
