import { getFullnodeUrl } from '@mysten/sui/client';
import { SuiChainType } from '../types/index.js';

export const suiTestnet: SuiChainType = {
  id: 'suiTestnet',
  name: 'Sui Testnet',
  suiNetwork: 'testnet',
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
