import React from 'react';
import ReactDOM from 'react-dom/client';
import Example from './components/Example';
import Providers from './components/Providers';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <main className='flex min-h-screen w-[100vw] flex-col items-center justify-center text-white bg-neutral-800'>
        <Example />
      </main>
    </Providers>
  </React.StrictMode>,
);
