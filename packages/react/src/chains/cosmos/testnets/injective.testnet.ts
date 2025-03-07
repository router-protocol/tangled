import { CosmsosChainType } from '../../../types/index.js';

export const injectiveTestnet: CosmsosChainType = {
  id: 'injective-888',
  chainName: 'injectivetestnet',
  name: 'Injective Testnet',
  type: 'cosmos',
  nativeCurrency: {
    name: 'Injective',
    symbol: 'INJ',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.sentry.tm.injective.network:443'],
      webSocket: ['wss://testnet.sentry.lcd.injective.network:443/websocket'],
      lcd: ['https://testnet.sentry.lcd.injective.network:443'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Injective Testnet Explorer',
      url: 'https://testnet.explorer.injective.network',
    },
  },
  extra: {
    nativeAddress: 'inj',
  },
} as const;
