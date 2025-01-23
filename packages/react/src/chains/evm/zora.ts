import { EVMChain } from '../../types/index.js';

export const zora: EVMChain = {
  id: 7777777,
  name: 'Zora',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://zora.drpc.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Zora Explorer',
      url: 'https://explorer.zora.energy',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
};
