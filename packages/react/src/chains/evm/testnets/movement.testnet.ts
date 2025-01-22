import { EVMChain } from '../../../types/index.js';

export const movementTestnet: EVMChain = {
  id: 30732,
  name: 'Movement Testnet',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'Movement Token',
    symbol: 'MOVE',
  },
  rpcUrls: {
    default: {
      http: ['https://mevm.devnet.imola.movementnetwork.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Movement Testnet Explorer',
      url: 'https://explorer.movementnetwork.xyz/?network=testnet',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11', // NOTE: address not found
    },
  },
};
