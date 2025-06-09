import { useQuery } from '@tanstack/react-query';
import { getWalletCapabilities } from '../actions/evm/index.js';
import { useConnectionOrConfig } from './useConnectionOrConfig.js';

export const useWalletCapabilities = (chainId: number, address: string) => {
  const connectionOrConfig = useConnectionOrConfig();
  return useQuery({
    queryKey: ['walletCapabilities', chainId, address],
    queryFn: () => {
      if (!connectionOrConfig?.wagmiConfig) {
        throw new Error('No wagmi config found');
      }
      return getWalletCapabilities(connectionOrConfig.wagmiConfig, chainId, address);
    },
    enabled: !!connectionOrConfig?.wagmiConfig && !!chainId && !!address,
  });
};
