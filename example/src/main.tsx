import { TangledContextProvider, solana } from '@tangled3/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TangledContextProvider
        config={{
          projectName: 'Tangled Example',
          chainConfigs: {
            solana: {
              ...solana,
              rpcUrls: {
                default: {
                  http: [import.meta.env.VITE_SOLANA_MAINNET_API_URL ?? 'https://api.mainnet-beta.solana.com'],
                },
              },
            },
          },

          projectId: '41980758771052df3f01be0a46f172a5',
        }}
      >
        <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white'>
          <App />
        </main>
      </TangledContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
