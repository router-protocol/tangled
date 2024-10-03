import { WalletConnectAdapter as TronWalletConnectAdapter } from '@tronweb3/tronwallet-adapters';
import { coinbaseWallet, walletConnect } from 'wagmi/connectors';
import * as bitcoinConnectors from '../connectors/bitcoin/connectors.js';
import * as solConnectors from '../connectors/solana/connectors.js';
import * as suiConnectors from '../connectors/sui/connectors.js';
import * as tronConnectors from '../connectors/tron/connectors.js';
import { CHAIN_TYPES, SupportedChainsByType, TangledConfig } from '../types/index.js';
import { ChainConnectors } from '../types/wallet.js';

// export type ChainConnectors = { [key in ChainType]: any };

export const createChainConnectors = (config: TangledConfig, chains: SupportedChainsByType): ChainConnectors => {
  const overrides = config.chainConnectors ?? {};

  const connectors: ChainConnectors = CHAIN_TYPES.reduce((acc, type) => {
    acc[type] = [];
    return acc;
  }, {} as ChainConnectors);

  const walletconnectConnector = walletConnect({
    projectId: config.projectId,
    showQrModal: true,
  });
  const coinbaseWalletConnector = coinbaseWallet({
    appName: config.projectName,
    headlessMode: false,
  });
  connectors.evm = [...(overrides.evm ?? []), walletconnectConnector, coinbaseWalletConnector];

  const tronChain = chains.tron[0];
  const tronWalletConnectAdapter = new TronWalletConnectAdapter({
    network: tronChain.tronName,
    options: {
      relayUrl: 'wss://relay.walletconnect.com',
      projectId: config.projectId,
    },
  });
  connectors.tron = [...(overrides.tron ?? []), tronConnectors.tronLinkAdapter, tronWalletConnectAdapter];

  connectors.solana = [
    ...(overrides.solana ?? []),
    solConnectors.phantom,
    solConnectors.solflare,
    solConnectors.backpack,
  ];

  connectors.sui = [
    ...(overrides.sui ?? []),
    suiConnectors.suiWallet,
    suiConnectors.martianSuiWallet,
    suiConnectors.suiet,
    suiConnectors.nightly,
  ];

  connectors.bitcoin = [...(overrides.bitcoin ?? []), bitcoinConnectors.xdefiWallet];

  return connectors;
};
