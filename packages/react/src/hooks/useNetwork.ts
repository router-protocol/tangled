import { useMutation } from '@tanstack/react-query';

import { useCallback } from 'react';
import useCurrentAccount from './useCurrentAccount.js';

const useNetwork = () => {
  const currentAccount = useCurrentAccount();

  const switchNetwork = useCallback(() => {
    // switch network
  }, []);

  const { mutate, mutateAsync } = useMutation({
    mutationKey: ['switch-network', currentAccount?.wallet],
    mutationFn: async () => {
      return switchNetwork();
    },
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      // do something
    },
  });

  return { network: currentAccount?.chainId, switchNetwork: mutate, switchNetworkAsync: mutateAsync };
};

export default useNetwork;
