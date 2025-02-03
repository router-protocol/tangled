import { EVMChain } from '../../../types/index.js';

export const monadTestnet: EVMChain = {
  id: 10143,
  type: 'evm',
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 6,
    name: 'USD Tether',
    symbol: 'USDT',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc2.monad.xyz/9f92c80beba5052ee8b525882899af062e90cbef'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Testnet Explorer',
      url: 'https://testnet.monadexplorer.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0x54126a689f2F4324DBF8B0e74C3E941922A52F17',
    },
  },
};
