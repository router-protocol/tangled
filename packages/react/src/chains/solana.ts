import { OtherChainData } from '../types/index.js';

export const solana: OtherChainData<'solana'> = {
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
      http: [
        'https://mainnet.helius-rpc.com/?api-key=945d5aa7-fa07-41e0-ba43-b861dbeb142b',
        'https://api.mainnet-beta.solana.com',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Solana Explorer',
      url: 'https://explorer.solana.com',
    },
  },
} as const;
