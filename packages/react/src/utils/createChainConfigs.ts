import { CHAIN_DATA, CHAIN_NAME } from '../constants/index.js';
import { Chain, ChainConfig, ChainData, ChainId, SupportedChainsByType } from '../types/index.js';
import getDefaultSupportedChains from './getDefaultSupportedChains.js';

const createChainConfigs = (
  chains: Partial<SupportedChainsByType> | undefined,
  overrides?: Partial<Record<Chain, ChainConfig>>,
): SupportedChainsByType => {
  return overrideChainConfig(chains ?? {}, overrides);
};

const overrideChainConfig = (
  chainsByType: Partial<SupportedChainsByType>,
  overrides: Partial<Record<Chain, ChainConfig>> | undefined,
) => {
  const supportedChains = getDefaultSupportedChains();

  for (const chains of Object.values(chainsByType)) {
    for (const chain of chains) {
      if (supportedChains[chain.type].some((c) => c.id === chain.id)) {
        continue;
      }
      // todo: simplify... this is a bit redundant
      const chainId = chain.id.toString() as ChainId;
      const chainData = {
        ...(CHAIN_DATA[chainId] ?? chain),
        ...overrides?.[CHAIN_NAME[chainId] ?? chain.name],
      } as ChainData;

      // @ts-expect-error - resolves to never
      supportedChains[chain.type].push(chainData);
    }
  }

  return supportedChains;
};

export default createChainConfigs;
