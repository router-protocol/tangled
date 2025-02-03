import { OtherChainData } from '../types/index.js';

export const solanaTestnet: OtherChainData<'solana'> = {
  id: 'solana-testnet',
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
