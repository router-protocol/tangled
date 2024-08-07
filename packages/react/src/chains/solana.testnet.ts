import { ChainData } from '../types/index.js';

export const solanaTestnet: ChainData = {
  id: 'solanaTestnet',
  name: 'Solana Testnet',
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
      url: 'https://explorer.solana.com/?cluster=testnet',
    },
  },
} as const;
