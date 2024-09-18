import { TronWeb } from 'tronweb';
import { TronChain } from '../../types/index.js';

export const getTronWeb = (chain: TronChain) => {
  const tronweb = new TronWeb({
    fullHost: chain.rpcUrls.fullNode.http[0] ?? '',
  });
  tronweb.setAddress('TVJ6njG5EpUwJt4N9xjTrqU5za78cgadS2');
  return tronweb;
};
