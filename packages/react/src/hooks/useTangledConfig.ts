import { useContext } from 'react';
import { useStore } from 'zustand';
import { TangledContext } from '../providers/TangledContext.js';
import { TangledConfigState } from '../store/TangledConfig.js';

export const useTangledConfig = <T>(selector: (state: TangledConfigState) => T): T => {
  const { configStore } = useContext(TangledContext);
  if (!configStore) throw new Error('Missing Ton Provider in the tree');
  return useStore(configStore, selector);
};
