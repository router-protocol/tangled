import {
  arbitrum as vArbitrum,
  avalanche as vAvalance,
  base as vBase,
  blast as vBlast,
  boba as vBoba,
  bsc as vBsc,
  linea as vLinea,
  mainnet as vMainnet,
  manta as vManta,
  mantle as vMantle,
  metis as vMetis,
  mode as vMode,
  optimism as vOptimism,
  polygon as vPolygon,
  polygonZkEvm as vPolygonZkEvm,
  scroll as vScroll,
  zkSync as vZkSync,
} from 'viem/chains';
import { EVMChain } from '../types/index.js';

export const arbitrum: EVMChain = { ...vArbitrum, type: 'evm' } as const;
export const avalanche: EVMChain = { ...vAvalance, type: 'evm' } as const;
export const base: EVMChain = { ...vBase, type: 'evm' } as const;
export const blast: EVMChain = { ...vBlast, type: 'evm' } as const;
export const boba: EVMChain = { ...vBoba, type: 'evm' } as const;
export const binance: EVMChain = { ...vBsc, type: 'evm' } as const;
export const ethereum: EVMChain = { ...vMainnet, type: 'evm' } as const;
export const linea: EVMChain = { ...vLinea, type: 'evm' } as const;
export const manta: EVMChain = { ...vManta, type: 'evm' } as const;
export const mantle: EVMChain = { ...vMantle, type: 'evm' } as const;
export const metis: EVMChain = { ...vMetis, type: 'evm' } as const;
export const mode: EVMChain = { ...vMode, type: 'evm' } as const;
export const optimism: EVMChain = { ...vOptimism, type: 'evm' } as const;
export const polygon: EVMChain = { ...vPolygon, type: 'evm' } as const;
export const polygonZkEvm: EVMChain = { ...vPolygonZkEvm, type: 'evm' } as const;
export const scroll: EVMChain = { ...vScroll, type: 'evm' } as const;
export const zkSync: EVMChain = { ...vZkSync, type: 'evm' } as const;
export * from './router-evm.js';
