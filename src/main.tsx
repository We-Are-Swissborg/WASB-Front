import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import "bootstrap/dist/js/bootstrap.bundle.min";
import './i18next';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
