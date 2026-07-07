import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface TherapistProfile {
  name: string;
  email: string;
  subscriptionStatus: 'trial' | 'active' | 'inactive';
}

interface AuthContextType {
  user: User | null;
  profile: TherapistProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<TherapistProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const docRef = doc(db, 'therapists', currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProfile(docSnap.data() as TherapistProfile);
        } else {
          // Initialize profile on first login (optional, if they register through another way we do it there)
          const newProfile = {
            name: currentUser.displayName || 'Terapeuta',
            email: currentUser.email || '',
            subscriptionStatus: 'trial' as const,
            createdAt: serverTimestamp()
          };
          try {
            await setDoc(docRef, newProfile);
            setProfile(newProfile as any); // Ignoring strict typing for state set
          } catch(e) {
            console.error("Failed to create profile", e);
          }
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
