import {
  Account,
  ModuleState,
  Wallet,
  WalletSelector,
  WalletSelectorState,
  setupWalletSelector,
} from '@near-wallet-selector/core';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupNightly } from '@near-wallet-selector/nightly';
import { setupWalletConnect } from '@near-wallet-selector/wallet-connect';
import { useMutation } from '@tanstack/react-query';
import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from 'zustand';
import { NearStore, createNearStore } from '../store/Near.js';
import { ChainId } from '../types/index.js';

export interface NearContextValues {
  connect: (adapterId: string) => Promise<{ account: string | null; chainId: ChainId | undefined }>;
  disconnect: () => Promise<void>;
  store: NearStore | null;

  wallets: ModuleState[];
}

export const NearContext = createContext<NearContextValues>({
  connect: async () => ({ account: '', chainId: undefined }),
  disconnect: async () => {},
  store: null,

  wallets: [],
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
  // const address = useStore(nearStore, (state) => state.address);
  const setAddress = useStore(nearStore, (state) => state.setAddress);

  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [wallets, setWallets] = useState<ModuleState[]>([]);

  const ContractId = {
    testnet: 'routetoken.i-swap.testnet',
    mainnet: 'usdt.tether-token.near',
  };

  const getWalletsWithSignMethods = async (state: WalletSelectorState) => {
    return await Promise.all(
      state.modules.map(async (wallet: ModuleState<Wallet>) => {
        return await wallet.wallet();
      }),
    );
  };

  // Initializing the near wallet selector
  const init = useCallback(async () => {
    const _selector: WalletSelector = await setupWalletSelector({
      network: 'testnet',
      modules: [
        setupMyNearWallet(),
        setupNightly(),
        setupWalletConnect({
          projectId: '41980758771052df3f01be0a46f172a5',
          metadata: {
            name: 'Tangled Next Example',
            description: 'Example dapp for multiple wallets integration',
            url: '',
            icons: [''],
          },
        }),
      ],
    });

    setSelector(_selector);
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
      console.log('nearwallets - ', nearWallets);
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

      console.log('state.accounts - ', state.accounts);
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
    mutationFn: async (adapterId: string) => {
      const adapter = wallets.find((wallet) => wallet.id === adapterId);
      if (!adapter) {
        throw new Error('Near adapter not found');
      }
      let accounts: Account[];

      if (adapter.type === 'bridge') {
        accounts = await adapter.signIn({
          contractId: ContractId.testnet,
          accounts: [],
        });
        return { account: accounts[0].accountId, chainId: undefined, adapter };
      }

      if (adapter.type === 'browser') {
        accounts = await adapter.signIn({
          contractId: ContractId.testnet,
          accounts: [],
          successUrl: adapter.metadata.successUrl,
          failureUrl: adapter.metadata.failureUrl,
        });
        return { account: accounts[0].accountId, chainId: undefined, adapter };
      }

      accounts = await adapter.signIn({
        contractId: ContractId.testnet,
        accounts: [],
      });
      return { account: accounts[0].accountId, chainId: undefined, adapter };
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
      if (wallets.length) {
        const selectedWalletId = localStorage.getItem('near-wallet-selector:selectedWalletId');
        const parsedSelectedWalletId: string | null = selectedWalletId ? JSON.parse(selectedWalletId) : null;
        console.log('recentWallets from localstorage - ', parsedSelectedWalletId);

        if (parsedSelectedWalletId) await connect(parsedSelectedWalletId);
      }
    })();
  }, [connectedAdapter, connect, wallets.length]);

  return (
    <NearContext.Provider
      value={{
        store: nearStore,
        connect,
        disconnect,
        wallets,
      }}
    >
      {children}
    </NearContext.Provider>
  );
};