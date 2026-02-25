'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  collection,
  query,
  onSnapshot,
  Query,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';
import { useFirestore } from '../provider';

export function useCollection<T>(path: string) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const q = useMemo(() => query(collection(firestore, path)), [firestore, path]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const documents = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as T),
        );
        setData(documents);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [q]);

  return { data, loading, error };
}
