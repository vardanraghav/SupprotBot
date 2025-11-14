import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

export { FirebaseProvider, useFirebaseApp, useFirestore } from './provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { FirebaseClientProvider } from './client-provider';


export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
} {
  const apps = getApps();
  const firebaseApp = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
  const firestore = getFirestore(firebaseApp);

  return { firebaseApp, firestore };
}
