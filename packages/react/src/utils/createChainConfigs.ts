import { CHAIN_DATA, CHAIN_NAME } from '../constants/index.js';
import { Chain, ChainConfig, ChainData, ChainId, SupportedChainsByType } from '../types/index.js';
import getDefaultSupportedChains from './getDefaultSupportedChains.js';

const createChainConfigs = (
  chains: SupportedChainsByType | undefined,
  overrides?: Partial<Record<Chain, ChainConfig>>,
  testnet?: boolean,
): SupportedChainsByType => {
  let supportedChains: SupportedChainsByType = {
    alephZero: [],
    bitcoin: [],
    casper: [],
    cosmos: [],
    evm: [],
    near: [],
    solana: [],
    sui: [],
    tron: [],
  };

  const defaultChains = getDefaultSupportedChains(testnet);

  if (chains) {
    supportedChains = overrideChainConfig(chains, overrides);
  } else {
    // Override with custom configs
    supportedChains = overrideChainConfig(defaultChains, overrides);
  }

  return supportedChains;
};

const overrideChainConfig = (
  chainsByType: SupportedChainsByType,
  overrides: Partial<Record<Chain, ChainConfig>> | undefined,
) => {
  const supportedChains: SupportedChainsByType = {
    alephZero: [],
    bitcoin: [],
    casper: [],
    cosmos: [],
    evm: [],
    near: [],
    solana: [],
    sui: [],
    tron: [],
  };

  for (const chains of Object.values(chainsByType)) {
    for (const chain of chains) {
      const chainId = chain.id.toString() as ChainId;
      const chainData = {
        ...CHAIN_DATA[chainId],
        ...overrides?.[CHAIN_NAME[chainId]],
      } as ChainData;
      // @ts-expect-error - Interesction type reduces to never
      supportedChains[chain.type].push(chainData);
    }
  }

  return supportedChains;
};

export default createChainConfigs;
