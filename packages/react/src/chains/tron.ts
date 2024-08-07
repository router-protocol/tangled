import { ChainData } from '../types/index.js';

export const tronMainnet: ChainData = {
  id: '0x2b6653dc',
  name: 'Tron',
  tronName: 'Mainnet',
  type: 'tron',
  nativeCurrency: {
    name: 'TRX',
    symbol: 'TRX',
    decimals: 6,
  },
  rpcUrls: {
    default: {
      http: [''],
    },
  },
  blockExplorers: {
    default: {
      name: 'Tronscan',
      url: 'https://tronscan.org',
    },
  },
} as const;
