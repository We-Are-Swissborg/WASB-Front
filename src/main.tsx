import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import "bootstrap/dist/js/bootstrap.bundle.min";
import { MetaMaskUIProvider } from '@metamask/sdk-react-ui';
import './i18next';



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MetaMaskUIProvider  debug={true} sdkOptions={{
      dappMetadata: {
        name: "We Are SwissBorg",
        url: window.location.host,
      }
      // Other options
    }}>
      <App />
    </MetaMaskUIProvider>
  </React.StrictMode>,
)
