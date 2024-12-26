import { useContext } from 'react';
import { useStore } from 'zustand';
import { NearContext } from '../providers/NearProvider.js';
import { NearState } from '../store/Near.js';

export function useNearStore<T>(selector: (state: NearState) => T): T {
  const { store } = useContext(NearContext);
  if (!store) throw new Error('Missing Near Provider in the tree');
  return useStore(store, selector);
}
