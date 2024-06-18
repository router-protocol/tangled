import { NetworkType } from '@tronweb3/tronwallet-abstract-adapter';
import { ChainId } from '../types/index.js';

export const getTronNetwork = (network: NetworkType | undefined): ChainId | undefined => {
  if (network === NetworkType.Mainnet) return 'tron-mainnet';
  // if (network === NetworkType.Shasta) return 'tron-shasta';
  // if (network === NetworkType.Nile) return 'tron-nile';
  return undefined;
};
