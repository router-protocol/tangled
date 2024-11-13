import { coinbaseWallet, walletConnect } from 'wagmi/connectors';
import * as bitcoinConnectors from '../connectors/bitcoin/connectors.js';
import * as cosmosConnectors from '../connectors/cosmos/connector.js';
import * as solConnectors from '../connectors/solana/connectors.js';
import * as suiConnectors from '../connectors/sui/connectors.js';
import { CHAIN_TYPES, TangledConfig } from '../types/index.js';
import { ChainConnectors } from '../types/wallet.js';

export const createChainConnectors = (config: TangledConfig): ChainConnectors => {
  const overrides = config.chainConnectors ?? {};

  const connectors: ChainConnectors = CHAIN_TYPES.reduce((acc, type) => {
    acc[type] = [];
    return acc;
  }, {} as ChainConnectors);

  const coinbaseWalletConnector = coinbaseWallet({
    appName: config.projectName,
    headlessMode: false,
  });

  const evmConnectors = [...(overrides.evm ?? []), coinbaseWalletConnector];

  if (config.projectId) {
    evmConnectors.push(
      walletConnect({
        projectId: config.projectId,
        showQrModal: true,
      }),
    );
  }
  connectors.evm = evmConnectors;

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

  connectors.cosmos = [...(overrides.cosmos ?? []), cosmosConnectors.cosmosWallet];

  connectors.bitcoin = [...(overrides.bitcoin ?? []), bitcoinConnectors.xdefiWallet];

  return connectors;
};
