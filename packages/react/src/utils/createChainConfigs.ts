import { CHAIN_DATA, CHAIN_ID } from '../constants/index.js';
import { Chain, ChainConfig, ChainData, SupportedChainsByType } from '../types/index.js';
import getDefaultSupportedChains from './getDefaultSupportedChains.js';

const createChainConfigs = (
  chains: Chain[] | undefined,
  overrides?: Partial<Record<Chain, ChainConfig>>,
  testnet?: boolean,
): SupportedChainsByType => {
  // const evmChainConfigs: ChainData[] = [];

  let supportedChains: SupportedChainsByType = {
    aleph_zero: [],
    bitcoin: [],
    casper: [],
    cosmos: [],
    evm: [],
    near: [],
    solana: [],
    sui: [],
    tron: [],
  };

  if (chains) {
    for (const chain of chains) {
      const chainType = CHAIN_DATA[CHAIN_ID[chain]].type;

      switch (chainType) {
        case 'evm':
          supportedChains.evm.push({
            ...CHAIN_DATA[CHAIN_ID[chain]],
            ...overrides?.[chain],
          } as ChainData<'evm'>);
          break;
        case 'tron':
          break;
        case 'near':
          break;
        case 'cosmos':
          break;
        case 'solana':
          supportedChains.solana.push({
            ...CHAIN_DATA[CHAIN_ID[chain]],
            ...overrides?.[chain],
          } as ChainData<'solana'>);
          break;
        case 'sui':
          supportedChains.sui.push({
            ...CHAIN_DATA[CHAIN_ID[chain]],
            ...overrides?.[chain],
          } as ChainData<'sui'>);
          break;
        case 'casper':
          break;
        case 'aleph_zero':
          supportedChains.aleph_zero.push({
            ...CHAIN_DATA[CHAIN_ID[chain]],
            ...overrides?.[chain],
          } as ChainData<'aleph_zero'>);
          break;
        case 'bitcoin':
          break;
        default:
          break;
      }
    }
  } else {
    // Default to all chains
    supportedChains = getDefaultSupportedChains(testnet);
  }

  return supportedChains;
};

export default createChainConfigs;
