import { useContext } from 'react';
import { CosmosContext } from '../providers/CosmosProvider.js';

export const useCosmosContext = () => {
  return useContext(CosmosContext);
};
