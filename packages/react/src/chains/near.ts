import { OtherChainData } from '../types/index.js';

export const near: OtherChainData<'near'> = {
  id: 'near',
  name: 'NEAR',
  type: 'near',
  nativeCurrency: {
    name: 'NEAR',
    symbol: 'NEAR',
    decimals: 24,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.mainnet.near.org'],
      webSocket: ['wss://rpc.mainnet.near.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'NEAR Blocks',
      url: 'https://nearblocks.io',
    },
  },
} as const;
