import { useContext } from 'react';
import { NearContext } from '../providers/contexts.js';

export const useNearContext = () => {
  return useContext(NearContext);
};
