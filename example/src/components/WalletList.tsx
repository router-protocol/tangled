import { CHAIN_TYPES, useConnect, useWallets } from '@tangled3/react';

const WalletList = () => {
  const wallets = useWallets();
  const { connect } = useConnect();

  return (
    <div className='max-h-[30rem] overflow-auto bg-neutral-800 p-4 rounded-lg shadow-lg'>
      <h2 className='text-xl font-bold sticky top-0 bg-black mb-4'>WALLETS</h2>
      <div className='space-y-8'>
        {CHAIN_TYPES.map((chainType) => (
          <div
            key={chainType}
            className='rounded-lg'
          >
            <span className='font-bold'>{chainType}</span>
            <table className='w-full border-collapse rounded-lg'>
              <thead>
                <tr className='bg-gray-800 text-white'>
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
                    className='border-b border-gray-600 hover:bg-gray-700'
                  >
                    <td className='px-4 py-2'>
                      <img
                        src={wallet.icon}
                        alt=''
                        className='w-8 h-8 rounded-full'
                      />
                    </td>
                    <td className='px-4 py-2'>{wallet.name}</td>
                    <td className='px-4 py-2'>{wallet.installed ? '✅' : '❌'}</td>
                    <td className='px-4 py-2'>{wallet.id}</td>
                    <td className='px-4 py-2'>
                      {wallet.installed ? (
                        <button
                          onClick={() => connect({ walletId: wallet.id, chainType })}
                          className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg'
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
  );
};
export default WalletList;
