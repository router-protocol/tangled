import { Adapter as TronAdapter } from '@tronweb3/tronwallet-abstract-adapter';
import { CreateConnectorFn } from 'wagmi';
import * as evmConnectors from '../connectors/evm/connectors.js';
import * as solConnectors from '../connectors/solana/connectors.js';
import * as suiConnectors from '../connectors/sui/connectors.js';
import * as tronConnectors from '../connectors/tron/connectors.js';
import { CHAIN_TYPES } from '../types/index.js';
import { Wallet } from '../types/wallet.js';

// export type ChainConnectors = { [key in ChainType]: any };
export type ChainConnectors = {
  evm: CreateConnectorFn[];
  tron: TronAdapter[];
  solana: Wallet<'solana'>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  near: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cosmos: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sui: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  casper: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aleph_zero: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bitcoin: any[];
};

export const createChainConnectors = (overrides: Partial<ChainConnectors>): ChainConnectors => {
  const connectors: ChainConnectors = CHAIN_TYPES.reduce((acc, type) => {
    acc[type] = [];
    return acc;
  }, {} as ChainConnectors);

  connectors.evm = [...(overrides.evm ?? []), ...defaultEvmConnectors];

  connectors.tron = [...(overrides.tron ?? []), tronConnectors.tronLinkAdapter];

  connectors.solana = [
    ...(overrides.solana ?? []),
    solConnectors.phantom,
    solConnectors.solflare,
    solConnectors.backpack,
  ];

  connectors.sui = [
    ...(overrides.sui ?? []),
    suiConnectors.suiWallet,
    suiConnectors.martianSuiWallet,
    suiConnectors.suiet,
    suiConnectors.nightly,
  ];

  return connectors;
};

const defaultEvmConnectors = [evmConnectors.binance, evmConnectors.trust, evmConnectors.brave, evmConnectors.frame];
