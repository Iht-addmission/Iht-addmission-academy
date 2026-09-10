import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  getDocs,
  where
} from 'firebase/firestore';
import { db } from './firebase';
import { handleFirestoreError } from '../components/FirebaseProvider';

export interface ClassSession {
  id: string;
  title: string;
  teacher: string;
  startTime: any; // Firestore Timestamp
  durationMinutes: number;
  meetLink: string;
  courseId: string;
  status: 'upcoming' | 'live' | 'completed';
  materials?: { title: string; url: string }[];
  createdAt: any;
}

const COLLECTION = 'classes';

export const subscribeToClasses = (callback: (classes: ClassSession[]) => void) => {
  const q = query(collection(db, COLLECTION), orderBy('startTime', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const classes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ClassSession));
    callback(classes);
  }, (error) => {
    handleFirestoreError(error, 'list', COLLECTION);
  });
};

export const addClass = async (data: Omit<ClassSession, 'id' | 'createdAt'>) => {
  try {
    await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, 'create', COLLECTION);
  }
};

export const updateClassStatus = async (id: string, status: ClassSession['status']) => {
  try {
    await updateDoc(doc(db, COLLECTION, id), { status });
  } catch (error) {
    handleFirestoreError(error, 'update', `${COLLECTION}/${id}`);
  }
};

export const deleteClass = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, 'delete', `${COLLECTION}/${id}`);
  }
};
