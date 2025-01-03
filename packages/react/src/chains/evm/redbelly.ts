import { EVMChain } from '../../types/index.js';

export const redbelly: EVMChain = {
  id: 151,
  name: 'RedBelly Network',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'RedBelly Network Token',
    symbol: 'RBNT',
  },
  rpcUrls: {
    default: {
      http: ['https://governors.mainnet.redbelly.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'RedBelly Explorer',
      url: 'https://redbelly.routescan.io',
    },
  },
};