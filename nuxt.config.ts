// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      VUE_APP_FIREBASE_API_KEY: process.env.VUE_APP_FIREBASE_API_KEY,
      VUE_APP_FIREBASE_AUTH_DOMAIN: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
      VUE_APP_FIREBASE_PROJECT_ID: process.env.VUE_APP_FIREBASE_PROJECT_ID,
      VUE_APP_FIREBASE_STORAGE_BUCKET: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
      VUE_APP_FIREBASE_MESSAGING_SENDER_ID: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
      VUE_APP_FIREBASE_APP_ID: process.env.VUE_APP_FIREBASE_APP_ID,
    }
  }
})
