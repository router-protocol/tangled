import { WalletAdapter as SolanaWalletAdapter } from '@solana/wallet-adapter-base';
import { VersionedTransaction as SolanaVersionedTransaction } from '@solana/web3.js';
import { sendTransaction as sendEVMTransaction } from '@wagmi/core';
import { Address as EVMAddress } from 'viem';
import { ConnectionOrConfig } from '../hooks/useConnectionOrConfig.js';
import { ChainData, ChainType } from '../types/index.js';

export type SendTransactionParams<C extends ChainType = ChainType> = {
  chain: ChainData<C>;
  to: string;
  from: string;
  value: bigint;
  args: TransactionArgs<C>;
  overrides: any;
  config: ConnectionOrConfig & {
    solanaWallet: SolanaWalletAdapter;
  };
};

type TransactionArgs<C extends ChainType> = C extends 'evm'
  ? {
      calldata: string;
    }
  : C extends 'tron'
    ? {
        calldata: string;
      }
    : C extends 'solana'
      ? {
          versionedTx: SolanaVersionedTransaction;
        }
      : C extends 'alephZero'
        ? {
            z: string;
          }
        : never;

/**
 * Send transaction. Does not wait for the transaction to be mined.
 * @param chain - {@link ChainData}
 * @param to - Recipient address
 * @param from - Sender address
 * @param value - Value to send
 * @param args - Additional arguments
 * @param config - {@link ConnectionOrConfig}
 */
export const sendTransactionToChain = async <C extends ChainType>({
  chain,
  to,
  from,
  value,
  args,
  config,
  overrides,
}: SendTransactionParams<C>) => {
  if (chain.type === 'evm') {
    const { calldata } = args as TransactionArgs<'evm'>;
    // send transaction to EVM chain
    const tx = await sendEVMTransaction(config.wagmiConfig, {
      account: from as EVMAddress,
      to: to as EVMAddress,
      value,
      chainId: chain.id,
      data: calldata as `0x${string}`,
      ...overrides,
    });

    return tx;
  }

  if (chain.type === 'tron') {
    const { calldata } = args as TransactionArgs<'tron'>;
    // send transaction to Tron chain
    const signedTx = await config.tronWeb.trx.sign(calldata);
    const tx = await config.tronWeb.trx.sendHexTransaction(signedTx);
    return tx.txid;
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

    // send transaction to Solana chain
    const txSignature = await config.solanaWallet.sendTransaction(versionedTx, config.solanaConnection);
    return txSignature;
  }

  if (chain.type === 'alephZero') {
    // send transaction to Aleph chain
  }

  throw new Error('Chain not supported');
};
