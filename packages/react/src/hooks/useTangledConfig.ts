import { useContext } from 'react';
import { TangledContext } from '../providers/TangledContext.js';

export const useTangledConfig = () => {
  const { config, connectors, chains } = useContext(TangledContext);
  return { config, connectors, chains };
};
