import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { maxInt256 } from 'viem';
import { RouterLCDBalancesResponse } from '../../types/cosmos.js';
import { ChainData, ConnectionOrConfig, CosmsosChainType } from '../../types/index.js';
import getOverridenAssets from '../../utils/getOverridenAssetsForCosmos.js';
import { compareStrings, isCosmosNativeOrFactoryToken } from '../../utils/index.js';

export const getCosmosTokenMetadata = async ({
  token,
  chain,
  getCosmosClient,
}: {
  token: string;
  chain: CosmsosChainType;
  getCosmosClient: ConnectionOrConfig['getCosmosClient'];
}) => {
  const registryClient = await getCosmosClient().getChainRegistry();

  const assetList = registryClient.getChainAssetList(chain.chainName).assets;

  let asset = assetList.find((asset) => compareStrings(asset.base, token));

  if (!asset) {
    asset = getOverridenAssets({ chain, token });
    if (!asset) {
      throw new Error('Token not found');
    }
  }
  return {
    symbol: asset.symbol,
    name: asset.name,
    decimals: asset.denom_units[1].exponent,
    address: token,
  };
};

export const getCosmosTokenBalanceAndAllowance = async ({
  account,
  token,
  spender,
  chain,
}: {
  account: string;
  token: string;
  spender: string | undefined;
  chain: ChainData;
}): Promise<{
  balance: bigint;
  allowance: bigint;
}> => {
  if (chain.id === 'router_9600-1') {
    const {
      getNetworkInfo,
      getEndpointsForNetwork,
      getNetworkType,
      restFetcher,
      ChainGrpcBankApi,
      getRouterSignerAddress,
    } = await import('@routerprotocol/router-chain-sdk-ts');

    const network = getNetworkInfo(chain.extra?.environment);
    if (token === 'route') {
      const bankClient = new ChainGrpcBankApi(network.grpcEndpoint);

      const accountAddress = getRouterSignerAddress(account);
      if (!accountAddress) {
        throw new Error(`Invalid address to convert to Router: ${account}`);
      }

      const routeBalance = await bankClient.fetchBalance({
        accountAddress,
        denom: 'route',
      });

      return {
        balance: BigInt(routeBalance.amount),
        allowance: maxInt256,
      };
    } else {
      const networkEnvironment = chain.id === 'router_9600-1' ? 'mainnet' : 'testnet';
      const lcdEndpoint = getEndpointsForNetwork(getNetworkType(networkEnvironment)).lcdEndpoint;
      const address = getRouterSignerAddress(account);
      if (!address) {
        throw new Error(`Invalid address to convert to Router: ${account}`);
      }

      const balancesData: RouterLCDBalancesResponse = await restFetcher(
        `${lcdEndpoint}/cosmos/bank/v1beta1/balances/${address}?pagination.limit=1000`,
      );
      const tokenBalance = balancesData.balances.find((balance) => balance.denom === token);

      if (!tokenBalance) {
        throw new Error(`Failed to fetch balance for token: ${token}`);
      }

      return {
        balance: BigInt(tokenBalance.amount),
        allowance: maxInt256,
      };
    }
  }
  const cosmwasmClient = await SigningCosmWasmClient.connect(chain.rpcUrls.default.http[0]);

  //  For native/factory tokens
  if (isCosmosNativeOrFactoryToken(token, chain)) {
    const nativeTokenBalance = await cosmwasmClient.getBalance(account, token);

    return {
      balance: BigInt(nativeTokenBalance.amount),
      allowance: maxInt256,
    };
  }

  // Querying both balance and allowance
  const [balanceResult, allowanceResult] = await Promise.all([
    cosmwasmClient.queryContractSmart(token, {
      balance: { address: account },
    }),
    cosmwasmClient.queryContractSmart(token, {
      allowance: {
        owner: account,
        spender: spender,
      },
    }),
  ]);

  return {
    balance: BigInt(balanceResult.amount),
    allowance: BigInt(allowanceResult.allowance.amount),
  };
};
