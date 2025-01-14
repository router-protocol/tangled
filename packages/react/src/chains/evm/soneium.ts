import { EVMChain } from '../../types/index.js';

export const soneium: EVMChain = {
  id: 1868,
  name: 'Soneium',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.soneium.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Soneium Explorer',
      url: 'https://soneium.blockscout.com',
    },
  },
};
