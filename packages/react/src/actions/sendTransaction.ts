import { Signer, SubmittableExtrinsic } from '@polkadot/api/types';
import { VersionedTransaction as SolanaVersionedTransaction } from '@solana/web3.js';
import { Cell } from '@ton/ton';
import { CHAIN } from '@tonconnect/ui-react';
import { sendTransaction as sendEVMTransaction } from '@wagmi/core';
import { Address as EVMAddress } from 'viem';
import { ChainData, ChainType, ConnectionOrConfig } from '../types/index.js';
import { WalletInstance } from '../types/wallet.js';
import { NO_DEPOSIT, THIRTY_TGAS } from './near/readCalls.js';

export type SendTransactionParams<CData extends ChainData> = {
  chain: CData;
  to: string;
  from: string;
  value: bigint;
  args: TransactionArgs<CData['type']>;
  overrides: any;
  config: ConnectionOrConfig & {
    connector: WalletInstance<CData['type']>;
  };
};

type TransactionArgs<CType extends ChainType> = CType extends 'evm' | 'tron'
  ? {
      calldata: string;
    }
  : CType extends 'solana'
    ? {
        versionedTx: SolanaVersionedTransaction;
      }
    : CType extends 'alephZero'
      ? {
          submittableExtrinsic: SubmittableExtrinsic<'promise' | 'rxjs'>;
        }
      : CType extends 'ton'
        ? {
            tonArgs: {
              validUntil: number; // transaction deadline in unix epoch seconds.
              network?: CHAIN; // (MAINNET: "-239" & TESTNET: "-3")
              payload?: string;
              stateInit?: string;
            };
          }
        : CType extends 'near'
          ? {
              nearArgs: {
                transactionType:
                  | 'CreateAccount'
                  | 'DeployContract'
                  | 'FunctionCall'
                  | 'Transfer'
                  | 'Stake'
                  | 'AddKey'
                  | 'DeleteKey'
                  | 'DeleteAccount';
                signerId?: string;
                methodName?: string;
                args?: object;
                gas?: string;
                deposit?: string;
              };
            }
          : never;

type SendTransactionReturnType<C extends ChainType> = C extends 'alephZero'
  ? {
      txHash: string;
      block: string;
      txIndex: number;
    }
  : { txHash: string };

export type SendTransactionToChainFunction = <CData extends ChainData>(
  params: SendTransactionParams<CData>,
) => Promise<SendTransactionReturnType<CData['type']>>;

/**
 * Send transaction. Does not wait for the transaction to be mined.
 * @param chain - {@link ChainData}
 * @param to - Recipient address
 * @param from - Sender address
 * @param value - Value to send
 * @param args - Additional arguments
 * @param config - {@link ConnectionOrConfig}
 */
export const sendTransactionToChain = (async ({ chain, to, from, value, args, config, overrides }) => {
  if (chain.type === 'evm') {
    const { calldata } = args as TransactionArgs<'evm'>;
    // send transaction to EVM chain
    const txHash = await sendEVMTransaction(config.wagmiConfig, {
      account: from as EVMAddress,
      to: to as EVMAddress,
      value,
      chainId: chain.id,
      data: calldata as `0x${string}`,
      ...overrides,
    });

    return {
      txHash,
    };
  }

  if (chain.type === 'tron') {
    const { calldata } = args as TransactionArgs<'tron'>;
    // send transaction to Tron chain
    const signedTx = await config.tronWeb.trx.sign(calldata);
    const tx = await config.tronWeb.trx.sendHexTransaction(signedTx);

    return {
      txHash: tx.txid,
    };
  }

  if (chain.type === 'solana') {
    const { versionedTx } = args as TransactionArgs<'solana'>;
    // simulate transaction before sending
    const simulationResult = await config.solanaConnection.simulateTransaction(versionedTx, {
      commitment: 'confirmed',
    });
    if (simulationResult.value.err) {
      throw new Error(`Transaction simulation failed with error ${JSON.stringify(simulationResult.value.err)}`);
    }

    const walletConnector = config.connector as WalletInstance<'solana'>;
    // send transaction to Solana chain
    const txSignature = await walletConnector.sendTransaction(versionedTx, config.solanaConnection);

    return { txHash: txSignature };
  }

  if (chain.type === 'alephZero') {
    let txnHash: string | undefined = undefined;
    let block: string | undefined = undefined;
    let extrinsicId: number | undefined = undefined;

    const walletConnector = config.connector as WalletInstance<'alephZero'>;

    // send transaction to Aleph chain
    const { submittableExtrinsic } = args as TransactionArgs<'alephZero'>;
    await submittableExtrinsic.signAndSend(
      from,
      { signer: walletConnector.signer as Signer },
      ({ events, status, txHash, txIndex }) => {
        events.forEach(({ event }) => {
          const { method } = event;

          if (method === 'ExtrinsicSuccess' && status.type === 'InBlock') {
            txnHash = txHash.toString();
            block = status.asFinalized.toHex();
            extrinsicId = txIndex;
          } else if (method === 'ExtrinsicFailed') {
            throw new Error(`Transaction failed: ${method}`);
          }
        });
      },
    );

    if (txnHash === undefined || block === undefined || extrinsicId === undefined) {
      throw 'Trasaction failed';
    }

    return {
      txHash: txnHash,
      block: block,
      txIndex: extrinsicId,
    };
  }

  if (chain.type === 'ton') {
    const { tonArgs } = args as TransactionArgs<'ton'>;
    const messages: Array<{
      address: string;
      amount: string;
      payload?: string;
      stateInit?: string;
    }> = [
      {
        address: to,
        amount: value.toString(),
        payload: tonArgs.payload,
        stateInit: tonArgs.stateInit,
      },
    ];
    const transaction = {
      from,
      messages,
      network: tonArgs.network,
      validUntil: tonArgs.validUntil,
    };

    const walletConnector = config.connector as WalletInstance<'ton'>;
    // send transaction to TON chain
    const tx = await walletConnector.sendTransaction(transaction);

    const cell = Cell.fromBase64(tx.boc);
    const buffer = cell.hash();
    const hashHex = buffer.toString('hex');

    return { txHash: hashHex };
  }

  if (chain.type === 'near') {
    const { nearArgs } = args as TransactionArgs<'near'>;

    // sendTransaction to NEAR chain
    const tx = await config.connector.signAndSendTransaction({
      receiverId: to,
      signerId: nearArgs.signerId,
      actions: [
        {
          type: nearArgs.transactionType,
          params: {
            methodName: nearArgs.methodName,
            args: nearArgs.args,
            gas: nearArgs.gas ?? THIRTY_TGAS,
            deposit: nearArgs.transactionType === 'Transfer' ? value : nearArgs.deposit ?? NO_DEPOSIT,
          },
        },
      ],
    });

    return { txHash: tx.transaction.hash };
  }

  throw new Error('Chain not supported');
}) as SendTransactionToChainFunction;
