import { EVMChain } from '../../types/index.js';

export const nero: EVMChain = {
  id: 1689,
  name: 'Nero',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'Nero Token',
    symbol: 'NERO',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.nerochain.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Nero Explorer',
      url: 'https://neroscan.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0x343A0DdD8e58bEaf29d69936c82F1516C6677B0E',
    },
  },
};
