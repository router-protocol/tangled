import { useConnection as useSolanaConnection } from '@tangled3/solana-react';
import { useQuery } from '@tanstack/react-query';
import { useConfig as useWagmiConfig } from 'wagmi';
import { getTokenMetadata } from '../actions/getToken.js';
import { ChainId } from '../types/index.js';
import { useAlephStore } from './useAlephStore.js';
import { useChain } from './useChain.js';
import { useTronStore } from './useTronStore.js';

export type UseTokenParams = {
  /** Chain ID of token */
  chainId: ChainId;
  /** Token Address */
  token: string | undefined;
};

type TokenMetadata = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
};

export const useToken = ({ chainId, token }: UseTokenParams) => {
  const chain = useChain(chainId);
  const wagmiConfig = useWagmiConfig();
  const { connection: solanaConnection } = useSolanaConnection();
  const tronWeb = useTronStore((state) => state.tronweb);
  const alephZeroApi = useAlephStore((state) => state.api);

  return useQuery({
    queryKey: ['token', chain?.id, token],
    queryFn: async () => {
      if (!chain || !token) {
        throw new Error('Missing required parameters');
      }
      if (!alephZeroApi) {
        throw new Error('Aleph Zero Api not found');
      }

      const result = await getTokenMetadata({
        token,
        chain,
        connectors: { wagmiConfig, solanaConnection, tronWeb, alephZeroApi: alephZeroApi },
      });

      return result as TokenMetadata;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    enabled: Boolean(token && chain),
  });
};
