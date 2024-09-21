import { AccountStatus, CurrencyCollection, Dictionary, HashUpdate, Message, TransactionDescription } from '@ton/ton';

export type TonTransactionInfo = {
  address: bigint;
  description: TransactionDescription;
  endStatus: AccountStatus;
  inMessage: undefined | Message;
  lt: bigint;
  now: number;
  oldStatus: AccountStatus;
  outMessages: Dictionary<number, Message>;
  outMessagesCount: number;
  prevTransactionHash: bigint;
  prevTransactionLt: bigint;
  stateUpdate: HashUpdate;
  totalFees: CurrencyCollection;
};
