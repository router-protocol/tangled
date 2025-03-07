import { TransactionException } from '@injectivelabs/exceptions';
import {
  BaseAccount,
  BroadcastModeKeplr,
  ChainRestAuthApi,
  ChainRestTendermintApi,
  CosmosTxV1Beta1Tx,
  createTransactionFromMsg,
  getTxRawFromTxRawOrDirectSignResponse,
  MsgExecuteContractCompat,
  SignDoc,
  TxRaw,
} from '@injectivelabs/sdk-ts';
import { BigNumberInBase, DEFAULT_BLOCK_TIMEOUT_HEIGHT, getStdFee } from '@injectivelabs/utils';
import { CosmsosChainType } from 'packages/react/src/types/index.js';

type PreparedTxRawAndSignDoc = {
  txRaw: TxRaw;
  signDoc: SignDoc;
};

export async function getKeplrFromWindow(chainId: string) {
  // @ts-expect-error - window.keplr is not defined globally
  const keplrWindow = window.keplr;
  await keplrWindow.enable(chainId);

  const offlineSigner = keplrWindow.getOfflineSigner(chainId);
  const accounts = await offlineSigner.getAccounts();
  const key = await keplrWindow.getKey(chainId);

  return { keplrWindowObj: keplrWindow, offlineSigner, accounts, key };
}

export async function prepareTransaction({
  from,
  chain,
  args,
}: {
  from: string;
  chain: CosmsosChainType;
  args: { msg: MsgExecuteContractCompat };
}): Promise<PreparedTxRawAndSignDoc> {
  // only lcd rpc url works instead of chain's default
  const restEndpoint = chain.rpcUrls.default.lcd![0];
  const chainRestAuthApi = new ChainRestAuthApi(restEndpoint);

  const accountDetailsResponse = await chainRestAuthApi.fetchAccount(from);
  const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse);

  // getting the block details
  const chainRestTendermintApi = new ChainRestTendermintApi(restEndpoint);
  const latestBlock = await chainRestTendermintApi.fetchLatestBlock();
  const latestHeight = latestBlock.header.height;
  const timeoutHeight = new BigNumberInBase(latestHeight).plus(DEFAULT_BLOCK_TIMEOUT_HEIGHT);

  // preparing the message
  const keplr = await getKeplrFromWindow(chain.id);

  const { txRaw, signDoc } = createTransactionFromMsg({
    pubKey: Buffer.from(keplr.key.pubKey).toString('base64'),
    chainId: chain.id,
    fee: getStdFee({}),
    message: args.msg,
    sequence: baseAccount.sequence,
    timeoutHeight: timeoutHeight.toNumber(),
    accountNumber: baseAccount.accountNumber,
  });

  return { txRaw, signDoc };
}

export async function signTransaction({
  from,
  chain,
  preparedTx,
}: {
  from: string;
  chain: CosmsosChainType;
  preparedTx: PreparedTxRawAndSignDoc;
}): Promise<TxRaw> {
  const keplr = await getKeplrFromWindow(chain.id);
  const directSignResponse = await keplr.offlineSigner.signDirect(from, preparedTx.signDoc);

  const txRawFromSignResponse = getTxRawFromTxRawOrDirectSignResponse(directSignResponse);
  return txRawFromSignResponse;
}

export async function broadcastTransaction({
  chain,
  txRaw,
}: {
  chain: CosmsosChainType;
  txRaw: TxRaw;
}): Promise<string> {
  const keplr = await getKeplrFromWindow(chain.id);
  const result = await keplr.keplrWindowObj.sendTx(
    chain.id,
    CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish(),
    BroadcastModeKeplr.Sync,
  );

  if (!result || result.length === 0) {
    throw new TransactionException(new Error('Transaction failed to be broadcasted'), { contextModule: 'Keplr' });
  }

  return Buffer.from(result).toString('hex');
}
