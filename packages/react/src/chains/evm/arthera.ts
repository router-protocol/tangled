import { EVMChain } from '../../types/index.js';

export const arthera: EVMChain = {
  id: 10242,
  name: 'Arthera',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'Arthera',
    symbol: 'AA',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.arthera.net'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Arthera Explorer',
      url: 'https://explorer.arthera.net',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
    },
  },
};
