import { bitcoin } from '../chains/bitcoin.js';
import * as cosmos from '../chains/cosmos.js';
import * as evm from '../chains/evm/index.js';
import { near } from '../chains/near.js';
import { solana } from '../chains/solana.js';
import { sui } from '../chains/sui.js';
import { tonMainnet } from '../chains/ton.js';
import { tronMainnet } from '../chains/tron.js';
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
  } else {
    // mainnet chains
    supportedChains.evm = [
      evm.arbitrum,
      evm.avalanche,
      evm.base,
      evm.binance,
      evm.blast,
      evm.boba,
      evm.ethereum,
      evm.linea,
      evm.manta,
      evm.mantle,
      evm.metis,
      evm.mode,
      evm.optimism,
      evm.polygon,
      evm.polygonZkEvm,
      evm.scroll,
      evm.zkSync,
    ] as EVMChain[];
    supportedChains.cosmos = [cosmos.osmosis, cosmos.injective, cosmos.self, cosmos.router] as CosmsosChainType[];
    supportedChains.solana = [solana] as OtherChainData<'solana'>[];
    supportedChains.tron = [tronMainnet] as TronChain[];
    supportedChains.sui = [sui] as SuiChainType[];
    supportedChains.ton = [tonMainnet] as OtherChainData<'ton'>[];
    supportedChains.near = [near] as OtherChainData<'near'>[];
    supportedChains.bitcoin = [bitcoin] as OtherChainData<'bitcoin'>[];
  }

  return supportedChains;
};

export default getDefaultSupportedChains;
