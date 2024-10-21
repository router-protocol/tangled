import { ChainRegistryChainUtil, ChainRegistryClientOptions, ChainRegistryFetcher } from '@chain-registry/client';

export const getCosmosChainRegistryClient = async (chains: string[]) => {
  const client = new ChainRegistryClient({
    chainNames: chains,
  });

  await client.fetchUrls();
  console.log('[REGISTRY]', client);

  return client;
};

export class ChainRegistryClient extends ChainRegistryFetcher {
  protected _options: ChainRegistryClientOptions = {
    chainNames: [],
    baseUrl: 'https://raw.githubusercontent.com/cosmos/chain-registry/master',
  };

  constructor(options: ChainRegistryClientOptions) {
    const { chainNames, assetListNames, ibcNamePairs, baseUrl, ...restOptions } = options;

    super(restOptions);
    this._options = {
      ...this._options,
      chainNames: chainNames || this._options.chainNames,
      assetListNames: assetListNames || this._options.assetListNames,
      ibcNamePairs: ibcNamePairs || this._options.ibcNamePairs,
      baseUrl: baseUrl || this._options.baseUrl,
    };

    this.generateUrls();
  }

  generateUrls() {
    const { chainNames, assetListNames, ibcNamePairs, baseUrl } = this._options;

    const chainUrls = chainNames.map((chain) => {
      return `${baseUrl}/${chain}/chain.json`;
    });

    const assetlistUrls = (assetListNames || chainNames).map((chain) => {
      return `${baseUrl}/${chain}/assetlist.json`;
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
      return `${baseUrl}/_IBC/${fileName}`;
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
}

// const fetchUrl = async (url: string) => {
//   return fetch(url).then((res) => {
//     if (res.status >= 400) {
//       throw new Error('Bad response');
//     }
//     return res.json();
//   });
// };
