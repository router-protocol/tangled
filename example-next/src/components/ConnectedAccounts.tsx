import {
  ConnectedAccount,
  useAccounts,
  useChain,
  useConnect,
  useDisconnect,
  useWallet,
} from '@noble-assets/tangled-react';

export const ConnectedAccounts = () => {
  const accounts = useAccounts();

  return (
    <div className='bg-neutral-900'>
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
      </td>
    </tr>
  );
};
