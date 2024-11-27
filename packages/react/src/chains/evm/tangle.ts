import { EVMChain } from '../../types/index.js';

export const tangle: EVMChain = {
  id: 5845,
  name: 'Tangle',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'Tangle Network',
    symbol: 'TNT',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.tangle.tools'],
      webSocket: ['wss://rpc.tangle.tools'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Tangle Explorer',
      url: 'https://explorer.tangle.tools',
    },
  },
  contracts: {
    multicall3: {
      address: '0x0000000000000000000000000000000000000808',
    },
  },
} as const;
