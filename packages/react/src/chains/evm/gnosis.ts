import { EVMChain } from '../../types/index.js';

export const gnosis: EVMChain = {
  id: 100,
  name: 'Gnosis',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'XDAI',
    symbol: 'XDAI',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.gnosischain.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Gnosis Explorer',
      url: 'https://gnosisscan.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
    },
  },
};
