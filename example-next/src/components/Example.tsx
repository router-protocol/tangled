import {
  ChainId,
  router,
  useChain,
  useChains,
  useCurrentAccount,
  useCurrentWallet,
  useNetwork,
  useSendTransaction,
  useWallet,
} from '@tangled3/react';
import { useEffect, useState } from 'react';
import { ConnectedAccounts } from './ConnectedAccounts';
import Tokens from './Tokens';
import WalletList from './WalletList';

function Example() {
  const { mutateAsync } = useSendTransaction();
  const click = () => {
    mutateAsync({
      args: {
        routerChainArgs: {
          transfer_route_cross_chain: {
            dest_chain_id: '137',
            recipient: '0x0b90994F83D2Fde68f83C418141B42550dE2Cb4c',
          },
        },
      },
      chain: router,
      from: 'router1733dyrfrhj8w7x7t3warslqmt9vfczmmvuqcc5',
      to: 'router17p9rzwnnfxcjp32un9ug7yhhzgtkhvl9jfksztgw5uh69wac2pgsmpev85',
      value: 4835500000000000000n,
    });
  };
  return (
    <div className='space-y-8'>
      <h1 className='text-2xl font-bold'>Tangled Example</h1>
      <h2 className='text-xl font-bold'>ACCOUNTS</h2>

      <button
        className='bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded'
        onClick={click}
      >
        Cosmos Routerchain tx
      </button>

      <div className='sticky top-0 bg-black py-8'>
        <CurrentAccountAndWallet />
      </div>

      <ConnectedAccounts />

      <WalletList />

      <Tokens />
    </div>
  );
}
export default Example;

const CurrentAccountAndWallet = () => {
  const currentAccount = useCurrentAccount();
  const currentWallet = useCurrentWallet();
  const chain = useChain(currentAccount?.chainId);
  const wallet = useWallet(currentAccount?.chainType, currentAccount?.wallet);
  const { switchNetworkAsync, isPending } = useNetwork();
  const chains = useChains(currentAccount?.chainType);
  const [selectedChain, setSelectedChain] = useState(currentAccount?.chainId);

  const handleChainChange = (chainId: ChainId) => {
    // optimistically update UI immediately
    setSelectedChain(chainId);

    switchNetworkAsync(chainId)
      .then(() => {
        // ui remains unchanged
      })
      .catch(() => {
        // on error, revert to the original chain
        setSelectedChain(currentAccount?.chainId);
      });
  };

  useEffect(() => {
    setSelectedChain(currentAccount?.chainId);
  }, [currentAccount?.chainId]);

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
              <td className='px-4 py-2 w-[15ch]'>
                {chain ? (
                  <select
                    id='chain'
                    className='h-12 border border-gray-300 text-gray-600 text-base rounded-lg block w-full focus:outline-none'
                    onChange={(e) => handleChainChange(e.target.value as ChainId)}
                    disabled={isPending}
                    value={selectedChain}
                  >
                    {chains.map((chain) => (
                      <option
                        key={chain.id}
                        value={chain.id}
                      >
                        {chain.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  'Unknown'
                )}
              </td>
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
