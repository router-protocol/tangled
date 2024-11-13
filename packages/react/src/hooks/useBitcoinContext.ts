import { useContext } from 'react';
import { BitcoinContext } from '../providers/BitcoinProvider.js';

export const useBitcoinContext = () => {
  return useContext(BitcoinContext);
};
