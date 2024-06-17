import { ChainData } from '../types/index.js';

export const tronMainnet: ChainData = {
  id: 'tron-mainnet',
  name: 'Tron',
  type: 'tron',
  nativeCurrency: {
    name: 'TRX',
    symbol: 'TRX',
    decimals: 6,
  },
  rpcUrls: {
    default: {
      http: [''],
    },
  },
  blockExplorers: {
    default: {
      name: 'Tronscan',
      url: 'https://tronscan.org',
    },
  },
} as const;
