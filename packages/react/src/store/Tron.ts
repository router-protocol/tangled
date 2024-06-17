import { Adapter, NetworkType, WalletReadyState } from '@tronweb3/tronwallet-abstract-adapter';
import { create } from 'zustand';

interface TronState {
  tronAdapter: Adapter | undefined;
  readyState: WalletReadyState | undefined;
  account: string | undefined;
  network: NetworkType | undefined;
  setTronAdapter: (tronAdapter: Adapter) => void;
  setReadyState: (readyState: WalletReadyState) => void;
  setAccount: (account: string | undefined) => void;
  setNetwork: (network: NetworkType) => void;
}

export const useTronStore = create<TronState>((set) => ({
  tronAdapter: undefined,
  readyState: undefined,
  account: undefined,
  network: undefined,

  setTronAdapter: (tronAdapter) => set(() => ({ tronAdapter })),
  setReadyState: (readyState) => set(() => ({ readyState })),
  setAccount: (account) => set(() => ({ account })),
  setNetwork: (network) => set(() => ({ network })),
}));
