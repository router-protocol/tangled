import { bitcoin } from '../chains/bitcoin.js';
import * as cosmos from '../chains/cosmos.js';
import * as evm from '../chains/evm.js';
import { near } from '../chains/near.js';
import { solana } from '../chains/solana.js';
import { sui } from '../chains/sui.js';
import { CosmsosChainType, EVMChain, OtherChainData, SuiChainType, SupportedChainsByType } from '../types/index.js';

const getDefaultSupportedChains = (): SupportedChainsByType => {
  const supportedChains: SupportedChainsByType = {
    bitcoin: [],
    cosmos: [],
    evm: [],
    near: [],
    solana: [],
    sui: [],
  };

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
  supportedChains.cosmos = [cosmos.osmosis, cosmos.injective, cosmos.router, cosmos.noble] as CosmsosChainType[];
  supportedChains.solana = [solana] as OtherChainData<'solana'>[];
  supportedChains.sui = [sui] as SuiChainType[];
  supportedChains.near = [near] as OtherChainData<'near'>[];
  supportedChains.bitcoin = [bitcoin] as OtherChainData<'bitcoin'>[];

  return supportedChains;
};

export default getDefaultSupportedChains;
