import { EVMChain } from '../../../types/index.js';

export const soneiumTestnet: EVMChain = {
  id: 1946,
  name: 'Soneium Testnet',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.minato.soneium.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Soneium Testnet Explorer',
      url: 'https://soneium-minato.blockscout.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
};
