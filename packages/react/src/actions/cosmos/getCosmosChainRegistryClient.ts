import {
  ChainRegistryClientOptions as BaseChainRegistryClientOptions,
  ChainRegistryChainUtil,
  ChainRegistryFetcher,
} from '@chain-registry/client';
import { AssetList } from '../../types/cosmos.js';

interface ChainRegistryClientOptions extends BaseChainRegistryClientOptions {
  testnet?: boolean | undefined;
}

export const getCosmosChainRegistryClient = async (chains: string[], testnet: boolean | undefined) => {
  const client = new ChainRegistryClient({
    chainNames: chains,
    testnet,
  });

  await client.fetchUrls();

  return client;
};

export class ChainRegistryClient extends ChainRegistryFetcher {
  protected _options: ChainRegistryClientOptions = {
    chainNames: [],
    baseUrl: 'https://raw.githubusercontent.com/cosmos/chain-registry/master',
    testnet: undefined,
  };

  constructor(options: ChainRegistryClientOptions) {
    const { chainNames, assetListNames, ibcNamePairs, baseUrl, testnet, ...restOptions } = options;

    super(restOptions);
    this._options = {
      ...this._options,
      chainNames: chainNames || this._options.chainNames,
      assetListNames: assetListNames || this._options.assetListNames,
      ibcNamePairs: ibcNamePairs || this._options.ibcNamePairs,
      baseUrl: baseUrl || this._options.baseUrl,
      testnet,
    };

    this.generateUrls();
  }

  generateUrls() {
    const { chainNames, assetListNames, ibcNamePairs, baseUrl, testnet } = this._options;

    const getPath = (chain: string) => {
      return testnet === true ? `/testnets/${chain}` : `/${chain}`;
    };

    const chainUrls = chainNames.map((chain) => {
      return `${baseUrl}${getPath(chain)}/chain.json`;
    });

    const assetlistUrls = (assetListNames || chainNames).map((chain) => {
      return `${baseUrl}${getPath(chain)}/assetlist.json`;
    });

    let namePairs = ibcNamePairs;
    if (!namePairs) {
      namePairs = [];
      for (let i = 0; i < chainNames.length; i++) {
        for (let j = i + 1; j < chainNames.length; j++) {
          namePairs.push([chainNames[i], chainNames[j]]);
        }
      }
    }
    const ibcUrls = namePairs.map((namePair) => {
      const fileName =
        namePair[0].localeCompare(namePair[1]) <= 0
          ? `${namePair[0]}-${namePair[1]}.json`
          : `${namePair[1]}-${namePair[0]}.json`;
      return `${baseUrl}${testnet ? '/testnets' : ''}/_IBC/${fileName}`;
    });

    this.urls = [...new Set([...chainUrls, ...assetlistUrls, ...ibcUrls, ...(this.urls || [])])];
  }

  getChainUtil(chainName: string) {
    const chainInfo = this.getChainInfo(chainName);
    return new ChainRegistryChainUtil({
      chainName: chainName,
      chainInfo: chainInfo,
    });
  }

  async fetchUrls() {
    await Promise.allSettled(this.urls.map((url) => this.fetch(url)));

    return Promise.all([]);
  }

  setAssetList(customAssetList: AssetList | undefined, chainName: string) {
    const chainAssetList = this.assetLists.find((asset) => asset.chain_name === chainName);
    if (chainAssetList && customAssetList) {
      chainAssetList.assets = customAssetList.assets;
    }
  }
}

// const fetchUrl = async (url: string) => {
//   return fetch(url).then((res) => {
//     if (res.status >= 400) {
//       throw new Error('Bad response');
//     }
//     return res.json();
//   });
// };
