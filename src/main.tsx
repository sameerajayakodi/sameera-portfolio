// Prevent "Cannot set property fetch of #<Window> which has only a getter" errors
try {
  let currentFetch = window.fetch;
  Object.defineProperty(window, 'fetch', {
    get() {
      return currentFetch;
    },
    set(newFetch) {
      currentFetch = newFetch;
    },
    configurable: true,
    enumerable: true
  });
} catch (e) {
  console.warn("Could not patch window.fetch setter in main.tsx:", e);
}


import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(

  <App />

);
