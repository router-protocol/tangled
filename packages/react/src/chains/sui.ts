import { getFullnodeUrl } from '@mysten/sui/client';
import { ChainData } from '../types/index.js';

export const sui: ChainData = {
  id: 'suiMainnet',
  name: 'Sui Mainnet',
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
