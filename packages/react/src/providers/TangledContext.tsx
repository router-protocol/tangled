import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { coinbaseWallet, injected, walletConnect } from '@wagmi/connectors';
import { ReactNode, createContext, useState } from 'react';
import { Chain, Transport, http } from 'viem';
import { WagmiProvider, createConfig } from 'wagmi';
import { CHAINS_DATA } from '../constants/index.js';
import { ChainConfig } from '../types/index.js';

export const TangledContext = createContext({});

const queryClient = new QueryClient();

const TangledContextProvider = ({ children, chains }: { children: ReactNode; chains: ChainConfig[] }) => {
  const [evmChains] = useState(() => {
    return chains.filter((chain) => chain.type === 'evm');
  });
  const [wagmiConfig] = useState(() => {
    return createConfig({
      chains: evmChains.map((chain) => ({ ...CHAINS_DATA[chain.id], ...chains }) as Chain) as [Chain, ...Chain[]],
      transports: evmChains.reduce(
        (acc, chain) => {
          acc[chain.id] = http();
          return acc;
        },
        {} as Record<string, Transport>,
      ),
      connectors: [
        injected(),
        walletConnect({ projectId: '949e50a7346865d10fe9757fe8dd9477' }),
        coinbaseWallet({
          appName: 'Nitro | Router Protocol',
        }),
      ],
      ssr: true,
      batch: {
        multicall: {
          wait: 20,
        },
      },
    });
  });

  return (
    <TangledContext.Provider value={{ chains, wagmiConfig }}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </TangledContext.Provider>
  );
};

export default TangledContextProvider;
