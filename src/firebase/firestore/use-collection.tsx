"use client";

import { useEffect, useState, useMemo } from 'react';
import { onSnapshot, collection, query, where, type Query, type DocumentData, type CollectionReference } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

type DocumentWithId<T> = T & { id: string };

function useMemoFirebase<T>(factory: () => T | null, deps: any[]): T | null {
    return useMemo(factory, deps);
}

export function useCollection<T extends DocumentData>(
  ref: CollectionReference<T> | Query<T> | null
) {
  const [data, setData] = useState<DocumentWithId<T>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ref) {
      setData([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setData(docs);
        setLoading(false);
      },
      async (err) => {
        const permissionError = new FirestorePermissionError({
            path: 'path' in ref ? ref.path : 'N/A', // Query does not have a direct path property
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ref]);

  return { data, loading, error, setData };
}
