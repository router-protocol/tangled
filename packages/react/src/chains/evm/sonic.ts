import { EVMChain } from '../../types/index.js';

export const sonic: EVMChain = {
  id: 146,
  name: 'Sonic',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'S Token',
    symbol: 'S',
  },
  rpcUrls: {
    default: {
      http: ['https://sonic.drpc.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Morph Explorer',
      url: 'https://sonicscan.org',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
};
