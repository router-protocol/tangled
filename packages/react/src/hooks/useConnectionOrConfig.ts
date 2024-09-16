import { useSuiClient } from '@mysten/dapp-kit';
import { useConnection as useSolanaConnection } from '@tangled3/solana-react';
import { useMemo } from 'react';
import { useConfig as useWagmiConfig } from 'wagmi';
import { ConnectionOrConfig } from '../types/index.js';
import { useAlephStore } from './useAlephStore.js';
import { useTronStore } from './useTronStore.js';

/**
 * A hook that returns the connection or config for the all chain types.
 */
export const useConnectionOrConfig = (): ConnectionOrConfig | undefined => {
  const wagmiConfig = useWagmiConfig();
  const { connection: solanaConnection } = useSolanaConnection();
  const tronWeb = useTronStore((state) => state.tronweb);
  const alephZeroApi = useAlephStore((state) => state.api);
  const suiClient = useSuiClient();

  return useMemo(() => {
    if (!alephZeroApi) return undefined;

    return {
      wagmiConfig,
      solanaConnection,
      tronWeb,
      alephZeroApi: alephZeroApi,
      suiClient: suiClient,
    };
  }, [wagmiConfig, solanaConnection, tronWeb, alephZeroApi, suiClient]);
};
