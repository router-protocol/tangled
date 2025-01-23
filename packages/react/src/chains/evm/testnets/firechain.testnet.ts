import { EVMChain } from '../../../types/index.js';

export const firechainTestnet: EVMChain = {
  id: 997,
  name: '5irechain Testnet',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'Testnet 5ire Token',
    symbol: 'T5IRE',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.5ire.network'],
    },
  },
  blockExplorers: {
    default: {
      name: '5ireChain Testnet Explorer',
      url: 'https://testnet.5irescan.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xCDD0e0902eB1d560A316982CBf618b74e21db27D',
    },
  },
};
