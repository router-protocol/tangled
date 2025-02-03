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
      address: '0xb7ab6Acb91F83B27eFf584338fE9555030659EAE',
    },
  },
};
