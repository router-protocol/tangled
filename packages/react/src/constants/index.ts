import {
  alephZero,
  arbitrum,
  avalanche,
  base,
  binance,
  blast,
  boba,
  ethereum,
  linea,
  manta,
  mantle,
  metis,
  mode,
  optimism,
  polygon,
  polygonZkEvm,
  scroll,
  tronMainnet,
  zkSync,
} from '../chains/index.js';
import { Chain, ChainData, ChainId } from '../types/index.js';

export const CHAIN_ID = {
  // evm
  arbitrum: '42161',
  avalanche: '43114',
  base: '8453',
  binance: '56',
  blast: '81457',
  boba: '288',
  ethereum: '1',
  linea: '59144',
  manta: '169',
  mantle: '5000',
  metis: '1088',
  mode: '34443',
  optimism: '10',
  polygon: '137',
  polygon_zkevm: '1101',
  scroll: '534352',
  zksync: '324',

  // cosmos

  // tron
  // tron: '0x2b6653dc',
  tronMainnet: 'tron-mainnet',
  // tronShasta: 'tron-shasta',
  // tronNile: 'tron-nile',

  // near

  // solana

  // sui

  // casper

  aleph_zero: 'aleph_zero',

  // testnets
  // goerli: '5',
  // fuji: '43113',
  // mumbai: '80001',
  // scrollSepolia: '534351',
  // sepolia: '11155111',
} as const;

export const CHAIN_DATA: Record<ChainId, ChainData> = {
  [CHAIN_ID.arbitrum]: arbitrum,
  [CHAIN_ID.avalanche]: avalanche,
  [CHAIN_ID.base]: base,
  [CHAIN_ID.binance]: binance,
  [CHAIN_ID.blast]: blast,
  [CHAIN_ID.boba]: boba,
  [CHAIN_ID.ethereum]: ethereum,
  [CHAIN_ID.linea]: linea,
  [CHAIN_ID.manta]: manta,
  [CHAIN_ID.mantle]: mantle,
  [CHAIN_ID.metis]: metis,
  [CHAIN_ID.mode]: mode,
  [CHAIN_ID.optimism]: optimism,
  [CHAIN_ID.polygon]: polygon,
  [CHAIN_ID.polygon_zkevm]: polygonZkEvm,
  [CHAIN_ID.scroll]: scroll,
  [CHAIN_ID.zksync]: zkSync,

  // tron
  [CHAIN_ID.tronMainnet]: tronMainnet,
  // [CHAIN_ID.tronShasta]: tronShasta,
  // [CHAIN_ID.tronNile]: tronNile,

  // aleph
  [CHAIN_ID.aleph_zero]: alephZero,

  // testnets
  // 5: goerli,
  // 80001: polygonMumbai,
  // 43113: avalancheFuji,
  // 534351: scrollSepolia,
  // 11155111: sepolia,
} as const;

export const DEFAULT_CHAINS = [
  'arbitrum',
  'avalanche',
  'base',
  'binance',
  'blast',
  'boba',
  'ethereum',
  'linea',
  'manta',
  'mantle',
  'metis',
  'mode',
  'optimism',
  'polygon',
  'polygon_zkevm',
  'scroll',
  'zksync',
  'aleph_zero',
] as Chain[];
