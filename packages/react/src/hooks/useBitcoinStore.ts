import { useContext } from 'react';
import { useStore } from 'zustand';
import { BitcoinContext } from '../providers/BitcoinProvider.js';
import { BitcoinState } from '../store/Bitcoin.js';

export function useBitcoinStore<T>(selector: (state: BitcoinState) => T): T {
  const { store } = useContext(BitcoinContext);
  if (!store) throw new Error('Missing Bitcoin Provider in the tree');
  return useStore(store, selector);
}
