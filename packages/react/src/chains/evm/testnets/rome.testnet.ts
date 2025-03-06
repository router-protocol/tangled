import { EVMChain } from '../../../types/index.js';

export const romeTestnet: EVMChain = {
  id: 200018,
  name: 'Rome Testnet',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'ROME',
    symbol: 'ROME',
  },
  rpcUrls: {
    default: {
      http: ['https://node1.testnet.romeprotocol.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Rome Testnet Explorer',
      url: 'https://node1.testnet.romeprotocol.xyz:1000',
    },
  },
  contracts: {
    multicall3: {
      address: '0xF9cda624FBC7e059355ce98a31693d299FACd963',
    },
  },
};
