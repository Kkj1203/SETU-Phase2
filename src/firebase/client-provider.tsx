'use client';

import { ReactNode } from 'react';
import { app, auth, db } from './config';
import { FirebaseProvider } from './provider';

type Props = {
  children: ReactNode;
};

export function FirebaseClientProvider({ children }: Props) {
  const value = {
    firebaseApp: app,
    auth,
    firestore: db,
  };

  return (
    <FirebaseProvider value={value}>
      {children}
    </FirebaseProvider>
  );
}
