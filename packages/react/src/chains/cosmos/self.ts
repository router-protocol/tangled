import { CosmsosChainType } from '../../types/index.js';

export const self: CosmsosChainType = {
  id: 'self-1',
  chainName: 'self',
  name: 'Self',
  type: 'cosmos',
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
  extra: {
    nativeAddress: 'uslf',
  },
} as const;
