import { EVMChain } from '../../types/index.js';

export const nahmii: EVMChain = {
  id: 4061,
  name: 'Nahmii',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.n3.nahmii.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Nahmii Explorer',
      url: 'https://explorer.nahmii.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
};
