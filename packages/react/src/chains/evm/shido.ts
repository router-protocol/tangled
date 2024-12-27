import { EVMChain } from '../../types/index.js';

export const shido: EVMChain = {
  id: 9008,
  name: 'Shido',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'Shido',
    symbol: 'SHIDO',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-delta-nodes.shidoscan.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Shido Explorer',
      url: 'https://shidoscan.com',
    },
  },
};
