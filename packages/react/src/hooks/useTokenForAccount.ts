import { useConnection as useSolanaConnection } from '@tangled3/solana-react';
import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { useConfig as useWagmiConfig } from 'wagmi';
import { getTokenBalanceAndAllowance } from '../actions/getToken.js';
import { ChainId } from '../types/index.js';
import { useAlephStore } from './useAlephStore.js';
import { useChain } from './useChain.js';
import { useToken } from './useToken.js';
import { useTronStore } from './useTronStore.js';

export type UseTokenParams = {
  /** Chain ID of token */
  chainId: ChainId;
  /** Token Address */
  token: string | undefined;
  /** Account to fetch balance and allowance for */
  account: string | undefined;
  /** Allowance spender */
  spender: string | undefined;
  /** Subscribe to token balance and allowance changes for every block */
  subscribe?: boolean;
};

export const useTokenForAccount = ({ chainId, account, token, spender }: UseTokenParams) => {
  const chain = useChain(chainId);
  const wagmiConfig = useWagmiConfig();
  const { connection: solanaConnection } = useSolanaConnection();
  const tronWeb = useTronStore((state) => state.tronweb);
  const alephZeroApi = useAlephStore((state) => state.api);

  const { data: tokenMetadata } = useToken({ chainId, token });

  return useQuery({
    queryKey: ['balance and allowance', chain?.id, token, account, spender, tokenMetadata?.decimals],
    queryFn: async () => {
      if (!account || !token || !tokenMetadata || !chain) {
        throw new Error('Missing required parameters');
      }
      if (!alephZeroApi) {
        throw new Error('Aleph Zero Api not found');
      }

      const { balance, allowance } = await getTokenBalanceAndAllowance({
        token: token,
        account,
        spender,
        chain,
        connectors: {
          wagmiConfig,
          solanaConnection,
          tronWeb,
          alephZeroApi,
        },
      });

      return {
        balance: {
          value: balance as bigint,
          formatted: formatUnits(balance, tokenMetadata?.decimals),
        },
        allowance: {
          value: allowance as bigint,
          formatted: formatUnits(allowance, tokenMetadata?.decimals),
        },
      };
    },
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: true,
    enabled: Boolean(tokenMetadata && account && chain),
  });
};
