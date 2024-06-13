import { CHAIN_ID, CHAINS_DATA } from '../constants/index.js';
import { Chain, ChainConfig, ChainData, ChainType } from '../types/index.js';

const createChainConfigs = (
  chains: Chain[] | undefined,
  overrides?: Record<Chain, ChainConfig>,
): Record<ChainType, ChainData[]> => {
  const evmChainConfigs: ChainData[] = [];

  if (chains) {
    chains.forEach((_chain) => {
      evmChainConfigs.push({
        type: 'evm',
        ...CHAINS_DATA[CHAIN_ID[_chain]],
        ...overrides?.[_chain],
      });
    });
  }

  return {
    evm: evmChainConfigs,
    solana: [],
    bitcoin: [],
    cosmos: [],
    tron: [],
    near: [],
    sui: [],
    casper: [],
    aleph_zero: [],
  };
};

export default createChainConfigs;
