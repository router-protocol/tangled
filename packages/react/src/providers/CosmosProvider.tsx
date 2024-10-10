import { Logger, MainWalletBase, WalletManager } from '@cosmos-kit/core';
import { wallets as keplrWallets } from '@cosmos-kit/keplr';
import { useChain } from '@cosmos-kit/react';
import { assets } from 'chain-registry';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from 'zustand';
import { CosmosStore, createCosmosStore } from '../store/Cosmos.js';

export interface CosmosContextValues {
  walletClient: MainWalletBase | undefined;
  // account: string | undefined;
  connect: (adapterId: string) => Promise<void>;
  disconnect: () => Promise<void>;
  wallets: MainWalletBase[];
  store: CosmosStore | null;
}

export const CosmosContext = createContext<CosmosContextValues>({
  walletClient: undefined,
  // account: undefined,
  connect: async () => {},
  disconnect: async () => {},
  wallets: [],
  store: null,
});

const CosmosContextProvider = ({ children }: { children: React.ReactNode }) => {
  const cosmosStore = useRef(createCosmosStore()).current;
  const connectedAdapter = useStore(cosmosStore, (state) => state.connectedAdapter);
  const setConnectedAdapter = useStore(cosmosStore, (state) => state.setConnectedAdapter);
  const setConnectors = useStore(cosmosStore, (state) => state.setConnectors);
  const connectors = useStore(cosmosStore, (state) => state.connectors);
  const setAddress = useStore(cosmosStore, (state) => state.setAddress);
  const setClient = useStore(cosmosStore, (state) => state.setClient);
  const reset = useStore(cosmosStore, (state) => state.reset);
  const [cosmosWallets, setCosmosWallets] = useState<MainWalletBase[]>([]);
  const walletManager = useMemo(() => {
    return new WalletManager(
      ['osmosis', 'cosmoshub', 'juno', 'stargaze'],
      [keplrWallets[0]],
      new Logger('NONE'),
      false,
      undefined,
      undefined,
      assets,
    );
  }, []);

  const { walletRepo, getCosmWasmClient } = useChain('osmosis');

  useEffect(() => {
    (async () => {
      const client = await walletRepo.getStargateClient();
      setClient(client);
      const tokenBalance = await client.getAllBalances('osmo1n9cm2m2tz993qs0gfmvrq5w3uxeuk66rkqpl2x');
      console.log('[Token] balance', tokenBalance);
      //https://lcd.osmosis.zone
      // const cosmWasmClient = await SigningCosmWasmClient.connect('https://rpc.osmosis.zone/');
      // const queryResult = await cosmWasmClient.queryContractSmart("osmo1h00p6dp77ax00p7pu6lx90f9t0upfekxv8p0cxr", { balance: { address: "osmo1n9cm2m2tz993qs0gfmvrq5w3uxeuk66rkqpl2x" } });
      // const allowanceResponse = await cosmWasmClient.queryContractSmart("uosmo", {
      //     allowance: {
      //         owner: "osmo1n9cm2m2tz993qs0gfmvrq5w3uxeuk66rkqpl2x",
      //         spender: ""
      //     }
      // });
      // console.log("[Allowance] balance allowance", queryResult)
    })();
  }, []);

  // console.log("tokenBalance",tokenBalance)

  const connect = useCallback(
    async (adapterId: string) => {
      let client;
      const mainWallet = adapterId
        ? walletManager.getMainWallet(adapterId)
        : walletManager.mainWallets.find((w) => w.isActive);

      if (!mainWallet) {
        client = void 0;
      }

      client = mainWallet?.clientMutable?.data;
      mainWallet?.client;
      if (!client) return;

      // const stargateClient = await mainWallet.;
      try {
        await client.enable?.(['osmosis-1', 'juno-1']);
        const simpleAccount = await client.getSimpleAccount('osmosis-1');
        setAddress(simpleAccount.address);
        // setClient(client);
        setConnectedAdapter(mainWallet);
        setConnectors(adapterId, mainWallet);
      } catch (error) {
        console.error('Failed to connect to Cosmos wallet:', error);
      }
    },
    [connectors, walletManager, setAddress, setConnectors],
  );

  const disconnect = useCallback(async () => {
    try {
      connectedAdapter?.disconnect();
      reset();
      console.log('Successfully disconnected from Cosmos wallet');
    } catch (error) {
      console.error('Failed to disconnect from Cosmos wallet:', error);
    }
  }, [connectors, setConnectedAdapter, setAddress, setConnectors]);

  useEffect(() => {
    setCosmosWallets(walletManager.mainWallets);
  }, [walletManager]);

  return (
    <CosmosContext.Provider
      value={{
        walletClient: connectors['keplr-extension'],
        store: cosmosStore,
        connect,
        disconnect,
        wallets: cosmosWallets,
      }}
    >
      {children}
    </CosmosContext.Provider>
  );
};

export const useCosmosContext = () => useContext(CosmosContext);

export default CosmosContextProvider;
