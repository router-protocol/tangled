// import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useWallet as useSolanaWallet } from '@tangled/solana-react';
import { useMemo } from 'react';
import { useConnectors as useEVMConnectors } from 'wagmi';
import { ChainType } from '../types/index.js';
import { Wallet } from '../types/wallet.js';
import { isEVMWalletInstalled } from '../utils/isEVMWalletInstalled.js';
import { useTangledConfig } from './useTangledConfig.js';
import { useTronStore } from './useTronStore.js';

/**
 * A hook that returns the connectors for a given chain type.
 * If no type is provided, it returns all connectors.
 * @returns An array of supported connectors
 */
export const useWallets = (): { [key in ChainType]: Wallet<key>[] } => {
  const evmConnectors = useEVMConnectors();

  const { wallets: solanaWallets } = useSolanaWallet();

  const { connectors: configuredConnectors } = useTangledConfig();

  const tronConnectors = useTronStore((state) => state.connectors);

  const extendedEvmWallets = useMemo<Wallet<'evm'>[]>(() => {
    return evmConnectors.map((connector) => ({
      id: connector.id,
      name: connector.name,
      connector: connector,
      icon: connector.icon ?? '',
      type: 'evm',
      installed: isEVMWalletInstalled(connector.id),
      downloadUrl: undefined,
    }));
  }, [evmConnectors]);

  const extendedSolanaWallets = useMemo<Wallet<'solana'>[]>(() => {
    const detected: Wallet<'solana'>[] = solanaWallets
      .filter((wallet) => wallet.readyState !== 'NotDetected' && wallet.readyState !== 'Unsupported')
      .map((wallet) => ({
        id: wallet.adapter.name,
        name: wallet.adapter.name,
        connector: wallet.adapter,
        icon: wallet.adapter.icon,
        type: 'solana',
        installed: wallet.readyState !== 'NotDetected' && wallet.readyState !== 'Unsupported',
        downloadUrl: wallet.adapter.url,
      }));

    const suggested =
      configuredConnectors.solana?.filter(
        (connector) => detected.find((wallet) => wallet.name === connector.name) === undefined,
      ) ?? [];

    return detected.concat(suggested);
  }, [configuredConnectors.solana, solanaWallets]);

  const extendedTronWallets = useMemo<Wallet<'tron'>[]>(() => {
    return Object.values(tronConnectors).map((connector) => ({
      id: connector.adapter.name,
      name: connector.adapter.name,
      connector: connector.adapter,
      icon: connector.adapter.icon,
      type: 'tron',
      installed: connector.adapter.readyState !== 'NotFound' && connector.adapter.readyState !== 'Loading',
      downloadUrl: connector.adapter.url,
    }));
  }, [tronConnectors]);

  return {
    evm: extendedEvmWallets,
    solana: extendedSolanaWallets,
    tron: extendedTronWallets,
    aleph_zero: [],
    bitcoin: [],
    casper: [],
    cosmos: [],
    near: [],
    sui: [],
  };
};
