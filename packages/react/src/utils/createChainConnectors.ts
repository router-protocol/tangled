import { Adapter as TronAdapter } from '@tronweb3/tronwallet-abstract-adapter';
import { CreateConnectorFn } from 'wagmi';
import * as evmConnectors from '../connectors/evm/connectors.js';
import * as solConnectors from '../connectors/solana/connectors.js';
import * as tronConnectors from '../connectors/tron/connectors.js';
import { CHAIN_TYPES } from '../types/index.js';
import { Wallet } from '../types/wallet.js';

// export type ChainConnectors = { [key in ChainType]: any };
export type ChainConnectors = {
  evm: CreateConnectorFn[];
  tron: TronAdapter[];
  solana: Wallet<'solana'>[];
  near: any[];
  cosmos: any[];
  sui: any[];
  casper: any[];
  aleph_zero: any[];
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

  return connectors;
};

const defaultEvmConnectors = [evmConnectors.binance, evmConnectors.trust, evmConnectors.brave, evmConnectors.frame];
