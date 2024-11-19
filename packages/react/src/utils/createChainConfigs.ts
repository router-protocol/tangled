import { Chain, ChainConfig, SupportedChainsByType } from '../types/index.js';
import getDefaultSupportedChains from './getDefaultSupportedChains.js';

const createChainConfigs = (
  chains: Partial<SupportedChainsByType> | undefined,
  overrides?: Partial<Record<Chain, ChainConfig>>,
): SupportedChainsByType => {
  return overrideChainConfig(chains ?? {}, overrides);
};

const overrideChainConfig = (
  chainsByType: Partial<SupportedChainsByType>,
  overrides: Partial<Record<string, ChainConfig>> | undefined,
) => {
  const supportedChains = getDefaultSupportedChains();

  for (const [type, chains] of Object.entries(chainsByType)) {
    if (chains?.length) {
      // @ts-expect-error key can be indexed with string
      supportedChains[type as keyof SupportedChainsByType] = chains.map((chain) => ({
        ...chain,
        ...overrides?.[chain.name],
      }));
    }
  }

  return supportedChains;
};

export default createChainConfigs;
