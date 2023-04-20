/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */


!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

const { i18n } = await import('./next-i18next.config.js');

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */

  images:{
    domains: ["images.clerk.dev"],
  },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ['zh-CN', 'zh-TW'],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'zh-CN',
    localeDetection: false,
    // This is a list of locale domains and the default locale they
    // should handle (these are only required when setting up domain routing)
    // Note: subdomains must be included in the domain value to be matched e.g. "fr.example.com".
  },
};
export default config;

