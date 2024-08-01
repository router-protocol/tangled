import { useContext } from 'react';
import { SuiContext } from '../providers/SuiProvider.js';

export const useSuiContext = () => {
  return useContext(SuiContext);
};
