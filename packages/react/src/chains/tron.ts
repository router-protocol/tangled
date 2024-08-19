import { ChainData } from '../types/index.js';

export const tronMainnet: ChainData = {
  id: 'tronMainnet',
  trxId: '0x2b6653dc',
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
    fullNode: {
      http: ['https://api.trongrid.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Tronscan',
      url: 'https://tronscan.org',
    },
  },
} as const;
