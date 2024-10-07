import { useContext } from 'react';
import { useStore } from 'zustand';
import { CasperContext } from '../providers/CasperProvider.js';
import { CasperState } from '../store/Casper.js';

export function useCasperStore<T>(selector: (state: CasperState) => T): T {
  const { store } = useContext(CasperContext);
  if (!store) throw new Error('Missing Ton Provider in the tree');
  return useStore(store, selector);
}
