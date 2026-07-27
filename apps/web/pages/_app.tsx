import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import i18n from '@simple-cash/i18n'; // alias will resolve via tsconfig paths
import { ThemeProvider } from '@simple-cash/ui';

function MyApp({ Component, pageProps }: AppProps) {
  // Set HTML dir attribute according to language (RTL support)
  useEffect(() => {
    document.documentElement.setAttribute('dir', i18n.dir());
  }, []);

  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
