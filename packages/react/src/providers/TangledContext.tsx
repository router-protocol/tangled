import { MatchProvider } from '@matchain/matchid-sdk-react';
import { ReactNode, createContext, useRef } from 'react';
import { StoreApi, useStore } from 'zustand';
import { TangledConfigState, createTangledConfigStore } from '../store/TangledConfig.js';
import { TangledConfig } from '../types/index.js';
import { BitcoinProvider } from './BitcoinProvider.js';
import CosmosContextProvider from './CosmosProvider.js';
import EVMProvider from './EVMProvider.js';
import { SolanaProvider } from './SolanaProvider.js';
import { SuiProvider } from './SuiProvider.js';
import { TronProvider } from './TronProvider.js';
import WalletsProvider from './WalletsProvider.js';

export const TangledContext = createContext<{
  configStore: StoreApi<TangledConfigState>;
}>({
  configStore: createTangledConfigStore({} as TangledConfig),
});

export const TangledContextProvider = ({ children, config }: { children: ReactNode; config: TangledConfig }) => {
  const configStore = useRef(createTangledConfigStore(config)).current;

  const chains = useStore(configStore, (state) => state.chains);
  const connectors = useStore(configStore, (state) => state.connectors);

  return (
    <TangledContext.Provider value={{ configStore }}>
      <MatchProvider
        appid='0gubs1qtriqfmawj'
        wallet={{ type: 'UserPasscode' }}
      >
        <EVMProvider
          chains={chains.evm}
          connectors={connectors.evm}
        >
          <TronProvider
            adapters={connectors.tron}
            chain={chains.tron[0]}
          >
            <SolanaProvider chain={chains.solana[0]}>
              <SuiProvider chains={chains.sui}>
                <CosmosContextProvider chains={chains.cosmos}>
                  <BitcoinProvider adapters={connectors.bitcoin}>
                    <WalletsProvider>{children}</WalletsProvider>
                  </BitcoinProvider>
                </CosmosContextProvider>
              </SuiProvider>
            </SolanaProvider>
          </TronProvider>
        </EVMProvider>
      </MatchProvider>
    </TangledContext.Provider>
  );
};
