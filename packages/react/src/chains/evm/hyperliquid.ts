import { EVMChain } from '../../types/index.js';

export const hyperliquid: EVMChain = {
  id: 998,
  name: 'hyperliquid',
  type: 'evm',
  nativeCurrency: {
    decimals: 6,
    name: 'USDC',
    symbol: 'USDC',
  },
  rpcUrls: {
    default: {
      http: [],
    },
  },
  blockExplorers: {
    default: {
      name: 'Hyperliquid explorer',
      url: 'http://hypurrscan.io/',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
    },
  },
};
