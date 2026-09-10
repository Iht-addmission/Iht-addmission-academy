/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from './lib/firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { User, Admission, Course, Institute, Exam, ExamResult } from './types';

// Helper to convert Firestore timestamp to ISO string
const toISO = (ts: any) => {
  if (ts instanceof Timestamp) return ts.toDate().toISOString();
  return ts || new Date().toISOString();
};

export async function fetchNotices() {
  const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), date: toISO(doc.data().createdAt) }));
}

export async function createNotice(data: any) {
  const docRef = await addDoc(collection(db, 'notices'), {
    ...data,
    createdAt: serverTimestamp()
  });
  
  // Trigger notification broadcast
  try {
    await createBroadcastNotification(
      `New Notice: ${data.title}`,
      data.content.substring(0, 100) + '...',
      'notice'
    );
  } catch (e) {
    console.error('Failed to broadcast notice notification:', e);
  }

  return { id: docRef.id, ...data };
}

export async function fetchNotifications(userId: string) {
  const q = query(
    collection(db, 'notifications'), 
    where('userId', '==', userId), 
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data(), 
    createdAt: toISO(doc.data().createdAt) 
  }));
}

export async function markNotificationAsRead(id: string) {
  await updateDoc(doc(db, 'notifications', id), { read: true });
}

export async function createBroadcastNotification(title: string, message: string, type: string) {
  const studentsSnapshot = await getDocs(query(collection(db, 'users'), where('role', '==', 'student')));
  const promises = studentsSnapshot.docs.map(studentDoc => 
    addDoc(collection(db, 'notifications'), {
      userId: studentDoc.id,
      title,
      message,
      type,
      read: false,
      createdAt: serverTimestamp()
    })
  );
  await Promise.all(promises);
}

export async function deleteNotice(id: string) {
  await deleteDoc(doc(db, 'notices', id));
}

export async function fetchAbout() {
  const docSnap = await getDoc(doc(db, 'settings', 'about'));
  if (docSnap.exists()) return docSnap.data();
  // Fallback to default
  return {
    ownerName: 'MD SHARIF ISLAM JOY',
    designation: 'Founder & Academic Director',
    qualification: 'On-going students, DMT in health Technology(ICA), BSc in Health Technology (DU)',
    bio: 'Leading the frontier of medical technical education for over a decade. Our mission is to produce world-class clinical technicians for Bangladesh.',
    vision: 'To harmonize technological precision with humanitarian medical care.',
    phone: '01819248542',
    email: 'xoysharif@gmail.com',
    photoUrl: '/src/assets/images/regenerated_image_1777971748339.jpg',
  };
}

export async function updateAbout(data: any) {
  await setDoc(doc(db, 'settings', 'about'), data, { merge: true });
  return data;
}

