import { EVMChain } from '../../types/index.js';

export const jfin: EVMChain = {
  id: 3501,
  name: 'Jfin',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'JFIN',
    symbol: 'JFIN',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.jfinchain.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Jfin Explorer',
      url: 'https://exp.jfinchain.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
};
