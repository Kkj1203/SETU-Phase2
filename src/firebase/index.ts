import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { useFirebase, useFirebaseApp, useFirestore, useAuth } from './provider';
import { useUser } from './auth/use-user';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';
import { FirebaseClientProvider } from './client-provider';

// This function can be used for server-side firebase logic if needed in the future.
function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} {
  if (getApps().length) {
    const firebaseApp = getApp();
    const auth = getAuth(firebaseApp);
    const firestore = getFirestore(firebaseApp);

    return { firebaseApp, auth, firestore };
  } else {
    const firebaseApp = initializeApp(firebaseConfig);
    const auth = getAuth(firebaseApp);
    const firestore = getFirestore(firebaseApp);

    return { firebaseApp, auth, firestore };
  }
}

export {
  initializeFirebase,
  FirebaseClientProvider,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
  useUser,
  useCollection,
  useDoc,
};
