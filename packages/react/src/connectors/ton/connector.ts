import { ConnectedWallet, TonConnectError, TonConnectUI, TonConnectUIError } from '@tonconnect/ui-react';
import { ChainId } from '../../types/index.js';
import { Wallet } from '../../types/wallet.js';

export const connectExternalWallet = async (connector: TonConnectUI): Promise<ConnectedWallet> => {
  const abortController = new AbortController();

  connector.openModal();

  const unsubscribe = connector.onModalStateChange((state) => {
    const { status, closeReason } = state;
    if (status === 'opened') {
      return;
    }

    unsubscribe();
    if (closeReason === 'action-cancelled') {
      abortController.abort();
    }
  });

  return await waitForWalletConnection({
    connector,
    ignoreErrors: true,
    signal: abortController.signal,
  });
};

export const waitForWalletConnection = async ({
  connector,
  ignoreErrors,
  signal,
}: {
  connector: TonConnectUI;
  ignoreErrors?: boolean;
  signal?: AbortSignal;
}): Promise<ConnectedWallet> => {
  return new Promise((resolve, reject) => {
    if (signal && signal.aborted) {
      console.info('[TON CONNECTION TRACKER] - connection was cancelled');
      return reject(new TonConnectUIError('Wallet was not connected'));
    }

    const statusChangeHandler = async (wallet: ConnectedWallet | null): Promise<void> => {
      if (!wallet) {
        console.info('[TON CONNECTION TRACKER] - connection was cancelled');

        if (ignoreErrors) return;

        unsubscribe();
        reject(new TonConnectUIError('Wallet was not connected'));
      } else {
        console.info('[TON CONNECTION TRACKER] - wallet connected');
        unsubscribe();
        resolve(wallet);
      }
    };

    const OnErrorsHandler = (reason: TonConnectError): void => {
      console.info('[TON CONNECTION TRACKER] - connection error', reason.message);

      if (ignoreErrors) return;

      unsubscribe();
      reject(reason);
    };

    const unsubscribe = connector.onStatusChange(
      (wallet: ConnectedWallet | null) => statusChangeHandler(wallet),
      (reason: TonConnectError) => OnErrorsHandler(reason),
    );

    if (signal) {
      signal.addEventListener(
        'abort',
        (): void => {
          unsubscribe();
          reject(new TonConnectUIError('Wallet was not connected'));
        },
        { once: true },
      );
    }
  });
};

export const createTonWalletInstance = (
  connectedTonWallet: {
    account: string | null;
    chainId: ChainId | undefined;
  },
  walletInstance: Wallet,
) => ({
  ...walletInstance,
  // @ts-expect-error - adapter does not exist on WalletInstance of type Wallet
  id: connectedTonWallet.adapter.wallet.appName,
  // @ts-expect-error - adapter does not exist on WalletInstance of type Wallet
  name: connectedTonWallet.adapter.wallet.name,
});
