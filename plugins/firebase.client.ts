import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.VUE_APP_FIREBASE_API_KEY,
    authDomain: config.VUE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: config.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: config.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: config.VUE_APP_FIREBASE_APP_ID
  }
  
  const firebaseApp = initializeApp(firebaseConfig);
  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  const storage = getStorage(firebaseApp);

  // attach the objects to the Nuxt3 Application for global usage
  nuxtApp.vueApp.provide('auth', auth);
  nuxtApp.provide('auth', auth);

  nuxtApp.vueApp.provide('firestore', firestore);
  nuxtApp.provide('firestore', firestore);

  nuxtApp.vueApp.provide('storage', storage);
  nuxtApp.provide('storage', storage);
});
