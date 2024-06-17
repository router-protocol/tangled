import { useContext } from 'react';
import { TangledContext } from '../providers/TangledContext.js';

export const useTangledConfig = () => {
  const { config } = useContext(TangledContext);
  return config;
};
