import { getFullnodeUrl } from '@mysten/sui/client';
import { SuiChainType } from '../types/index.js';

export const sui: SuiChainType = {
  id: 'sui',
  name: 'Sui Mainnet',
  suiNetwork: 'mainnet',
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
