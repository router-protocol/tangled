import { TronWeb } from 'tronweb';
import { ChainData } from '../../types/index.js';

export const getTronWeb = (chain: ChainData<'tron'>) => {
  return new TronWeb({
    fullHost: chain.rpcUrls.fullNode.http[0] ?? '',
  });
};
