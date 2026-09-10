/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  name?: string;
  displayName?: string;
  photoUrl?: string;
  phone?: string;
  address?: string;
  department?: string;
  batch?: string;
  studentId?: string;
  admissionId?: string;
  idPhotoUrl?: string;
  isApproved?: boolean;
  isPaid?: boolean;
  createdAt?: string;
}

export interface DepartmentInfo {
  code: string;
  seats: number;
}

export interface SeatMapping {
  [departmentId: string]: DepartmentInfo | number;
}

export interface Institute {
  id: string;
  name: string;
  nameBn?: string;
  location: string;
  locationBn?: string;
  isApproved: boolean;
  seats: SeatMapping;
  description?: string;
  descriptionBn?: string;
  image?: string;
  logo?: string;
  website?: string;
  facebook?: string;
  phone?: string;
  email?: string;
  mapEmbed?: string;
  gallery?: string[];
}

export interface Course {
  id: string;
  title: string;
  titleBn?: string;
  duration: string;
  durationBn?: string;
  fee: string;
  description: string;
  descriptionBn?: string;
  image: string;
  logo?: string;
  envImage?: string;
  outcomes?: string[];
  outcomesBn?: string[];
  instructors?: {
    name: string;
    nameBn?: string;
    role: string;
    roleBn?: string;
    avatar: string;
  }[];
  totalSeats?: number;
  curriculum?: string[];
  curriculumBn?: string[];
  cutMark?: string;
  association?: string;
  jobFacilities?: string[];
  jobFacilitiesBn?: string[];
  qualification?: string;
  qualificationBn?: string[];
  affiliationAuthority?: string[];
  affiliationAuthorityBn?: string[];
  professionalAssociations?: string[];
  professionalAssociationsBn?: string[];
  clinicalPartners?: string[];
  clinicalPartnersBn?: string[];
  accreditationStatus?: string;
  accreditationStatusBn?: string;
  detailedCurriculum?: {
    year: string;
    yearBn?: string;
    subjects: string[];
    subjectsBn?: string[];
  }[];
}

export interface Notice {
  id: string;
  title: string;
  titleBn?: string;
  content: string;
  contentBn?: string;
  date: string;
}

export interface Admission {
  id: string;
  name: string;
  courseId: string;
  phone: string;
  sscInfo?: string;
  hscInfo?: string;
  paymentMethod: 'bkash' | 'nagad' | 'rocket';
  paymentNumber: string;
  transactionId: string;
  screenshotUrl?: string;
  photoUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface ClassSession {
  id: string;
  courseId: string;
  title: string;
  type: 'live' | 'recorded';
  url: string;
  date: string;
  notesUrl?: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
}

export interface Exam {
  id: string;
  title: string;
  courseId: string;
  durationMinutes: number;
  totalMarks: number;
  questions: Question[];
  status: 'active' | 'archived';
  createdAt: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  userEmail: string;
  userName: string;
  score: number;
  totalMarks: number;
  submittedAt: string;
}
