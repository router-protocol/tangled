import { buildNitroTransaction } from '@/actions/buildNitroTransaction';
import getPfQuote from '@/actions/getPfQuote';
// import { buildNitroTransaction } from '@/txArgs/buildNitroTx';
// import { pfData } from '@/txArgs/getPfData';
// import { PathfinderTransaction } from '@/txArgs/types';
import {
  CHAIN_DATA,
  ConnectedAccount,
  SOL_ADDRESS,
  useAccounts,
  useChain,
  useConnect,
  useConnectionOrConfig,
  useDisconnect,
  useSendTransaction,
  useTokenForAccount,
  useTokenHandlers,
  useWallet,
} from '@tangled3/react';

export const ConnectedAccounts = () => {
  const accounts = useAccounts();

  useTokenForAccount({
    chainId: 'solana',
    account: 'Gc9ZS3FLaLPhVBVG8ZojAnFWDdP6jZ8TxxT6SK8kDA8f',
    token: SOL_ADDRESS,
    spender: undefined,
  });

  return (
    <div className='bg-neutral-900 w-full'>
      <h3 className='text-lg font-bold'>Connected Accounts:</h3>
      <table className='w-full'>
        <thead>
          <tr className='bg-gray-900'>
            <th className='text-left px-4 py-2'>Icon</th>
            <th className='text-left w-[10ch] px-4 py-2'>Address</th>
            <th className='text-left w-[2ch] px-4 py-2'>Chains</th>
            <th className='text-left px-4 py-2 w-[5ch]'>Type</th>
            <th className='text-left px-4 py-2 w-[10ch]'>ID</th>
            <th className='text-left px-4 py-2 w-[10ch]'>Name</th>
            <th className='text-left px-4 py-2 w-[25ch]'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account, index) => (
            <ConnectedAccountItem
              key={`${index} ${account.address}`}
              account={account}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ConnectedAccountItem = ({ account }: { account: ConnectedAccount }) => {
  const { disconnect } = useDisconnect();
  const { connect } = useConnect();
  const wallet = useWallet(account.chainType, account.wallet);
  const chain = useChain(account.chainId);
  const connectionOrConfig = useConnectionOrConfig();

  const { mutateAsync: sendTransaction } = useSendTransaction();
  const handleSendTx = async () => {
    const quote = getPfQuote();
    const txArgs = await buildNitroTransaction(quote, CHAIN_DATA['injective-888']);
    const tx = await sendTransaction(txArgs);
    console.log('[inj] tx = ', { tx });
  };

//     console.log('tx data ', account);

//     const tx = await handleTokenPrerequisite();
//     console.log('[tron] tx = ', tx);
//   };

//   const { mutateAsync: handleTokenPrerequisite } = useTokenHandlers({
//     amount: 1n,
//     chainId: tronMainnet.id,
//     owner: account.address,
//     spender: '0x0259094fde1684b82d2c6b10b65d044c31c0693a',
//     token: '0xa614f803B6FD780986A42c78Ec9c7f77e6DeD13C',
//   });

  // const currentWallet = useCurrentWallet();
  // const walletInstance = useWallet(currentWallet?.type, currentWallet?.id);

  // const handleSendTx = async () => {
  //   const nitroTx = await buildNitroTransaction(pfData as unknown as PathfinderTransaction, tronMainnet);

  //   console.log('tx data ', nitroTx, account);

  //   const tx = await sendTransaction(nitroTx);
  //   console.log('[tron] tx = ', tx);
  // };
  return (
    <tr className='border-b border-gray-700'>
      <td className='min-w-8 w-[5ch] h-8 px-4 py-2'>
        <img
          src={wallet?.icon}
          alt=''
          className='w-8 h-8'
        />
      </td>
      <td className='px-4 py-2'>
        {account.address.slice(0, 6)}...{account.address.slice(-4)}
      </td>
      <td className='px-4 py-2'>
        {chain?.name ?? 'Unknown'} [{account.chainId}]
      </td>
      <td className='px-4 py-2'>{account.chainType}</td>
      <td className='px-4 py-2'>{account.wallet}</td>
      <td className='px-4 py-2'>{wallet?.name}</td>
      <td className='px-4 py-2 flex gap-2'>
        <button
          onClick={() => disconnect({ chainType: account.chainType, walletId: account.wallet })}
          className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded'
        >
          Disconnect
        </button>

        <button
          onClick={() => connect({ chainType: account.chainType, walletId: account.wallet })}
          className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'
        >
          Switch
        </button>
        <button
          onClick={handleSendTx}
          className='bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded'
        >
          Send Txn
        </button>
      </td>
    </tr>
  );
};
