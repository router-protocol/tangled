import { useQuery } from '@tanstack/react-query';
import { getTokenMetadata } from '../actions/getToken.js';
import { ChainId } from '../types/index.js';
import { QueryParameter } from '../types/properties.js';
import { useChain } from './useChain.js';
import { useConnectionOrConfig } from './useConnectionOrConfig.js';

export type UseTokenParams = {
  /** Chain ID of token */
  chainId: ChainId | undefined;
  /** Token Address */
  token: string | undefined;
  queryOptions?: QueryParameter;
};

export type TokenMetadata = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  chainId: ChainId;
};

export const useToken = ({ chainId, token, queryOptions = {} }: UseTokenParams) => {
  const chain = useChain(chainId);
  const connectionOrConfig = useConnectionOrConfig();

  return useQuery({
    queryKey: ['token', chain?.id, token],
    queryFn: async () => {
      if (!chain || !token) {
        throw new Error('Missing required parameters');
      }
      if (!connectionOrConfig) {
        throw new Error('Connections or config not found');
      }

      const result = await getTokenMetadata({
        token,
        chain,
        config: connectionOrConfig,
      });

      return result as TokenMetadata;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    enabled: Boolean(token && chain),
    ...queryOptions,
  });
};
