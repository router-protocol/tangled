import { useSuiClient } from '@mysten/dapp-kit';
import { useConnection as useSolanaConnection } from '@tangled3/solana-react';
import { useMemo } from 'react';
import { useConfig as useWagmiConfig } from 'wagmi';
import { FallbackBitcoinProvider } from '../connectors/bitcoin/connectors.js';
import { ConnectionOrConfig } from '../types/index.js';
import { useBitcoinContext } from './useBitcoinContext.js';
import { useCosmosStore } from './useCosmosStore.js';
import { useTonStore } from './useTonStore.js';
import { useTronStore } from './useTronStore.js';

/**
 * A hook that returns the connection or config for the all chain types.
 */
export const useConnectionOrConfig = (): ConnectionOrConfig | undefined => {
  const wagmiConfig = useWagmiConfig();
  const { connection: solanaConnection } = useSolanaConnection();
  const tronWeb = useTronStore((state) => state.tronweb);
  const suiClient = useSuiClient();
  const tonClient = useTonStore((state) => state.tonClient);
  const getCosmosClient = useCosmosStore((state) => state.getCosmosClient);
  const { bitcoinProvider } = useBitcoinContext();

  return useMemo(() => {
    return {
      wagmiConfig,
      solanaConnection,
      tronWeb,
      suiClient: suiClient,
      tonClient,
      getCosmosClient,
      bitcoinProvider: bitcoinProvider ?? new FallbackBitcoinProvider(),
    };
  }, [wagmiConfig, solanaConnection, tronWeb, suiClient, tonClient, getCosmosClient, bitcoinProvider]);
};
