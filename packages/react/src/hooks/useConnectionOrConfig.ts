import { useSuiClient } from '@mysten/dapp-kit';
import { useConnection as useSolanaConnection } from '@tangled3/solana-react';
import { useMemo } from 'react';
import { useConfig as useWagmiConfig } from 'wagmi';
import { FallbackBitcoinProvider } from '../connectors/bitcoin/connectors.js';
import { ConnectionOrConfig } from '../types/index.js';
import { useBitcoinContext } from './useBitcoinContext.js';
import { useCosmosStore } from './useCosmosStore.js';
import { useNearContext } from './useNearContext.js';

/**
 * A hook that returns the connection or config for the all chain types.
 */
export const useConnectionOrConfig = (): ConnectionOrConfig | undefined => {
  const wagmiConfig = useWagmiConfig();
  const { connection: solanaConnection } = useSolanaConnection();
  const suiClient = useSuiClient();
  const getCosmosClient = useCosmosStore((state) => state.getCosmosClient);
  const { bitcoinProvider } = useBitcoinContext();
  const { nearSelector } = useNearContext();

  return useMemo(() => {
    return {
      wagmiConfig,
      solanaConnection,
      suiClient: suiClient,
      getCosmosClient,
      bitcoinProvider: bitcoinProvider ?? new FallbackBitcoinProvider(),
      nearSelector,
    };
  }, [wagmiConfig, solanaConnection, suiClient, getCosmosClient, bitcoinProvider, nearSelector]);
};
