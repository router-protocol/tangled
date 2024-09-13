import { Address, JettonMaster } from '@ton/ton';
import { ChainData, ConnectionOrConfig } from '../../types/index.js';

export const getTonTokenMetadata = async ({ token, chain }: { token: string; chain: ChainData<'ton'> }) => {
  const data = await (
    await fetch(
      chain.id === '1100'
        ? `https://toncenter.com/api/v3/jetton/masters?address=${token}&limit=128&offset=0`
        : `https://testnet.toncenter.com/api/v3/jetton/masters?address=${token}&limit=128&offset=0`,
    )
  ).json();

  const jettonContent = data.jetton_masters[0].jetton_content;

  return {
    symbol: jettonContent.symbol ?? 'USDT',
    name: jettonContent.name ?? 'Tether USD',
    decimals: Number(jettonContent.decimals),
    address: jettonContent.address ?? token,
  };
};

export const getTonTokenBalanceAndAllowance = async ({
  account,
  token,
  chain,
  spender,
  config,
}: {
  account: string;
  token: string;
  chain: ChainData<'ton'>;
  spender: string | undefined;
  config: ConnectionOrConfig;
}) => {
  let balance = 0n;
  let allowance = 0n;

  try {
    const jettonMaster = new JettonMaster(Address.parse(token));
    const contractProvider = config.tonClient.provider(Address.parse(token));

    const walletAddress = await jettonMaster.getWalletAddress(contractProvider, Address.parse(account));

    const walletAddressContractCallResult = await config.tonClient.runMethod(walletAddress, 'get_wallet_data');
    const accountBalance = walletAddressContractCallResult.stack.readNumber();
    balance = BigInt(accountBalance);

    if (spender) {
      // TON TODO: fetch allowance
      console.log('spender here', spender);
    }
  } catch (error) {
    console.error('error - ', error);
  }

  return {
    balance,
    allowance,
  };
};
