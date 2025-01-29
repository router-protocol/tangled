import { Config, multicall } from '@wagmi/core';
import { Address, erc20Abi, maxInt256, parseUnits } from 'viem';

// Interface for the response containing withdrawable
interface WithdrawableResponse {
  withdrawable: string; // Field to store the withdrawable amount
}

export const getEVMTokenMetadata = async (address: string, chainId: number, wagmiConfig: Config) => {
  if (chainId === 998) {
    return {
      name: 'USDC',
      symbol: 'USDC',
      decimals: 6,
    };
  }
  const tokenData = await multicall(wagmiConfig, {
    contracts: [
      {
        address: address as Address,
        abi: erc20Abi,
        functionName: 'name',
      },
      {
        address: address as Address,
        abi: erc20Abi,
        functionName: 'symbol',
      },
      {
        address: address as Address,
        abi: erc20Abi,
        functionName: 'decimals',
      },
    ],
    chainId: Number(chainId),
    allowFailure: false,
  });

  return {
    name: tokenData[0],
    symbol: tokenData[1],
    decimals: tokenData[2],
  };
};

export const getEVMTokenBalanceAndAllowance = async (
  address: string,
  account: string,
  spender: string | undefined,
  chainId: number,
  wagmiConfig: Config,
) => {
  if (chainId === 998) {
    const response = await fetch('https://api-ui.hyperliquid.xyz/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'clearinghouseState',
        user: account,
      }),
    });

    if (!response.ok) {
      return {
        balance: BigInt(0),
        allowance: maxInt256,
      };
    }

    const balance = (await response.json()) as WithdrawableResponse;
    const withdrawableBalance = balance.withdrawable;

    return {
      balance: parseUnits(withdrawableBalance, 6),
      allowance: maxInt256,
    };
  }
  const calls = [
    {
      address: address as Address,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [account as Address],
    },
  ];
  if (spender) {
    calls.push({
      address: address as Address,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [account as Address, spender as Address],
    });
  }
  const balanceAndAllowance = await multicall(wagmiConfig, {
    contracts: calls,
    chainId: Number(chainId),
    allowFailure: false,
  });

  return {
    balance: BigInt(balanceAndAllowance[0]),
    allowance: BigInt(balanceAndAllowance[1] ?? 0),
  };
};
