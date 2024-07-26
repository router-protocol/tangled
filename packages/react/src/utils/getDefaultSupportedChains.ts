import { alephZero } from '../chains/aleph_zero.js';
import * as evm from '../chains/evm.js';
import { solana } from '../chains/solana.js';
import { tronMainnet } from '../chains/tron.js';
import { ChainData, SupportedChainsByType } from '../types/index.js';

const getDefaultSupportedChains = (testnet?: boolean): SupportedChainsByType => {
  const supportedChains: SupportedChainsByType = {
    aleph_zero: [],
    bitcoin: [],
    casper: [],
    cosmos: [],
    evm: [],
    near: [],
    solana: [],
    sui: [],
    tron: [],
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
    ] as ChainData<'evm'>[];
    supportedChains.solana = [solana] as ChainData<'solana'>[];
    supportedChains.tron = [tronMainnet] as ChainData<'tron'>[];
    supportedChains.aleph_zero = [alephZero] as ChainData<'aleph_zero'>[];
  }

  return supportedChains;
};

export default getDefaultSupportedChains;
