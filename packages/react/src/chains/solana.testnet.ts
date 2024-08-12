import { ChainData } from '../types/index.js';

export const solanaTestnet: ChainData<'solana'> = {
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
      http: ['https://api.testnet.solana.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Solana Explorer',
      url: 'https://explorer.solana.com/?cluster=testnet',
    },
  },
} as const;
