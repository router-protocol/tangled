import { useContext } from 'react';
import { TangledContext } from '../providers/TangledContext.js';

const useChains = () => {
  const { chains } = useContext(TangledContext);
  return chains;
};

export default useChains;
