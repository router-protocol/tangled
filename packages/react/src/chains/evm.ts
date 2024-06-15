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

export const arbitrum = { ...vArbitrum, type: 'evm' } as const;
export const avalanche = { ...vAvalance, type: 'evm' } as const;
export const base = { ...vBase, type: 'evm' } as const;
export const blast = { ...vBlast, type: 'evm' } as const;
export const boba = { ...vBoba, type: 'evm' } as const;
export const binance = { ...vBsc, type: 'evm' } as const;
export const ethereum = { ...vMainnet, type: 'evm' } as const;
export const linea = { ...vLinea, type: 'evm' } as const;
export const manta = { ...vManta, type: 'evm' } as const;
export const mantle = { ...vMantle, type: 'evm' } as const;
export const metis = { ...vMetis, type: 'evm' } as const;
export const mode = { ...vMode, type: 'evm' } as const;
export const optimism = { ...vOptimism, type: 'evm' } as const;
export const polygon = { ...vPolygon, type: 'evm' } as const;
export const polygonZkEvm = { ...vPolygonZkEvm, type: 'evm' } as const;
export const scroll = { ...vScroll, type: 'evm' } as const;
export const zkSync = { ...vZkSync, type: 'evm' } as const;
