import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { maxInt256 } from 'viem';
import { ChainData, ConnectionOrConfig, CosmsosChainType } from '../../types/index.js';
import { areTokensEqual, formatTokenAddress, isNativeOrFactoryToken } from '../../utils/index.js';

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

  const asset = assetList.find((asset) => areTokensEqual(asset.base, token));

  if (!asset) {
    throw new Error('Token not found');
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
    const { getNetworkInfo, ChainGrpcWasmApi, ChainGrpcBankApi, getRouterSignerAddress, toUtf8 } = await import(
      '@routerprotocol/router-chain-sdk-ts'
    );

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
      const wasmClient = new ChainGrpcWasmApi(network.grpcEndpoint);

      const address = getRouterSignerAddress(account);
      if (!address) {
        throw new Error(`Invalid address to convert to Router: ${account}`);
      }

      const balance = await wasmClient.fetchSmartContractState(
        token,
        toUtf8(
          JSON.stringify({
            balance: { address },
          }),
        ),
      );

      return {
        balance: BigInt(balance.data.balance),
        allowance: maxInt256,
      };
    }
  }
  const cosmwasmClient = await SigningCosmWasmClient.connect(chain.rpcUrls.default.http[0]);
  const formattedToken = formatTokenAddress(token);

  //  For native/factory tokens
  if (isNativeOrFactoryToken(token, chain)) {
    const nativeTokenBalance = await cosmwasmClient.getBalance(account, formattedToken);

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
