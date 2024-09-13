import { TonClient } from '@ton/ton';
import { ChainData } from '../../types/index.js';

export const getTonClient = (chain: ChainData<'ton'>) => {
  const tonClient = new TonClient({
    endpoint: chain.rpcUrls.default.http[0] ?? '',
  });
  return tonClient;
};
