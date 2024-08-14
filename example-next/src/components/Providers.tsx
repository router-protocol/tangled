'use client';
import { TangledContextProvider } from '@tangled3/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TangledContextProvider
        config={{
          projectName: 'Tangled Example',
          chainConfigs: {},
          projectId: '41980758771052df3f01be0a46f172a5',
        }}
      >
        {children}
      </TangledContextProvider>
    </QueryClientProvider>
  );
};

export default Providers;
