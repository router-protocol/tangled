import { useContext } from 'react';
import { TangledContext } from '../providers/TangledContext.js';

const useTangledConfig = () => {
  const { config } = useContext(TangledContext);
  return config;
};

export default useTangledConfig;
