import { Coin } from '@routerprotocol/router-chain-sdk-ts';

export type RouterLCDBalancesResponse = {
  balances: Coin[];
  pagination: {
    next_string: string | null;
    total: string;
  };
};
