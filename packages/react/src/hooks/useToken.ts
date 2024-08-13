import { useQuery } from '@tanstack/react-query';
import { ChainId } from '../types/index.js';
import { useChain } from './useChain.js';

import { useConnection as useSolanaConnection } from '@tangled3/solana-react';
import { formatUnits } from 'viem';
import { useConfig as useWagmiConfig } from 'wagmi';
import { getTokenBalanceAndAllowance, getTokenMetadata } from '../utils/getToken.js';

export type UseTokenParams = {
  /** Chain ID of token */
  chainId: ChainId;
  /** Token Address */
  token: string | undefined;
  /** Account to fetch balance and allowance for */
  account?: string;
  /** Allowance spender */
  spender?: string;
  /** Subscribe to token balance and allowance changes for every block */
  subscribe?: boolean;
};

type TokenMetadata = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
};

type BalanceReturnType = {
  value: bigint;
  formatted: string;
};

export type UseTokenReturn = {
  tokenMetadata: TokenMetadata | undefined;
  balance: BalanceReturnType | undefined;
  allowance: BalanceReturnType | undefined;
  error: Error | null;
  isMetadataLoading: boolean;
  isBalanceAndAllowanceLoading: boolean;
  isLoading: boolean;
};

export const useToken = ({ chainId, account, token, spender }: UseTokenParams): UseTokenReturn => {
  const chain = useChain(chainId);
  const wagmiConfig = useWagmiConfig();
  const { connection: solanaConnection } = useSolanaConnection();

  const {
    data: tokenMetadata,
    error,
    isLoading: isMetadataLoading,
  } = useQuery({
    queryKey: ['token', chain, token],
    queryFn: async () => {
      if (!chain || !token) {
        throw new Error('Missing required parameters');
      }

      const result = await getTokenMetadata({ address: token, chain, wagmiConfig, solanaConnection });

      return result as TokenMetadata;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    enabled: Boolean(token && chain),
  });

  const { data: balanceAndAllowance, isLoading: isBalanceAndAllowanceLoading } = useQuery({
    queryKey: ['balance and allowance', token, account, spender, tokenMetadata],
    queryFn: async () => {
      if (!account || !token || !tokenMetadata || !chain) {
        throw new Error('Missing required parameters');
      }

      const { balance, allowance } = await getTokenBalanceAndAllowance({
        token: token,
        account,
        spender,
        chain,
        wagmiConfig,
        solanaConnection,
      });

      return {
        balance: {
          value: balance,
          formatted: formatUnits(balance, tokenMetadata?.decimals),
        },
        allowance: {
          value: allowance,
          formatted: formatUnits(allowance, tokenMetadata?.decimals),
        },
      };
    },
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: true,
    enabled: Boolean(tokenMetadata && account && chain),
  });

  return {
    tokenMetadata: tokenMetadata,
    balance: balanceAndAllowance?.balance,
    allowance: balanceAndAllowance?.allowance,
    error: error,
    isLoading: isMetadataLoading || isBalanceAndAllowanceLoading,
    isMetadataLoading: isMetadataLoading,
    isBalanceAndAllowanceLoading: isBalanceAndAllowanceLoading,
  };
};
