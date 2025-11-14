'use client';

import { FirebaseProvider, initializeFirebase } from '.';

const { firebaseApp, firestore } = initializeFirebase();

/**
 * Provides the Firebase app and Firestore instances to the component tree.
 * This ensures that Firebase is initialized only once on the client.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseProvider firebaseApp={firebaseApp} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}
