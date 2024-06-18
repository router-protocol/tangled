import { NetworkType } from '@tronweb3/tronwallet-abstract-adapter';
import { WalletConnectAdapter } from '@tronweb3/tronwallet-adapters';

export const createTronWalletConnect = ({
  projectId,
  network,
  name,
  description,
  url,
  icons,
}: {
  projectId: string;
  network: NetworkType;
  name: string;
  description: string;
  url: string;
  icons: string[];
}) =>
  new WalletConnectAdapter({
    // @ts-expect-error TODO: fix type
    network: network,
    options: {
      relayUrl: 'wss://relay.walletconnect.com',
      // example walletconnect app project ID
      projectId,
      metadata: {
        name,
        description,
        url,
        icons,
      },
    },
    web3ModalConfig: {
      themeMode: 'dark',
      themeVariables: {
        '--w3m-z-index': 3000,
      },
    },
  });
