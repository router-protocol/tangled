import { NetworkType } from '@tronweb3/tronwallet-abstract-adapter';

export const getTronNetwork = (network: NetworkType) => {
  if (network === NetworkType.Mainnet) return 'tron-mainnet';
  if (network === NetworkType.Shasta) return 'tron-shasta';
  if (network === NetworkType.Nile) return 'tron-nile';
  return undefined;
};
