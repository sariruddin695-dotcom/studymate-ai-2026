import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { StudyStoreProvider } from './lib/study-store.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StudyStoreProvider>
      <App />
    </StudyStoreProvider>
  </StrictMode>,
);
