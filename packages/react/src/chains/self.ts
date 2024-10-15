import { CosmsosChainType } from '../types/index.js';

export const self: CosmsosChainType = {
  id: 'self',
  name: 'Self',
  type: 'cosmos',
  cosmosChainId: 'self-1',
  nativeCurrency: {
    name: 'Self',
    symbol: 'SLF',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.selfchain.io:26657'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Self Explorer',
      url: 'https://explorer.selfchain.xyz',
    },
  },
} as const;
