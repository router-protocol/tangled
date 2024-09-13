import { useConnection as useSolanaConnection } from '@tangled3/solana-react';
import { useMemo } from 'react';
import { useConfig as useWagmiConfig } from 'wagmi';
import { useAlephStore } from './useAlephStore.js';
import { useTonStore } from './useTonStore.js';
import { useTronStore } from './useTronStore.js';

/**
 * A hook that returns the connection or config for the all chain types.
 */
export const useConnectionOrConfig = () => {
  const wagmiConfig = useWagmiConfig();
  const { connection: solanaConnection } = useSolanaConnection();
  const tronWeb = useTronStore((state) => state.tronweb);
  const alephZeroApi = useAlephStore((state) => state.api);
  const tonClient = useTonStore((state) => state.tonClient);

  return useMemo(() => {
    if (!alephZeroApi) return undefined;

    return {
      wagmiConfig,
      solanaConnection,
      tronWeb,
      alephZeroApi: alephZeroApi,
      tonClient,
    };
  }, [wagmiConfig, solanaConnection, tronWeb, alephZeroApi, tonClient]);
};
