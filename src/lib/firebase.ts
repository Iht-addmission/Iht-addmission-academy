import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore, doc, getDocFromServer, initializeFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Use initializeFirestore to enable experimentalForceLongPolling for better connectivity
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  ignoreUndefinedProperties: true,
}, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const fetchNotices = async () => [];
export const fetchExams = async () => [];
export const fetchStudents = async () => [];
export const fetchAdmins = async () => [];
export const fetchRecordedClasses = async () => [];
export const fetchAllUsers = async () => [];
export const fetchAllExamResults = async () => [];
export const updateAdmissionStatus = async () => {};
export const fetchAdmissionStatus = async () => null;
export const fetchCourses = async () => [];
export const createCourse = async () => {};
export const updateCourse = async () => {};
export const deleteCourse = async () => {};
export const updateInstitute = async () => {};
export const deleteInstitute = async () => {};
export const createExam = async () => {};
export const submitExamResult = async () => {};
export const createRecordedClass = async () => {};
export const deleteRecordedClass = async () => {};
export const fetchTeachers = async () => [];
export const createTeacher = async () => {};
export const updateTeacher = async () => {};
