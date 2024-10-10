import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { assets } from 'chain-registry';
import { ChainData, ChainId, ConnectionOrConfig } from '../../types/index.js';

export const getCosmosTokenMetadata = async ({ token, chainId }: { token: string; chainId: ChainId }) => {
  const chainAssets = assets.find((chain) => chain.chain_name === 'osmosis');
  // console.log("[Token] asset",chainId,chainAssets)
  const asset = chainAssets?.assets.find((asset) => asset.base === token);

  if (!asset) {
    throw new Error('Token not supported');
  }
  return {
    symbol: asset.symbol,
    name: asset.name,
    decimals: asset.denom_units[1].exponent,
    address: asset.address,
  };
};

export const getCosmosTokenBalanceAndAllowance = async ({
  account,
  token,
  spender,
  config,
  chain,
}: {
  account: string;
  token: string;
  spender: string | undefined;
  config: ConnectionOrConfig;
  chain: ChainData | undefined;
}) => {
  let balance = 0n;
  let allowance = 0n;
  try {
    const tokenBalance = await config.cosmosClient.getBalance(account, token);
    if (token.toLowerCase().startsWith('ibc') || token.toLowerCase().startsWith('factory')) {
      return {
        balance: BigInt(tokenBalance.amount),
        allowance: 10000n,
      };
    }
    // const client = await CosmWasmClient.connect(chain?.rpcUrls.default.http[0]);
    const client = await CosmWasmClient.connect('https://rpc-osmosis.blockapsis.com');
    const queryresult = await client.queryContractSmart(token, {
      allowance: {
        owner: account,
        spender: spender,
      },
    });
    allowance = BigInt(queryresult.allowance);
  } catch (error) {
    console.error('Failed to fetch allowance:', error);
    throw error;
  }

  return {
    balance,
    allowance,
  };
};
