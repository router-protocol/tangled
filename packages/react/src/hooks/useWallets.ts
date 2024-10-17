import { State as CosmosWalletState } from '@cosmos-kit/core';
import { useWallets as useSuiWallets } from '@mysten/dapp-kit';
import { useWallet as useSolanaWallet } from '@tangled3/solana-react';
import { useContext, useMemo } from 'react';
import { Connector, useConnectors as useEVMConnectors } from 'wagmi';
import { getBitcoinProvider, isXdefiWalletInstalled } from '../connectors/bitcoin/connectors.js';
import { walletConfigs } from '../connectors/evm/walletConfigs.js';
import { TonContext } from '../providers/TonProvider.js';
import { ChainType } from '../types/index.js';
import { Wallet } from '../types/wallet.js';
import { useAlephStore } from './useAlephStore.js';
import { useBitcoinStore } from './useBitcoinStore.js';
import { useCosmosStore } from './useCosmosStore.js';
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

  // const data = useManager;

  const suiWallets = useSuiWallets();

  const configuredConnectors = useTangledConfig((config) => config.connectors);

  const tronConnectors = useTronStore((state) => state.connectors);

  const { wallets: tonWallets, tonAdapter } = useContext(TonContext);

  const cosmosWallets = useCosmosStore((state) => state.wallets);

  const bitcoinConnectors = useBitcoinStore((state) => state.connectors);

  const extendedEvmWallets = useMemo<Wallet<'evm'>[]>(() => {
    const prepareWallets = (connector: Connector): Wallet<'evm'> | undefined => {
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
        if (wallet.hide) return undefined;

        return {
          ...c,
          ...wallet,
          installed: typeof wallet.isInstalled === 'function' ? wallet.isInstalled() : wallet.isInstalled,
        };
      }

      return c;
    };

    const wallets = evmConnectors.map((c) => prepareWallets(c)).filter((w) => w !== undefined) as Wallet<'evm'>[];

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

  //sui
  const extendedSuiWallets = useMemo<Wallet<'sui'>[]>(() => {
    const detected: Wallet<'sui'>[] =
      suiWallets.map((wallet) => ({
        id: wallet.name,
        name: wallet.name,
        connector: wallet,
        icon: wallet.icon.toString(),
        type: 'sui',
        installed: true,
        url: '',
      })) ?? [];

    if (options?.onlyInstalled) {
      return detected;
    }

    const suggested =
      configuredConnectors.sui?.filter(
        (connector) => detected.find((wallet) => wallet.name === connector.name) === undefined,
      ) ?? [];

    return detected.concat(suggested);
  }, [configuredConnectors.sui, options?.onlyInstalled, suiWallets]);

  //ton
  const extendedTonWallets = useMemo<Wallet<'ton'>[]>(() => {
    const detected: Wallet<'ton'>[] = tonWallets.map((wallet) => ({
      id: wallet.appName,
      name: wallet.name,
      connector: tonAdapter,
      icon: wallet.imageUrl,
      type: 'ton',
      // @ts-expect-error - `injected` doesn't exist on WalletInfo type
      installed: wallet.injected,
      url: wallet.aboutUrl,
    }));

    // for ton connect modal option
    const tonConnectOption: Wallet<'ton'> = {
      id: 'ton-connect',
      name: 'Ton Connect',
      connector: tonAdapter,
      icon: 'https://cryptologos.cc/logos/toncoin-ton-logo.png?v=035',
      type: 'ton',
      installed: true,
    };

    const walletList = [tonConnectOption, ...detected];

    if (options?.onlyInstalled) {
      return walletList.filter((wallet) => wallet.installed);
    }

    return walletList;
  }, [tonWallets, tonAdapter, options]);

  //cosmos
  const extendedCosmosWallets = useMemo<Wallet<'cosmos'>[]>(() => {
    if (!cosmosWallets.length) return [] as Wallet<'cosmos'>[];

    const detected: Wallet<'cosmos'>[] = cosmosWallets.map((wallet) => {
      return {
        id: wallet.walletInfo.name,
        name: wallet.walletInfo.prettyName,
        url: wallet.walletInfo.downloads?.[0].link,
        connector: wallet,
        icon: typeof wallet.walletInfo.logo === 'string' ? wallet.walletInfo.logo : wallet.walletInfo.logo?.major ?? '',
        type: 'cosmos',
        installed:
          (wallet.clientMutable.state === CosmosWalletState.Done ||
            wallet.clientMutable.state === CosmosWalletState.Init) &&
          wallet.clientMutable.data !== undefined,
      };
    });

    const walletList = detected;

    if (options?.onlyInstalled) {
      return walletList.filter((wallet) => wallet.installed);
    }

    return walletList;
  }, [cosmosWallets, options?.onlyInstalled]);

  // bitcoin
  const extendedBitcoinWallets = useMemo<Wallet<'bitcoin'>[]>(() => {
    const detected: Wallet<'bitcoin'>[] = Object.values(bitcoinConnectors).map((connector) => ({
      id: connector.adapter.id,
      name: connector.adapter.name,
      connector: getBitcoinProvider(),
      icon: connector.adapter.icon,
      type: 'bitcoin',
      installed: isXdefiWalletInstalled(),
      url: connector.adapter.url,
    }));

    if (options?.onlyInstalled) {
      return detected.filter((wallet) => wallet.installed);
    }

    return detected;
  }, [bitcoinConnectors, options?.onlyInstalled]);

  return useMemo(
    () => ({
      evm: extendedEvmWallets,
      solana: extendedSolanaWallets,
      tron: extendedTronWallets,
      alephZero: extendedAlephWallets,
      ton: extendedTonWallets,
      bitcoin: extendedBitcoinWallets,
      casper: [],
      cosmos: extendedCosmosWallets,
      near: [],
      sui: extendedSuiWallets,
    }),
    [
      extendedEvmWallets,
      extendedSolanaWallets,
      extendedTronWallets,
      extendedAlephWallets,
      extendedSuiWallets,
      extendedTonWallets,
      extendedCosmosWallets,
      extendedBitcoinWallets,
    ],
  );
};
