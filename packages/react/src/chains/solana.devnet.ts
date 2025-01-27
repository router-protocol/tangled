import { OtherChainData } from '../types/index.js';

export const solanaDevnet: OtherChainData<'solana'> = {
  id: 'solana-devnet',
  name: 'Solana Devnet',
  type: 'solana',
  nativeCurrency: {
    name: 'SOL',
    symbol: 'SOL',
    decimals: 9,
  },
  rpcUrls: {
    default: {
      http: ['https://api.devnet.solana.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Solana Explorer',
      url: 'https://explorer.solana.com/?cluster=devnet',
    },
  },
} as const;
