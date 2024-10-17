import { OtherChainData } from '../types/index.js';

export const alephZero: OtherChainData<'alephZero'> = {
  id: 'alephZero',
  name: 'Aleph Zero',
  type: 'alephZero',
  nativeCurrency: {
    name: 'AZERO',
    symbol: 'AZERO',
    decimals: 12,
  },
  rpcUrls: {
    default: {
      http: [''],
      webSocket: ['wss://ws.azero.dev'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Subscan',
      url: 'https://alephzero.subscan.io',
    },
  },
} as const;
