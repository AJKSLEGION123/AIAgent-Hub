import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './app-styles.css'
import App from './App.jsx'
import { ErrorBoundary } from './ErrorBoundary.jsx'

if (typeof performance !== 'undefined') performance.mark('app-init');

const rootEl = document.getElementById('root');
createRoot(rootEl).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

// Dismiss the inline loader once React paints content into #root.
// MutationObserver is more reliable than rAF for catching actual render.
{
  const boot = document.getElementById('boot');
  if (boot) {
    const kill = () => { boot.style.opacity = '0'; setTimeout(() => boot.remove(), 300); };
    if (rootEl.firstElementChild) { kill(); }
    else {
      const obs = new MutationObserver(() => {
        if (rootEl.firstElementChild) { obs.disconnect(); kill(); }
      });
      obs.observe(rootEl, { childList: true });
      // Safety net — force remove after 3s even if nothing else fires
      setTimeout(() => { obs.disconnect(); kill(); }, 3000);
    }
  }
}

// PWA: Register Service Worker with auto-update
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      // Check for updates every 5 minutes while tab is open
      setInterval(() => reg.update().catch(() => {}), 5 * 60 * 1000);
      // When a new SW takes control — reload the page once
      let reloaded = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (reloaded) return;
        reloaded = true;
        window.location.reload();
      });
      // When a new SW is installed and waiting, activate it immediately
      reg.addEventListener('updatefound', () => {
        const newSW = reg.installing;
        if (!newSW) return;
        newSW.addEventListener('statechange', () => {
          if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
            newSW.postMessage('SKIP_WAITING');
          }
        });
      });
    }).catch(() => {});
  });
}
