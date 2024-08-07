import { ChainData } from '../types/index.js';

export const solanaDevnet: ChainData = {
  id: 'solanaDevnet',
  name: 'Solana Devnet',
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
      url: 'https://explorer.solana.com/?cluster=devnet',
    },
  },
} as const;
