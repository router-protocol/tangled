import {
  Account,
  ModuleState,
  Wallet,
  WalletSelector,
  WalletSelectorState,
  setupWalletSelector,
} from '@near-wallet-selector/core';
import { setupEthereumWallets } from '@near-wallet-selector/ethereum-wallets';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupNearMobileWallet } from '@near-wallet-selector/near-mobile-wallet';
import { setupWalletConnect } from '@near-wallet-selector/wallet-connect';
import { useMutation } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi';
import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { useStore } from 'zustand';
import { createNearConfig } from '../connectors/near/connector.js';
import { useTangledConfig } from '../hooks/useTangledConfig.js';
import { NearStore, createNearStore } from '../store/Near.js';
import { ChainId } from '../types/index.js';

export interface NearContextValues {
  connect: ({
    adapterId,
    contractId,
  }: {
    adapterId: string;
    contractId: string | undefined;
  }) => Promise<{ account: string | null; chainId: ChainId | undefined }>;
  disconnect: () => Promise<void>;
  store: NearStore | null;

  wallets: ModuleState[];
  nearSelector: WalletSelector;
}

export const NearContext = createContext<NearContextValues>({
  connect: async () => ({ account: '', chainId: undefined }),
  disconnect: async () => {},
  store: null,

  wallets: [],
  nearSelector: {},
});

/**
 * @notice This provider is used to connect to the Near network.
 * @param adapters - Supported adapters for the Near network.
 * @returns The Near provider context with the connect and disconnect functions.
 */
export const NearProvider = ({ children }: { children: React.ReactNode }) => {
  const nearStore = useRef(createNearStore()).current;
  const connectedAdapter = useStore(nearStore, (state) => state.connectedAdapter);
  const setConnectedAdapter = useStore(nearStore, (state) => state.setConnectedAdapter);
  const setConnectors = useStore(nearStore, (state) => state.setConnectors);
  const setAddress = useStore(nearStore, (state) => state.setAddress);

  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [wallets, setWallets] = useState<ModuleState[]>([]);

  const { config } = useTangledConfig();

  const [nearContractId, setNearContractId] = useLocalStorage<string | null>('recent-used-near-contractid', null);
  const [selectedWalletId] = useLocalStorage<string | null>('near-wallet-selector:selectedWalletId', null);

  const nearWagmiConfig = createNearConfig(config.nearNetwork, config.projectId, config.projectName);

  const web3Modal = createWeb3Modal({
    wagmiConfig: nearWagmiConfig,
    projectId: config.projectId,
    enableOnramp: false,
    allWallets: 'SHOW',
  });

  const getWalletsWithSignMethods = async (state: WalletSelectorState) => {
    return await Promise.all(
      state.modules.map(async (wallet: ModuleState<Wallet>) => {
        if (wallet.metadata.available) {
          return await wallet.wallet();
        } else {
          return wallet;
        }
      }),
    );
  };

  // Initializing the near wallet selector
  const init = useCallback(async () => {
    const _selector: WalletSelector = await setupWalletSelector({
      network: config.nearNetwork,
      modules: [
        setupMyNearWallet(),
        setupNearMobileWallet(),
        setupWalletConnect({
          projectId: config.projectId,
          metadata: {
            name: config.projectName,
            description: '',
            url: '',
            icons: [''],
          },
        }),
        setupEthereumWallets({ wagmiConfig: nearWagmiConfig, web3Modal }),
      ],
    });

    setSelector(_selector);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    init().catch((err) => {
      console.error(err);
      throw new Error('Failed to initialize NEAR wallet selector');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subscription for setting available near wallets
  useEffect(() => {
    if (!selector) return;

    const subscription = selector.store.observable.subscribe(async (state: WalletSelectorState) => {
      const nearWallets = await getWalletsWithSignMethods(state);
      setWallets(nearWallets);
    });

    return () => subscription.unsubscribe();
  }, [selector]);

  // Subscription for accounts
  useEffect(() => {
    if (!selector) {
      return;
    }

    const updateAccounts = () => {
      const state = selector.store.getState();
      if (!state.accounts[0]) return;

      setAddress(state.accounts[0].accountId);
    };

    // Subscribe to changes in the store
    const subscription = selector.store.observable.subscribe(updateAccounts);

    return () => subscription.unsubscribe();
  }, [selector, setAddress]);

  /////////////////
  /// Mutations ///
  /////////////////
  const { mutateAsync: connect } = useMutation({
    mutationKey: ['near connect'],
    mutationFn: async ({ adapterId, contractId }: { adapterId: string; contractId: string | undefined }) => {
      const adapter = wallets.find((wallet) => wallet.id === adapterId);
      if (!adapter) {
        throw new Error('Near adapter not found');
      }
      if (!contractId) {
        throw new Error('Near contractId not found');
      }
      setNearContractId(contractId);

      const signInParams = {
        contractId,
        accounts: [],
        successUrl:
          adapter.type === 'browser'
            ? adapter.metadata.successUrl || `${window.location.origin}/wallets/mynearwallet`
            : undefined,
        failureUrl: adapter.type === 'browser' ? adapter.metadata.failureUrl : undefined,
      };

      const accounts: Account[] = await adapter.signIn(signInParams);

      return {
        account: accounts[0].accountId,
        chainId: undefined,
        adapter,
      };
    },
    onSuccess: (data) => {
      setAddress(data.account);
      setConnectors(data.adapter);
      setConnectedAdapter(data.adapter);
    },
  });

  const { mutateAsync: disconnect } = useMutation({
    mutationKey: ['near disconnect'],
    mutationFn: async () => {
      if (!connectedAdapter) return;
      await connectedAdapter.signOut();

      setAddress('');
      setConnectors(connectedAdapter);
      setConnectedAdapter(undefined);
    },
  });

  // Autoconnect to recent wallet
  useEffect(() => {
    (async function autoConnect() {
      if (nearContractId && wallets.length) {
        if (selectedWalletId) {
          try {
            await connect({
              adapterId: selectedWalletId,
              contractId: nearContractId,
            });
          } catch (error) {
            console.error('Connection error:', error);
          }
        }
      }
    })();
  }, [connect, wallets.length, nearContractId, selectedWalletId]);

  return (
    <NearContext.Provider
      value={{
        store: nearStore,
        connect,
        disconnect,
        wallets,
        nearSelector: selector!,
      }}
    >
      {children}
    </NearContext.Provider>
  );
};
