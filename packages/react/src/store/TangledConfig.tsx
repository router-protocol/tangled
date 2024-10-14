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
  tonconnectManifestUrl: string;
  twaReturnUrl: `${string}://${string}`;
}

export type TangledConfigStore = ReturnType<typeof createTangledConfigStore>;

export const createTangledConfigStore = (config: TangledConfig) => {
  return createStore<TangledConfigState>()(
    devtools((_, get) => ({
      chains: createChainConfigs(config.chains, config.chainConfigs),
      chainsById: Object.values(get().chains).reduce(
        (acc, chain) => {
          chain.forEach((c) => {
            const chainId = c.id as unknown as string;
            acc[chainId] = c as ChainData;
          });
          return acc;
        },
        {} as Record<string, ChainData>,
      ),
      connectors: createChainConnectors(config, get().chains),
      tonconnectManifestUrl: config.tonconnectManifestUrl,
      twaReturnUrl: config.twaReturnUrl,
    })),
  );
};
