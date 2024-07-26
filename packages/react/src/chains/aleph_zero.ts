import { ChainData } from '../types/index.js';

export const alephZero: ChainData = {
  id: 'aleph-zero',
  name: 'Aleph Zero',
  type: 'aleph_zero',
  nativeCurrency: {
    name: 'AZERO',
    symbol: 'AZERO',
    decimals: 12,
  },
  rpcUrls: {
    default: {
      http: [''],
    },
  },
  blockExplorers: {
    default: {
      name: 'Subscan',
      url: 'https://alephzero.subscan.io/',
    },
  },
} as const;
