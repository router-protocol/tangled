import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, createContext, useState } from 'react';
import { TangledConfig } from '../types/index.js';
import createChainConfigs from '../utils/createChainConfigs.js';
import EVMProvider from './EVMProvider.js';

export const TangledContext = createContext({});

const queryClient = new QueryClient();

const TangledContextProvider = ({
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
        <EVMProvider
          chains={chains.evm}
          connectors={config.evmConnectors}
        >
          {children}
        </EVMProvider>
      </QueryClientProvider>
    </TangledContext.Provider>
  );
};

export default TangledContextProvider;
