import { TangledContextProvider } from '@tangled/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TangledContextProvider
      config={{
        projectName: 'Tangled Example',
        chainConfigs: {},
      }}
    >
      <App />
    </TangledContextProvider>
  </React.StrictMode>,
);
