import { coinbaseWallet, walletConnect } from 'wagmi/connectors';
import * as bitcoinConnectors from '../connectors/bitcoin/connectors.js';
import * as cosmosConnectors from '../connectors/cosmos/connector.js';
import * as solConnectors from '../connectors/solana/connectors.js';
import * as suiConnectors from '../connectors/sui/connectors.js';
import * as tronConnectors from '../connectors/tron/connectors.js';
import { WalletConnectAdapter } from '../connectors/tron/wcTronAdapter.js';
import { CHAIN_TYPES, SupportedChainsByType, TangledConfig } from '../types/index.js';
import { ChainConnectors } from '../types/wallet.js';

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

  const tronWalletConnectAdapter = new WalletConnectAdapter({
    network: tronChain.trxId,
    options: {
      projectId: '41980758771052df3f01be0a46f172a5',
      metadata: {
        name: config.projectName,
        description: '',
        url: '',
        icons: [''],
      },
    },
  });

  connectors.tron = [...(overrides.tron ?? []), tronConnectors.tronLinkAdapter, tronWalletConnectAdapter];

  connectors.solana = [
    ...(overrides.solana ?? []),
    solConnectors.phantom,
    solConnectors.solflare,
    solConnectors.binance,
    solConnectors.backpack,
  ];

  connectors.sui = [
    ...(overrides.sui ?? []),
    suiConnectors.suiWallet,
    suiConnectors.binanceWeb3Wallet,
    suiConnectors.martianSuiWallet,
    suiConnectors.suiet,
    suiConnectors.nightly,
  ];

  connectors.cosmos = [...(overrides.cosmos ?? []), cosmosConnectors.cosmosWallet];

  connectors.bitcoin = [...(overrides.bitcoin ?? []), bitcoinConnectors.ctrlWallet];

  return connectors;
};
