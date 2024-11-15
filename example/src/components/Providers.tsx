'use client';
import { TangledContextProvider, solana } from '@noble-assets/tangled-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TangledContextProvider
        config={{
          projectName: 'Tangled Example',
          chainConfigs: {
            solana: {
              ...solana,
              rpcUrls: {
                default: {
                  http: [process.env.NEXT_PUBLIC_SOLANA_API ?? 'https://api.mainnet-beta.solana.com'],
                },
              },
            },
          },

          projectId: '41980758771052df3f01be0a46f172a5',
        }}
      >
        {children}
      </TangledContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Providers;
