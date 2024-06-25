import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, createContext, useState } from 'react';
import { SupportedChainsByType, TangledConfig } from '../types/index.js';
import createChainConfigs from '../utils/createChainConfigs.js';
import { ChainConnectors, createChainConnectors } from '../utils/createChainConnectors.js';
import EVMProvider from './EVMProvider.js';
import { SolanaProvider } from './SolanaProvider.js';
import TronProvider from './TronProvider.js';
import WalletsProvider from './WalletsProvider.js';

export const TangledContext = createContext({
  config: {} as TangledConfig,
  chains: {} as SupportedChainsByType,
  connectors: {} as ChainConnectors,
});

const queryClient = new QueryClient();

export const TangledContextProvider = ({ children, config }: { children: ReactNode; config: TangledConfig }) => {
  const [chains] = useState(() => {
    return createChainConfigs(config.chains, config.chainConfigs);
  });
  const [connectors] = useState(() => {
    return createChainConnectors({ evm: config.evmConnectors });
  });

  return (
    <TangledContext.Provider value={{ config, chains, connectors }}>
      <QueryClientProvider client={queryClient}>
        <TronProvider
          adapters={connectors.tron}
          chains={chains.tron}
        >
          <SolanaProvider network={chains.solana[0]}>
            <EVMProvider
              chains={chains.evm}
              connectors={connectors.evm}
            >
              <WalletsProvider>{children}</WalletsProvider>
            </EVMProvider>
          </SolanaProvider>
        </TronProvider>
      </QueryClientProvider>
    </TangledContext.Provider>
  );
};