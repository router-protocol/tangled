import type { CoinbaseWalletParameters } from '@wagmi/connectors';
import { coinbaseWallet } from '@wagmi/connectors';

export const createCoinbaseConnector = /*@__PURE__*/ (params: CoinbaseWalletParameters) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coinbaseWallet(params) as any;
