import { OtherChainData } from '../types/index.js';

export const bitcoinTestnet: OtherChainData<'bitcoin'> = {
  id: 'bitcoin-testnet',
  name: 'Bitcoin Testnet',
  type: 'bitcoin',
  nativeCurrency: {
    name: 'BTC',
    symbol: 'BTC',
    decimals: 8,
  },
  rpcUrls: {
    default: {
      http: ['https://bitcoin-testnet.drpc.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Mempool space',
      url: 'https://mempool.space/testnet',
    },
  },
} as const;
