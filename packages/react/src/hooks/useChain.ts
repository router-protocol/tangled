import { useContext } from 'react';
import { TangledContext } from '../providers/TangledContext.js';
import { ChainData, ChainId } from '../types/index.js';

/**
 * A hook that returns the chain data for a given chain ID.
 * @param chainId The type of chain to return
 * @returns An array of `ChainData`
 */
export const useChain = (chainId: ChainId | undefined): ChainData | undefined => {
  const { chainsById } = useContext(TangledContext);

  if (chainId && chainsById[chainId]) {
    return chainsById[chainId];
  }
  return undefined;
};
