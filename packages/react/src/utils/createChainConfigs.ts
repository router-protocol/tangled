import type {
  Chain,
  ChainConfig,
  CosmosChainType,
  EVMChain,
  OtherChainData,
  OtherChainTypes,
  SuiChainType,
  SupportedChainsByType,
} from '../types/index.js';
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
      const customChains = chains.map((chain) => {
        return {
          ...chain,
          ...overrides?.[chain.name],
        };
      });
      switch (type) {
        case 'cosmos':
          supportedChains.cosmos = customChains as CosmosChainType[];
          break;
        case 'evm':
          supportedChains.evm = customChains as EVMChain[];
          break;
        case 'sui':
          supportedChains.sui = customChains as SuiChainType[];
          break;
        default:
          supportedChains[type as OtherChainTypes] = customChains as OtherChainData[];
          break;
      }
    }
  }

  return supportedChains;
};

export default createChainConfigs;
