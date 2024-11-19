import { CosmosChainType } from '../types/index.js';

export const noble: CosmosChainType = {
  id: 'noble-1',
  chainName: 'noble',
  name: 'Noble',
  type: 'cosmos',
  nativeCurrency: {
    name: 'usdc',
    symbol: 'uusdc',
    decimals: 6,
  },
  rpcUrls: {
    default: {
      http: ['https://noble-rpc.polkachu.com/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Noble Explorer',
      url: 'https://www.mintscan.io/noble',
    },
  },
} as const;
