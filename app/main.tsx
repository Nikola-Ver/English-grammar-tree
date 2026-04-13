import { registerSW } from 'virtual:pwa-register';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initI18n } from './i18n/config';

registerSW({ immediate: true });

const rootEl = document.getElementById('root');
if (rootEl) {
  void initI18n().then(() => {
    import('./App').then(({ App }) => {
      createRoot(rootEl).render(
        <StrictMode>
          <App />
        </StrictMode>,
      );
    });
  });
}
