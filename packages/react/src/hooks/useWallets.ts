import { State as CosmosWalletState } from '@cosmos-kit/core';
import { useWallets as useSuiWallets } from '@mysten/dapp-kit';
import { useWallet as useSolanaWallet } from '@tangled3/solana-react';
import { useMemo } from 'react';
import { Connector, useConnectors as useEVMConnectors } from 'wagmi';
import { getBitcoinProvider, isCtrlWalletInstalled } from '../connectors/bitcoin/connectors.js';
import { walletConfigs } from '../connectors/evm/walletConfigs.js';
import { solanaConnectorsConfig } from '../connectors/solana/connectors.js';
import { suiConnectorsConfig } from '../connectors/sui/connectors.js';
import { ChainType } from '../types/index.js';
import { Wallet } from '../types/wallet.js';
import { useBitcoinStore } from './useBitcoinStore.js';
import { useCosmosStore } from './useCosmosStore.js';
import { useIsClient } from './useIsClient.js';
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

  const isClient = useIsClient();

  const { wallets: solanaWallets } = useSolanaWallet();

  // const data = useManager;

  const suiWallets = useSuiWallets();

  const configuredConnectors = useTangledConfig((config) => config.connectors);

  const tronConnectors = useTronStore((state) => state.connectors);

  const cosmosWallets = useCosmosStore((state) => state.wallets);

  const bitcoinConnectors = useBitcoinStore((state) => state.connectors);

  const extendedEvmWallets = useMemo<Wallet<'evm'>[]>(() => {
    if (!isClient) return [];
    const prepareWallets = (connector: Connector): Wallet<'evm'> | undefined => {
      const walletId = Object.keys(walletConfigs).find(
        (id) =>
          id // where id is comma seperated list
            .split(',')
            .map((i) => i.trim())
            .indexOf(connector.id) !== -1,
      );

      const walletConfig = walletId ? walletConfigs[walletId] : undefined;

      const isInjected = connector.type === 'injected' && connector.id !== 'metaMask';
      let isInstalled = isInjected;
      if (walletConfig?.isInstalled) {
        isInstalled =
          typeof walletConfig.isInstalled === 'function' ? walletConfig.isInstalled() : walletConfig.isInstalled;
      }

      const c: Wallet<'evm'> = {
        id: connector.id,
        name: walletConfig?.name || connector.name || connector.id || connector.type,
        icon: connector.icon ?? walletConfig?.icon ?? '',
        connector,
        installed: isInstalled,
        type: 'evm',
      };

      return c;
    };

    const wallets = evmConnectors.map((c) => prepareWallets(c)).filter((w) => w !== undefined) as Wallet<'evm'>[];

    // ✅ Add MatchID Wallets manually
    wallets.push(
      {
        id: 'Google',
        name: 'Google',
        icon: 'https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png', // Replace with actual icon
        connector: evmConnectors[0], //temporary
        installed: true,
        type: 'evm',
        getWalletConnectDeeplink: () => 'https://matchid-login-url.com', // Replace with actual deeplink if needed
      },
      {
        id: 'Twitter',
        name: 'Twitter',
        icon: 'https://freepnglogo.com/images/all_img/1725374683twitter-x-logo.png', // Replace with actual icon
        connector: evmConnectors[0], //temporary
        installed: true,
        type: 'evm',
        getWalletConnectDeeplink: () => 'https://matchid-login-url.com', // Replace with actual deeplink if needed
      },
      {
        id: 'Telegram',
        name: 'Telegram',
        icon: 'https://i.pinimg.com/474x/9f/f9/9c/9ff99cea674681327ba53e7721246f5b.jpg', // Replace with actual icon
        connector: evmConnectors[0], //temporary
        installed: true,
        type: 'evm',
        getWalletConnectDeeplink: () => 'https://matchid-login-url.com', // Replace with actual deeplink if needed
      },
      {
        id: 'Discord',
        name: 'Discord',
        icon: 'https://static.vecteezy.com/system/resources/previews/023/741/066/non_2x/discord-logo-icon-social-media-icon-free-png.png', // Replace with actual icon
        connector: evmConnectors[0], //temporary
        installed: true,
        type: 'evm',
        getWalletConnectDeeplink: () => 'https://matchid-login-url.com', // Replace with actual deeplink if needed
      },
      {
        id: 'Github',
        name: 'Github',
        icon: 'https://static.vecteezy.com/system/resources/previews/053/066/802/non_2x/free-logo-github-free-png.png', // Replace with actual icon
        connector: evmConnectors[0], //temporary
        installed: true,
        type: 'evm',
        getWalletConnectDeeplink: () => 'https://matchid-login-url.com', // Replace with actual deeplink if needed
      },
      {
        id: 'Linkedin',
        name: 'Linkedin',
        icon: 'https://pngimg.com/d/linkedIn_PNG32.png', // Replace with actual icon
        connector: evmConnectors[0], //temporary
        installed: true,
        type: 'evm',
        getWalletConnectDeeplink: () => 'https://matchid-login-url.com', // Replace with actual deeplink if needed
      },
    );

    if (options?.onlyInstalled) {
      return wallets.filter((wallet) => wallet.installed);
    }

    return wallets;
  }, [evmConnectors, isClient, options?.onlyInstalled]);

  const extendedSolanaWallets = useMemo<Wallet<'solana'>[]>(() => {
    if (!isClient) return [];

    const detected: Wallet<'solana'>[] = solanaWallets
      .filter((wallet) => wallet.readyState !== 'NotDetected' && wallet.readyState !== 'Unsupported')
      .map((wallet) => {
        const config = solanaConnectorsConfig[wallet.adapter.name];
        return {
          id: wallet.adapter.name,
          name: config?.name || wallet.adapter.name,
          connector: wallet.adapter,
          icon: config?.icon || wallet.adapter.icon,
          type: 'solana',
          installed: wallet.readyState !== 'NotDetected' && wallet.readyState !== 'Unsupported',
          url: config?.url || wallet.adapter.url,
        };
      });

    if (options?.onlyInstalled) {
      return detected;
    }

    const suggested =
      configuredConnectors.solana?.filter(
        (connector) => detected.find((wallet) => wallet.name === connector.name) === undefined,
      ) ?? [];

    return detected.concat(suggested);
  }, [configuredConnectors.solana, isClient, options?.onlyInstalled, solanaWallets]);

  const extendedTronWallets = useMemo<Wallet<'tron'>[]>(() => {
    if (!isClient) return [];

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
  }, [configuredConnectors.tron, isClient, options?.onlyInstalled, tronConnectors]);

  //sui
  const extendedSuiWallets = useMemo<Wallet<'sui'>[]>(() => {
    if (!isClient) return [];

    const detected: Wallet<'sui'>[] =
      suiWallets.map((wallet) => {
        const config = suiConnectorsConfig[wallet.name];
        return {
          id: wallet.name,
          name: config?.name || wallet.name,
          icon: config?.icon || wallet.icon.toString(),
          type: 'sui',
          connector: wallet,
          installed: true,
          url: config?.url || '',
        };
      }) ?? [];

    if (options?.onlyInstalled) {
      return detected;
    }

    const suggested =
      configuredConnectors.sui?.filter(
        (connector) => detected.find((wallet) => wallet.name === connector.name) === undefined,
      ) ?? [];

    return detected.concat(suggested);
  }, [configuredConnectors.sui, isClient, options?.onlyInstalled, suiWallets]);

  //cosmos
  const extendedCosmosWallets = useMemo<Wallet<'cosmos'>[]>(() => {
    if (!isClient) return [];

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
  }, [cosmosWallets, isClient, options?.onlyInstalled]);

  // bitcoin
  const extendedBitcoinWallets = useMemo<Wallet<'bitcoin'>[]>(() => {
    if (!isClient) return [];
    const detected: Wallet<'bitcoin'>[] = Object.values(bitcoinConnectors).map((connector) => ({
      id: connector.adapter.id,
      name: connector.adapter.name,
      connector: getBitcoinProvider(),
      icon: connector.adapter.icon,
      type: 'bitcoin',
      installed: isCtrlWalletInstalled(),
      url: connector.adapter.url,
    }));

    if (options?.onlyInstalled) {
      return detected.filter((wallet) => wallet.installed);
    }

    return detected;
  }, [bitcoinConnectors, isClient, options?.onlyInstalled]);

  return useMemo(
    () => ({
      evm: extendedEvmWallets,
      solana: extendedSolanaWallets,
      tron: extendedTronWallets,
      ton: [],
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
      extendedSuiWallets,
      extendedCosmosWallets,
      extendedBitcoinWallets,
    ],
  );
};
