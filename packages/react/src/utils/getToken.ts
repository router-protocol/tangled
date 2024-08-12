import { Connection, ParsedAccountData, PublicKey } from '@solana/web3.js';
import { getBalance } from '@wagmi/core';
import { Address as EVMAddress } from 'viem';
import { Config } from 'wagmi';
import { ETH_ADDRESS, SOL_ADDRESS } from '../constants/index.js';
import { ChainData } from '../types/index.js';
import { getEVMTokenBalanceAndAllowance, getEVMTokenMetadata } from './evm/getEVMToken.js';
import { areTokensEqual } from './index.js';
import { getSolanaTokenBalanceAndAllowance } from './solana/getSolanaToken.js';
import { getTronWeb } from './tron/getTronweb.js';

type GetTokenMetadataParams = {
  address: string;
  chain: ChainData;
  wagmiConfig: Config;
};
export const getTokenMetadata = async ({ address, chain, wagmiConfig }: GetTokenMetadataParams) => {
  // evm chain
  if (chain?.type === 'evm') {
    if (areTokensEqual(address, ETH_ADDRESS)) {
      return {
        name: chain.nativeCurrency.name,
        symbol: chain.nativeCurrency.symbol,
        decimals: chain.nativeCurrency.decimals,
        address: ETH_ADDRESS,
      };
    }

    const { name, symbol, decimals } = await getEVMTokenMetadata(address, Number(chain.id), wagmiConfig);
    return { name, symbol, decimals, address };
  }

  if (chain.type === 'tron') {
    const tronWeb = getTronWeb(chain);

    const contract = await tronWeb.contract().at(address);
    let name = contract.name().call();
    let symbol = contract.symbol().call();
    let decimals = contract.decimals().call();

    [name, symbol, decimals] = await Promise.all([name, symbol, decimals]);

    return { name, symbol, decimals, address };
  }

  if (chain.type === 'solana') {
    const connection = new Connection(chain.rpcUrls.default.http[0], 'confirmed');

    const pbKey = new PublicKey(address);
    const mint = await connection.getParsedAccountInfo(pbKey);
    const parsed = (mint.value?.data as ParsedAccountData)?.parsed;

    // TODO: add token fetch from metadata
    if (parsed.info?.decimals) {
      return {
        name: '',
        symbol: '',
        decimals: parsed.info.decimals,
        address,
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
};
export const getTokenBalanceAndAllowance = async ({
  token,
  account,
  spender,
  chain,
  wagmiConfig,
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
    const tronWeb = getTronWeb(chain);

    if (areTokensEqual(token, ETH_ADDRESS)) {
      const balance = BigInt(await tronWeb.trx.getBalance(account));
      const allowance = BigInt(0);
      return { balance, allowance };
    }

    const contract = await tronWeb.contract().at(token);
    const balance = await contract.balanceOf(account).call();
    const allowance = spender ? await contract.allowance(account, spender).call() : BigInt(0);
    return { balance, allowance };
  }

  if (chain.type === 'solana') {
    const connection = new Connection(chain.rpcUrls.default.http[0], 'confirmed');
    const pbKey = new PublicKey(token);

    // if asset is native solana token
    if (areTokensEqual(token, SOL_ADDRESS)) {
      const balance = BigInt(await connection.getBalance(pbKey));
      return { balance, allowance: 0n };
    }

    const { balance, allowance } = await getSolanaTokenBalanceAndAllowance({
      connection,
      account: new PublicKey(account),
      token: pbKey,
      spender: spender ? new PublicKey(spender) : undefined,
    });

    return { balance, allowance };
  }

  throw new Error('Chain type not supported');
};
