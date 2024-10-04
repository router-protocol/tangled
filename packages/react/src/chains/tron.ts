import { TronChain } from '../types/index.js';

export const tronMainnet: TronChain = {
  id: '728126428',
  trxId: '0x2b6653dc',
  name: 'Tron',
  tronName: 'Mainnet',
  type: 'tron',
  nativeCurrency: {
    name: 'TRX',
    symbol: 'TRX',
    decimals: 6,
  },
  contracts: {
    multicall: 'TGXuuKAb4bnrn137u39EKbYzKNXvdCes98',
  },
  rpcUrls: {
    default: {
      http: [''],
    },
    fullNode: {
      http: ['https://api.trongrid.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Tronscan',
      url: 'https://tronscan.org',
    },
  },
} as const;
