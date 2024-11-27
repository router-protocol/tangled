import { EVMChain } from '../../types/index.js';

export const oasisSapphire: EVMChain = {
  id: 23294,
  type: 'evm',
  name: 'Oasis Sapphire',
  nativeCurrency: {
    decimals: 18,
    name: 'Rose',
    symbol: 'ROSE',
  },
  rpcUrls: {
    default: {
      http: ['https://sapphire.oasis.io'],
      webSocket: ['wss://sapphire.oasis.io/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Oasis Explorer',
      url: 'https://explorer.oasis.io/mainnet/sapphire',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
    },
  },
};
