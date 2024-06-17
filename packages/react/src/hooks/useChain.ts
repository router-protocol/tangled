import { useContext, useMemo } from 'react';
import { TangledContext } from '../providers/TangledContext.js';
import { ChainData, ChainId, ChainType } from '../types/index.js';

/**
 * A hook that returns the chain data for a given chain ID.
 * @param chainId The type of chain to return
 * @returns An array of `ChainData<ChainType>`
 */
export const useChain = <T extends ChainType>(chainId: ChainId, type: T) => {
  const { chains } = useContext(TangledContext);

  return useMemo(() => chains[type].find((chain) => chain.id === chainId) as ChainData<T>, [chains, chainId, type]);
};
