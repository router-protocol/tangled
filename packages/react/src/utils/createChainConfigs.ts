import { CHAIN_DATA, CHAIN_NAME } from '../constants/index.js';
import { Chain, ChainConfig, ChainData, ChainId, SupportedChainsByType } from '../types/index.js';
import getDefaultSupportedChains from './getDefaultSupportedChains.js';

const createChainConfigs = (
  chains: SupportedChainsByType | undefined,
  overrides?: Partial<Record<Chain, Partial<ChainConfig>>>,
  testnet?: boolean,
): SupportedChainsByType => {
  let supportedChains: SupportedChainsByType = {
    bitcoin: [],
    casper: [],
    cosmos: [],
    evm: [],
    near: [],
    solana: [],
    sui: [],
    tron: [],
    ton: [],
  };

  if (chains) {
    supportedChains = overrideChainConfig(chains, overrides);
  } else {
    const defaultChains = getDefaultSupportedChains(testnet);
    // Override with custom configs
    supportedChains = overrideChainConfig(defaultChains, overrides);
  }

  return supportedChains;
};

const overrideChainConfig = (
  chainsByType: SupportedChainsByType,
  overrides: Partial<Record<Chain, Partial<ChainConfig>>> | undefined,
) => {
  const supportedChains: SupportedChainsByType = {
    bitcoin: [],
    casper: [],
    cosmos: [],
    evm: [],
    near: [],
    solana: [],
    sui: [],
    tron: [],
    ton: [],
  };

  for (const chains of Object.values(chainsByType)) {
    for (const chain of chains) {
      const chainId = chain.id.toString() as ChainId;
      const chainConfigData = CHAIN_DATA[chainId] || {};
      const chainData = {
        ...chainConfigData,
        ...chain,
        ...overrides?.[CHAIN_NAME[chainId]],
      } as ChainData;

      // @ts-expect-error - resolves to never
      supportedChains[chain.type].push(chainData);
    }
  }

  return supportedChains;
};

export default createChainConfigs;
