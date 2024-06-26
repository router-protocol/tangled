import { useContext } from 'react';
import { TronContext } from '../providers/TronProvider.js';

export const useTronContext = () => {
  return useContext(TronContext);
};
