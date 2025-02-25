import { EVMChain } from '../../types/index.js';

export const appchain: EVMChain = {
  id: 466,
  name: 'App Chain',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.appchain.xyz/http'],
    },
  },
  blockExplorers: {
    default: {
      name: 'AppChain Explorer',
      url: 'https://explorer.appchain.xyz',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
    },
  },
};
