import { CosmsosChainType } from '../types/index.js';

export const injective: CosmsosChainType = {
  id: 'injective',
  name: 'Injective',
  type: 'cosmos',
  cosmosChainId: 'injective-1',
  nativeCurrency: {
    name: 'Injective',
    symbol: 'INJ',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [''],
    },
  },
  blockExplorers: {
    default: {
      name: 'Injective Explorer',
      url: 'https://explorer.injective.network/',
    },
  },
} as const;
