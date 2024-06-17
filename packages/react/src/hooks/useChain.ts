import { useContext } from 'react';
import { TangledContext } from '../providers/TangledContext.js';
import { ChainData, ChainType } from '../types/index.js';

/**
 * A hook that returns an array of supported chains.
 * If no type is provided, it returns all chains.
 * @param type The type of chain to return
 * @returns An array of `ChainData<type>`
 */
const useChains = <T extends ChainType>(type: T | undefined): ChainData[] => {
  const { chains } = useContext(TangledContext);

  if (type) return chains[type] as ChainData<T>[];

  return Object.values(chains).flat();
};

export default useChains;
