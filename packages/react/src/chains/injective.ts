import { CosmsosChainType } from '../types/index.js';

export const injective: CosmsosChainType = {
  id: 'injective-1',
  name: 'Injective',
  type: 'cosmos',
  chainName: 'injective',
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
      url: 'https://explorer.injective.network',
    },
  },
} as const;
