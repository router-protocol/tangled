import { type ApiPromise } from '@polkadot/api';
import { Connection as SolanaConnection } from '@solana/web3.js';
import { useConnection as useSolanaConnection } from '@tangled3/solana-react';
import { useMemo } from 'react';
import { type TronWeb } from 'tronweb';
import { Config as WagmiConfig, useConfig as useWagmiConfig } from 'wagmi';
import { useAlephStore } from './useAlephStore.js';
import { useTronStore } from './useTronStore.js';

export type ConnectionOrConfig = {
  wagmiConfig: WagmiConfig;
  solanaConnection: SolanaConnection;
  tronWeb: TronWeb;
  alephZeroApi: ApiPromise;
};

/**
 * A hook that returns the connection or config for the all chain types.
 */
export const useConnectionOrConfig = () => {
  const wagmiConfig = useWagmiConfig();
  const { connection: solanaConnection } = useSolanaConnection();
  const tronWeb = useTronStore((state) => state.tronweb);
  const alephZeroApi = useAlephStore((state) => state.api);

  return useMemo(() => {
    if (!alephZeroApi) return undefined;

    return {
      wagmiConfig,
      solanaConnection,
      tronWeb,
      alephZeroApi: alephZeroApi,
    };
  }, [wagmiConfig, solanaConnection, tronWeb, alephZeroApi]);
};
