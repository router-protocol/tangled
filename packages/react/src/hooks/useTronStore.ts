import { useContext } from 'react';
import { useStore } from 'zustand';
import { TronContext } from '../providers/TronProvider.js';
import { TronState } from '../store/Tron.js';

export function useTronStore<T>(selector: (state: TronState) => T): T {
  const { store } = useContext(TronContext);
  if (!store) throw new Error('Missing TronContext.Provider in the tree');
  return useStore(store, selector);
}
