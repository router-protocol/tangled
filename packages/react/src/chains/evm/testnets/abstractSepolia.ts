import { EVMChain } from '../../../types/index.js';

export const abstractSepolia: EVMChain = {
  id: 11124,
  name: 'Abstract Sepolia',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://api.testnet.abs.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Abstract Sepolia Explorer',
      url: 'https://sepolia.abscan.org',
    },
  },
  contracts: {
    multicall3: {
      address: '0xF9cda624FBC7e059355ce98a31693d299FACd963',
    },
  },
};
