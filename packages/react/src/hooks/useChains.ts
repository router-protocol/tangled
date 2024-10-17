import { useMemo } from 'react';
import { ChainData, ChainType } from '../types/index.js';
import { useTangledConfig } from './useTangledConfig.js';

/**
 * A hook that returns an array of supported chains.
 * If no type is provided, it returns all chains.
 * @param type The type of chain to return
 * @returns An array of `ChainData`
 */
export const useChains = <T extends ChainType>(type?: T): ChainData[] => {
  const chains = useTangledConfig((config) => config.chains);

  return useMemo(() => {
    if (type) {
      return chains[type] as ChainData[];
    }

    return Object.values(chains).flat();
  }, [chains, type]);
};
