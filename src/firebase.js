import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDhDsti9DhXv6rhQte7DYNEiNbZA1VSFA0",
  authDomain: "pethum-portfolio.firebaseapp.com",
  projectId: "pethum-portfolio",
  storageBucket: "pethum-portfolio.firebasestorage.app",
  messagingSenderId: "478226711472",
  appId: "1:478226711472:web:e3ce5c9c92a02b15b10c75"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);