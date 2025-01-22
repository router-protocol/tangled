import { EVMChain } from '../../../types/index.js';

export const storyOdyssey: EVMChain = {
  id: 1516,
  name: 'Story Odyssey',
  type: 'evm',
  nativeCurrency: {
    decimals: 18,
    name: 'IP Token',
    symbol: 'IP',
  },
  rpcUrls: {
    default: {
      http: ['https://lightnode-json-rpc-story.grandvalleys.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Story Odyssey Explorer',
      url: 'https://odyssey.storyscan.xyz',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
};
