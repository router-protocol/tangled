import { TonClient } from '@ton/ton';
import { OtherChainData } from '../../types/index.js';

export const getTonClient = (chain: OtherChainData<'ton'>) => {
  const tonClient = new TonClient({
    endpoint: chain.rpcUrls.default.http[0] ?? '',
  });
  return tonClient;
};
