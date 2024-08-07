import {
  CHAIN_TYPES,
  ConnectedAccount,
  useAccounts,
  useChain,
  useConnect,
  useDisConnect,
  useWallet,
  useWallets,
} from '@tangled3/react';
import useCurrentAccount from '../../packages/react/dist/_esm/hooks/useCurrentAccount';
import useCurrentWallet from '../../packages/react/dist/_esm/hooks/useCurrentWallet';
import './App.css';

function App() {
  const accounts = useAccounts();
  const wallets = useWallets();

  const { connect } = useConnect();

  return (
    <div className=''>
      <h1>Tangled Example</h1>

      <h2>ACCOUNTS</h2>

      <div
        style={{
          position: 'sticky',
          top: 0,
          background: 'white',
          padding: '1rem 0',
        }}
      >
        <CurrentAccountAndWallet />
      </div>

      <br />
      <br />
      <br />

      <div>
        <h3>Connected Accounts:</h3>

        <ul>
          {accounts.map((account, index) => {
            return (
              <ConnectedAccountItem
                key={`${index} ${account.address}`}
                account={account}
              />
            );
          })}
        </ul>
      </div>

      <br />
      <br />
      <br />

      <h2>WALLETS</h2>

      <div className=''>
        {CHAIN_TYPES.map((chainType) => (
          <div
            className=''
            key={chainType}
          >
            <span>{chainType}</span>
            <ul>
              {wallets[chainType].map((wallet) => (
                <li
                  key={wallet.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '5ch 2ch 15ch 25ch 10ch 1fr 1fr',
                    gap: '1rem',
                  }}
                >
                  <img
                    src={wallet.icon}
                    alt=''
                    width={32}
                    height={32}
                  />

                  <span>{wallet.installed ? '✅' : '❌'}</span>
                  <span>{wallet.name}</span>
                  <span>{wallet.id}</span>

                  {wallet.installed ? (
                    <button onClick={() => connect({ walletId: wallet.id, chainType })}>connect</button>
                  ) : (
                    <span></span>
                  )}
                  {wallet.url ? (
                    <a
                      style={{ width: 'fit-content' }}
                      href={wallet.url}
                    >
                      Install Link
                    </a>
                  ) : (
                    'No Install Link'
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
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
    <div
      className=''
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
      }}
    >
      <div className=''>
        <h3>Current Account</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '5ch 15ch 15ch 10ch 1fr',
            gap: '1rem',
          }}
        >
          <img
            src={wallet?.icon}
            alt=''
            width={32}
            height={32}
          />
          <span>
            {currentAccount?.address?.slice(0, 6)}...{currentAccount?.address?.slice(-4)}
          </span>
          <span>[[{currentAccount?.chainType}]]</span>
          <span>{chain?.name ?? 'Unknown'}</span>
          <span> [{currentAccount?.chainId}]</span>
        </div>
      </div>
      <div className=''>
        <h3>Current Wallet</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '15ch 25ch 15ch 1fr 1fr', gap: '1rem' }}>
          <span>{currentWallet?.id}</span>
          <span>[[{currentWallet?.type}]]</span>
        </div>
      </div>
    </div>
  );
};

const ConnectedAccountItem = ({
  account,
}: {
  account: ConnectedAccount;
  // extract type from useDisConnect
}) => {
  const { disconnect } = useDisConnect();
  const { connect } = useConnect();
  const wallet = useWallet(account.chainType, account.wallet);
  const chain = useChain(account.chainId);
  return (
    <li
      key={`${account.address}-${account.wallet}`}
      style={{
        display: 'grid',
        gridTemplateColumns: '5ch 15ch 15ch 15ch 20ch 20ch 10ch 10ch',
        gap: '1rem',
      }}
    >
      <img
        src={wallet?.icon}
        alt=''
        width={32}
        height={32}
      />
      <span>
        {account.address.slice(0, 6)}...{account.address.slice(-4)}
      </span>
      <span>
        {chain?.name ?? 'Unknown'} [{account.chainId}]
      </span>
      <span>{account.chainType}</span>
      <span>{account.wallet}</span>
      <span>{wallet?.name}</span>

      <button onClick={() => disconnect({ chainType: account.chainType, walletId: account.wallet })}>Disconnect</button>
      <button onClick={() => connect({ chainType: account.chainType, walletId: account.wallet })}>Switch</button>
    </li>
  );
};

export default App;
