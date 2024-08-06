import { Evaluate } from '@wagmi/core/internal';
import { EIP1193Provider } from 'viem';

export type WalletProviderFlags = string;
export type WalletProvider = Evaluate<
  EIP1193Provider & {
    [key in WalletProviderFlags]?: true | undefined;
  } & {
    providers?: any[] | undefined;
    /** Only exists in MetaMask as of 2022/04/03 */
    _events?: { connect?: (() => void) | undefined } | undefined;
    /** Only exists in MetaMask as of 2022/04/03 */
    _state?:
      | {
          accounts?: string[];
          initialized?: boolean;
          isConnected?: boolean;
          isPermanentlyDisconnected?: boolean;
          isUnlocked?: boolean;
        }
      | undefined;
  }
>;
export type WindowProvider = {
  coinbaseWalletExtension?: WalletProvider | undefined;
  ethereum?: WalletProvider | undefined;
  phantom?: { ethereum: WalletProvider } | undefined;
  providers?: any[] | undefined; // Adjust the type as needed
};
