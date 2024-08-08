import {
  CHAIN_TYPES,
  ConnectedAccount,
  useAccounts,
  useChain,
  useConnect,
  useCurrentAccount,
  useCurrentWallet,
  useDisConnect,
  useWallet,
  useWallets,
} from '@tangled3/react';

export function Example() {
  const accounts = useAccounts();
  const wallets = useWallets();

  const { connect } = useConnect();

  return (
    <div className='space-y-8 p-8'>
      <h1 className='text-2xl font-bold'>Tangled Example</h1>
      <h2 className='text-xl font-bold'>ACCOUNTS</h2>
      <div className='sticky top-0 bg-black py-8'>
        <CurrentAccountAndWallet />
      </div>

      <div>
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

      <div>
        <h2 className='text-xl font-bold'>WALLETS</h2>
        <div className='space-y-8'>
          {CHAIN_TYPES.map((chainType) => (
            <div key={chainType}>
              <span className='font-bold'>{chainType}</span>
              <table className='w-full'>
                <thead>
                  <tr className='bg-gray-900'>
                    <th className='text-left px-4 py-2 w-[5ch]'>Icon</th>
                    <th className='text-left px-4 py-2 w-[20ch]'>Name</th>
                    <th className='text-left px-4 py-2 w-[5ch]'>Installed</th>
                    <th className='text-left px-4 py-2 w-[25ch]'>ID</th>
                    <th className='text-left px-4 py-2 w-[15ch]'>Action</th>
                    <th className='text-left px-4 py-2 w-[30ch]'>Install Link</th>
                  </tr>
                </thead>
                <tbody>
                  {wallets[chainType].map((wallet) => (
                    <tr
                      key={wallet.id}
                      className='border-b border-gray-700'
                    >
                      <td className='px-4 py-2'>
                        <img
                          src={wallet.icon}
                          alt=''
                          className='w-8 h-8'
                        />
                      </td>
                      <td className='px-4 py-2'>{wallet.name}</td>
                      <td className='px-4 py-2'>{wallet.installed ? '✅' : '❌'}</td>
                      <td className='px-4 py-2'>{wallet.id}</td>
                      <td className='px-4 py-2'>
                        {wallet.installed ? (
                          <button
                            onClick={() => connect({ walletId: wallet.id, chainType })}
                            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'
                          >
                            connect
                          </button>
                        ) : (
                          <span></span>
                        )}
                      </td>
                      <td className='px-4 py-2'>
                        {wallet.url ? (
                          <a
                            href={wallet.url}
                            className='text-blue-500 hover:underline'
                          >
                            Install Link
                          </a>
                        ) : (
                          <span>
                            No Install Link <span className='font-[emoji]'>&#x26A0;&#xFE0F;</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const CurrentAccountAndWallet = () => {
  const currentAccount = useCurrentAccount();
  const currentWallet = useCurrentWallet();
  const chain = useChain(currentAccount?.chainId);
  const wallet = useWallet(currentAccount?.chainType, currentAccount?.wallet);

  return (
    <div className='grid grid-cols-2'>
      <div>
        <h3 className='text-lg font-bold'>Current Account</h3>
        <table className='w-full'>
          <thead>
            <tr className='bg-gray-900'>
              <th className='text-left px-4 py-2 w-[5ch]'>Icon</th>
              <th className='text-left px-4 py-2 w-[15ch]'>Address</th>
              <th className='text-left px-4 py-2 w-[15ch]'>Type</th>
              <th className='text-left px-4 py-2 w-[10ch]'>Chain</th>
              <th className='text-left px-4 py-2 w-[auto]'>ID</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='px-4 py-2 w-[5ch]'>
                <img
                  src={wallet?.icon}
                  alt=''
                  className='w-8 h-8'
                />
              </td>
              <td className='px-4 py-2 w-[15ch]'>
                {currentAccount?.address?.slice(0, 6)}...{currentAccount?.address?.slice(-4)}
              </td>
              <td className='px-4 py-2 w-[15ch]'>[[{currentAccount?.chainType}]]</td>
              <td className='px-4 py-2 w-[10ch]'>{chain?.name ?? 'Unknown'}</td>
              <td className='px-4 py-2 w-[auto]'>[{currentAccount?.chainId}]</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3 className='text-lg font-bold'>Current Wallet</h3>
        <table className='w-full'>
          <thead>
            <tr className='bg-gray-900'>
              <th className='text-left px-4 py-2 w-[15ch]'>ID</th>
              <th className='text-left px-4 py-2 w-[25ch]'>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='px-4 py-2 w-[15ch]'>{currentWallet?.id}</td>
              <td className='px-4 py-2 w-[25ch]'>[[{currentWallet?.type}]]</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ConnectedAccountItem = ({ account }: { account: ConnectedAccount }) => {
  const { disconnect } = useDisConnect();
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
