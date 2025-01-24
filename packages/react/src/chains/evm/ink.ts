import { EVMChain } from '../../types/index.js';

export const ink: EVMChain = {
  id: 57073,
  name: 'Ink',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'Ink Token',
    symbol: 'INK',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-qnd.inkonchain.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Ink Explorer',
      url: 'https://explorer.inkonchain.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
};
