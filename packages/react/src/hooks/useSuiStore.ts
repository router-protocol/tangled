import { useContext } from 'react';
import { useStore } from 'zustand';
import { SuiContext } from '../providers/SuiProvider.js';
import { SuiState } from '../store/Sui.js';

export function useSuiStore<T>(selector: (state: SuiState) => T): T {
  const { store } = useContext(SuiContext);
  if (!store) throw new Error('Missing Sui Provider in the tree');
  return useStore(store, selector);
}
