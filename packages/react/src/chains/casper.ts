import { OtherChainData } from '../types/index.js';

export const casperMainnet: OtherChainData<'casper'> = {
  id: 'casper',
  name: 'Casper',
  type: 'casper',
  nativeCurrency: {
    name: 'Casper',
    symbol: 'CSPR',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.casper.network'], // CASPER TODO: need confirmation
    },
  },
  blockExplorers: {
    default: {
      name: 'Casper Explorer',
      url: 'https://explorer.mainnet.casperlabs.io',
    },
  },
} as const;
