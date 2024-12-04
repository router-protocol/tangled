import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { multicall } from '@wagmi/core';
import { Address as EVMAddress, erc20Abi } from 'viem';
import { trc20Abi } from '../constants/abi/trc20.js';
import { tronMulticallAbi } from '../constants/abi/tronMulticall.js';
import { ChainData, ConnectionOrConfig, OtherChainData } from '../types/index.js';
import { viewMethodOnNear } from './near/readCalls.js';

export const getBalances = async (
  tokens: { address: string }[],
  chain: ChainData,
  account: string,
  config: ConnectionOrConfig,
): Promise<Record<string, bigint>> => {
  if (chain.type === 'evm') {
    const balancesMulticall = [];

    for (const token of tokens) {
      balancesMulticall.push({
        address: token.address as EVMAddress,
        functionName: 'balanceOf',
        abi: erc20Abi,
        args: [account],
      });
    }
    const balances = multicall(config.wagmiConfig, {
      contracts: balancesMulticall,
      allowFailure: true,
      batchSize: 100,
      chainId: Number(chain.id),
    }).then((res) =>
      res.reduce(
        (acc, value, index) => {
          acc[tokens[index].address] = BigInt(value.result ?? '0');
          return acc;
        },
        {} as Record<string, bigint>,
      ),
    );
    return balances;
  }

  if (chain.type === 'tron') {
    if (!chain.contracts?.multicall) {
      throw new Error('Multicall contract not found');
    }
    const contract = config.tronWeb.contract(tronMulticallAbi, chain.contracts.multicall);
    const calls = [];

    for (const token of tokens) {
      calls.push({
        address: token.address as EVMAddress,
        functionName: 'balanceOf',
        abi: trc20Abi,
        args: [account],
      });
    }

    const balancesCall = contract.multicall(calls).call();
    return balancesCall;
  }

  if (chain.type === 'solana') {
    const pubkey = new PublicKey(account);
    const connection = config.solanaConnection;

    const tokenAccountsCall = connection.getTokenAccountsByOwner(pubkey, { programId: TOKEN_PROGRAM_ID }, {});
    const token2022AccountsCall = connection.getTokenAccountsByOwner(pubkey, { programId: TOKEN_2022_PROGRAM_ID });

    const [tokenAccounts, token2022Accounts] = await Promise.all([tokenAccountsCall, token2022AccountsCall]);

    const tokenBalances = tokenAccounts.value.reduce(
      (acc, value) => {
        // @ts-expect-error Buffer is not typed
        const data = value.account.data.parsed;
        const address = data.info.mint;
        const balance = data.info.tokenAmount.amount;
        acc[address] = balance;
        return acc;
      },
      {} as Record<string, bigint>,
    );

    const tokenBalances2022 = token2022Accounts.value.reduce(
      (acc, value) => {
        // @ts-expect-error Buffer is not typed
        const data = value.account.data.parsed;
        const address = data.info.mint;
        const balance = data.info.tokenAmount.amount;
        acc[address] = balance;
        return acc;
      },
      {} as Record<string, bigint>,
    );

    const balances: Record<string, bigint> = {};

    for (const token of tokens) {
      balances[token.address] = tokenBalances[token.address] ?? tokenBalances2022[token.address] ?? 0n;
    }
    return balances;
  }

  if (chain.type === 'cosmos') {
    const balances: Record<string, bigint> = {};

    const cosmosClient = config.getCosmosClient().chainWallets[chain.id];

    const stargateClient = await cosmosClient.getStargateClient();

    // Use the client to fetch all balances for the account
    const accountBalances = await stargateClient.getAllBalances(account);

    // Process each balance and store it in the balances object
    accountBalances.forEach((balance) => {
      balances[balance.denom] = BigInt(balance.amount);
    });

    return balances;
  }

  if (chain.type === 'near') {
    const balances: Record<string, bigint> = {};

    for (const token of tokens) {
      balances[token.address] = BigInt(
        await viewMethodOnNear(chain as OtherChainData<'near'>, token.address, 'ft_balance_of', {
          account_id: account,
        }),
      );
    }

    return balances;
  }

  throw new Error('Unsupported chain type');
};
