import { EVMChain } from '../../types/index.js';

export const story: EVMChain = {
  id: 1514,
  name: 'Story',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'IP',
    symbol: 'IP',
  },
  rpcUrls: {
    default: {
      http: ['htts://mainnet.stroyrpc.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Story Explorer',
      url: 'https://kmnzxolweu42.blockscout.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
};
