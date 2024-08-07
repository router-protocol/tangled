import { ChainData } from '../types/index.js';

export const tronShasta: ChainData = {
  id: '0x94a9059e',
  name: 'Tron Shasta',
  tronName: 'Shasta',
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
      url: 'https://shasta.tronscan.org',
    },
  },
} as const;
