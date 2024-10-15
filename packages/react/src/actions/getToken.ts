import { ParsedAccountData, PublicKey } from '@solana/web3.js';
import { getBalance } from '@wagmi/core';
import { Address as EVMAddress } from 'viem';
import { trc20Abi } from '../constants/abi/trc20.js';
import { ETH_ADDRESS, SOL_ADDRESS } from '../constants/index.js';
import { TokenMetadata } from '../hooks/useToken.js';
import { ChainData, ChainId, ChainType, ConnectionOrConfig, GetTokenMetadataParams } from '../types/index.js';
import { areTokensEqual } from '../utils/index.js';
import { getAlephZeroTokenBalanceAndAllowance, getAlephZeroTokenMetadata } from './alephZero/getAlephZeroToken.js';
import { getBitcoinApiConfig } from './bitcoin/bitcoinApiConfig.js';
import { fetchBalance } from './bitcoin/transaction.js';
import { getEVMTokenBalanceAndAllowance, getEVMTokenMetadata } from './evm/getEVMToken.js';
import { getSolanaTokenBalanceAndAllowance } from './solana/getSolanaToken.js';
import { getTonTokenBalanceAndAllowance, getTonTokenMetadata } from './ton/getTonToken.js';

/**
 * Get token metadata
 * @param token - Token address
 * @param chain - {@link ChainData}
 * @param config {@link ConnectionOrConfig}
 * @returns Token metadata {@link TokenMetadata}
 */
export const getTokenMetadata = async ({ token, chain, config }: GetTokenMetadataParams): Promise<TokenMetadata> => {
  // evm chain
  if (chain?.type === 'evm') {
    if (areTokensEqual(token, ETH_ADDRESS)) {
      return {
        name: chain.nativeCurrency.name,
        symbol: chain.nativeCurrency.symbol,
        decimals: chain.nativeCurrency.decimals,
        address: ETH_ADDRESS,
        chainId: chain.id.toString() as ChainId,
      };
    }

    const { name, symbol, decimals } = await getEVMTokenMetadata(token, Number(chain.id), config.wagmiConfig);
    return { name, symbol, decimals, address: token, chainId: chain.id.toString() as ChainId };
  }

  if (chain.type === 'tron') {
    if (areTokensEqual(token, ETH_ADDRESS)) {
      return { ...chain.nativeCurrency, address: ETH_ADDRESS, chainId: chain.id };
    }
    let contractAddress: string = token;
    // = config.tronWeb.address.fromHex(token);
    if (token.startsWith('0x')) {
      contractAddress = config.tronWeb.address.fromHex(token);
    }

    const contract = config.tronWeb.contract(trc20Abi, contractAddress);

    let name = contract.name().call();
    let symbol = contract.symbol().call();
    let decimals = contract.decimals().call();

    [name, symbol, decimals] = await Promise.all([name, symbol, decimals]);

    return { name, symbol, decimals: Number(decimals), address: token, chainId: chain.id };
  }

  if (chain.type === 'solana') {
    if (areTokensEqual(token, SOL_ADDRESS)) {
      return { ...chain.nativeCurrency, address: SOL_ADDRESS, chainId: chain.id };
    }

    const pbKey = new PublicKey(token);
    const mint = await config.solanaConnection.getParsedAccountInfo(pbKey);
    const parsed = (mint.value?.data as ParsedAccountData)?.parsed;

    // TODO: add token fetch from metadata
    if (parsed.info?.decimals) {
      return {
        name: '',
        symbol: '',
        decimals: parsed.info.decimals,
        address: token,
        chainId: chain.id,
      };
    } else {
      throw new Error('Token metadata not found');
    }
  }

  if (chain.type === 'alephZero') {
    if (areTokensEqual(token, ETH_ADDRESS)) {
      return { ...chain.nativeCurrency, address: ETH_ADDRESS, chainId: chain.id };
    }
    const res = await getAlephZeroTokenMetadata({ api: config.alephZeroApi, token });
    return {
      ...res,
      chainId: chain.id,
    };
  }

  if (chain.type === 'ton') {
    if (areTokensEqual(token, ETH_ADDRESS)) {
      return { ...chain.nativeCurrency, address: ETH_ADDRESS, chainId: chain.id };
    }
    const res = await getTonTokenMetadata({ token, chainId: chain.id });
    return {
      ...res,
      chainId: chain.id,
    };
  }

  throw new Error('Chain type not supported');
};

