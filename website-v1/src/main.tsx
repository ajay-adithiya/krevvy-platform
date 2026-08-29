import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { GlobalContentProvider } from './contexts/GlobalContentContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalContentProvider>
      <App />
    </GlobalContentProvider>
  </StrictMode>,
);
