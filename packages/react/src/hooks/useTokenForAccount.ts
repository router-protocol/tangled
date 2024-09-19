import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { GetTokenBalanceAndAllowanceResponse, getTokenBalanceAndAllowance } from '../actions/getToken.js';
import { ChainId } from '../types/index.js';
import { QueryParameter } from '../types/properties.js';
import { useChain } from './useChain.js';
import { useConnectionOrConfig } from './useConnectionOrConfig.js';
import { useToken } from './useToken.js';

export type UseTokenForAccountParams = {
  /** Chain ID of token */
  chainId: ChainId | undefined;
  /** Token Address */
  token: string | undefined;
  /** Account to fetch balance and allowance for */
  account: string | undefined;
  /** Allowance spender */
  spender: string | undefined;
  /** Subscribe to token balance and allowance changes for every block */
  // subscribe?: boolean;
  queryOptions?: QueryParameter;
};

export const useTokenForAccount = ({
  chainId,
  account,
  token,
  spender,
  queryOptions = {},
}: UseTokenForAccountParams) => {
  const chain = useChain(chainId);
  const connectionOrConfig = useConnectionOrConfig();

  const { data: tokenMetadata } = useToken({ chainId, token });

  return useQuery({
    queryKey: ['balance and allowance', chain?.id, token, account, spender, tokenMetadata?.decimals],
    queryFn: async () => {
      if (!account || !token || !tokenMetadata || !chain) {
        throw new Error('Missing required parameters');
      }
      if (!connectionOrConfig) {
        throw new Error('Connections or config not found');
      }

      const tokenBalanceAndAllowanceResult = await getTokenBalanceAndAllowance({
        token: token,
        account,
        spender,
        chain,
        config: connectionOrConfig,
      });

      const { balance, allowance } = tokenBalanceAndAllowanceResult;

      if (chain.type === 'solana') {
        const { associatedTokenAccountAddress, isAtaDeployed } =
          tokenBalanceAndAllowanceResult as GetTokenBalanceAndAllowanceResponse<'solana'>;

        return {
          balance: {
            value: balance as bigint,
            formatted: formatUnits(balance, tokenMetadata?.decimals),
          },
          associatedTokenAccountAddress: associatedTokenAccountAddress,
          isAtaDeployed: isAtaDeployed,
          allowance: {
            value: allowance as bigint,
            formatted: formatUnits(allowance, tokenMetadata?.decimals),
          },
        };
      }

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
    ...queryOptions,
  });
};
