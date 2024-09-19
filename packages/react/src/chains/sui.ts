import { getFullnodeUrl } from '@mysten/sui/client';
import { OtherChainData } from '../types/index.js';

export const sui: OtherChainData<'sui'> = {
  id: 'sui',
  name: 'Sui Mainnet',
  networkIdentifier: 'mainnet',
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
