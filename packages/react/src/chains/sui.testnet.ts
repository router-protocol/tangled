import { getFullnodeUrl } from '@mysten/sui/client';
import { ChainData } from '../types/index.js';

export const sui: ChainData = {
  id: 'sui-testnet',
  name: 'sui-testnet',
  type: 'sui',
  nativeCurrency: {
    name: 'Sui',
    symbol: 'SUI',
    decimals: 9,
  },
  rpcUrls: {
    default: {
      http: [...getFullnodeUrl('testnet')],
    },
  },
  blockExplorers: {
    default: {
      name: 'Suiscan Testnet',
      url: 'https://suiscan.xyz/testnet',
    },
  },
} as const;
