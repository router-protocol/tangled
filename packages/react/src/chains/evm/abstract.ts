import { EVMChain } from '../../types/index.js';

export const abstract: EVMChain = {
  id: 2741,
  name: 'Abstract',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.fsd.adfasd32442ds.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Abstract Explorer',
      url: 'https://abscan.org',
    },
  },
  contracts: {
    multicall3: {
      address: '0xa9c8576470a8d03d3dD4dbC322978aEAeF987F7d',
    },
  },
};
