import { TronWeb } from 'tronweb';
import { ChainData } from '../../types/index.js';

export const getTronWeb = (chain: ChainData<'tron'>) => {
  const tronweb = new TronWeb({
    fullHost: chain.rpcUrls.fullNode.http[0] ?? '',
  });
  tronweb.setAddress('TVJ6njG5EpUwJt4N9xjTrqU5za78cgadS2');
  return tronweb;
};
