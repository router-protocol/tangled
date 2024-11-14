import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, createContext, useRef } from 'react';
import { StoreApi, useStore } from 'zustand';
import { TangledConfigState, createTangledConfigStore } from '../store/TangledConfig.js';
import { TangledConfig } from '../types/index.js';
import { BitcoinProvider } from './BitcoinProvider.js';
import { CosmosContextProvider } from './CosmosProvider.js';
import { EVMProvider } from './EVMProvider.js';
import { NearProvider } from './NearProvider.js';
import { SolanaProvider } from './SolanaProvider.js';
import { SuiProvider } from './SuiProvider.js';
import { WalletsProvider } from './WalletsProvider.js';

export const TangledContext = createContext<{
  configStore: StoreApi<TangledConfigState>;
}>({
  configStore: createTangledConfigStore({} as TangledConfig),
});

export const TangledContextProvider = ({ children, config }: { children: ReactNode; config: TangledConfig }) => {
  const configStore = useRef(createTangledConfigStore(config)).current;
  const queryClient = new QueryClient();

  const chains = useStore(configStore, (state) => state.chains);
  const connectors = useStore(configStore, (state) => state.connectors);

  return (
    <TangledContext.Provider value={{ configStore }}>
      <EVMProvider
        chains={chains.evm}
        connectors={connectors.evm}
      >
        <QueryClientProvider client={queryClient}>
          <SolanaProvider chain={chains.solana[0]}>
            <CosmosContextProvider chains={chains.cosmos}>
              <SuiProvider chains={chains.sui}>
                <BitcoinProvider adapters={connectors.bitcoin}>
                  <NearProvider>
                    <WalletsProvider>{children}</WalletsProvider>
                  </NearProvider>
                </BitcoinProvider>
              </SuiProvider>
            </CosmosContextProvider>
          </SolanaProvider>
        </QueryClientProvider>
      </EVMProvider>
    </TangledContext.Provider>
  );
};
