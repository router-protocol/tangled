import { CosmsosChainType } from '../../types/index.js';

export const osmosis: CosmsosChainType = {
  id: 'osmosis-1',
  chainName: 'osmosis',
  name: 'Osmosis',
  type: 'cosmos',
  nativeCurrency: {
    name: 'osmo',
    symbol: 'osmo',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.osmosis.zone'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Cosmos Explorer',
      url: 'https://celatone.osmosis.zone',
    },
  },
  extra: {
    nativeAddress: 'uosmo',
  },
} as const;