export type GetTokenBalanceAndAllowanceParams<CData extends ChainData> = {
  token: string;
  account: string;
  spender: string | undefined;
  chain: CData;
  config: ConnectionOrConfig;
};
export type GetTokenBalanceAndAllowanceResponse<CType extends ChainType> = CType extends 'solana'
  ? {
      balance: bigint;
      associatedTokenAccountAddress: string | undefined;
      isAtaDeployed: boolean;
      /** Delegated amount */
      allowance: bigint;
    }
  : {
      balance: bigint;
      allowance: bigint;
    };
export type GetTokenBalanceAndAllowanceFunction = <CData extends ChainData>(
  params: GetTokenBalanceAndAllowanceParams<CData>,
) => Promise<GetTokenBalanceAndAllowanceResponse<CData['type']>>;
/**
 * Get token balance and allowance for a given account and spender
 * @param token - Token address
 * @param account - Account address
 * @param spender - Spender address
 * @param chain - Chain data
 * @param config - {@link ConnectionOrConfig}
 * @returns Token balance and allowance as bigint
 */
export const getTokenBalanceAndAllowance = (async (params) => {
  const { token, account, spender, chain, config } = params;

  // evm chain
  if (chain.type === 'evm') {
    if (areTokensEqual(token, ETH_ADDRESS)) {
      const result = {
        balance: await getBalance(config.wagmiConfig, {
          address: account as EVMAddress,
          chainId: Number(chain.id),
        }).then((res) => BigInt(res.value)),
        allowance: BigInt(0),
      };
      return result;
    }
    return await getEVMTokenBalanceAndAllowance(token, account, spender, Number(chain.id), config.wagmiConfig);
  }

  if (chain.type === 'tron') {
    if (areTokensEqual(token, ETH_ADDRESS)) {
      const balance = BigInt(await config.tronWeb.trx.getBalance(account));
      const allowance = BigInt(0);
      return { balance, allowance };
    }

    let contractAddress: string = token;
    // = config.tronWeb.address.fromHex(token);
    if (token.startsWith('0x')) {
      contractAddress = config.tronWeb.address.fromHex(token);
    }

    const contract = config.tronWeb.contract(trc20Abi, contractAddress);
    const balance = await contract.balanceOf(account).call();
    const allowance = spender ? await contract.allowance(account, spender).call() : BigInt(0);
    return { balance, allowance };
  }

  if (chain.type === 'solana') {
    const pbKey = new PublicKey(token);

    // if asset is native solana token
    if (areTokensEqual(token, SOL_ADDRESS)) {
      const balance = BigInt(await config.solanaConnection.getBalance(pbKey));
      return { balance, allowance: 0n };
    }

    const { balance, associatedTokenAccountAddress, isAtaDeployed, delegatedAmount } =
      await getSolanaTokenBalanceAndAllowance({
        connection: config.solanaConnection,
        account: new PublicKey(account),
        token: pbKey,
        spender: spender ? new PublicKey(spender) : undefined,
      });

    return { balance, associatedTokenAccountAddress, isAtaDeployed, allowance: delegatedAmount };
  }

  if (chain.type === 'alephZero') {
    return getAlephZeroTokenBalanceAndAllowance({
      api: config.alephZeroApi,
      account,
      token,
      spender,
    });
  }

  if (chain.type === 'ton') {
    return getTonTokenBalanceAndAllowance({
      account,
      token,
      spender,
      config,
    });
  }

  if (chain.type === 'bitcoin') {
    const balance =
      (await fetchBalance(getBitcoinApiConfig(chain.id !== 'bitcoin', 'blockstream'), account)) ||
      (await fetchBalance(getBitcoinApiConfig(chain.id !== 'bitcoin', 'mempool'), account));

    if (balance === null) {
      throw new Error('Failed to fetch bitcoin balance');
    }

    return { balance, allowance: 0n };
  }

  throw new Error('Chain type not supported');
}) as GetTokenBalanceAndAllowanceFunction;
