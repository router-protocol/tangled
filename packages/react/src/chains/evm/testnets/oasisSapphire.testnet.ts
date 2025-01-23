import { EVMChain } from '../../../types/index.js';

export const oasisSapphireTestnet: EVMChain = {
  id: 23295,
  type: 'evm',
  name: 'Oasis Sapphire Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Sapphire Test Rose Token',
    symbol: 'TEST',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.sapphire.oasis.io'],
      webSocket: ['wss://testnet.sapphire.oasis.io/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Oasis Testnet Explorer',
      url: 'https://explorer.oasis.io/testnet/sapphire',
    },
  },
  contracts: {
    multicall3: {
      address: '0xce275dFaB490427301A83A93EeB7df733BE8aa10',
    },
  },
};
