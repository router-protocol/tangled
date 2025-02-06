import { EVMChain } from '../../types/index.js';

export const berachain: EVMChain = {
  id: 80094,
  name: 'Berachain',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'Berachain',
    symbol: 'BERA',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.berachain.com'],
      webSocket: ['wss://rpc.berachain.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Berachain Explorer',
      url: 'https://berascan.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
};
