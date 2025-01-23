import { EVMChain } from '../../types/index.js';

export const zero: EVMChain = {
  id: 543210,
  name: 'Zero',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://zero.drpc.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Zero Explorer',
      url: 'https://explorer.zero.network',
    },
  },
  contracts: {
    multicall3: {
      address: '0x0307F341a18f1FC1f63a7Ceeac970245A08C5a80',
    },
  },
};
