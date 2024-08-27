import { ReactNode, createContext, useState } from 'react';
import { ChainData, ChainId, SupportedChainsByType, TangledConfig } from '../types/index.js';
import { ChainConnectors } from '../types/wallet.js';
import createChainConfigs from '../utils/createChainConfigs.js';
import { createChainConnectors } from '../utils/createChainConnectors.js';
import { AlephProvider } from './AlephProvider.js';
import EVMProvider from './EVMProvider.js';
import { SolanaProvider } from './SolanaProvider.js';
import { SuiProvider } from './SuiProvider.js';
import { TronProvider } from './TronProvider.js';
import WalletsProvider from './WalletsProvider.js';

export const TangledContext = createContext({
  config: {} as TangledConfig,
  chains: {} as SupportedChainsByType,
  chainsById: {} as Record<ChainId, ChainData>,
  connectors: {} as ChainConnectors,
});

export const TangledContextProvider = ({ children, config }: { children: ReactNode; config: TangledConfig }) => {
  const [chains] = useState(() => {
    return createChainConfigs(config.chains, config.chainConfigs);
  });
  const [chainsById] = useState(() => {
    return Object.values(chains).reduce(
      (acc, chain) => {
        chain.forEach((c) => {
          const chainId = c.id as unknown as ChainId;
          acc[chainId] = c as ChainData;
        });
        return acc;
      },
      {} as Record<ChainId, ChainData>,
    );
  });
  const [connectors] = useState(() => {
    return createChainConnectors(config, chains);
  });

  return (
    <TangledContext.Provider value={{ config, chains, connectors, chainsById }}>
      <EVMProvider
        chains={chains.evm}
        connectors={connectors.evm}
      >
        <TronProvider
          adapters={connectors.tron}
          chain={chains.tron[0]}
        >
          <SolanaProvider chain={chains.solana[0]}>
            <AlephProvider chain={chains.alephZero[0]}>
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
