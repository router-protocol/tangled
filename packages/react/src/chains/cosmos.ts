import { OtherChainData } from '../types/index.js';

export const osmo: OtherChainData<'cosmos'> = {
  id: 'osmosis-1',
  name: 'osmosis-1',
  type: 'cosmos',
  nativeCurrency: {
    name: 'osmo',
    symbol: 'osmo',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [''],
    },
  },
  blockExplorers: {
    default: {
      name: 'Cosmos Explorer',
      url: 'https://celatone.osmosis.zone/',
    },
  },
} as const;
