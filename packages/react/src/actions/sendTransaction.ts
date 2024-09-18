import { Signer, SubmittableExtrinsic } from '@polkadot/api/types';
import { VersionedTransaction as SolanaVersionedTransaction } from '@solana/web3.js';
import { sendTransaction as sendEVMTransaction } from '@wagmi/core';
import { Address as EVMAddress } from 'viem';
import { ChainData, ChainType, ConnectionOrConfig } from '../types/index.js';
import { WalletInstance } from '../types/wallet.js';

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

  throw new Error('Chain not supported');
}) as SendTransactionToChainFunction;
