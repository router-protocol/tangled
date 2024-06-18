import { Adapter as SolanaAdapter } from '@solana/wallet-adapter-base';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { Adapter as TronAdapter } from '@tronweb3/tronwallet-abstract-adapter';
import { Mutable } from '@wagmi/core/internal';
import { Connector as EVMConnector, useConnectors as useEVMConnectors } from 'wagmi';
import { useTronStore } from './useTronStore.js';

type Wallets = {
  evm: Mutable<EVMConnector>[];
  solana: SolanaAdapter[];
  tron: TronAdapter[];
};

/**
 * A hook that returns the connectors for a given chain type.
 * If no type is provided, it returns all connectors.
 * @returns An array of supported connectors
 */
export const useWallets = (): Wallets => {
  const evmConnectors = useEVMConnectors();
  const { wallets: solanaWallets } = useSolanaWallet();
  const tronConnectors = useTronStore((state) => state.connectors);

  return {
    evm: evmConnectors as Mutable<EVMConnector>[],
    solana: solanaWallets.map((w) => w.adapter),
    tron: Object.values(tronConnectors).map((c) => c.adapter),
  };
};
