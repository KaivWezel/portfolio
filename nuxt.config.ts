// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/main.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "~/assets/functions.scss";',
        },
      },
    },
  },
  app: {
    head: {
      link: [{ rel: "stylesheet", href: "https://use.typekit.net/lhz1gdy.css" }],
    },
  },
});
