import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ChainData, SupportedChainsByType, TangledConfig } from '../types/index.js';
import { ChainConnectors } from '../types/wallet.js';
import createChainConfigs from '../utils/createChainConfigs.js';
import { createChainConnectors } from '../utils/createChainConnectors.js';

export interface TangledConfigState {
  chains: SupportedChainsByType;
  chainsById: Record<string, ChainData>;
  connectors: ChainConnectors;
  config: TangledConfig;
}

export type TangledConfigStore = ReturnType<typeof createTangledConfigStore>;

export const createTangledConfigStore = (config: TangledConfig) => {
  const chains = createChainConfigs(config.chains, config.chainConfigs);
  const chainsById = Object.values(chains).reduce(
    (acc, chain) => {
      chain.forEach((c) => {
        const chainId = c.id as unknown as string;
        acc[chainId] = c as ChainData;
      });
      return acc;
    },
    {} as Record<string, ChainData>,
  );

  return createStore<TangledConfigState>()(
    devtools(() => ({
      chains,
      chainsById,
      connectors: createChainConnectors(config, chains),
      config,
    })),
  );
};
