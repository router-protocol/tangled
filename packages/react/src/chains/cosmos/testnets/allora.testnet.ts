import { CosmsosChainType } from '../../../types/index.js';

export const alloraTestnet: CosmsosChainType = {
  id: 'allora-testnet-1',
  chainName: 'alloratestnet',
  name: 'Allora Testnet',
  type: 'cosmos',
  nativeCurrency: {
    name: 'Allora Testnet Token',
    symbol: 'ALLO',
    decimals: 9,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.ankr.com/allora_testnet'],
      webSocket: ['wss://rpc.testnet.osmosis.zone'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Allora Testnet Explorer',
      url: 'https://explorer.testnet.allora.network',
    },
  },
  extra: {
    nativeAddress: 'uallo',
  },
} as const;
