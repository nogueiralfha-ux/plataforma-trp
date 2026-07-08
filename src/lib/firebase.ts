import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA3FA8axVV9aSXY70hiEaXpve8lvBiBO6c",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "plataforma-trp.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "plataforma-trp",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "plataforma-trp.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "999325505617",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:999325505617:web:b269a21a87126f7889c070"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
