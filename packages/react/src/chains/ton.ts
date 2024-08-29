import { ChainData } from '../types/index.js';

export const tonMainnet: ChainData = {
  id: '1100',
  name: 'Ton',
  type: 'ton',
  nativeCurrency: {
    name: 'TON',
    symbol: 'TON',
    decimals: 9,
  },
  rpcUrls: {
    default: {
      http: ['https://toncenter.com/api/v2/jsonRPC'],
      webSocket: [''],
    },
  },
  blockExplorers: {
    default: {
      name: 'Tonscan',
      url: 'https://tonscan.org/',
    },
  },
} as const;
