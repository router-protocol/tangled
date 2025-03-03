import { MsgExecuteContractCompat } from '@injectivelabs/sdk-ts';
import { type ChainData, type SendTransactionMutationParams, type TransactionArgs } from '@tangled3/react';

export type CosmosCoin = {
  denom: string;
  amount: string;
};

export function isCosmosCoinArray(value: string | CosmosCoin[] | CosmosCoin | undefined): value is CosmosCoin[] {
  return Array.isArray(value);
}

export function toUtf8(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

export const buildNitroTransaction = async (
  pfTransaction: any,
  sourceChain: ChainData,
): Promise<SendTransactionMutationParams> => {
  const transactionData = pfTransaction.txn;
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
      to: transactionData.to,
      from: transactionData.from,
      args,
      overrides: undefined,
    };
  }

  if (sourceChain.type === 'cosmos') {
    let messages:
      | {
          typeUrl: string;
          value: Record<string, unknown>;
        }
      | undefined;

    if (sourceChain.id === 'osmosis-1') {
      messages = {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: {
          sender: transactionData.from,
          contract: transactionData.to,
          msg: toUtf8(JSON.stringify(transactionData.data)),
          funds: isCosmosCoinArray(transactionData.value) ? [...transactionData.value] : [],
        },
      };

      if (messages) {
        const args: TransactionArgs<'cosmos'> = {
          messages: [messages],
          memo: undefined,
          routerChainArgs: undefined,
        };

        const txnValue =
          isCosmosCoinArray(transactionData.value) && transactionData.value.length > 0 && transactionData.value[0]
            ? BigInt(transactionData.value[0].amount)
            : BigInt(transactionData.value as string);

        return {
          chain: sourceChain,
          value: txnValue,
          to: transactionData.to,
          from: transactionData.from,
          args,
          overrides: {},
        };
      }
    }

    if (sourceChain.id === 'injective-888') {
      const msg = MsgExecuteContractCompat.fromJSON({
        sender: transactionData.from,
        contractAddress: transactionData.to,
        msg: transactionData.data,
        funds: isCosmosCoinArray(transactionData.value) ? [...transactionData.value] : [],
      });

      return {
        chain: sourceChain,
        value: transactionData.value,
        to: transactionData.to,
        from: transactionData.from,
        args: {
          calldata: '',
          injectiveArgs: { msg },
        },
        overrides: {},
      };
    }
  }

  throw new Error('Unsupported chain type');
};
