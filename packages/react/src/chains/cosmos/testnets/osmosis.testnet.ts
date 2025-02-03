import { CosmsosChainType } from '../../../types/index.js';

export const osmosisTestnet: CosmsosChainType = {
  id: 'osmo-test-5',
  chainName: 'osmosistestnet',
  name: 'Osmosis Testnet',
  type: 'cosmos',
  nativeCurrency: {
    name: 'osmo',
    symbol: 'osmo',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.osmosis.zone'],
      webSocket: ['wss://rpc.testnet.osmosis.zone'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Osmosis Testnet Explorer',
      url: 'https://explorer.testnet.osmosis.zone',
    },
  },
  extra: {
    nativeAddress: 'uosmo',
  },
} as const;
