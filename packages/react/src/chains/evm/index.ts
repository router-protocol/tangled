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
  matchain as vMatchain,
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
  vanar as vVanar,
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
export const dogechain: EVMChain = { ...vDogechain, type: 'evm' } as const;
export const ethereum: EVMChain = { ...vMainnet, type: 'evm' } as const;
export const firechain: EVMChain = {
  ...vFirechain,
  type: 'evm',
  contracts: { multicall3: { address: '0xa363227E39D1870e20a881b59f8032BEdFB09E8B' } },
} as const;
export const linea: EVMChain = { ...vLinea, type: 'evm' } as const;
export const manta: EVMChain = { ...vManta, type: 'evm' } as const;
export const mantle: EVMChain = { ...vMantle, type: 'evm' } as const;
export const matchain: EVMChain = {
  ...vMatchain,
  type: 'evm',
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 1,
    },
  },
} as const;
export const metis: EVMChain = { ...vMetis, type: 'evm' } as const;
export const mode: EVMChain = { ...vMode, type: 'evm' } as const;
export const optimism: EVMChain = { ...vOptimism, type: 'evm' } as const;
export const polygon: EVMChain = { ...vPolygon, type: 'evm' } as const;
export const polygonZkEvm: EVMChain = { ...vPolygonZkEvm, type: 'evm' } as const;
export const rootstock: EVMChain = { ...vRootstock, type: 'evm' } as const;
export const rollux: EVMChain = { ...vRollux, type: 'evm' } as const;
export const saakuru: EVMChain = {
  ...vSaakuru,
  type: 'evm',
  contracts: { multicall3: { address: '0xB558D0c3f1a804AA9ec893c76D546C06624D081D' } },
} as const;
export const scroll: EVMChain = { ...vScroll, type: 'evm' } as const;
export const taiko: EVMChain = { ...vTaiko, type: 'evm' } as const;
export const vanar: EVMChain = {
  ...vVanar,
  type: 'evm',
  contracts: { multicall3: { address: '0x545fa049Fe952fea45113325b9a4F556401315Bc' } },
} as const;
export const xLayer: EVMChain = { ...vxLayer, type: 'evm' } as const;
export const zkSync: EVMChain = { ...vZkSync, type: 'evm' } as const;
export * from './abstract.js';
export * from './arthera.js';
export * from './berachain.js';
export * from './hyperliquid.js';
export * from './ink.js';
export * from './morph.js';
export * from './nahmii.js';
export * from './nero.js';
export * from './oasisSapphire.js';
export * from './odyssey.js';
export * from './redbelly.js';
export * from './router-evm.js';
export * from './shido.js';
export * from './soneium.js';
export * from './sonic.js';
export * from './tangle.js';
export * from './testnet.js';
export * from './worldChain.js';
export * from './zero.js';
export * from './zora.js';
