import { CosmsosChainType } from '../types/index.js';

export const router: CosmsosChainType = {
  id: 'router_9600-1',
  chainName: 'routerchain',
  name: 'Router Chain',
  type: 'cosmos',
  nativeCurrency: {
    name: 'Route',
    symbol: 'ROUTE',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://sentry.tm.rpc.routerprotocol.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Router Explorer',
      url: 'https://routerscan.io',
    },
  },
} as const;
