import { CHAIN } from '@tonconnect/ui-react';
import { ChainData } from '../types/index.js';

export const tonTestnet: ChainData = {
  id: CHAIN.TESTNET, // '-3'
  name: 'Ton Testnet',
  type: 'ton',
  nativeCurrency: {
    name: 'TON',
    symbol: 'TON',
    decimals: 9,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.toncenter.com/api/v2/jsonRPC'],
      webSocket: [''],
    },
  },
  blockExplorers: {
    default: {
      name: 'Tonscan',
      url: 'https://testnet.tonscan.org/',
    },
  },
} as const;
