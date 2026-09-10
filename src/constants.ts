/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Course, Notice } from '../types';

export const COURSES: Course[] = [
  {
    id: 'dmt-radiotherapy',
    title: 'Diploma in Medical Technology (Radiotherapy)',
    titleBn: 'ডিপ্লোমা ইন মেডিকেল টেকনোলজি (রেডিওথেরাপি)',
    duration: '4 Years',
    durationBn: '৪ বছর',
    qualification: 'SSC / Equivalent',
    description: 'Learn advanced cancer treatment techniques using ionizing radiation under clinical supervision.',
    descriptionBn: 'ক্লিনিকাল তত্ত্বাবধানে আয়োনাইজিং রেডিয়েশন ব্যবহার করে আধুনিক ক্যানসার চিকিৎসা পদ্ধতি শিখুন।',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
    totalSeats: 120,
    cutMark: '75%',
    accreditationStatus: 'Fully Accredited',
    affiliationAuthority: ['State Medical Faculty of Bangladesh', 'DGHS'],
    professionalAssociations: ['Bangladesh Medical Technologist Association'],
    clinicalPartners: ['National Institute of Cancer Research & Hospital'],
    jobFacilities: ['Government Hospitals', 'Private Oncology Centers', 'Cancer Institutes'],
    detailedCurriculum: [
      { year: '1st Year', yearBn: '১ম বর্ষ', subjects: ['Anatomy & Physiology', 'Basic Physics & Radiation Biology'], subjectsBn: ['অ্যানাটমি ও ফিজিওলজি', 'বেসিক ফিজিক্স ও রেডিয়েশন বায়োলজি'] },
      { year: '2nd Year', yearBn: '২য় বর্ষ', subjects: ['Radiotherapy Equipment', 'Clinical Oncology'], subjectsBn: ['রেডিওথেরাপি যন্ত্রপাতি', 'ক্লিনিকাল অনকোলজি'] }
    ]
  },
  {
    id: 'dmt-laboratory',
    title: 'Diploma in Medical Technology (Laboratory)',
    titleBn: 'ডিপ্লোমা ইন মেডিকেল টেকনোলজি (ল্যাবরেটরি)',
    duration: '4 Years',
    durationBn: '৪ বছর',
    qualification: 'SSC / Equivalent',
    description: 'Master pathology, microbiology, biochemistry, and blood bank diagnostic procedures.',
    descriptionBn: 'প্যাথলজি, মাইক্রোবায়োলজি, বায়োকেমিস্ট্রি এবং ব্লাড ব্যাংক ডায়াগনস্টিক পদ্ধতি আয়ত্ত করুন।',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
    totalSeats: 350,
    cutMark: '80%',
    accreditationStatus: 'Fully Accredited',
    affiliationAuthority: ['State Medical Faculty of Bangladesh', 'DGHS'],
    professionalAssociations: ['BMTA'],
    clinicalPartners: ['DMCH', 'BSMMU'],
    jobFacilities: ['Diagnostic Centers', 'Hospitals', 'Research Labs'],
    detailedCurriculum: [
      { year: '1st Year', yearBn: '১ম বর্ষ', subjects: ['General Pathology', 'Basic Biochemistry'], subjectsBn: ['জেনারেল প্যাথলজি', 'বেসিক বায়োকেমিস্ট্রি'] }
    ]
  }
];

export const NOTICES: Notice[] = [
  {
    id: '1',
    title: 'IHT & DMT Admission Circular 2026-2027 Announced',
    titleBn: 'আইএইচটি ও ডিএমটি ভর্তি বিজ্ঞপ্তি ২০২৬-২০২৭ প্রকাশিত হয়েছে',
    date: 'September 10, 2026',
    description: 'The State Medical Faculty of Bangladesh has officially released the online application guidelines for admission.',
    descriptionBn: 'বাংলাদেশ স্টেট মেডিকেল ফ্যাকাল্টি আনুষ্ঠানিকভাবে ভর্তির অনলাইন আবেদন নির্দেশিকা প্রকাশ করেছে।',
    isImportant: true
  }
];
