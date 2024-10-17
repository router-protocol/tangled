import { ChainWalletBase, Data, Logger, MainWalletBase, State, WalletManager, WalletRepo } from '@cosmos-kit/core';
import { wallets as keplr } from '@cosmos-kit/keplr';
import { wallets as leap } from '@cosmos-kit/leap';
import { wallets as xdefi } from '@cosmos-kit/xdefi';
import { useMutation } from '@tanstack/react-query';
import { createContext, useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from 'zustand';
import { useTangledConfig } from '../hooks/useTangledConfig.js';
import { CosmosStore, createCosmosStore } from '../store/Cosmos.js';
import { CosmsosChainType } from '../types/index.js';

export interface CosmosContextValues {
  connect: (params: { adapterId: string; chainId?: string }) => Promise<{
    chainWallets: ChainWalletBase[];
    mainWallet: MainWalletBase;
    walletId: string;
    chainId: string | undefined;
  }>;
  disconnect: () => Promise<void>;
  store: CosmosStore | null;
}

export const CosmosContext = createContext<CosmosContextValues>({
  connect: async () => ({ chainWallets: [], mainWallet: {} as MainWalletBase, walletId: '', chainId: '' }),
  disconnect: async () => {},
  store: null,
});

const CosmosContextProvider = ({ children, chains }: { children: React.ReactNode; chains: CosmsosChainType[] }) => {
  const tangledConfig = useTangledConfig((state) => state.config);
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
          projectId: tangledConfig.projectId,
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

    chainNames.forEach((chainName) => {
      const walletRepo = walletManager.getWalletRepo(chainName);

      walletRepo.activate();

      walletRepo.wallets.forEach((wallet) => {
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
    return walletManager;
  }, [chainIds, chainNames, logger]);

  const chainRepos = useMemo(
    () => chains.map((chain) => walletManager.getWalletRepo(chain.chainName)),
    [chains, walletManager],
  );
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
    setWalletManager(walletManager);
  }, [walletManager, setWalletManager]);

  const { mutateAsync: connect } = useMutation({
    mutationKey: ['cosmos connect'],
    mutationFn: async ({ adapterId, chainId }: { adapterId: string; chainId?: string }) => {
      const walletId = adapterId.split(':')[0];
      const mainWallet = walletManager.mainWallets.find((wallet) => wallet.walletName === walletId);

      if (!mainWallet) {
        throw new Error('Failed to connect to Cosmos wallet: wallet not found');
      }

      const client = mainWallet.clientMutable.data;

      try {
        await mainWallet.client?.enable?.(chainIds);
      } catch (e) {
        for (const repo of chainRepos) {
          await mainWallet.client?.addChain?.(repo.chainRecord);
        }
        await mainWallet.client?.enable?.(chainIds);
      }

      if (!client) {
        throw new Error('Failed to connect to Cosmos wallet: missing mutable client');
      }

      await mainWallet.connectAll(false);

      const chainWallets = mainWallet.getChainWalletList(true);

      return { chainWallets, mainWallet, walletId, chainId };
    },
    onSuccess: (data) => {
      setConnectedMainWallet(data.mainWallet);
      setChainWallets(data.chainWallets);
    },
  });

  const { mutateAsync: disconnect } = useMutation({
    mutationKey: ['cosmos disconnect'],
    mutationFn: async () => {
      await connectedMainWallet?.disconnectAll();
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

    if (clientState[cosmosCurrentWallet] !== State.Done) {
      return;
    }

    connect({ adapterId: cosmosCurrentWallet });

    autoConnectRef.current = false;
  }, [walletManager, connect, clientState]);

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
