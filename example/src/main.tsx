import { TangledContextProvider } from '@tangled3/react';
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
          chainConfigs: {},
          projectId: '41980758771052df3f01be0a46f172a5',
        }}
      >
        <App />
      </TangledContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
