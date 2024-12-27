import * as chains from '../chains/index.js';
import { Chain, ChainData, ChainId, ChainType } from '../types/index.js';

export * from './abi/index.js';

export const CHAIN_ID = {
  // evm
  arbitrum: '42161',
  avalanche: '43114',
  arthera: '10242',
  base: '8453',
  binance: '56',
  blast: '81457',
  boba: '288',
  dogechain: '2000',
  firechain: '995',
  ethereum: '1',
  linea: '59144',
  manta: '169',
  mantle: '5000',
  matchain: '698',
  metis: '1088',
  mode: '34443',
  oasisSapphire: '23294',
  optimism: '10',
  polygon: '137',
  polygon_zkevm: '1101',
  rollux: '570',
  rootstock: '30',
  routerEvm: '9600',
  saakuru: '7225878',
  scroll: '534352',
  taiko: '167000',
  tangle: '5845',
  vanar: '2040',
  xLayer: '196',
  zksync: '324',

  // cosmos
  osmosis: 'osmosis-1',
  injective: 'injective-1',
  self: 'self-1',
  routerchain: 'router_9600-1',

  // tron
  tronMainnet: '728126428',
  tronShasta: '2494104990',
  // tronNile: 'tron-nile',

  // near

  // solana
  solana: 'solana',
  solanaTestnet: 'solanaTestnet',
  solanaDevnet: 'solanaDevnet',

  // sui
  sui: 'sui',
  suiTestnet: 'suiTestnet',

  // casper

  // ton

  // bitcoin
  bitcoin: 'bitcoin',
  bitcoinTestnet: 'bitcoin-testnet',

  // testnets
  // goerli: '5',
  // fuji: '43113',
  // mumbai: '80001',
  // scrollSepolia: '534351',
  // sepolia: '11155111',
} as const;

export const CHAIN_NAME = Object.keys(CHAIN_ID).reduce(
  (acc, key) => {
    acc[CHAIN_ID[key as Chain]] = key;
    return acc;
  },
  {} as Record<string, string>,
) as Record<ChainId, Chain>;

export const CHAIN_DATA: Record<ChainId, ChainData> = {
  [CHAIN_ID.arbitrum]: chains.arbitrum,
  [CHAIN_ID.avalanche]: chains.avalanche,
  [CHAIN_ID.arthera]: chains.arthera,
  [CHAIN_ID.base]: chains.base,
  [CHAIN_ID.binance]: chains.binance,
  [CHAIN_ID.blast]: chains.blast,
  [CHAIN_ID.boba]: chains.boba,
  [CHAIN_ID.dogechain]: chains.dogechain,
  [CHAIN_ID.firechain]: chains.firechain,
  [CHAIN_ID.ethereum]: chains.ethereum,
  [CHAIN_ID.linea]: chains.linea,
  [CHAIN_ID.manta]: chains.manta,
  [CHAIN_ID.mantle]: chains.mantle,
  [CHAIN_ID.matchain]: chains.matchain,
  [CHAIN_ID.metis]: chains.metis,
  [CHAIN_ID.mode]: chains.mode,
  [CHAIN_ID.oasisSapphire]: chains.oasisSapphire,
  [CHAIN_ID.optimism]: chains.optimism,
  [CHAIN_ID.polygon]: chains.polygon,
  [CHAIN_ID.polygon_zkevm]: chains.polygonZkEvm,
  [CHAIN_ID.rollux]: chains.rollux,
  [CHAIN_ID.rootstock]: chains.rootstock,
  [CHAIN_ID.routerEvm]: chains.routerEvm,
  [CHAIN_ID.saakuru]: chains.saakuru,
  [CHAIN_ID.scroll]: chains.scroll,
  [CHAIN_ID.taiko]: chains.taiko,
  [CHAIN_ID.tangle]: chains.tangle,
  [CHAIN_ID.vanar]: chains.vanar,
  [CHAIN_ID.zksync]: chains.zkSync,
  [CHAIN_ID.xLayer]: chains.xLayer,

  //cosmos
  [CHAIN_ID.osmosis]: chains.osmosis,
  [CHAIN_ID.injective]: chains.injective,
  [CHAIN_ID.self]: chains.self,
  [CHAIN_ID.routerchain]: chains.router,

  // tron
  [CHAIN_ID.tronMainnet]: chains.tronMainnet,
  [CHAIN_ID.tronShasta]: chains.tronShasta,
  // [CHAIN_ID.tronNile]: chains.tronNile,

  // near

  // solana
  [CHAIN_ID.solana]: chains.solana,
  [CHAIN_ID.solanaTestnet]: chains.solanaTestnet,
  [CHAIN_ID.solanaDevnet]: chains.solanaDevnet,

  //sui
  [CHAIN_ID.sui]: chains.sui,
  [CHAIN_ID.suiTestnet]: chains.suiTestnet,

  // ton

  // bitcoin
  [CHAIN_ID.bitcoin]: chains.bitcoin,
  [CHAIN_ID.bitcoinTestnet]: chains.bitcoinTestnet,

  // testnets
  // 5: goerli,
  // 80001: polygonMumbai,
  // 43113: avalancheFuji,
  // 534351: scrollSepolia,
  // 11155111: sepolia,
} as const;

export const CHAIN_TYPE_LABEL: Record<ChainType, string> = {
  evm: 'Ethereum',
  cosmos: 'Cosmos',
  tron: 'Tron',
  near: 'Near',
  solana: 'Solana',
  sui: 'Sui',
  casper: 'Casper',
  bitcoin: 'Bitcoin',
  ton: 'Ton',
} as const;

/**
 * The native ETH address.
 */
export const ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

/**
 * The native SUI address.
 */
export const SUI_ADDRESS = '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI';

/**
 * The native SOL address.
 */
export const SOL_ADDRESS = '11111111111111111111111111111111';
