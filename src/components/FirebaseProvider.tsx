import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isPaid: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isPaid: false,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // Find or create user in Firestore
        const userRef = doc(db, 'users', fbUser.uid);
        
        // Listen to user document for real-time role/paid updates
        const unsubDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUser({
              id: fbUser.uid,
              email: fbUser.email || '',
              name: data.name || fbUser.displayName || '',
              displayName: data.displayName || fbUser.displayName || '',
              photoUrl: data.photoUrl || fbUser.photoURL || '',
              phone: data.phone || '',
              address: data.address || '',
              department: data.department || '',
              batch: data.batch || '',
              studentId: data.studentId || '',
              admissionId: data.admissionId,
              isApproved: data.isApproved === true || fbUser.email === 'xoysharif@gmail.com',
              isPaid: data.isPaid === true || fbUser.email === 'xoysharif@gmail.com',
              role: data.role || 'student'
            });
            setIsPaid(data.isPaid === true || fbUser.email === 'xoysharif@gmail.com');
            setIsAdmin(data.role === 'admin' || fbUser.email === 'xoysharif@gmail.com');
          } else {
            // Initial user setup if document doesn't exist
            const isMaster = fbUser.email === 'xoysharif@gmail.com';
            setUser({
              id: fbUser.uid,
              email: fbUser.email || '',
              name: fbUser.displayName || '',
              role: isMaster ? 'admin' : 'student',
              isApproved: isMaster
            });
            setIsPaid(isMaster);
            setIsAdmin(isMaster);
          }
          setLoading(false);
        }, (error) => {
          handleFirestoreError(error, 'get', `users/${fbUser.uid}`);
          setLoading(false);
        });

        return () => unsubDoc();
      } else {
        setUser(null);
        setIsPaid(false);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isPaid, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: string;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: string, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
