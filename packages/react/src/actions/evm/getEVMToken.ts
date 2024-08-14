import { Config, multicall } from '@wagmi/core';
import { Address, erc20Abi } from 'viem';

export const getEVMTokenMetadata = async (address: string, chainId: number, wagmiConfig: Config) => {
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
  const calls = [
    {
      address: address as Address,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [account as Address],
    },
  ];
  if (!spender) {
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
    allowance: BigInt(balanceAndAllowance[1]),
  };
};
