import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA_qJOosj2u1K0z4TNVTRqkmPzcNMeAJO8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "shemakids.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "shemakids",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "shemakids.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "558416825909",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:558416825909:web:d2557e7b91dd5184d6eb7c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-trprecuperaotera-44b7cc20-edf3-41d7-bbd1-cb54ae902425");
