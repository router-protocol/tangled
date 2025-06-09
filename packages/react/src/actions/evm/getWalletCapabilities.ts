import { getCapabilities } from '@wagmi/core';
import { Config } from 'wagmi';

export const getWalletCapabilities = async (wagmiConfig: Config, chainId: number, address: string) => {
  const capabilities = await getCapabilities<Config, number>(wagmiConfig, {
    chainId,
    account: address as `0x${string}`,
  });

  // console.log(capabilities, wagmiConfig.chains.map(chain => [chain.id, chain.rpcUrls]));

  return capabilities;
};