export async function submitAdmission(data: any) {
  const { photo, screenshot, ...admissionData } = data;
  
  let photoUrl = admissionData.photoUrl || '';
  let screenshotUrl = admissionData.screenshotUrl || '';

  if (photo) {
    photoUrl = await uploadFile(photo, `admissions/photos/${Date.now()}_${photo.name}`);
  }
  
  if (screenshot) {
    screenshotUrl = await uploadFile(screenshot, `admissions/payments/${Date.now()}_${screenshot.name}`);
  }
  
  const docRef = await addDoc(collection(db, 'admissions'), {
    ...admissionData,
    photoUrl,
    screenshotUrl,
    status: 'pending',
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, ...admissionData, photoUrl, screenshotUrl, status: 'pending' };
}

export async function uploadFile(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function fetchAdmissions() {
  const q = query(collection(db, 'admissions'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data(), 
    submittedAt: toISO(doc.data().createdAt) 
  }));
}

export async function updateAdmissionStatus(id: string, status: string) {
  const admissionRef = doc(db, 'admissions', id);
  await updateDoc(admissionRef, { status });
  
  if (status === 'approved') {
    const admissionSnap = await getDoc(admissionRef);
    if (admissionSnap.exists()) {
      const admissionData = admissionSnap.data();
      const userId = admissionData.userId;
      if (userId) {
        await updateDoc(doc(db, 'users', userId), { isPaid: true });
      }
    }
  }
  
  return { id, status };
}

export async function seedDatabase() {
  console.log('Starting global database seeding...');
  const institutes = [
    {
      id: 'ssmch-iht',
      name: 'SSMCH',
      nameBn: 'এসএসএমসিএইচ',
      location: 'Mitford, Dhaka',
      locationBn: 'মিটফোর্ড, ঢাকা',
      isApproved: true,
      seats: { 
        laboratory: { code: '411', seats: 50 }, 
        radiography: { code: '412', seats: 50 }, 
        physiotherapy: { code: '413', seats: 50 }
      },
      description: 'Sir Salimullah Medical College Hospital (IHT), clinical technology excellence at Mitford.',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'cmh-iht',
      name: 'CMH (DHAKA)',
      nameBn: 'সিএমএইচ (ঢাকা)',
      location: 'Dhaka Cantonment, Dhaka',
      locationBn: 'ঢাকা সেনানিবাস, ঢাকা',
      isApproved: true,
      seats: { 
        laboratory: { code: '511', seats: 40 }, 
        radiography: { code: '512', seats: 40 }, 
        ica: { code: '518', seats: 20 }
      },
      description: 'Combined Military Hospital (CMH), Dhaka Cantonment - Specialized military healthcare training.',
      image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'dhaka-iht',
      name: 'Institute of Health Technology (IHT), Dhaka',
      location: 'Mohakhali, Dhaka (near DGHS)',
      isApproved: true,
      seats: { 
        laboratory: { code: '111', seats: 50 }, 
        radiography: { code: '112', seats: 50 }, 
        physiotherapy: { code: '113', seats: 50 }, 
        dentistry: { code: '114', seats: 50 }, 
        pharmacy: { code: '115', seats: 50 }, 
        radiotherapy: { code: '116', seats: 20 }, 
        ota: { code: '117', seats: 25 }, 
        ica: { code: '118', seats: 25 } 
      },
      description: 'Established in 1963 as the "Paramedical Institute," it is the oldest and most prestigious government medical technology institute in Bangladesh. Affiliated with the University of Dhaka (for B.Sc.) & State Medical Faculty (for Diploma). Current Principal: Dr. Md. Mojib Uddin.',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200',
      website: 'http://ihtdhaka.gov.bd',
      phone: '02-9881234',
      email: 'info@ihtdhaka.gov.bd'
    },
    {
      id: 'rajshahi-iht',
      name: 'Rajshahi Institute of Health Technology',
      location: 'Greater Road, Rajshahi',
      isApproved: true,
      seats: { 
        laboratory: { code: '121', seats: 50 }, 
        radiography: { code: '122', seats: 50 }, 
        physiotherapy: { code: '123', seats: 50 }, 
        dentistry: { code: '124', seats: 50 }, 
        pharmacy: { code: '125', seats: 50 }, 
        radiotherapy: { code: '126', seats: 27 } 
      },
      description: 'A leading health technology institute serving the northern region of Bangladesh since 1976.',
      image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ee?auto=format&fit=crop&q=80&w=1200',
      website: 'http://ihtrajshahi.gov.bd'
    },
    {
      id: 'bogura-iht',
      name: 'Bogura Institute of Health Technology',
      location: 'Sherpur Road, Bogura',
      isApproved: true,
      seats: { 
        laboratory: { code: '131', seats: 50 }, 
        radiography: { code: '132', seats: 50 }, 
        physiotherapy: { code: '133', seats: 50 }, 
        dentistry: { code: '134', seats: 50 }, 
        pharmacy: { code: '135', seats: 50 }, 
        radiotherapy: { code: '136', seats: 57 } 
      },
      description: 'High-quality technical education for students in North Bengal.',
      image: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'chattogram-iht',
      name: 'Chattogram Institute of Health Technology',
      location: 'Panchlaish, Chattogram',
      isApproved: true,
      seats: { 
        laboratory: { code: '141', seats: 50 }, 
        radiography: { code: '142', seats: 50 }, 
        physiotherapy: { code: '143', seats: 50 }, 
        dentistry: { code: '144', seats: 50 }, 
        pharmacy: { code: '145', seats: 50 }, 
        radiotherapy: { code: '146', seats: 27 } 
      },
      description: 'The primary medical technology training center for the port city.',
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'barishal-iht',
      name: 'Barishal Institute of Health Technology',
      location: 'Band Road, Barishal',
      isApproved: true,
      seats: { 
        laboratory: { code: '151', seats: 50 }, 
        radiography: { code: '152', seats: 50 }, 
        physiotherapy: { code: '153', seats: 50 }, 
        dentistry: { code: '154', seats: 50 }, 
        pharmacy: { code: '155', seats: 50 }, 
        radiotherapy: { code: '156', seats: 27 } 
      },
      description: 'Serving the southern division of Bangladesh.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'rangpur-iht',
      name: 'Rangpur Institute of Health Technology',
      location: 'Mahiganj, Rangpur',
      isApproved: true,
      seats: { 
        laboratory: { code: '161', seats: 50 }, 
        radiography: { code: '162', seats: 50 }, 
        physiotherapy: { code: '163', seats: 50 }, 
        dentistry: { code: '164', seats: 50 }, 
        pharmacy: { code: '165', seats: 50 }, 
        radiotherapy: { code: '166', seats: 27 } 
      },
      description: 'Empowering students from Rangpur division.',
      image: 'https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'jhenaidah-iht',
      name: 'Jhenaidah Institute of Health Technology',
      location: 'Jhenaidah Town, Jhenaidah',
      isApproved: true,
      seats: { 
        laboratory: { code: '171', seats: 50 }, 
        radiography: { code: '172', seats: 50 }, 
        physiotherapy: { code: '173', seats: 50 }, 
        dentistry: { code: '174', seats: 50 }, 
        pharmacy: { code: '175', seats: 50 }, 
        radiotherapy: { code: '176', seats: 27 } 
      },
      description: 'Technical education center in the Khulna division.',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'sylhet-iht',
      name: 'Sylhet Institute of Health Technology',
      location: 'Jalalabad, Sylhet',
      isApproved: true,
      seats: { 
        laboratory: { code: '181', seats: 50 }, 
        radiography: { code: '182', seats: 50 }, 
        physiotherapy: { code: '183', seats: 50 }, 
        dentistry: { code: '184', seats: 50 }, 
        pharmacy: { code: '185', seats: 57 } 
      },
      description: 'Providing medical technology expertise in the Sylhet region.',
      image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'sirajgonj-iht',
      name: 'Sirajgonj Institute of Health Technology',
      location: 'Sirajgonj Sadar, Sirajgonj',
      isApproved: true,
      seats: { 
        laboratory: { code: '191', seats: 50 }, 
        pharmacy: { code: '195', seats: 53 } 
      },
      description: 'Technical training hub for students in Sirajgonj.',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'satkhira-iht',
      name: 'Satkhira Institute of Health Technology',
      location: 'Satkhira Sadar, Satkhira',
      isApproved: true,
      seats: { 
        laboratory: { code: '201', seats: 50 }, 
        radiography: { code: '202', seats: 53 } 
      },
      description: 'Serving the southwestern border district of Satkhira.',
      image: 'https://images.unsplash.com/photo-1538108197017-c13466739195?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'jamalpur-iht',
      name: 'Jamalpur Institute of Health Technology',
      location: 'Jamalpur Sadar, Jamalpur',
      isApproved: true,
      seats: { 
        laboratory: { code: '211', seats: 50 }, 
        radiography: { code: '212', seats: 50 }, 
        dentistry: { code: '214', seats: 50 }, 
        pharmacy: { code: '215', seats: 56 } 
      },
      description: 'Medical technology training in the Mymensingh region.',
      image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ee?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'tungipara-iht',
      name: 'Tungipara IHT (Gopalgonj)',
      location: 'Tungipara, Gopalgonj',
      isApproved: true,
      seats: { 
        laboratory: { code: '221', seats: 50 }, 
        pharmacy: { code: '225', seats: 53 } 
      },
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'gazipur-iht',
      name: 'Gazipur Institute of Health Technology',
      location: 'Gazipur Sadar, Gazipur',
      isApproved: true,
      seats: { 
        laboratory: { code: '231', seats: 50 }, 
        pharmacy: { code: '235', seats: 53 } 
      },
      image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ee?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'joypurhat-iht',
      name: 'Joypurhat Institute of Health Technology',
      location: 'Joypurhat Sadar, Joypurhat',
      isApproved: true,
      seats: { 
        laboratory: { code: '251', seats: 50 }, 
        pharmacy: { code: '255', seats: 53 } 
      },
      image: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'madaripur-iht',
      name: 'Madaripur Institute of Health Technology',
      location: 'Madaripur Sadar, Madaripur',
      isApproved: true,
      seats: { 
        laboratory: { code: '261', seats: 50 }, 
        radiography: { code: '262', seats: 50 }, 
        pharmacy: { code: '265', seats: 55 } 
      },
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'manikganj-iht',
      name: 'Manikganj Institute of Health Technology',
      location: 'Manikganj Sadar, Manikganj',
      isApproved: true,
      seats: { 
        laboratory: { code: '271', seats: 26 }, 
        radiography: { code: '272', seats: 26 } 
      },
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'munshiganj-iht',
      name: 'Munshiganj Institute of Health Technology',
      location: 'Munshiganj Sadar, Munshiganj',
      isApproved: true,
      seats: { 
        laboratory: { code: '281', seats: 26 }, 
        radiography: { code: '282', seats: 26 } 
      },
      image: 'https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'noakhali-iht',
      name: 'Noakhali Institute of Health Technology',
      location: 'Maijdee, Noakhali',
      isApproved: true,
      seats: { 
        laboratory: { code: '291', seats: 26 }, 
        radiography: { code: '292', seats: 26 } 
      },
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'naogaon-iht',
      name: 'Naogaon Institute of Health Technology',
      location: 'Naogaon Sadar, Naogaon',
      isApproved: true,
      seats: { 
        laboratory: { code: '301', seats: 26 }, 
        radiography: { code: '302', seats: 26 } 
      },
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'kurigram-iht',
      name: 'Kurigram Institute of Health Technology',
      location: 'Kurigram Sadar, Kurigram',
      isApproved: true,
      seats: { 
        laboratory: { code: '311', seats: 26 }, 
        radiography: { code: '312', seats: 26 } 
      },
      image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'mymensingh-iht',
      name: 'Mymensingh Institute of Health Technology',
      location: 'Mymensingh Sadar, Mymensingh',
      isApproved: true,
      seats: { 
        laboratory: { code: '321', seats: 26 }, 
        radiography: { code: '322', seats: 26 } 
      },
      image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'shibchor-iht',
      name: 'Shibchor Institute of Health Technology',
      location: 'Shibchor, Madaripur',
      isApproved: true,
      seats: { 
        laboratory: { code: '331', seats: 26 }, 
        radiography: { code: '332', seats: 26 } 
      },
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'lalmonirhat-iht',
      name: 'Lalmonirhat Institute of Health Technology',
      location: 'Sadar, Lalmonirhat',
      isApproved: true,
      seats: { 
        laboratory: { code: '341', seats: 26 }, 
        pharmacy: { code: '345', seats: 26 } 
      },
      image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ee?auto=format&fit=crop&q=80&w=1200'
    }
  ];
  
  const notices = [
    { title: 'Admission Open 2024-25 Session', content: 'Admission is now officially open for DMT, Pharmacy, and Radiology.', date: new Date().toISOString(), type: 'admission' },
    { title: 'Academic Calendar Published', content: 'The full academic calendar for the current session is now available.', date: new Date().toISOString(), type: 'academic' }
  ];

  const courses = [
    { 
      id: 'laboratory', 
      title: 'Laboratory Technology (DMLT)', 
      titleBn: 'ডিপ্লোমা ইন ল্যাবরেটরি মেডিসিন (DMLT)',
      fee: 125000, 
      duration: '3 Years + 1 Year Internship', 
      durationBn: '৩ বছর + ১ বছর ইন্টার্নশিপ',
      students: '2.4k', 
      rating: '4.9', 
      instructor: 'Dr. Sharif Ahmed', 
      description: 'Advanced diagnostic science and laboratory clinical training.', 
      descriptionBn: 'উন্নত ডায়াগনস্টিক বিজ্ঞান এবং ল্যাবরেটরি ক্লিনিক্যাল প্রশিক্ষণ।',
      syllabus: ['Hematology', 'Biochemistry', 'Microbiology'],
      detailedCurriculum: [
        { year: '1st Year', yearBn: '১ম বর্ষ', subjects: ['Basic Anatomy', 'Basic Physiology', 'Community Medicine', 'Basic Chemistry'], subjectsBn: ['বেসিক অ্যানাটমি', 'বেসিক ফিজিওলজি', 'কমিউনিটি মেডিসিন', 'বেসিক কেমিস্ট্রি'] },
        { year: '2nd Year', yearBn: '২য় বর্ষ', subjects: ['Clinical Hematology', 'Systemic Bacteriology', 'Clinical Biochemistry', 'Cytology'], subjectsBn: ['ক্লিনিক্যাল হেমাটোলজি', 'সিস্টেমিক ব্যাকটেরিওলজি', 'ক্লিনিক্যাল বায়োকেমিস্ট্রি', 'সাইটোলজি'] },
        { year: '3rd Year', yearBn: '৩য় বর্ষ', subjects: ['Immunology', 'Histopathology', 'Parasitology', 'Blood Banking'], subjectsBn: ['ইমিউনোলজি', 'হিস্টোপ্যাথলজি', 'প্যারাসাইটোলজি', 'ব্লাড ব্যাংকিং'] }
      ]
    },
    { 
      id: 'radiography', 
      title: 'Radiology & Imaging Technology', 
      titleBn: 'ডিপ্লোমা ইন রেডিওলজি এন্ড ইমেজিং',
      fee: 125000, 
      duration: '3 Years + 1 Year Internship', 
      durationBn: '৩ বছর + ১ বছর ইন্টার্নশিপ',
      students: '1.5k', 
      rating: '4.8', 
      instructor: 'Prof. Hasan Ali', 
      description: 'Medical imaging technology, X-Ray, and MRI operations.', 
      descriptionBn: 'মেডিকেল ইমেজিং প্রযুক্তি, এক্স-রে এবং এমআরআই অপারেশন।',
      syllabus: ['Physics', 'Imaging Tech', 'Anatomy'],
      detailedCurriculum: [
        { year: '1st Year', yearBn: '১ম বর্ষ', subjects: ['Anatomy I', 'Physiology I', 'Physics for Radiography', 'English'], subjectsBn: ['অ্যানাটমি ১', 'ফিজিওলজি ১', 'রেডিওগ্রাফি ফিজিক্স', 'ইংরেজি'] },
        { year: '2nd Year', yearBn: '২য় বর্ষ', subjects: ['Radiographic Technique', 'Imaging Physics', 'Darkroom Procedure'], subjectsBn: ['রেডিওগ্রাফিক টেকনিক', 'ইমেজিং ফিজিক্স', 'ডারকরুম প্রসিডিউর'] },
        { year: '3rd Year', yearBn: '৩য় বর্ষ', subjects: ['Advanced Imaging', 'CT Scan', 'MRI', 'Radiation Protection'], subjectsBn: ['অ্যাডভান্সড ইমেজিং', 'সিটি স্ক্যান', 'এমআরআই', 'রেডিয়েশন প্রোটেকশন'] }
      ]
    },
    { 
      id: 'physiotherapy', 
      title: 'Physiotherapy (DPT)', 
      titleBn: 'ডিপ্লোমা ইন ফিজিওথেরাপি (DPT)',
      fee: 125000, 
      duration: '3 Years + 1 Year Internship', 
      durationBn: '৩ বছর + ১ বছর ইন্টার্নশিপ',
      students: '1.8k', 
      rating: '4.7', 
      instructor: 'Dr. Jane Smith', 
      description: 'Rehabilitative medicine and physical therapy technical training.', 
      descriptionBn: 'পুনর্বাসন ঔষধ এবং শারীরিক থেরাপি প্রযুক্তিগত প্রশিক্ষণ।',
      syllabus: ['Kinesiology', 'Therapeutic Exercise', 'Electrotherapy'],
      detailedCurriculum: [
        { year: '1st Year', yearBn: '১ম বর্ষ', subjects: ['Anatomy', 'Physiology', 'Physics for PT', 'Behavioral Science'], subjectsBn: ['অ্যানাটমি', 'ফিজিওলজি', 'পিটি ফিজিক্স', 'আচরণগত বিজ্ঞান'] },
        { year: '2nd Year', yearBn: '২য় বর্ষ', subjects: ['Biomechanics', 'Exercise Therapy', 'Massage', 'Electrotherapy I'], subjectsBn: ['বায়োমেকানিক্স', 'ব্যায়াম থেরাপি', 'ম্যাসাজ', 'ইলেক্ট্রোথেরাপি ১'] },
        { year: '3rd Year', yearBn: '৩য় বর্ষ', subjects: ['PT in Orthopaedics', 'PT in Neurology', 'Electrotherapy II', 'Ethics'], subjectsBn: ['অর্থোপেডিকস পিটি', 'নিউরোলজি পিটি', 'ইলেক্ট্রোথেরাপি ২', 'নীতিশাস্ত্র'] }
      ]
    },
    { 
      id: 'dentistry', 
      title: 'Dental Technology (DDT)', 
      titleBn: 'ডিপ্লোমা ইন ডেন্টিস্ট্রি (DDT)',
      fee: 125000, 
      duration: '3 Years + 1 Year Internship', 
      durationBn: '৩ বছর + ১ বছর ইন্টার্নশিপ',
      students: '1.2k', 
      rating: '4.9', 
      instructor: 'Dr. Mike Ross', 
      description: 'Oral health technical science and dental clinical support.', 
      descriptionBn: 'মৌখিক স্বাস্থ্য প্রযুক্তিগত বিজ্ঞান এবং ডেন্টাল ক্লিনিক্যাল সহায়তা।',
      syllabus: ['Oral Anatomy', 'Prosthodontics', 'Dental Materials'],
      detailedCurriculum: [
        { year: '1st Year', yearBn: '১ম বর্ষ', subjects: ['Dental Anatomy', 'Physiology', 'Dental Materials', 'English'], subjectsBn: ['ডেন্টাল অ্যানাটমি', 'ফিজিওলজি', 'ডেন্টাল উপকরণ', 'ইংরেজি'] },
        { year: '2nd Year', yearBn: '২য় বর্ষ', subjects: ['Prosthodontics', 'Orthodontics', 'Conservative Dentistry'], subjectsBn: ['প্রস্টোডন্টিকস', 'অর্থোডন্টিকস', 'কনজারভেটিভ ডেন্টিস্ট্রি'] },
        { year: '3rd Year', yearBn: '৩য় বর্ষ', subjects: ['Oral Surgery Support', 'Periodontology', 'Community Dentistry'], subjectsBn: ['ওরাল সার্জারি সাপোর্ট', 'পিরিওডন্টোলজি', 'কমিউনিটি ডেন্টিস্ট্রি'] }
      ]
    },
    { 
      id: 'pharmacy', 
      title: 'Diploma In Pharmacy (DP)', 
      titleBn: 'ডিপ্লোমা ইন ফার্মেসি (DP)',
      fee: 150000, 
      duration: '3 Years + 1 Year Internship', 
      durationBn: '৩ বছর + ১ বছর ইন্টার্নশিপ',
      students: '2k', 
      rating: '4.8', 
      instructor: 'Dr. Sarah Wilson', 
      description: 'Pharmaceutical science and clinical drug management training.', 
      descriptionBn: 'ফার্মাসিউটিক্যাল বিজ্ঞান এবং ক্লিনিক্যাল ড্রাগ ম্যানেজমেন্ট প্রশিক্ষণ।',
      syllabus: ['Pharmacology', 'Pharmaceutics', 'Pharma Chemistry'],
      detailedCurriculum: [
        { year: '1st Year', yearBn: '১ম বর্ষ', subjects: ['Pharmaceutics I', 'Pharma Chemistry I', 'Biochestry'], subjectsBn: ['ফার্মাসিউটিকস ১', 'ফার্মাসিউটিক্যাল কেমিস্ট্রি ১', 'বায়োকেমিস্ট্রি'] },
        { year: '2nd Year', yearBn: '২য় বর্ষ', subjects: ['Pharmacognosy', 'Pharmacology I', 'Pharmaceutics II'], subjectsBn: ['ফার্মাকগনোসি', 'ফার্মাকোলজি ১', 'ফার্মাসিউটিকস ২'] },
        { year: '3rd Year', yearBn: '৩য় বর্ষ', subjects: ['Hospital Pharmacy', 'Forensic Pharmacy', 'Pharmacology II'], subjectsBn: ['হাসপাতাল ফার্মেসি', 'ফরেনসিক ফার্মেসি', 'ফার্মাকোলজি ২'] }
      ]
    },
    { 
      id: 'radiotherapy', 
      title: 'Radiotherapy Technology', 
      titleBn: 'রেডিওথেরাপি টেকনোলজি',
      fee: 125000, 
      duration: '3 Years + 1 Year Internship', 
      durationBn: '৩ বছর + ১ বছর ইন্টার্নশিপ',
      students: '800', 
      rating: '4.6', 
      instructor: 'Dr. Wilson', 
      description: 'Cancer treatment support and radiation therapy management.', 
      descriptionBn: 'ক্যান্সার চিকিত্সা সহায়তা এবং বিকিরণ থেরাপি ব্যবস্থাপনা।',
      syllabus: ['Radiation Oncology', 'Physics', 'Dosimetry'],
      detailedCurriculum: [
        { year: '1st Year', yearBn: '১ম বর্ষ', subjects: ['Radiation Physics', 'Anatomy', 'Physiology', 'Pathology'], subjectsBn: ['রেডিয়েশন ফিজিক্স', 'অ্যানাটমি', 'ফিজিওলজি', 'প্যাথলজি'] },
        { year: '2nd Year', yearBn: '২য় বর্ষ', subjects: ['Radiotherapy Technique', 'Imaging for Planning', 'Radiobiology'], subjectsBn: ['রেডিওথেরাপি টেকনিক', 'ইমেজিং ফর প্ল্যানিং', 'রেডিওবায়োলজি'] },
        { year: '3rd Year', yearBn: '৩য় বর্ষ', subjects: ['Oncology', 'Dosimetry', 'Clinical Practice'], subjectsBn: ['অনকোলজি', 'ডোসিমেট্রি', 'ক্লিনিক্যাল প্র্যাকটিস'] }
      ]
    },
    { 
      id: 'ota', 
      title: 'OT Technology (OTA)', 
      titleBn: 'ওটি টেকনোলজি (OTA)',
      fee: 125000, 
      duration: '3 Years + 1 Year Internship', 
      durationBn: '৩ বছর + ১ বছর ইন্টার্নশিপ',
      students: '900', 
      rating: '4.7', 
      instructor: 'Dr. House', 
      description: 'Surgical support and OT sterilization technical procedures.', 
      descriptionBn: 'সার্জিক্যাল সাপোর্ট এবং ওটি নির্বীজন প্রযুক্তিগত পদ্ধতি।',
      syllabus: ['Surgical Instrumentation', 'Sterilization', 'OT Management'],
      detailedCurriculum: [
        { year: '1st Year', yearBn: '১ম বর্ষ', subjects: ['Anatomy', 'Physiology', 'Microbiology', 'English'], subjectsBn: ['অ্যানাটমি', 'ফিজিওলজি', 'মাইক্রোবায়োলজি', 'ইংরেজি'] },
        { year: '2nd Year', yearBn: '২য় বর্ষ', subjects: ['OT Techniques', 'Anesthesia Basics', 'Pharmacology'], subjectsBn: ['ওটি টেকনিকস', 'অ্যানেস্থেসিয়া বেসিকস', 'ফার্মাকোলজি'] },
        { year: '3rd Year', yearBn: '৩য় বর্ষ', subjects: ['Advanced Surgery Support', 'Emergency Care', 'OT Admin'], subjectsBn: ['অ্যাডভান্সড সার্জারি সাপোর্ট', 'ইমার্জেন্সি কেয়ার', 'ওটি অ্যাডমিন'] }
      ]
    },
    { 
      id: 'ica', 
      title: 'ICU Assistant (ICA)', 
      titleBn: 'আইসিইউ অ্যাসিস্ট্যান্ট (ICA)',
      fee: 125000, 
      duration: '3 Years + 1 Year Internship', 
      durationBn: '৩ বছর + ১ বছর ইন্টার্নশিপ',
      students: '600', 
      rating: '4.5', 
      instructor: 'Dr. Strange', 
      description: 'Critical care support and emergency medical technical skills.', 
      descriptionBn: 'ক্রিটিক্যাল কেয়ার সাপোর্ট এবং জরুরি চিকিৎসা প্রযুক্তিগত দক্ষতা।',
      syllabus: ['Ventilator Support', 'Critical Care', 'Emergency Response'],
      detailedCurriculum: [
        { year: '1st Year', yearBn: '১ম বর্ষ', subjects: ['Anatomy', 'Physiology', 'Basic Nursing', 'English'], subjectsBn: ['অ্যানাটমি', 'ফিজিওলজি', 'বেসিক নার্সিং', 'ইংরেজি'] },
        { year: '2nd Year', yearBn: '২য় বর্ষ', subjects: ['ICU Equipment', 'Pharmacology', 'Critical Care Nursing'], subjectsBn: ['আইসিইউ সরঞ্জাম', 'ফার্মাকোলজি', 'ক্রিটিক্যাল কেয়ার নার্সিং'] },
        { year: '3rd Year', yearBn: '৩য় বর্ষ', subjects: ['Advanced Life Support', 'Trauma Management', 'Monitor Care'], subjectsBn: ['অ্যাডভান্সড লাইফ সাপোর্ট', 'ট্রমা ম্যানেজমেন্ট', 'মনিটর কেয়ার'] }
      ]
    },
    { 
      id: 'sanitary', 
      title: 'Sanitary Inspection (SIT)', 
      titleBn: 'স্যানিটারি ইন্সপেকশন (SIT)',
      fee: 125000, 
      duration: '3 Years + 1 Year Internship', 
      durationBn: '৩ বছর + ১ বছর ইন্টার্নশিপ',
      students: '1k', 
      rating: '4.4', 
      instructor: 'Dr. Watson', 
      description: 'Public health and sanitation management training.', 
      descriptionBn: 'জনস্বাস্থ্য এবং স্যানিটেশন ব্যবস্থাপনা প্রশিক্ষণ।',
      syllabus: ['Environmental Health', 'Food Safety', 'Epidemiology'],
      detailedCurriculum: [
        { year: '1st Year', yearBn: '১ম বর্ষ', subjects: ['Environmental Health', 'Anatomy', 'Physiology', 'English'], subjectsBn: ['পরিবেশগত স্বাস্থ্য', 'অ্যানাটমি', 'ফিজিওলজি', 'ইংরেজি'] },
        { year: '2nd Year', yearBn: '২য় বর্ষ', subjects: ['Food Safety', 'Communicable Diseases', 'Waste Management'], subjectsBn: ['খাদ্য নিরাপত্তা', 'ছোঁয়াচে রোগ', 'বর্জ্য ব্যবস্থাপনা'] },
        { year: '3rd Year', yearBn: '৩য় বর্ষ', subjects: ['Epidemiology', 'Public Health Laws', 'Rural Sanitation'], subjectsBn: ['এপিডেমিওলজি', 'জনস্বাস্থ্য আইন', 'পল্লী স্যানিটেশন'] }
      ]
    },
    { 
      id: 'admission-masterclass', 
      title: 'Admission Masterclass', 
      titleBn: 'অ্যাডমিশন মাস্টারক্লাস',
      fee: 4500, 
      duration: '6 Months', 
      durationBn: '৬ মাস',
      seats: '200', 
      students: '5k', 
      rating: '5.0', 
      instructor: 'Joy Sharif', 
      level: 'Admission', 
      description: 'Complete preparation for Govt IHT/MATS admission exams.', 
      descriptionBn: 'সরকারি আইএইচটি/ম্যাটস ভর্তি পরীক্ষার জন্য সম্পূর্ণ প্রস্তুতি।',
      syllabus: ['Biology', 'Chemistry', 'Physics', 'General Knowledge'],
      detailedCurriculum: [
        { year: 'Core Module', yearBn: 'মূল মডিউল', subjects: ['Biology Intensive', 'Chemistry Basics', 'Physics Mastery', 'General Knowledge & English'], subjectsBn: ['জীববিজ্ঞান ইনটেনসিভ', 'রসায়ন বেসিকস', 'পদার্থবিজ্ঞান মাস্টারি', 'সাধারণ জ্ঞান ও ইংরেজি'] }
      ]
    },
    { 
      id: 'bsc-lab', 
      title: 'B.Sc. in Health Technology (Laboratory)', 
      titleBn: 'বিএসসি ইন হেলথ টেকনোলজি (ল্যাবরেটরি)',
      fee: 250000, 
      duration: '4 Years', 
      durationBn: '৪ বছর',
      students: '400', 
      rating: '5.0', 
      instructor: 'Dr. Md. Mojib Uddin', 
      description: 'Advanced clinical diagnostic education affiliated with the University of Dhaka.', 
      descriptionBn: 'ঢাকা বিশ্ববিদ্যালয়ের অধীনে উন্নত ক্লিনিক্যাল ডায়াগনস্টিক শিক্ষা।',
      detailedCurriculum: [
        { year: '1st Year', yearBn: '১ম বর্ষ', subjects: ['Anatomy', 'Physiology', 'Biochemistry', 'Community Medicine'], subjectsBn: ['অ্যানাটমি', 'ফিজিওলজি', 'বায়োকেমিস্ট্রি', 'কমিউনিটি মেডিসিন'] },
        { year: '2nd Year', yearBn: '২য় বর্ষ', subjects: ['Microbiology', 'General Pathology', 'Pharmacology', 'Parasitology'], subjectsBn: ['মাইক্রোবায়োলজি', 'সাধারণ প্যাথলজি', 'ফার্মাকোলজি', 'প্যারাসাইটোলজি'] },
        { year: '3rd Year', yearBn: '৩য় বর্ষ', subjects: ['Hematology', 'Clinical Biochemistry', 'Immunology', 'Histopathology'], subjectsBn: ['হেমাটোলজি', 'ক্লিনিক্যাল বায়োকেমিস্ট্রি', 'ইমিউনোলজি', 'হিস্টোপ্যাথলজি'] },
        { year: '4th Year', yearBn: '৪র্থ বর্ষ', subjects: ['Molecular Biology', 'Research Methodology', 'Advanced Lab Tech', 'Biostatistics'], subjectsBn: ['মলিকুলার বায়োলজি', 'রিসার্চ মেথডোলজি', 'অ্যাডভান্সড ল্যাব টেক', 'বায়োস্ট্যাটিস্টিকস'] }
      ]
    },
    { 
      id: 'bsc-radiology', 
      title: 'B.Sc. in Radiology & Imaging', 
      titleBn: 'বিএসসি ইন রেডিওলজি এন্ড ইমেজিং',
      fee: 250000, 
      duration: '4 Years', 
      durationBn: '৪ বছর',
      students: '350', 
      rating: '4.9', 
      instructor: 'Dr. Md. Mojib Uddin', 
      description: 'Medical imaging technology, MRI, and CT scan specialization.', 
      descriptionBn: 'মেডিকেল ইমেজিং প্রযুক্তি, এমআরআই এবং সিটি স্ক্যান স্পেশালাইজেশন।',
      detailedCurriculum: [
        { year: '1st Year', yearBn: '১ম বর্ষ', subjects: ['Anatomy', 'Physiology', 'Physics', 'Behavioral Science'], subjectsBn: ['অ্যানাটমি', 'ফিজিওলজি', 'পদার্থবিজ্ঞান', 'আচরণগত বিজ্ঞান'] },
        { year: '2nd Year', yearBn: '২য় বর্ষ', subjects: ['Imaging Tech', 'Darkroom Procedure', 'Radiographic Anatomy'], subjectsBn: ['ইমেজিং টেক', 'ডারকরুম প্রসিডিউর', 'রেডিওগ্রাফিক অ্যানাটমি'] },
        { year: '3rd Year', yearBn: '৩য় বর্ষ', subjects: ['Special Imaging', 'CT Scan', 'MRI Basics', 'Radiation Physics'], subjectsBn: ['স্পেশাল ইমেজিং', 'সিটি স্ক্যান', 'এমআরআই বেসিকস', 'রেডিয়েশন ফিজিক্স'] },
        { year: '4th Year', yearBn: '৪র্থ বর্ষ', subjects: ['Nuclear Medicine', 'Ultrasonography', 'Advanced Radiological Tech', 'Research'], subjectsBn: ['নিউক্লিয়ার মেডিসিন', 'আল্ট্রাসনোগ্রাফি', 'অ্যাডভান্সড রেডিওলজিক্যাল টেক', 'রিসার্চ'] }
      ]
    },
    { 
      id: 'bsc-physiotherapy', 
      title: 'B.Sc. in Physiotherapy', 
      titleBn: 'বিএসসি ইন ফিজিওথেরাপি',
      fee: 250000, 
      duration: '4 Years', 
      durationBn: '৪ বছর',
      students: '380', 
      rating: '4.9', 
      instructor: 'Dr. Md. Mojib Uddin', 
      description: 'Physical therapy and rehabilitative medicine specialized training.', 
      descriptionBn: 'শারীরিক থেরাপি এবং পুনর্বাসন ঔষধ বিশেষায়িত প্রশিক্ষণ।',
      detailedCurriculum: [
        { year: '1st Year', yearBn: '১ম বর্ষ', subjects: ['Human Anatomy', 'Physiology', 'Biochemistry', 'Kinesiology'], subjectsBn: ['হিউম্যান অ্যানাটমি', 'ফিজিওলজি', 'বায়োকেমিস্ট্রি', 'কাইনসিওলজি'] },
        { year: '2nd Year', yearBn: '২য় বর্ষ', subjects: ['Biomechanics', 'Exercise Therapy', 'Electrotherapy I', 'Psychology'], subjectsBn: ['বায়োমেকানিক্স', 'ব্যায়াম থেরাপি', 'ইলেক্ট্রোথেরাপি ১', 'মনোবিজ্ঞান'] },
        { year: '3rd Year', yearBn: '৩য় বর্ষ', subjects: ['Clinical Orthopaedics', 'Neurology', 'Electrotherapy II', 'PT Ethics'], subjectsBn: ['ক্লিনিক্যাল অর্থোপেডিকস', 'নিউরোলজি', 'ইলেক্ট্রোথেরাপি ২', 'পিটি এথিক্স'] },
        { year: '4th Year', yearBn: '৪র্থ বর্ষ', subjects: ['PT in Surgery', 'Gerontology', 'Community PT', 'Research Project'], subjectsBn: ['সার্জারি পিটি', 'জেরোন্টোলজি', 'কমিউনিটি পিটি', 'রিসার্চ প্রজেক্ট'] }
      ]
    }
  ];

  try {
    // Seed Institutes
    for (const inst of institutes) {
      const { id, ...data } = inst;
      await setDoc(doc(db, 'institutes', id), data);
    }

    // Seed Notices
    for (const notice of notices) {
      await addDoc(collection(db, 'notices'), { ...notice, createdAt: serverTimestamp() });
    }

    // Seed Courses
    for (const course of courses) {
      const { id, ...data } = course;
      await setDoc(doc(db, 'courses', id), data);
    }
    console.log('Database seeded successfully.');
    return { success: true };
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
}

export async function fetchAdmissionStatus(email: string) {
  const q = query(collection(db, 'admissions'), where('email', '==', email), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const data = snapshot.docs[0].data();
  return { id: snapshot.docs[0].id, ...data, submittedAt: toISO(data.createdAt) };
}

export async function fetchCourses() {
  const snapshot = await getDocs(collection(db, 'courses'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function createCourse(data: any) {
  const docRef = await addDoc(collection(db, 'courses'), data);
  return { id: docRef.id, ...data };
}

export async function updateCourse(id: string, data: any) {
  await updateDoc(doc(db, 'courses', id), data);
  return { id, ...data };
}

export async function deleteCourse(id: string) {
  await deleteDoc(doc(db, 'courses', id));
}

export async function fetchTeachers(): Promise<User[]> {
  const q = query(collection(db, 'users'), where('role', '==', 'teacher'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

export async function createTeacher(data: any) {
  // Ideally this should be handled by a secure function, but for now we create the user doc
  const docRef = await addDoc(collection(db, 'users'), { ...data, role: 'teacher' });
  return { id: docRef.id, ...data, role: 'teacher' };
}

export async function updateTeacher(id: string, data: any) {
  await updateDoc(doc(db, 'users', id), data);
  return { id, ...data };
}

export async function deleteTeacher(id: string) {
  await deleteDoc(doc(db, 'users', id));
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const fbUser = userCredential.user;

  const userRef = doc(db, 'users', fbUser.uid);
  const userDoc = await getDoc(userRef);
  
  const isAdmin = fbUser.email === 'xoysharif@gmail.com';

  if (userDoc.exists()) {
    const data = userDoc.data();
    if (isAdmin && (data.role !== 'admin' || data.isPaid !== true)) {
       await setDoc(userRef, { ...data, role: 'admin', isPaid: true, isApproved: true }, { merge: true });
       return { id: fbUser.uid, email: fbUser.email, ...data, role: 'admin', isPaid: true, isApproved: true };
    }
    return { id: fbUser.uid, email: fbUser.email || '', ...data };
  }

  const userData = {
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: fbUser.displayName || '',
    role: isAdmin ? 'admin' : 'student',
    isPaid: isAdmin ? true : false,
    isApproved: isAdmin ? true : false, // Default students/others to false for now as per previous behavior
    createdAt: new Date().toISOString()
  };

  await setDoc(userRef, userData);
  return { id: fbUser.uid, ...userData };
}

export async function login(credentials: any) {
  const { email, password } = credentials;
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const fbUser = userCredential.user;
  
  const userRef = doc(db, 'users', fbUser.uid);
  const userDoc = await getDoc(userRef);
  
  const isAdmin = fbUser.email === 'xoysharif@gmail.com';

  if (userDoc.exists()) {
    const data = userDoc.data();
    if (isAdmin && (data.role !== 'admin' || data.isPaid !== true)) {
       await setDoc(userRef, { ...data, role: 'admin', isPaid: true, isApproved: true }, { merge: true });
       return { id: fbUser.uid, email: fbUser.email, ...data, role: 'admin', isPaid: true, isApproved: true };
    }
    return { id: fbUser.uid, email: fbUser.email || '', ...data };
  }
  
  const userData = {
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: fbUser.displayName || '',
    role: isAdmin ? 'admin' : 'student',
    isPaid: isAdmin ? true : false,
    isApproved: isAdmin ? true : false,
    createdAt: new Date().toISOString()
  };
  
  await setDoc(userRef, userData);
  return { id: fbUser.uid, ...userData };
}

export async function signup(data: any) {
  const { email, password, name, role } = data;
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const fbUser = userCredential.user;

  await updateProfile(fbUser, { displayName: name });

  const isAdmin = email === 'xoysharif@gmail.com';
  const userData = {
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: name,
    role: isAdmin ? 'admin' : (role || 'student'),
    isPaid: isAdmin ? true : false,
    isApproved: isAdmin ? true : false,
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'users', fbUser.uid), userData);
  return { id: fbUser.uid, ...userData };
}

export async function fetchInstitutes() {
  const snapshot = await getDocs(collection(db, 'institutes'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addInstitute(data: any) {
  const docRef = await addDoc(collection(db, 'institutes'), data);
  return { id: docRef.id, ...data };
}

export async function updateInstitute(id: string, data: any) {
  await updateDoc(doc(db, 'institutes', id), data);
  return { id, ...data };
}

export async function deleteInstitute(id: string) {
  await deleteDoc(doc(db, 'institutes', id));
}

export async function fetchExams() {
  const q = query(collection(db, 'exams'), where('status', '==', 'active'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function createExam(data: any) {
  const docRef = await addDoc(collection(db, 'exams'), {
    ...data,
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, ...data };
}

export async function submitExamResult(data: any) {
  const docRef = await addDoc(collection(db, 'examResults'), {
    ...data,
    submittedAt: serverTimestamp()
  });
  return { id: docRef.id, ...data };
}

export async function fetchExamResults(email: string) {
  const q = query(collection(db, 'examResults'), where('userEmail', '==', email), orderBy('submittedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), submittedAt: toISO(doc.data().submittedAt) }));
}

export async function fetchAllExamResults() {
  const q = query(collection(db, 'examResults'), orderBy('submittedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), submittedAt: toISO(doc.data().submittedAt) }));
}

export async function fetchStudents(): Promise<User[]> {
  const q = query(collection(db, 'users'), where('role', '==', 'student'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

export async function fetchAllUsers(): Promise<User[]> {
  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

export async function updateUserApproval(userId: string, isApproved: boolean) {
  await updateDoc(doc(db, 'users', userId), { isApproved });
}

export async function updateUserRole(userId: string, role: string) {
  await updateDoc(doc(db, 'users', userId), { role });
}

export async function updateUserProfile(userId: string, data: any) {
  const { photo, idPhoto, ...profileData } = data;
  let photoUrl = profileData.photoUrl || '';
  let idPhotoUrl = profileData.idPhotoUrl || '';

  if (photo instanceof File) {
    photoUrl = await uploadFile(photo, `users/profiles/${userId}_${Date.now()}_${photo.name}`);
  }

  if (idPhoto instanceof File) {
    idPhotoUrl = await uploadFile(idPhoto, `users/ids/${userId}_${Date.now()}_${idPhoto.name}`);
  }

  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { ...profileData, photoUrl, idPhotoUrl });
  
  if (auth.currentUser && auth.currentUser.uid === userId && profileData.displayName) {
    await updateProfile(auth.currentUser, { displayName: profileData.displayName });
  }

  return { id: userId, ...profileData, photoUrl, idPhotoUrl };
}

export async function createChat(teacherId: string, studentId: string, studentName: string, teacherName: string) {
  const q = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', teacherId)
  );
  const snapshot = await getDocs(q);
  const existingChat = snapshot.docs.find(doc => {
    const data = doc.data();
    return data.participants.includes(studentId);
  });
  
  if (existingChat) return { id: existingChat.id, ...existingChat.data() };

  const chatData = {
    participants: [teacherId, studentId],
    studentId,
    teacherId,
    studentName,
    teacherName,
    lastMessage: '',
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  };
  
  const docRef = await addDoc(collection(db, 'chats'), chatData);
  return { id: docRef.id, ...chatData };
}

export async function sendChatMessage(chatId: string, senderId: string, text: string) {
  await addDoc(collection(db, 'chats', chatId, 'messages'), {
    senderId,
    text,
    createdAt: serverTimestamp()
  });
  
  await updateDoc(doc(db, 'chats', chatId), {
    lastMessage: text,
    updatedAt: serverTimestamp()
  });
}

export async function fetchAdmins(): Promise<User[]> {
  const q = query(collection(db, 'users'), where('role', '==', 'admin'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

export async function fetchRecordedClasses() {
  const q = query(collection(db, 'recordedClasses'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data(), 
    date: toISO(doc.data().createdAt) 
  }));
}

export async function createRecordedClass(data: any) {
  const docRef = await addDoc(collection(db, 'recordedClasses'), {
    ...data,
    createdAt: serverTimestamp()
  });
  
  // Trigger notification broadcast
  try {
    await createBroadcastNotification(
      `New Lecture Video: ${data.title}`,
      `A new recorded session for ${data.course} is now available in the vault.`,
      'video'
    );
  } catch (e) {
    console.error('Failed to broadcast video notification:', e);
  }

  return { id: docRef.id, ...data };
}

export async function deleteRecordedClass(id: string) {
  await deleteDoc(doc(db, 'recordedClasses', id));
}
