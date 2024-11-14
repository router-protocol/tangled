import { useContext } from 'react';
import { useStore } from 'zustand';
import { TangledContext } from '../providers/TangledContext.js';
import { TangledConfigState } from '../store/TangledConfig.js';

export const useTangledConfig = <T>(selector: (state: TangledConfigState) => T): T => {
  const { configStore } = useContext(TangledContext);
  return useStore(configStore, selector);
};
