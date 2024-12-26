import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { ReactNode, createContext, useRef } from 'react';
import { StoreApi, useStore } from 'zustand';
import { TangledConfigState, createTangledConfigStore } from '../store/TangledConfig.js';
import { TangledConfig } from '../types/index.js';
import { BitcoinProvider } from './BitcoinProvider.js';
import CosmosContextProvider from './CosmosProvider.js';
import EVMProvider from './EVMProvider.js';
import { SolanaProvider } from './SolanaProvider.js';
import { SuiProvider } from './SuiProvider.js';
import { TonProvider } from './TonProvider.js';
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
  const tonconnectManifestUrl = useStore(configStore, (state) => state.tonconnectManifestUrl);
  const twaReturnUrl = useStore(configStore, (state) => state.twaReturnUrl);

  return (
    <TangledContext.Provider value={{ configStore }}>
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
                {/* getting error if combined with TonProvider */}
                <TonConnectUIProvider
                  manifestUrl={tonconnectManifestUrl}
                  actionsConfiguration={{ twaReturnUrl }}
                >
                  <TonProvider chain={chains.ton[0]}>
                    <BitcoinProvider adapters={connectors.bitcoin}>
                      <WalletsProvider>{children}</WalletsProvider>
                    </BitcoinProvider>
                  </TonProvider>
                </TonConnectUIProvider>
              </CosmosContextProvider>
            </SuiProvider>
          </SolanaProvider>
        </TronProvider>
      </EVMProvider>
    </TangledContext.Provider>
  );
};
