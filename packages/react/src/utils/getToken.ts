import { ParsedAccountData, PublicKey, Connection as SolanaConnection } from '@solana/web3.js';
import { getBalance } from '@wagmi/core';
import { type TronWeb } from 'tronweb';
import { Address as EVMAddress } from 'viem';
import { Config } from 'wagmi';
import { trc20Abi } from '../constants/abi/trc20.js';
import { ETH_ADDRESS, SOL_ADDRESS } from '../constants/index.js';
import { ChainData } from '../types/index.js';
import { getEVMTokenBalanceAndAllowance, getEVMTokenMetadata } from './evm/getEVMToken.js';
import { areTokensEqual } from './index.js';
import { getSolanaTokenBalanceAndAllowance } from './solana/getSolanaToken.js';

type GetTokenMetadataParams = {
  token: string;
  chain: ChainData;
  wagmiConfig: Config;
  solanaConnection: SolanaConnection;
  tronWeb: TronWeb;
};
export const getTokenMetadata = async ({
  token,
  chain,
  wagmiConfig,
  solanaConnection,
  tronWeb,
}: GetTokenMetadataParams) => {
  // evm chain
  if (chain?.type === 'evm') {
    if (areTokensEqual(token, ETH_ADDRESS)) {
      return {
        name: chain.nativeCurrency.name,
        symbol: chain.nativeCurrency.symbol,
        decimals: chain.nativeCurrency.decimals,
        address: ETH_ADDRESS,
      };
    }

    const { name, symbol, decimals } = await getEVMTokenMetadata(token, Number(chain.id), wagmiConfig);
    return { name, symbol, decimals, address: token };
  }

  if (chain.type === 'tron') {
    const contract = tronWeb.contract(trc20Abi, token);

    let name = contract.name().call();
    let symbol = contract.symbol().call();
    let decimals = contract.decimals().call();

    [name, symbol, decimals] = await Promise.all([name, symbol, decimals]);

    return { name, symbol, decimals: Number(decimals), address: token };
  }

  if (chain.type === 'solana') {
    const pbKey = new PublicKey(token);
    const mint = await solanaConnection.getParsedAccountInfo(pbKey);
    const parsed = (mint.value?.data as ParsedAccountData)?.parsed;

    // TODO: add token fetch from metadata
    if (parsed.info?.decimals) {
      return {
        name: '',
        symbol: '',
        decimals: parsed.info.decimals,
        address: token,
      };
    } else {
      throw new Error('Token metadata not found');
    }
  }

  throw new Error('Chain type not supported');
};

type GetTokenBalanceAndAllowanceParams = {
  token: string;
  account: string;
  spender: string | undefined;
  chain: ChainData;
  wagmiConfig: Config;
  solanaConnection: SolanaConnection;
  tronWeb: TronWeb;
};
export const getTokenBalanceAndAllowance = async ({
  token,
  account,
  spender,
  chain,
  wagmiConfig,
  solanaConnection,
  tronWeb,
}: GetTokenBalanceAndAllowanceParams) => {
  // evm chain
  if (chain?.type === 'evm') {
    if (areTokensEqual(token, ETH_ADDRESS)) {
      return {
        balance: getBalance(wagmiConfig, {
          address: account as EVMAddress,
          chainId: Number(chain.id),
        }),
        allowance: BigInt(0),
      };
    }
    const balanceAndAllowance = await getEVMTokenBalanceAndAllowance(
      token,
      account,
      spender,
      Number(chain.id),
      wagmiConfig,
    );
    const balance = balanceAndAllowance.balance;
    const allowance = balanceAndAllowance.allowance;
    return { balance, allowance };
  }

  if (chain.type === 'tron') {
    if (areTokensEqual(token, ETH_ADDRESS)) {
      const balance = BigInt(await tronWeb.trx.getBalance(account));
      const allowance = BigInt(0);
      return { balance, allowance };
    }

    const contract = tronWeb.contract(trc20Abi, token);
    const balance = await contract.balanceOf(account).call();
    const allowance = spender ? await contract.allowance(account, spender).call() : BigInt(0);
    return { balance, allowance };
  }

  if (chain.type === 'solana') {
    const pbKey = new PublicKey(token);

    // if asset is native solana token
    if (areTokensEqual(token, SOL_ADDRESS)) {
      const balance = BigInt(await solanaConnection.getBalance(pbKey));
      return { balance, allowance: 0n };
    }

    const { balance, allowance } = await getSolanaTokenBalanceAndAllowance({
      connection: solanaConnection,
      account: new PublicKey(account),
      token: pbKey,
      spender: spender ? new PublicKey(spender) : undefined,
    });

    return { balance, allowance };
  }

  throw new Error('Chain type not supported');
};
