import { EVMChain } from '../../../types/index.js';

export const beraChainTestnet: EVMChain = {
  id: 80084,
  name: 'BeraChain Testnet',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'Bera Token',
    symbol: 'BERA',
  },
  rpcUrls: {
    default: {
      http: ['https://bartio.drpc.org'],
      webSocket: ['wss://bartio.drpc.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BeraChain Testnet Explorer',
      url: 'https://bartio.beratrail.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
};
