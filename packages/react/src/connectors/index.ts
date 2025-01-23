/**
 * EIP-6963: Multi Injected Provider Discovery
 * https://eips.ethereum.org/EIPS/eip-6963
 *
 */
export type WalletConfigProps = {
  // Wallets name
  name?: string;
  // Links to download the wallet
  url?: string;
  icon?: string;
  isInstalled: boolean | (() => boolean) | undefined;
  hide?: boolean;
  // Create URI for QR code, where uri is encoded data from WalletConnect
  getWalletConnectDeeplink?: (uri: string) => string;
};
