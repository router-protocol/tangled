import { getFullnodeUrl } from '@mysten/sui/client';
import { ChainData } from '../types/index.js';

export const sui: ChainData = {
  id: 'sui',
  name: 'sui-mainnet',
  type: 'sui',
  nativeCurrency: {
    name: 'Sui',
    symbol: 'SUI',
    decimals: 9,
  },
  rpcUrls: {
    default: {
      http: [getFullnodeUrl('mainnet')],
    },
  },
  blockExplorers: {
    default: {
      name: 'Suiscan',
      url: 'https://suiscan.xyz/',
    },
  },
} as const;
