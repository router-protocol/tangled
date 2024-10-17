export const getCosmosChainRegistryClient = async (chains: string[]) => {
  const ChainRegistryClient = await import('@chain-registry/client').then((module) => module.ChainRegistryClient);

  const client = new ChainRegistryClient({
    chainNames: chains,
  });

  await client.fetchUrls();

  return client;
};
