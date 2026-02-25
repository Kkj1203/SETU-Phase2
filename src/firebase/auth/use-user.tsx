'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../provider';
import { db } from '../config';

type IAMUser = {
  authUser: User | null;
  role: 'patient' | 'responder' | 'hospital' | 'admin' | null;
  linkedEntityId: string | null;
  loading: boolean;
};

export function useUser(): IAMUser {
  const auth = useAuth();

  const [authUser, setAuthUser] = useState<User | null>(null);
  const [role, setRole] = useState<IAMUser['role']>(null);
  const [linkedEntityId, setLinkedEntityId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);

      // No authenticated user → reset IAM state
      if (!user) {
        setRole(null);
        setLinkedEntityId(null);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          // Auth user exists but IAM record missing
          console.warn('IAM user record not found for UID:', user.uid);
          setRole(null);
          setLinkedEntityId(null);
        } else {
          const data = snap.data();
          setRole(data.role ?? null);
          setLinkedEntityId(data.linked_entity_id ?? null);
        }
      } catch (error) {
        console.error('Error loading IAM user:', error);
        setRole(null);
        setLinkedEntityId(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return {
    authUser,
    role,
    linkedEntityId,
    loading,
  };
}
