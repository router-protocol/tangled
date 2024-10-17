import {
  arbitrum,
  avalanche,
  base,
  binance,
  bitcoin,
  bitcoinTestnet,
  blast,
  boba,
  casperMainnet,
  casperTestnet,
  ethereum,
  injective,
  linea,
  manta,
  mantle,
  metis,
  mode,
  near,
  nearTestnet,
  optimism,
  osmosis,
  polygon,
  polygonZkEvm,
  router,
  routerEvm,
  scroll,
  self,
  solana,
  solanaDevnet,
  solanaTestnet,
  sui,
  suiTestnet,
  tonMainnet,
  tonTestnet,
  tronMainnet,
  tronShasta,
  zkSync,
} from '../chains/index.js';
import { Chain, ChainData, ChainId, ChainType } from '../types/index.js';

export * from './abi/index.js';

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
  routerEvm: '9600',

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
  near: '397',
  nearTestnet: '398',

  // solana
  solana: 'solana',
  solanaTestnet: 'solanaTestnet',
  solanaDevnet: 'solanaDevnet',

  // sui
  sui: 'sui',
  suiTestnet: 'suiTestnet',

  // casper
  casper: 'casper',
  casperTestnet: 'casper-test',

  // ton
  tonMainnet: '-239',
  tonTestnet: '-3',

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
  [CHAIN_ID.routerEvm]: routerEvm,

  //cosmos
  [CHAIN_ID.osmosis]: osmosis,
  [CHAIN_ID.injective]: injective,
  [CHAIN_ID.self]: self,
  [CHAIN_ID.routerchain]: router,

  // tron
  [CHAIN_ID.tronMainnet]: tronMainnet,
  [CHAIN_ID.tronShasta]: tronShasta,
  // [CHAIN_ID.tronNile]: tronNile,

  // near
  [CHAIN_ID.near]: near,
  [CHAIN_ID.nearTestnet]: nearTestnet,

  // solana
  [CHAIN_ID.solana]: solana,
  [CHAIN_ID.solanaTestnet]: solanaTestnet,
  [CHAIN_ID.solanaDevnet]: solanaDevnet,

  //sui
  [CHAIN_ID.sui]: sui,
  [CHAIN_ID.suiTestnet]: suiTestnet,

  // ton
  [CHAIN_ID.tonMainnet]: tonMainnet,
  [CHAIN_ID.tonTestnet]: tonTestnet,

  // bitcoin
  [CHAIN_ID.bitcoin]: bitcoin,
  [CHAIN_ID.bitcoinTestnet]: bitcoinTestnet,

  // casper
  [CHAIN_ID.casper]: casperMainnet,
  [CHAIN_ID.casperTestnet]: casperTestnet,

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
 * The native SOL address.
 */
export const SOL_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

// Lookup for near chain id
export const NEAR_NETWORK_CONFIG: Record<string, string> = {
  testnet: CHAIN_ID.nearTestnet,
  mainnet: CHAIN_ID.near,
};
