import { EVMChain } from '../../types/index.js';

export const odyssey: EVMChain = {
  id: 153153,
  name: 'Odyssey',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'Dione token',
    symbol: 'DIONE',
  },
  rpcUrls: {
    default: {
      http: ['https://node.dioneprotocol.com/ext/bc/D/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Odyssey Explorer',
      url: 'https://odyssey-explorer.ithaca.xyz',
    },
  },
};
