// import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useWallets as useSuiWallets } from '@mysten/dapp-kit';
import { useWallet as useSolanaWallet } from '@tangled3/solana-react';
import { useMemo } from 'react';
import { useConnectors as useEVMConnectors } from 'wagmi';
import { ChainType } from '../types/index.js';
import { Wallet } from '../types/wallet.js';
import { isEVMWalletInstalled } from '../utils/isEVMWalletInstalled.js';
import { useAlephStore } from './useAlephStore.js';
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

  const alephAdapter = useAlephStore((state) => state.connectedAdapter);

  const suiWallets = useSuiWallets();

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
      url: undefined,
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
        url: wallet.adapter.url,
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
      url: connector.adapter.url,
    }));
  }, [tronConnectors]);

  const extendedAlephWallets = useMemo<Wallet<'aleph_zero'>[]>(() => {
    const walletList = alephAdapter?.walletsList;

    const detected: Wallet<'aleph_zero'>[] =
      alephAdapter?.walletsFromRegistry.map((wallet) => ({
        id: wallet.slug.toLowerCase(),
        name: wallet.name,
        connector: alephAdapter,
        icon: wallet.image.default,
        type: 'aleph_zero',
        installed: walletList?.find((w) => w.slug == wallet.slug)?.detected,
        url: wallet.homepage,
      })) ?? [];

    return detected;
  }, [alephAdapter]);

  //sui
  const extendedSuiWallets = useMemo<Wallet<'sui'>[]>(() => {
    console.log('sui wallet list - ', suiWallets);

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

    return detected;
  }, [suiWallets]);

  return {
    evm: extendedEvmWallets,
    solana: extendedSolanaWallets,
    tron: extendedTronWallets,
    aleph_zero: extendedAlephWallets,
    bitcoin: [],
    casper: [],
    cosmos: [],
    near: [],
    sui: extendedSuiWallets,
  };
};
