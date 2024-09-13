import { useContext } from 'react';
import { TangledContext } from '../providers/TangledContext.js';
import { ChainData, ChainId, ChainType } from '../types/index.js';

/**
 * A hook that returns the chain data for a given chain ID.
 * @param chainId The type of chain to return
 * @returns An array of `ChainData<ChainType>`
 */
export const useChain = <T extends ChainType = ChainType>(chainId: ChainId | undefined): ChainData<T> | undefined => {
  const { chainsById } = useContext(TangledContext);

  if (chainId && chainsById[chainId]) {
    return chainsById[chainId] as ChainData<T>;
  }
  return undefined;
};
