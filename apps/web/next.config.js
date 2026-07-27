// next.config.js
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')
module.exports = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    // runtime caching strategy for static assets and API calls
    runtimeCaching: [
      {
        urlPattern: /\/api\/.*\/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 },
        },
      },
      {
        urlPattern: /.*/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-cache',
          expiration: { maxEntries: 200, maxAgeSeconds: 24 * 60 * 60 },
        },
      },
    ],
  },
  i18n: {
    locales: ['en', 'am', 'ti', 'lg', 'ar'],
    defaultLocale: 'en',
    localeDetection: true,
  },
})
