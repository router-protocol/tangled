import { EVMChain } from '../types/index.js';

export const routerEvm: EVMChain = {
  id: 9600,
  name: 'Router Chain',
  type: 'evm',
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
  extra: {
    environment: 'mainnet',
    pathfinder: 'https://api-beta.pathfinder.routerprotocol.com/api',
  },
} as const;
