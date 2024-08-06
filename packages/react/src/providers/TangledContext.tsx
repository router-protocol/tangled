import { ReactNode, createContext, useState } from 'react';
import { SupportedChainsByType, TangledConfig } from '../types/index.js';
import { ChainConnectors } from '../types/wallet.js';
import createChainConfigs from '../utils/createChainConfigs.js';
import { createChainConnectors } from '../utils/createChainConnectors.js';
import { AlephProvider } from './AlephProvider.js';
import EVMProvider from './EVMProvider.js';
import { SolanaProvider } from './SolanaProvider.js';
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
    return createChainConnectors(config);
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
              <WalletsProvider>{children}</WalletsProvider>
            </AlephProvider>
          </SolanaProvider>
        </TronProvider>
      </EVMProvider>
    </TangledContext.Provider>
  );
};
