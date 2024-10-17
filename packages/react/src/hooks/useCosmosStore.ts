import { useContext } from 'react';
import { useStore } from 'zustand';
import { CosmosContext } from '../providers/CosmosProvider.js';
import { CosmosState } from '../store/Cosmos.js';

export function useCosmosStore<T>(selector: (state: CosmosState) => T): T {
  const { store } = useContext(CosmosContext);
  if (!store) throw new Error('Missing Cosmos Provider in the tree');
  return useStore(store, selector);
}
