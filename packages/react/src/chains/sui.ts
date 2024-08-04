import { ChainData } from '../types/index.js';

export const sui: ChainData = {
  id: 'sui',
  name: 'Sui',
  type: 'sui',
  nativeCurrency: {
    name: 'Sui',
    symbol: 'SUI',
    decimals: 9,
  },
  rpcUrls: {
    default: {
      http: [''],
    },
  },
  blockExplorers: {
    default: {
      name: 'Subscan',
      url: 'https://suiscan.xyz/',
    },
  },
} as const;
