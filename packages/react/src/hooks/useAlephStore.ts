import { useContext } from 'react';
import { useStore } from 'zustand';
import { AlephContext } from '../providers/AlephProvider.js';
import { AlephState } from '../store/Aleph.js';

export function useAlephStore<T>(selector: (state: AlephState) => T): T {
  const { store } = useContext(AlephContext);
  if (!store) throw new Error('Missing Aleph Provider in the tree');
  return useStore(store, selector);
}
