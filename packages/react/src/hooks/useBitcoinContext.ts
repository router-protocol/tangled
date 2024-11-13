import { useContext } from 'react';
import { BitcoinContext } from '../providers/contexts.js';

export const useBitcoinContext = () => {
  return useContext(BitcoinContext);
};
