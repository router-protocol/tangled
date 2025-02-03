import { CosmsosChainType } from '../../../types/index.js';

export const alloraTestnet: CosmsosChainType = {
  id: 'allora-testnet-1',
  chainName: 'alloratestnet',
  name: 'Allora Testnet',
  type: 'cosmos',
  nativeCurrency: {
    name: 'Allora Testnet Token',
    symbol: 'ALLO',
    decimals: 9,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-allora-rpc.rhino-apis.com'],
      webSocket: ['wss://rpc.testnet.osmosis.zone'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Self Explorer',
      url: 'https://explorer.selfchain.xyz',
    },
  },
  extra: {
    nativeAddress: 'uslf',
  },
} as const;
