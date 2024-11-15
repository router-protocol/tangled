'use client';
import { CosmsosChainType, TangledContextProvider, solana } from '@noble-assets/tangled-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

const dydx: CosmsosChainType = {
  id: 'dydx-mainnet-1' as `${string}-${number}`,
  chainName: 'dydx',
  name: 'dYdX',
  type: 'cosmos',
  nativeCurrency: {
    name: 'dydx',
    symbol: 'dydx',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://dydx-dao-rpc.polkachu.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'DyDx Explorer',
      url: 'https://www.mintscan.io/dydx',
    },
  },
} as const;

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TangledContextProvider
          config={{
            projectName: 'Tangled Example',
            chains: {
              cosmos: [dydx],
            },
            chainConfigs: {
              solana: {
                ...solana,
                rpcUrls: {
                  default: {
                    http: ['https://api.mainnet-beta.solana.com'],
                  },
                },
              },
            },

            projectId: '41980758771052df3f01be0a46f172a5',
          }}
        >
          {children}
        </TangledContextProvider>
      </QueryClientProvider>
      <ReactQueryDevtools client={queryClient} />
    </>
  );
};
