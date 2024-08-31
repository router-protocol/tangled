// import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useWallet as useSolanaWallet } from '@tangled3/solana-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useEffect, useMemo, useState } from 'react';
import { Connector, useConnectors as useEVMConnectors } from 'wagmi';
import { walletConfigs } from '../connectors/evm/walletConfigs.js';
import { ChainType } from '../types/index.js';
import { Wallet } from '../types/wallet.js';
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

  const [tonConnectUI] = useTonConnectUI();
  const [tonWalletsList, setTonWalletsList] = useState<Wallet<'ton'>[]>([]);

  const extendedEvmWallets = useMemo<Wallet<'evm'>[]>(() => {
    const prepareWallets = (connector: Connector) => {
      const walletId = Object.keys(walletConfigs).find(
        (id) =>
          id // where id is comma seperated list
            .split(',')
            .map((i) => i.trim())
            .indexOf(connector.id) !== -1,
      );

      const c: Wallet<'evm'> = {
        id: connector.id,
        name: connector.name ?? connector.id ?? connector.type,
        icon: connector.icon ?? '',
        connector,
        installed: connector.type === 'injected' && connector.id !== 'metaMask',
        type: 'evm',
      };

      if (walletId) {
        const wallet = walletConfigs[walletId];

        return {
          ...c,
          ...wallet,
          installed: typeof wallet.isInstalled === 'function' ? wallet.isInstalled() : wallet.isInstalled,
        };
      }

      return c;
    };

    const wallets: Wallet<'evm'>[] = evmConnectors.map((c) => prepareWallets(c));

    if (options?.onlyInstalled) {
      return wallets.filter((wallet) => wallet.installed);
    }

    return wallets;
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

  const extendedAlephWallets = useMemo<Wallet<'alephZero'>[]>(() => {
    const walletList = alephAdapter?.walletsList;

    const registryWallets: Wallet<'alephZero'>[] =
      alephAdapter?.walletsFromRegistry.map((wallet) => ({
        id: wallet.slug.toLowerCase(),
        name: wallet.name,
        connector: alephAdapter,
        icon: wallet.image.default,
        type: 'alephZero',
        installed: walletList?.find((w) => w.slug == wallet.slug)?.detected,
        url: wallet.homepage,
      })) ?? [];

    if (options?.onlyInstalled) {
      return registryWallets.filter((wallet) => wallet.installed);
    }

    return registryWallets;
  }, [alephAdapter, options?.onlyInstalled]);

  useEffect(() => {
    if (tonConnectUI) {
      tonConnectUI
        .getWallets()
        .then((wallets) => {
          const extendedWallets: Wallet<'ton'>[] = wallets.map((wallet) => ({
            id: wallet.appName,
            name: wallet.name,
            connector: tonConnectUI,
            icon: wallet.imageUrl,
            type: 'ton',
            installed: wallets.map((wallet) => wallet.name).includes('Tonkeeper'), // TON TODO: fix this hardcoded value
            url: wallet.aboutUrl,
          }));
          setTonWalletsList(extendedWallets);
        })
        .catch((error) => {
          console.error('Error fetching ton wallets:', error);
        });
    }
  }, [tonConnectUI]);

  const extendedTonWallets = useMemo(() => tonWalletsList, [tonWalletsList]);

  return useMemo(
    () => ({
      evm: extendedEvmWallets,
      solana: extendedSolanaWallets,
      tron: extendedTronWallets,
      alephZero: extendedAlephWallets,
      ton: extendedTonWallets,
      bitcoin: [],
      casper: [],
      cosmos: [],
      near: [],
      sui: [],
    }),
    [extendedEvmWallets, extendedSolanaWallets, extendedTronWallets, extendedAlephWallets, extendedTonWallets],
  );
};
