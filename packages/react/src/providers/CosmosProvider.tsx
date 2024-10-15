import { ChainWalletBase, Data, Logger, MainWalletBase, State, WalletManager, WalletRepo } from '@cosmos-kit/core';
import { wallets as keplr } from '@cosmos-kit/keplr';
import { wallets as leap } from '@cosmos-kit/leap';
import { wallets as xdefi } from '@cosmos-kit/xdefi';
import { useMutation } from '@tanstack/react-query';
import { createContext, useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from 'zustand';
import { CosmosStore, createCosmosStore } from '../store/Cosmos.js';
import { CosmsosChainType } from '../types/index.js';

export interface CosmosContextValues {
  connect: (params: { adapterId: string; chainId?: string }) => Promise<{
    chainWallets: ChainWalletBase[];
    mainWallet: MainWalletBase;
  }>;
  disconnect: () => Promise<void>;
  store: CosmosStore | null;
}

export const CosmosContext = createContext<CosmosContextValues>({
  connect: async () => ({ chainWallets: [], mainWallet: {} as MainWalletBase }),
  disconnect: async () => {},
  store: null,
});

const CosmosContextProvider = ({ children, chains }: { children: React.ReactNode; chains: CosmsosChainType[] }) => {
  const cosmosStore = useRef(createCosmosStore(chains)).current;

  const [, setViewWalletRepo] = useState<WalletRepo | undefined>();
  const [, setData] = useState<Data>();
  const [, setState] = useState<State>(State.Init);
  const [, setMsg] = useState<string | undefined>();

  const [clientState, setClientStates] = useState<Record<string, State>>({});
  const [, setClientMsg] = useState<string | undefined>();

  const [render, forceRender] = useState<number>(0);

  const connectedMainWallet = useStore(cosmosStore, (state) => state.connectedMainWallet);

  const setConnectedMainWallet = useStore(cosmosStore, (state) => state.setConnectedMainWallet);
  const setChainWallets = useStore(cosmosStore, (state) => state.setChainWallets);
  const setWalletManager = useStore(cosmosStore, (state) => state.setWalletManager);
  const setWallets = useStore(cosmosStore, (state) => state.setWallets);

  const reset = useStore(cosmosStore, (state) => state.reset);

  const autoConnectRef = useRef(true);

  const chainIds = useMemo(() => chains.map((chain) => chain.id), [chains]);
  const chainNames = useMemo(() => chains.map((chain) => chain.chainName), [chains]);

  const logger = useMemo(() => new Logger('ERROR'), []);

  const walletManager = useMemo(() => {
    const walletManager = new WalletManager(
      chainNames,
      [...keplr, ...xdefi, ...leap] as MainWalletBase[],
      logger,
      false,
      true,
      [], // allowedIframeParentOrigins,
      [], // assetLists,
      'icns', // defaultNameService,
      {
        signClient: {
          projectId: 'a8510432ebb71e6948cfd6cde54b70f7',
          relayUrl: 'wss://relay.walletconnect.org',
          metadata: {
            name: 'Router Intents',
            description: 'Router Intents dApp',
            url: 'https://poc-intents-ui.vercel.app',
            icons: [
              'https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/packages/docs/public/favicon-96x96.png',
            ],
          },
        },
      },
    );
    walletManager.setActions({
      viewWalletRepo: setViewWalletRepo,
      data: setData,
      state: (state) => {
        setState(state);
      },
      message: setMsg,
    });

    walletManager.walletRepos.forEach((wr) => {
      wr.setActions({
        viewWalletRepo: setViewWalletRepo,
        render: forceRender,
      });
      wr.wallets.forEach((w) => {
        w.setActions({
          data: setData,
          state: (state) => {
            setState(state);
          },
          message: setMsg,
        });
      });
    });

    walletManager.mainWallets.forEach((w) => {
      w.setActions({
        data: setData,
        state: (state) => {
          setState(state);
        },
        message: setMsg,
        clientState: (state) => {
          setClientStates((prev) => ({ ...prev, [w.walletName]: state }));
        },
        clientMessage: setClientMsg,
      });
    });

    return walletManager;
  }, [chainNames, logger]);

  useEffect(() => {
    walletManager.onMounted();
    return () => {
      walletManager.onUnmounted();
    };
  }, [render, walletManager]);

  useEffect(() => {
    setWallets([...walletManager.mainWallets] || []);
  }, [setWallets, walletManager.mainWallets, clientState]);

  /**
   * Get the wallet manager and set the callbacks for the wallet connect and extension wallets
   * This is necessary to enable the wallet to connect to the Cosmos chains
   */
  useEffect(() => {
    const repos = chains.map((chain) => walletManager.getWalletRepo(chain.chainName));

    console.log('repos', repos);

    chainNames.forEach((chainName) => {
      const walletRepo = walletManager.getWalletRepo(chainName);

      walletRepo.activate();

      walletRepo.wallets.forEach((wallet) => {
        if (wallet.isModeExtension) {
          if (wallet.callbacks)
            wallet.callbacks.beforeConnect = async () => {
              try {
                await wallet.client?.enable?.(chainIds);
              } catch (e) {
                for (const repo of repos) {
                  await wallet.client?.addChain?.(repo.chainRecord);
                }
                await wallet.client?.enable?.(chainIds);
              }
            };
        }

        if (wallet.isModeWalletConnect) {
          wallet.connectChains = async () => {
            await wallet?.client?.connect?.(chainIds);
            for (const name of chainNames.filter((name) => name !== chainName)) {
              await wallet.mainWallet.getChainWallet(name)?.update({ connect: false });
            }
          };
        }
      });
    });

    setWalletManager(walletManager);
  }, [walletManager, setWalletManager, chains, chainNames, chainIds]);

  const { mutateAsync: connect } = useMutation({
    mutationKey: ['cosmos connect'],
    mutationFn: async ({ adapterId, chainId }: { adapterId: string; chainId?: string }) => {
      const mainWallet = walletManager.mainWallets.find((wallet) => wallet.walletName === adapterId);

      if (!mainWallet) {
        throw new Error('Failed to connect to Cosmos wallet: wallet not found');
      }

      const client = mainWallet.clientMutable.data;

      if (!client) {
        throw new Error('Failed to connect to Cosmos wallet: missing mutable client');
      }

      await client.enable?.(chainIds);

      // enable param chainId
      if (chainId) {
        await client.enable?.([chainId]);
      }

      await mainWallet.connectAll(false);

      const chainWallets = mainWallet.getChainWalletList(false);

      console.log('chainWallets', chainWallets);

      return { chainWallets, mainWallet };
    },
    onSuccess: (data) => {
      setConnectedMainWallet(data.mainWallet);
      setChainWallets(data.chainWallets);
    },
  });

  const { mutateAsync: disconnect } = useMutation({
    mutationKey: ['cosmos disconnect'],
    mutationFn: async () => {
      connectedMainWallet?.disconnectAll();
      reset();
    },
  });

  /**
   * On first render, connect to the wallet if the wallet is already connected
   * Serves as a way to persist the wallet connection across page refreshes
   */
  useEffect(() => {
    const cosmosCurrentWallet = localStorage.getItem('cosmos-kit@2:core//current-wallet');
    if (!autoConnectRef.current || !cosmosCurrentWallet) {
      return;
    }

    connect({ adapterId: cosmosCurrentWallet });

    autoConnectRef.current = false;
  }, [walletManager, connect]);

  return (
    <CosmosContext.Provider
      value={{
        store: cosmosStore,
        connect,
        disconnect,
      }}
    >
      {children}
    </CosmosContext.Provider>
  );
};

export default CosmosContextProvider;
