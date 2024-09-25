import { OtherChainData } from '../types/index.js';

export const nearTestnet: OtherChainData<'near'> = {
  id: '398',
  name: 'NEAR Testnet',
  type: 'near',
  nativeCurrency: {
    name: 'NEAR',
    symbol: 'NEAR',
    decimals: 24,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.near.org'],
      webSocket: ['wss://rpc.testnet.near.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'NEAR Blocks',
      url: 'https://testnet.nearblocks.io',
    },
  },
} as const;
