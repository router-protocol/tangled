import { bitcoin } from '../chains/bitcoin.js';
import * as cosmos from '../chains/cosmos/index.js';
import * as evm from '../chains/evm/index.js';
import { solana } from '../chains/solana.js';
import { solanaTestnet } from '../chains/solana.testnet.js';
import { sui } from '../chains/sui.js';
import { suiTestnet } from '../chains/sui.testnet.js';
import { tronMainnet } from '../chains/tron.js';
import { tronShasta } from '../chains/tron.shasta.js';
import {
  CosmsosChainType,
  EVMChain,
  OtherChainData,
  SuiChainType,
  SupportedChainsByType,
  TronChain,
} from '../types/index.js';

const getDefaultSupportedChains = (testnet?: boolean): SupportedChainsByType => {
  const supportedChains: SupportedChainsByType = {
    bitcoin: [],
    casper: [],
    cosmos: [],
    evm: [],
    near: [],
    solana: [],
    sui: [],
    tron: [],
    ton: [],
  };

  if (testnet) {
    // testnet chains
    supportedChains.evm = [
      evm.sepolia,
      evm.holesky,
      evm.arbitrumSepolia,
      evm.avalancheFuji,
      evm.amoy,
      evm.abstractSepolia,
      evm.beraChainTestnet,
      evm.firechainTestnet,
      evm.oasisSapphireTestnet,
      evm.pentagonTestnet,
      evm.soneiumTestnet,
      evm.storyOdyssey,
      evm.unichainSepolia,
      evm.monadTestnet,
    ] as EVMChain[];
    supportedChains.cosmos = [cosmos.osmosisTestnet, cosmos.alloraTestnet, cosmos.injectiveTestnet];
    supportedChains.solana = [solanaTestnet] as OtherChainData<'solana'>[];
    supportedChains.tron = [tronShasta] as TronChain[];
    supportedChains.sui = [suiTestnet] as SuiChainType[];
  } else {
    // mainnet chains
    supportedChains.evm = [
      evm.jfin,
      evm.abstract,
      evm.arbitrum,
      evm.arthera,
      evm.avalanche,
      evm.base,
      evm.berachain,
      evm.binance,
      evm.blast,
      evm.boba,
      evm.dogechain,
      evm.firechain,
      evm.ethereum,
      evm.linea,
      evm.manta,
      evm.mantle,
      evm.matchain,
      evm.metis,
      evm.hyperliquid,
      evm.ink,
      evm.mode,
      evm.morph,
      evm.nahmii,
      evm.nero,
      evm.oasisSapphire,
      evm.odyssey,
      evm.optimism,
      evm.polygon,
      evm.polygonZkEvm,
      evm.redbelly,
      evm.routerEvm,
      evm.rollux,
      evm.rootstock,
      evm.saakuru,
      evm.scroll,
      evm.shido,
      evm.soneium,
      evm.sonic,
      evm.taiko,
      evm.tangle,
      evm.vanar,
      evm.worldChain,
      evm.xLayer,
      evm.zero,
      evm.zkSync,
      evm.zora,
    ] as EVMChain[];
    supportedChains.cosmos = [cosmos.osmosis, cosmos.injective, cosmos.self, cosmos.router] as CosmsosChainType[];
    supportedChains.solana = [solana] as OtherChainData<'solana'>[];
    supportedChains.tron = [tronMainnet] as TronChain[];
    supportedChains.sui = [sui] as SuiChainType[];
    supportedChains.bitcoin = [bitcoin] as OtherChainData<'bitcoin'>[];
  }

  return supportedChains;
};

export default getDefaultSupportedChains;
