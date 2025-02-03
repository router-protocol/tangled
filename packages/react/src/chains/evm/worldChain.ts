import { EVMChain } from '../../types/index.js';

export const worldChain: EVMChain = {
  id: 480,
  name: 'World Chain',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://worldchain.drpc.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'World Chain Mainnet Explorer',
      url: 'https://worldscan.org',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
};
