import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, createContext, useState } from 'react';
import { TangledConfig } from '../types/index.js';
import createChainConfigs from '../utils/createChainConfigs.js';
import EVMProvider from './EVMProvider.js';
import { SolanaProvider } from './SolanaProvider.js';
import TronProvider from './TronProvider.js';
import WalletsProvider from './WalletsProvider.js';

export const TangledContext = createContext({});

const queryClient = new QueryClient();

export const TangledContextProvider = ({
  children,
  // chains,
  // evmConnectors,
  config,
}: {
  children: ReactNode;
  config: TangledConfig;
  // chains: ChainConfig[];
  // evmConnectors: CreateConnectorFn[];
}) => {
  const [chains] = useState(() => {
    return createChainConfigs(config.chains, config.chainConfigs);
  });

  return (
    <TangledContext.Provider value={{}}>
      <QueryClientProvider client={queryClient}>
        <TronProvider>
          <SolanaProvider network={chains.solana[0]}>
            <EVMProvider
              chains={chains.evm}
              connectors={config.evmConnectors}
            >
              <WalletsProvider>{children}</WalletsProvider>
            </EVMProvider>
          </SolanaProvider>
        </TronProvider>
      </QueryClientProvider>
    </TangledContext.Provider>
  );
};
