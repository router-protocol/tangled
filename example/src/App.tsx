import { CHAIN_TYPES, useAccounts, useConnect, useDisConnect, useWallets } from '@tangled3/react';
import './App.css';

function App() {
  const accounts = useAccounts();
  const wallets = useWallets();

  const { connect } = useConnect();
  const { disconnect } = useDisConnect();

  return (
    <div className=''>
      <h1>Tangled Example</h1>

      <h2>ACCOUNTS</h2>

      <div>
        <span>Connected Accounts:</span>

        <ul>
          {accounts.map((account) => {
            return (
              <li
                key={`${account.address}-${account.wallet}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
                  gap: '1rem',
                }}
              >
                <img
                  src={wallets[account.chainType].find((wallet) => wallet.id === account.wallet)?.icon}
                  alt=''
                  width={32}
                  height={32}
                />
                <span>{account.address}</span>
                <span>{account.chainId}</span>
                <span>{account.chainType}</span>
                <span>{account.wallet}</span>

                <button onClick={() => disconnect({ chainType: account.chainType, walletId: account.wallet })}>
                  Disconnect
                </button>
              </li>
            );
          })}
        </ul>
      </div>

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
                    gridTemplateColumns: '2ch 1fr 1fr 1fr 1fr 1fr 1fr',
                    gap: '1rem',
                  }}
                >
                  <span>{wallet.installed ? '✅' : '❌'}</span>
                  <span>{wallet.name}</span>
                  <span>{wallet.id}</span>
                  <img
                    src={wallet.icon}
                    alt=''
                    width={32}
                    height={32}
                  />
                  {wallet.installed ? (
                    <button onClick={() => connect({ walletId: wallet.id, chainType })}>connect</button>
                  ) : null}
                  {wallet.url ? <a href={wallet.url}>Install Link</a> : <span>Not Installed</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
