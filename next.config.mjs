/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: [
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-popover", 
    "@radix-ui/react-select",
    "@radix-ui/react-slot",
    "@radix-ui/react-context"
  ],

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  output: 'standalone',
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};

export default config;
