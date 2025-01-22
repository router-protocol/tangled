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
      url: 'ttps://explorer.oasis.io/mainnet/sapphire',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11', // NOTE: no multicall3 address
    },
  },
};
