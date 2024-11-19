import { bitcoin } from '../chains/bitcoin.js';
import * as cosmos from '../chains/cosmos.js';
import * as evm from '../chains/evm.js';
import { near } from '../chains/near.js';
import { solana } from '../chains/solana.js';
import { sui } from '../chains/sui.js';
import { SupportedChainsByType } from '../types/index.js';

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
  ];
  supportedChains.cosmos = [cosmos.osmosis, cosmos.injective, cosmos.noble];
  supportedChains.solana = [solana];
  supportedChains.sui = [sui];
  supportedChains.near = [near];
  supportedChains.bitcoin = [bitcoin];

  return supportedChains;
};

export default getDefaultSupportedChains;
