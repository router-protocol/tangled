import { useContext } from 'react';
import { CosmosContext } from '../providers/contexts.js';

export const useCosmosContext = () => {
  return useContext(CosmosContext);
};
