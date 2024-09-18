import { TronChain } from '../types/index.js';

export const tronShasta: TronChain = {
  id: 'tronShasta',
  trxId: '0x94a9059e',
  name: 'Tron Shasta',
  tronName: 'Shasta',
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
    fullNode: {
      http: ['https://api.shasta.trongrid.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Tronscan',
      url: 'https://shasta.tronscan.org',
    },
  },
} as const;
