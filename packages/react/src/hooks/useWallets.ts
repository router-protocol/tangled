// import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useWallet as useSolanaWallet } from '@tangled3/solana-react';
import { useMemo } from 'react';
import { useConnectors as useEVMConnectors } from 'wagmi';
import { ChainType } from '../types/index.js';
import { Wallet } from '../types/wallet.js';
import { isEVMWalletInstalled } from '../utils/isEVMWalletInstalled.js';
import { useAlephStore } from './useAlephStore.js';
import { useTangledConfig } from './useTangledConfig.js';
import { useTronStore } from './useTronStore.js';

type UseWalletsOptions = {
  onlyInstalled?: boolean;
};

/**
 * A hook that returns the connectors for a given chain type.
 * If no type is provided, it returns all connectors.
 * @param options {@link UseWalletsOptions}
 * @returns An array of supported connectors
 */
export const useWallets = (options?: UseWalletsOptions): { [key in ChainType]: Wallet<key>[] } => {
  const evmConnectors = useEVMConnectors();

  const { wallets: solanaWallets } = useSolanaWallet();

  const alephAdapter = useAlephStore((state) => state.connectedAdapter);

  const { connectors: configuredConnectors } = useTangledConfig();

  const tronConnectors = useTronStore((state) => state.connectors);

  const extendedEvmWallets = useMemo<Wallet<'evm'>[]>(() => {
    if (options?.onlyInstalled) {
      return evmConnectors
        .filter((connector) => isEVMWalletInstalled(connector.id))
        .map((connector) => ({
          id: connector.id,
          name: connector.name,
          connector: connector,
          icon: connector.icon ?? '',
          type: 'evm',
          installed: true,
          url: undefined,
        }));
    }

    return evmConnectors.map((connector) => ({
      id: connector.id,
      name: connector.name,
      connector: connector,
      icon: connector.icon ?? '',
      type: 'evm',
      installed: isEVMWalletInstalled(connector.id),
      url: undefined,
    }));
  }, [evmConnectors, options?.onlyInstalled]);

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
        url: wallet.adapter.url,
      }));

    if (options?.onlyInstalled) {
      return detected;
    }

    const suggested =
      configuredConnectors.solana?.filter(
        (connector) => detected.find((wallet) => wallet.name === connector.name) === undefined,
      ) ?? [];

    return detected.concat(suggested);
  }, [configuredConnectors.solana, options?.onlyInstalled, solanaWallets]);

  const extendedTronWallets = useMemo<Wallet<'tron'>[]>(() => {
    const detected: Wallet<'tron'>[] = Object.values(tronConnectors).map((connector) => ({
      id: connector.adapter.name,
      name: connector.adapter.name,
      connector: connector.adapter,
      icon: connector.adapter.icon,
      type: 'tron',
      installed: connector.adapter.readyState !== 'NotFound' && connector.adapter.readyState !== 'Loading',
      url: connector.adapter.url,
    }));

    if (options?.onlyInstalled) {
      return detected.filter((wallet) => wallet.installed);
    }

    const suggested: Wallet<'tron'>[] =
      configuredConnectors.tron
        ?.filter((connector) => detected.find((wallet) => wallet.name === connector.name) === undefined)
        .map((connector) => ({
          id: connector.name,
          name: connector.name,
          connector: connector,
          icon: connector.icon,
          type: 'tron',
          installed: false,
          url: connector.url,
        })) ?? [];

    return detected.concat(suggested);
  }, [configuredConnectors.tron, options?.onlyInstalled, tronConnectors]);

  const extendedAlephWallets = useMemo<Wallet<'aleph_zero'>[]>(() => {
    const walletList = alephAdapter?.walletsList;

    const registryWallets: Wallet<'aleph_zero'>[] =
      alephAdapter?.walletsFromRegistry.map((wallet) => ({
        id: wallet.slug.toLowerCase(),
        name: wallet.name,
        connector: alephAdapter,
        icon: wallet.image.default,
        type: 'aleph_zero',
        installed: walletList?.find((w) => w.slug == wallet.slug)?.detected,
        url: wallet.homepage,
      })) ?? [];

    if (options?.onlyInstalled) {
      return registryWallets.filter((wallet) => wallet.installed);
    }

    return registryWallets;
  }, [alephAdapter, options?.onlyInstalled]);

  return {
    evm: extendedEvmWallets,
    solana: extendedSolanaWallets,
    tron: extendedTronWallets,
    aleph_zero: extendedAlephWallets,
    bitcoin: [],
    casper: [],
    cosmos: [],
    near: [],
    sui: [],
  };
};
