import { ReactNode, createContext, useState } from 'react';
import { SupportedChainsByType, TangledConfig } from '../types/index.js';
import createChainConfigs from '../utils/createChainConfigs.js';
import { ChainConnectors, createChainConnectors } from '../utils/createChainConnectors.js';
import { AlephProvider } from './AlephProvider.js';
import EVMProvider from './EVMProvider.js';
import { SolanaProvider } from './SolanaProvider.js';
import { SuiProvider } from './SuiProvider.js';
import { TronProvider } from './TronProvider.js';
import WalletsProvider from './WalletsProvider.js';

export const TangledContext = createContext({
  config: {} as TangledConfig,
  chains: {} as SupportedChainsByType,
  connectors: {} as ChainConnectors,
});

export const TangledContextProvider = ({ children, config }: { children: ReactNode; config: TangledConfig }) => {
  const [chains] = useState(() => {
    return createChainConfigs(config.chains, config.chainConfigs);
  });
  const [connectors] = useState(() => {
    return createChainConnectors({ evm: config.evmConnectors });
  });

  return (
    <TangledContext.Provider value={{ config, chains, connectors }}>
      <EVMProvider
        chains={chains.evm}
        connectors={connectors.evm}
      >
        <TronProvider
          adapters={connectors.tron}
          chains={chains.tron}
        >
            <SolanaProvider network={chains.solana[0]}>
              <AlephProvider chains={chains.aleph_zero}>
                <SuiProvider chains={chains.sui}>
                  <WalletsProvider>{children}</WalletsProvider>
                </SuiProvider>
              </AlephProvider>
            </SolanaProvider>
          </TronProvider>
        </EVMProvider>
    </TangledContext.Provider>
  );
};
