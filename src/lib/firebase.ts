import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDm27NHxv1NLNClne2uOMmClpW_iCu008",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "studio-9584361568-e5b3b.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "studio-9584361568-e5b3b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "studio-9584361568-e5b3b.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "522899078689",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:522899078689:web:56fb1e7f92a9693b4ced60"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
