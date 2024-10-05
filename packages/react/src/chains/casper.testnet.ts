import { OtherChainData } from '../types/index.js';

export const casperTestnet: OtherChainData<'casper'> = {
  id: 'casper-test',
  name: 'Casper Testnet',
  type: 'casper',
  nativeCurrency: {
    name: 'Casper',
    symbol: 'CSPR',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://casper-node-proxy.dev.make.services/rpc'], // CASPER TODO: need confirmation
    },
  },
  blockExplorers: {
    default: {
      name: 'Casper Explorer',
      url: 'https://testnet.cspr.live',
    },
  },
} as const;
