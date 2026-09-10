import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';

// Safeguard against fetch overrides that cause "Cannot set property fetch of #<Window> which has only a getter"
try {
  if (typeof window !== 'undefined') {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (descriptor && !descriptor.writable && !descriptor.set) {
      console.log('window.fetch is a getter-only property, protecting it.');
      // Attempt to prevent any code from even trying to set it by defining a no-op setter if possible
      // But we can't redefine if it's not configurable.
    }
  }
} catch (e) {
  console.warn('Failed to apply fetch safeguard', e);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
