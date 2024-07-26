import { useContext } from 'react';
import { AlephContext } from '../providers/AlephProvider.js';

export const useAlephContext = () => {
  return useContext(AlephContext);
};
