import { EVMChain } from '../../types/index.js';

export const shido: EVMChain = {
  id: 9008,
  name: 'Shido',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'Shido',
    symbol: 'SHIDO',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-delta-nodes.shidoscan.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Shido Explorer',
      url: 'https://shidoscan.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xeD4c58BAEF3dd056345aF4affA05b085B50a8f67',
    },
  },
};
