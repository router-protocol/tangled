import { Connection, ParsedAccountData, PublicKey } from '@solana/web3.js';
import { Config } from 'wagmi';
import { ChainData } from '../types/index.js';
import { getEVMTokenBalanceAndAllowance, getEVMTokenMetadata } from './evm/getEVMToken.js';
import { getTronWeb } from './tron/getTronweb.js';

type GetTokenMetadataParams = {
  address: string;
  chain: ChainData;
  wagmiConfig: Config;
};
export const getTokenMetadata = async ({ address, chain, wagmiConfig }: GetTokenMetadataParams) => {
  // evm chain
  if (chain?.type === 'evm') {
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
  address: string;
  account: string;
  spender: string | undefined;
  chain: ChainData;
  wagmiConfig: Config;
};
export const getTokenBalanceAndAllowance = async ({
  address,
  account,
  spender,
  chain,
  wagmiConfig,
}: GetTokenBalanceAndAllowanceParams) => {
  let balance: bigint, allowance: bigint;
  // evm chain
  if (chain?.type === 'evm') {
    const balanceAndAllowance = await getEVMTokenBalanceAndAllowance(
      address,
      account,
      spender,
      Number(chain.id),
      wagmiConfig,
    );
    balance = balanceAndAllowance.balance;
    allowance = balanceAndAllowance.allowance;
  } else {
    throw new Error('Chain type not supported');
  }

  return {
    balance,
    allowance,
  };
};
