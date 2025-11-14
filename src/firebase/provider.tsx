'use client';

import { createContext, useContext, useMemo } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

type FirebaseContextValue = {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth?: Auth; // Auth is now optional
};

const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

type FirebaseProviderProps = {
  children: React.ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth?: Auth;
};

export function FirebaseProvider({
  children,
  firebaseApp,
  firestore,
  auth,
}: FirebaseProviderProps) {
  const value = useMemo(
    () => ({ firebaseApp, firestore, auth }),
    [firebaseApp, firestore, auth],
  );

  return (
    <FirebaseContext.Provider value={value}>
      {children}
      <FirebaseErrorListener />
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function useFirebaseApp() {
  return useFirebase().firebaseApp;
}
export function useFirestore() {
  return useFirebase().firestore;
}

// useAuth is no longer used and can be removed if desired.
// Keeping it but making it potentially return undefined.
export function useAuth() {
  return useFirebase().auth;
}
