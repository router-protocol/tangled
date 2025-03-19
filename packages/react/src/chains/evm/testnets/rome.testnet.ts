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
      address: '0xee783Cc989AFBa38614Cc3d0643255145278a307',
    },
  },
};
