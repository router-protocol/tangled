import { EVMChain } from '../../types/index.js';

export const hyperEVM: EVMChain = {
  id: 999,
  name: 'HyperEVM',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'HYPE',
    symbol: 'HYPE',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.hyperliquid.xyz/evm'],
    },
  },
  blockExplorers: {
    default: {
      name: 'HyperEVM explorer',
      url: 'https://purrsec.com/',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
    },
  },
};
