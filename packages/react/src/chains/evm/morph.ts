import { EVMChain } from '../../types/index.js';

export const morph: EVMChain = {
  id: 2818,
  name: 'Morph',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.morphl2.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Morph Explorer',
      url: 'https://explorer.morphl2.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
};
