import { ChainData } from '../types/index.js';

export const solana: ChainData = {
  id: 'solana',
  name: 'Solana',
  type: 'solana',
  nativeCurrency: {
    name: 'SOL',
    symbol: 'SOL',
    decimals: 9,
  },
  rpcUrls: {
    default: {
      http: [''],
    },
  },
  blockExplorers: {
    default: {
      name: 'Solana Explorer',
      url: 'https://explorer.solana.com/',
    },
  },
} as const;
