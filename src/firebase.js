import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// 🔥 Your Web App's Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhDsti9DhXv6rhQte7DYNEiNbZA1VSFA0",
  authDomain: "pethum-portfolio.firebaseapp.com",
  projectId: "pethum-portfolio",
  storageBucket: "pethum-portfolio.firebasestorage.app",
  messagingSenderId: "478226711472",
  appId: "1:478226711472:web:e3ce5c9c92a02b15b10c75",
  measurementId: "G-2NKJY6Q0RJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Export Services so App.jsx can use them
export { auth, googleProvider, db, storage, analytics };