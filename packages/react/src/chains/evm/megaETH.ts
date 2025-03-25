import { EVMChain } from '../../types/index.js';

export const megaETH: EVMChain = {
  id: 6342,
  name: 'megaETH',
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
      name: 'megaETH explorer',
      url: 'https://testnet.megaeth.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
    },
  },
};
