import { OtherChainData } from '../types/index.js';

export const bitcoin: OtherChainData<'bitcoin'> = {
  id: 'bitcoin',
  name: 'Bitcoin',
  type: 'bitcoin',
  nativeCurrency: {
    name: 'BTC',
    symbol: 'BTC',
    decimals: 8,
  },
  rpcUrls: {
    default: {
      http: ['https://bitcoin.drpc.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Mempool space',
      url: 'https://mempool.space',
    },
  },
} as const;
