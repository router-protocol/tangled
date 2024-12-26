import { useContext } from 'react';
import { NearContext } from '../providers/NearProvider.js';

export const useNearContext = () => {
  return useContext(NearContext);
};
