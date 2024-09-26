import { alephZero } from '../chains/alephZero.js';
import * as evm from '../chains/evm.js';
import { near } from '../chains/near.js';
import { solana } from '../chains/solana.js';
import { sui } from '../chains/sui.js';
import { tonMainnet } from '../chains/ton.js';
import { tronMainnet } from '../chains/tron.js';
import { EVMChain, OtherChainData, SuiChainType, SupportedChainsByType, TronChain } from '../types/index.js';

const getDefaultSupportedChains = (testnet?: boolean): SupportedChainsByType => {
  const supportedChains: SupportedChainsByType = {
    alephZero: [],
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
    supportedChains.solana = [solana] as OtherChainData<'solana'>[];
    supportedChains.tron = [tronMainnet] as TronChain[];
    supportedChains.alephZero = [alephZero] as OtherChainData<'alephZero'>[];
    supportedChains.sui = [sui] as SuiChainType[];
    supportedChains.ton = [tonMainnet] as OtherChainData<'ton'>[];
    supportedChains.near = [near] as OtherChainData<'near'>[];
  }

  return supportedChains;
};

export default getDefaultSupportedChains;
