'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { Example } from '../components/Example';

const TangledContextProvider = dynamic(() => import('@tangled3/react').then((mod) => mod.TangledContextProvider), {
  ssr: false,
});

const queryClient = new QueryClient();

export default function HomePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <TangledContextProvider
        config={{
          projectName: 'Tangled Example',
          chainConfigs: {},
          projectId: '41980758771052df3f01be0a46f172a5',
        }}
      >
        <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white'>
          <Example />
        </main>
      </TangledContextProvider>
    </QueryClientProvider>
  );
}
