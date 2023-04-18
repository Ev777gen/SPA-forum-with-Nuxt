import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';

export default defineNuxtPlugin(nuxtApp => {
  // Hardcode for now. Later add:
  // const config = useRuntimeConfig();
  // ... 
  // apiKey: config.VUE_APP_FIREBASE_API_KEY,
  const firebaseConfig = {
    apiKey: "AIzaSyDrneVPNzmr8y5EraatCBjTIM4UIf563xs",
    authDomain: "spa-blog-c7ad9.firebaseapp.com",
    projectId: "spa-blog-c7ad9",
    storageBucket: "spa-blog-c7ad9.appspot.com",
    messagingSenderId: "965165354166",
    appId: "1:965165354166:web:8683642d1540a64df6ea17"
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

// https://medium.com/codex/using-firebase-in-nuxt3-the-right-way-bebbb6d8c4dd
// https://medium.com/@cybercoder.naj/list/nuxt3-tutorial-8af9304349ba 