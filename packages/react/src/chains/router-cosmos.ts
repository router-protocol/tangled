import { CosmsosChainType } from '../types/index.js';

export const router: CosmsosChainType = {
  id: 'router-9600',
  name: 'Router Chain',
  type: 'cosmos',
  cosmosChainId: 'router-9600',
  nativeCurrency: {
    name: 'Route',
    symbol: 'ROUTE',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://sentry.evm.rpc.routerprotocol.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Router Explorer',
      url: 'https://routerscan.io',
    },
  },
} as const;
