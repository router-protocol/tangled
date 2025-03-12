import { type ChainData, type SendTransactionMutationParams, type TransactionArgs } from '@tangled3/react';
import type { TransactionData } from './types';
import { type PathfinderTransaction, type TxnDataBitcoin } from './types';

export const buildNitroTransaction = async (
  pfTransaction: PathfinderTransaction,
  sourceChain: ChainData,
): Promise<SendTransactionMutationParams> => {
  const transactionData = pfTransaction.txn as TransactionData;
  if (sourceChain.type === 'evm') {
    return {
      chain: sourceChain,
      value: BigInt(transactionData.value as string),
      to: transactionData.to,
      from: transactionData.from,
      args: { calldata: transactionData.data as string },
      overrides: undefined,
    };
  }
  if (sourceChain.type === 'tron') {
    if (!transactionData.raw_data_hex) {
      throw new Error('Tron transaction has no raw data hex');
    }
    const args: TransactionArgs<'tron'> = {
      calldata: transactionData.raw_data_hex,
    };
    return {
      chain: sourceChain,
      value: BigInt((transactionData.value as string) ?? '0'),
      to: 'TTZLTNUMMJ1AxEXa2oQBQzarNHccqYB3Ye',
      from: 'TABd1oGDnR5SntsXxiKZYGfYQ1kNfyLUHx',
      args,
      overrides: undefined,
    };
  }

  //   if (sourceChain.type === "cosmos") {
  //     if (sourceChain.id === "router_9600-1") {
  //       if (connector.type === "cosmos") {
  //         return {
  //           chain: sourceChain,
  //           to: transactionData.to,
  //           from: transactionData.from,
  //           value: 0n,
  //           args: {
  //             messages: [],
  //             routerChainArgs: {
  //               executeMsg: transactionData.data as TxnDataRouter,
  //               funds: isCosmosCoinArray(transactionData.value ?? []) ? transactionData.value : [transactionData.value],
  //             },
  //           } as TransactionArgs<"cosmos">,
  //           overrides: {
  //             walletType: "keplr",
  //           },
  //         };
  //       } else {
  //         return {
  //           chain: routerEvm,
  //           to: transactionData.to,
  //           from: transactionData.from,
  //           value: 0n,
  //           args: {
  //             calldata: "",
  //             routerChainArgs: {
  //               executeMsg: transactionData.data as TxnDataRouter,
  //               funds: isCosmosCoinArray(transactionData.value ?? []) ? transactionData.value : [transactionData.value],
  //             },
  //           } as TransactionArgs<"evm">,
  //           overrides: {
  //             walletType: "evm",
  //           },
  //         };
  //       }
  //     }

  //     let messages:
  //       | {
  //           typeUrl: string;
  //           value: Record<string, unknown>;
  //         }
  //       | undefined;

  //     if (sourceChain.id === "osmosis-1") {
  //       messages = {
  //         typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
  //         value: {
  //           sender: transactionData.from,
  //           contract: transactionData.to,
  //           msg: toUtf8(JSON.stringify(transactionData.data)),
  //           funds: isCosmosCoinArray(transactionData.value) ? [...transactionData.value] : [],
  //         },
  //       };
  //     } else if (sourceChain.id === "self-1") {
  //       if (!isCosmosCoinArray(transactionData.value ?? [])) {
  //         throw new Error("Expected CosmosCoin array for value in self-1 chain");
  //       }

  //       if (!isTxnDataSelf(transactionData.data)) {
  //         throw new Error("Expected TxnDataSelf for data in self-1 chain");
  //       }

  //       const txnValue = transactionData.value as CosmosCoin[];
  //       if (!txnValue[0]) {
  //         throw new Error("Expected at least one coin in value array");
  //       }

  //       const coin: CosmosCoin = {
  //         denom: txnValue[0].denom,
  //         amount: txnValue[0].amount,
  //       };

  //       messages = {
  //         typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
  //         value: {
  //           sourcePort: transactionData.data.srcPort,
  //           sourceChannel: transactionData.data.srcChannel,
  //           token: coin,
  //           sender: transactionData.from,
  //           receiver: transactionData.to,
  //           timeoutTimestamp: (Date.now() + 240 * 1000) * 1_000_000,
  //           memo: transactionData.data.memo,
  //         },
  //       };
  //     }

  //     if (messages) {
  //       const args: TransactionArgs<"cosmos"> = {
  //         messages: [messages],
  //         memo: undefined,
  //         routerChainArgs: undefined,
  //       };

  //       const txnValue =
  //         isCosmosCoinArray(transactionData.value) && transactionData.value.length > 0 && transactionData.value[0]
  //           ? BigInt(transactionData.value[0].amount)
  //           : BigInt(transactionData.value as string);

  //       return {
  //         chain: sourceChain,
  //         value: txnValue,
  //         to: transactionData.to,
  //         from: transactionData.from,
  //         args,
  //         overrides: {},
  //       };
  //     }
  //   }

  if (sourceChain.type === 'bitcoin') {
    const args: TransactionArgs<'bitcoin'> = {
      memo: (transactionData.data as TxnDataBitcoin).params[0].memo,
    };
    return {
      chain: sourceChain,
      value: BigInt((transactionData.data as TxnDataBitcoin).params[0].amount.amount),
      to: transactionData.to,
      from: transactionData.from,
      args,
      overrides: undefined,
    };
  }

  if (sourceChain.type === 'sui') {
    // const byteArray = hexToUint8Array(transactionData.data as string);
    // const args: TransactionArgs<"sui"> = {
    //   tx: SuiTransaction.from(byteArray),
    // };
    // return {
    //   chain: sourceChain,
    //   value: 0n,
    //   to: pfTransaction.receiverAddress,
    //   from: transactionData.from,
    //   args,
    //   overrides: undefined,
    // };
  }

  throw new Error('Unsupported chain type');
};
