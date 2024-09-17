import { Address, JettonMaster } from '@ton/ton';
import { CHAIN } from '@tonconnect/ui-react';
import { ChainData, ConnectionOrConfig } from '../../types/index.js';

export const getTonTokenMetadata = async ({ token, chain }: { token: string; chain: ChainData<'ton'> }) => {
  const data = await (
    await fetch(
      chain.id === CHAIN.MAINNET
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
  config,
}: {
  account: string;
  token: string;
  chain: ChainData<'ton'>;
  spender: string | undefined;
  config: ConnectionOrConfig;
}) => {
  let balance = 0n;
  const allowance = 0n;

  try {
    const jettonMaster = new JettonMaster(Address.parse(token));
    const contractProvider = config.tonClient.provider(Address.parse(token));

    const walletAddress = await jettonMaster.getWalletAddress(contractProvider, Address.parse(account));

    const walletAddressContractCallResult = await config.tonClient.runMethod(walletAddress, 'get_wallet_data');
    const accountBalance = walletAddressContractCallResult.stack.readNumber();
    balance = BigInt(accountBalance);
  } catch (error) {
    console.error('error - ', error);
  }

  return {
    balance,
    allowance,
  };
};
