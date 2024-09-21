import { useContext } from 'react';
import { TonContext } from '../providers/TonProvider.js';

export const useTonContext = () => {
  return useContext(TonContext);
};
