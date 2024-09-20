import { useContext } from 'react';
import { useStore } from 'zustand';
import { TonContext } from '../providers/TonProvider.js';
import { TonState } from '../store/Ton.js';

export function useTonStore<T>(selector: (state: TonState) => T): T {
  const { store } = useContext(TonContext);
  if (!store) throw new Error('Missing Ton Provider in the tree');
  return useStore(store, selector);
}
