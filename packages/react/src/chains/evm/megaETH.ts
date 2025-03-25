import { EVMChain } from '../../types/index.js';

export const megaEVM: EVMChain = {
  id: 6342,
  name: 'megaEVM',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://carrot.megaeth.com/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'megaEVM explorer',
      url: 'https://testnet.megaeth.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
    },
  },
};
