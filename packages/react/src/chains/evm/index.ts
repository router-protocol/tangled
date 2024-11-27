import {
  arbitrum as vArbitrum,
  avalanche as vAvalance,
  base as vBase,
  blast as vBlast,
  boba as vBoba,
  bsc as vBsc,
  dogechain as vDogechain,
  fireChain as vFirechain,
  linea as vLinea,
  mainnet as vMainnet,
  manta as vManta,
  mantle as vMantle,
  metis as vMetis,
  mode as vMode,
  optimism as vOptimism,
  polygon as vPolygon,
  polygonZkEvm as vPolygonZkEvm,
  rollux as vRollux,
  rootstock as vRootstock,
  saakuru as vSaakuru,
  scroll as vScroll,
  taiko as vTaiko,
  zksync as vZkSync,
  xLayer as vxLayer,
} from 'viem/chains';
import { EVMChain } from '../../types/index.js';

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
export const xLayer: EVMChain = { ...vxLayer, type: 'evm' } as const;
export const rootstock: EVMChain = { ...vRootstock, type: 'evm' } as const;
export const saakuru: EVMChain = { ...vSaakuru, type: 'evm' } as const;
export const taiko: EVMChain = { ...vTaiko, type: 'evm' } as const;
export const dogechain: EVMChain = { ...vDogechain, type: 'evm' } as const;
export const rollux: EVMChain = { ...vRollux, type: 'evm' } as const;
export const firechain: EVMChain = { ...vFirechain, type: 'evm' } as const;

export * from './arthera.js';
export * from './oasisSapphire.js';
export * from './router-evm.js';
export * from './tangle.js';
