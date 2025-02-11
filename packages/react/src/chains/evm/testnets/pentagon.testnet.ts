import { EVMChain } from '../../../types/index.js';

export const pentagonTestnet: EVMChain = {
  id: 555555,
  name: 'Pentagon Testnet',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'Pentagon Token',
    symbol: 'PEN',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-testnet.pentagon.games'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Pentagon Testnet Explorer',
      url: 'https://explorer-testnet.pentagon.games',
    },
  },
  contracts: {
    multicall3: {
      address: '0xFd16E48426e22ac5ef9b8d4B6C917eFC5F33e8C6',
    },
  },
};
