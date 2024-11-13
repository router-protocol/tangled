import { createConfig, CreateConnectorFn, http, injected } from '@wagmi/core';
import { type Chain } from '@wagmi/core/chains';
import { walletConnect } from 'wagmi/connectors';
import { near } from '../../chains/near.js';
import { nearTestnet } from '../../chains/near.testnet.js';

export const createNearConfig = (networkType: 'mainnet' | 'testnet', projectName: string, projectId?: string) => {
  const selectedChain = networkType === 'mainnet' ? near : nearTestnet;

  const chainConfig: Chain = {
    id: Number(selectedChain.id),
    name: selectedChain.name,
    nativeCurrency: {
      decimals: selectedChain.nativeCurrency.decimals,
      name: selectedChain.nativeCurrency.name,
      symbol: selectedChain.nativeCurrency.symbol,
    },
    rpcUrls: selectedChain.rpcUrls,
    blockExplorers: selectedChain.blockExplorers,
  };

  const connectors: CreateConnectorFn[] | undefined = [injected({ shimDisconnect: true })];

  if (projectId) {
    connectors.push(
      walletConnect({
        projectId,
        metadata: {
          name: projectName,
          description: '',
          url: '',
          icons: [''],
        },
        showQrModal: false,
      }),
    );
  }

  return createConfig({
    chains: [chainConfig],
    transports: {
      [chainConfig.id]: http(),
    },
    connectors,
  });
};
