import { CHAIN } from '@tonconnect/ui-react';
import { OtherChainData } from '../types/index.js';

export const tonMainnet: OtherChainData<'ton'> = {
  id: CHAIN.MAINNET, // '-239'
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
