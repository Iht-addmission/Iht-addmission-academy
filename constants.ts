/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Course } from './types';

export const COURSES: Course[] = [
  {
    id: 'laboratory',
    title: 'Laboratory Technology (DMLT)',
    titleBn: 'ল্যাবরেটরি টেকনোলজি (DMLT)',
    duration: '3 Years + 1 Year Internship',
    fee: '120,000 BDT',
    qualification: 'SSC/HSC Science (Min GPA 2.5)',
    description: 'Master the art of medical diagnostics. Learn to perform complex biochemical, hematological, and microbiological tests essential for disease detection.',
    descriptionBn: 'মেডিকেল ডায়াগনস্টিকসের কলাকৌশলে দক্ষতা অর্জন করুন। রোগ শনাক্তকরণের জন্য প্রয়োজনীয় জটিল বায়োকেমিক্যাল, হেমাটোলজিক্যাল এবং মাইক্রোবায়োলজিক্যাল পরীক্ষাগুলো পরিচালনা করতে শিখুন।',
    image: '/src/assets/images/regenerated_image_1777837787844.webp',
    logo: 'https://cdn-icons-png.flaticon.com/512/3063/3063205.png',
    envImage: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=1200&h=800',
    totalSeats: 2450,
    cutMark: '72 - 85',
    association: 'State Medical Faculty of Bangladesh',
    curriculum: ['Microbiology', 'Biochemistry', 'Hematology', 'Pathology'],
    jobFacilities: ['Govt. Hospitals', 'Diagnostic Centers', 'Research Labs'],
    outcomes: ['Clinical Accuracy', 'Lab Management', 'Diagnostic Expertise'],
    affiliationAuthority: ['SMF Bangladesh', 'Ministry of Health'],
    professionalAssociations: ['Bangladesh Medical Technologist Association'],
    clinicalPartners: ['Dhaka Medical College', 'Popular Diagnostic'],
    accreditationStatus: 'Recognized by SMF',
    detailedCurriculum: [
      {
        year: '1st Year',
        yearBn: '১ম বর্ষ',
        subjects: ['Paper I: English', 'Paper II: Basic Anatomy', 'Paper III: Basic Physiology', 'Paper IV: Basic Community Medicine & Behavioural Science', 'Paper V: Basic computer science'],
        subjectsBn: ['পেপার ১: ইংরেজি', 'পেপার ২: মৌলিক এনাটমি', 'পেপার ৩: মৌলিক ফিজিওলজি', 'পেপার ৪: মৌলিক কমিউনিটি মেডিসিন ও আচরণগত বিজ্ঞান', 'পেপার ৫: মৌলিক কম্পিউটার বিজ্ঞান']
      },
      {
        year: '2nd Year',
        yearBn: '২য় বর্ষ',
        subjects: ['Paper I: Physics', 'Paper II: Chemistry', 'Paper III: Basic Microbiology & Parasitology', 'Paper IV: Medical Laboratory Science', 'Paper V: Clinical Pathology and Haematology'],
        subjectsBn: ['পেপার ১: পদার্থবিজ্ঞান', 'পেপার ২: রসায়ন', 'পেপার ৩: মৌলিক মাইক্রোবায়োলজি ও প্যারাসিটোলজি', 'পেপার ৪: মেডিকেল ল্যাবরেটরি সায়েন্স', 'পেপার ৫: ক্লিনিক্যাল প্যাথলজি এবং হেমাটোলজি']
      },
      {
        year: '3rd Year',
        yearBn: '৩য় বর্ষ',
        subjects: ['Paper I: Clinical Chemistry', 'Paper II: Microbiology & Parasitology', 'Paper III: Histopathology & Blood Transfusion'],
        subjectsBn: ['পেপার ১: ক্লিনিক্যাল কেমিস্ট্রি', 'পেপার ২: মাইক্রোবায়োলজি ও প্যারাসিটোলজি', 'পেপার ৩: হিস্টোপ্যাথলজি এবং রক্ত সঞ্চালন']
      },
      {
        year: '4th Year',
        yearBn: '৪র্থ বর্ষ',
        subjects: ['Paper I: Clinical Biochemistry & Immunology', 'Paper II: Special Microbiology'],
        subjectsBn: ['পেপার ১: ক্লিনিক্যাল বায়োকেমিস্ট্রি ও ইমিউনোলজি', 'পেপার ২: বিশেষ মাইক্রোবায়োলজি']
      }
    ]
  },
  {
    id: 'dentistry',
    title: 'Dental Technology (DDT)',
    titleBn: 'ডেন্টাল টেকনোলজি (DDT)',
    duration: '3 Years + 1 Year Internship',
    fee: '120,000 BDT',
    qualification: 'SSC/HSC Science (Min GPA 2.5)',
    description: 'Specialize in dental care and prosthetic fabrication. Learn clinical dentistry procedures and laboratory management for dental health.',
    descriptionBn: 'দন্তচিকিৎসা এবং প্রস্থেটিক তৈরির বিষয়ে বিশেষায়িত জ্ঞান অর্জন করুন। দন্ত স্বাস্থ্যের জন্য ক্লিনিকাল ডেন্টিস্ট্রি পদ্ধতি এবং ল্যাবরেটরি ব্যবস্থাপনা শিখুন।',
    image: '/src/assets/images/regenerated_image_1777837783382.jpg',
    logo: 'https://cdn-icons-png.flaticon.com/512/2818/2818366.png',
    envImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200&h=800',
    totalSeats: 1200,
    cutMark: '68 - 80',
    association: 'State Medical Faculty of Bangladesh',
    curriculum: ['Oral Anatomy', 'Prosthodontics', 'Dental Materials', 'Oral Hygiene'],
    jobFacilities: ['Dental Colleges', 'Private Clinics', 'Prosthetic Labs'],
    outcomes: ['Prosthetic Fabrication', 'Clinical Assisting', 'Patient Care'],
    affiliationAuthority: ['SMF Bangladesh', 'Ministry of Health'],
    professionalAssociations: ['Bangladesh Dental Society', 'BMTA'],
    clinicalPartners: ['Dental Unit DMC', 'Govt Dental College'],
    accreditationStatus: 'Recognized by SMF',
    detailedCurriculum: [
      {
        year: '1st Year',
        yearBn: '১ম বর্ষ',
        subjects: ['Paper I: English', 'Paper II: Basic Anatomy', 'Paper III: Basic Physiology', 'Paper IV: Basic Community Medicine & Behavioural Science', 'Paper V: Basic computer science'],
        subjectsBn: ['পেপার ১: ইংরেজি', 'পেপার ২: মৌলিক এনাটমি', 'পেপার ৩: মৌলিক ফিজিওলজি', 'পেপার ৪: মৌলিক কমিউনিটি মেডিসিন ও আচরণগত বিজ্ঞান', 'পেপার ৫: মৌলিক কম্পিউটার বিজ্ঞান']
      },
      {
        year: '2nd Year',
        yearBn: '২য় বর্ষ',
        subjects: ['Paper I: Physics', 'Paper II: Chemistry', 'Paper III: Basic Microbiology & Parasitology', 'Paper IV: Chemistry of dental materials', 'Paper V: Oral and Dental Anatomy'],
        subjectsBn: ['পেপার ১: পদার্থবিজ্ঞান', 'পেপার ২: রসায়ন', 'পেপার ৩: মৌলিক মাইক্রোবায়োলজি ও প্যারাসিটোলজি', 'পেপার ৪: ডেন্টাল ম্যাটেরিয়ালস রসায়ন', 'পেপার ৫: ওরাল এবং ডেন্টাল এনাটমি']
      },
      {
        year: '3rd Year',
        yearBn: '৩য় বর্ষ',
        subjects: ['Paper I: Partial Dentures Prosthesis', 'Paper II: Complete Dentures Prosthesis', 'Paper III: Community Dentistry and Primary Dental Care'],
        subjectsBn: ['পেপার ১: আংশিক কৃত্রিম দাঁত প্রতিস্থাপন', 'পেপার ২: সম্পূর্ণ কৃত্রিম দাঁত প্রতিস্থাপন', 'পেপার ৩: কমিউনিটি ডেন্টিস্ট্রি এবং প্রাথমিক দাঁতের যত্ন']
      },
      {
        year: '4th Year',
        yearBn: '৪র্থ বর্ষ',
        subjects: ['Paper I: Drugs used in Dental Surgery', 'Paper II: Applied Dental Prosthetic'],
        subjectsBn: ['পেপার ১: ডেন্টাল সার্জারিতে ব্যবহৃত ওষুধ', 'পেপার ২: ফলিত ডেন্টাল প্রস্থেটিক']
      }
    ]
  },
  {
    id: 'radiography',
    title: 'Radiography & Imaging Technology',
    titleBn: 'রেডিওলজি ও ইমেজিং টেকনোলজি',
    duration: '3 Years + 1 Year Internship',
    fee: '120,000 BDT',
    qualification: 'SSC/HSC Science (Min GPA 2.5)',
    description: 'Expertise in medical imaging. Learn to operate X-Ray, CT Scan, and MRI machines with a focus on precision and radiation safety.',
    descriptionBn: 'মেডিকেল ইমেজিংয়ে বিশেষ দক্ষতা। সুনির্দিষ্টতা এবং বিকিরণ নিরাপত্তার উপর ফোকাস রেখে এক্স-রে, সিটি স্ক্যান এবং এমআরআই মেশিন পরিচালনা করতে শিখুন।',
    image: '/src/assets/images/regenerated_image_1777837785788.webp',
    logo: 'https://cdn-icons-png.flaticon.com/512/4836/4836932.png',
    envImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200&h=800',
    totalSeats: 1500,
    cutMark: '75 - 88',
    association: 'State Medical Faculty of Bangladesh',
    curriculum: ['Radiation Physics', 'Imaging Tech', 'Anatomy', 'Radiation Safety'],
    jobFacilities: ['Govt. Radiology Dept', 'Private Imaging Centers', 'Cancer Centers'],
    outcomes: ['Operation of MRI/CT', 'Radiation Protection', 'Imaging Analysis'],
    affiliationAuthority: ['SMF Bangladesh', 'Ministry of Health'],
    professionalAssociations: ['BMTA', 'ISRT International'],
    clinicalPartners: ['National Institute of Cancer Research', 'DMC'],
    accreditationStatus: 'Recognized by SMF',
    detailedCurriculum: [
      {
        year: '1st Year',
        yearBn: '১ম বর্ষ',
        subjects: ['Paper I: English', 'Paper II: Basic Anatomy', 'Paper III: Basic Physiology', 'Paper IV: Basic Community Medicine & Behavioural Science', 'Paper V: Basic computer science'],
        subjectsBn: ['পেপার ১: ইংরেজি', 'পেপার ২: মৌলিক এনাটমি', 'পেপার ৩: মৌলিক ফিজিওলজি', 'পেপার ৪: মৌলিক কমিউনিটি মেডিসিন ও আচরণগত বিজ্ঞান', 'পেপার ৫: মৌলিক কম্পিউটার বিজ্ঞান']
      },
      {
        year: '2nd Year',
        yearBn: '২য় বর্ষ',
        subjects: ['Paper I: Physics', 'Paper II: Chemistry', 'Paper III: Basic Microbiology & Parasitology', 'Paper IV: Radiological Anatomy, Physiology and Pathology', 'Paper V: Radiological Physics & Equipment'],
        subjectsBn: ['পেপার ১: পদার্থবিজ্ঞান', 'পেপার ২: রসায়ন', 'পেপার ৩: মৌলিক মাইক্রোবায়োলজি ও প্যারাসিটোলজি', 'পেপার ৪: রেডিওলজিক্যাল এনাটমি, ফিজিওলজি এবং প্যাথলজি', 'পেপার ৫: রেডিওলজিক্যাল ফিজিক্স ও ইকুইপমেন্ট']
      },
      {
        year: '3rd Year',
        yearBn: '৩য় বর্ষ',
        subjects: ['Paper I: Radiological Procedure', 'Paper II: Radiological Photography and Quality Assurance', 'Paper III: Radiation Biology & Patients Care'],
        subjectsBn: ['পেপার ১: রেডিওলজিক্যাল প্রসিডিউর', 'পেপার ২: রেডিওলজিক্যাল ফটোগ্রাফি এবং কোয়ালিটি অ্যাসুরেন্স', 'পেপার ৩: রেডিয়েশন বায়োলজি ও পেশেন্ট কেয়ার']
      },
      {
        year: '4th Year',
        yearBn: '৪র্থ বর্ষ',
        subjects: ['Paper I: Advanced Radiology & Imaging Procedure', 'Paper II: Basic Concepts of Radiological Findings'],
        subjectsBn: ['পেপার ১: অ্যাডভান্সড রেডিওলজি ও ইমেজিং প্রসিডিউর', 'পেপার ২: রেডিওলজিক্যাল ফাইন্ডিং-এর মৌলিক ধারণা']
      }
    ]
  },
  {
    id: 'physiotherapy',
    title: 'Physiotherapy (DPT)',
    titleBn: 'ফিজিওথেরাপি (DPT)',
    duration: '3 Years + 1 Year Internship',
    fee: '120,000 BDT',
    qualification: 'SSC/HSC Science (Min GPA 2.5)',
    description: 'Become a specialist in physical rehabilitation. focusing on musculoskeletal management, exercise therapy, and clinical recovery.',
    descriptionBn: 'শারীরিক পুনর্বাসন বিশেষজ্ঞ হয়ে উঠুন। মাস্কুলোস্কেলিটাল ব্যবস্থাপনা, ব্যায়াম থেরাপি এবং ক্লিনিকাল রিকভারির ওপর গুরুত্ব দিন।',
    image: '/src/assets/images/regenerated_image_1777837787260.jpg',
    logo: 'https://cdn-icons-png.flaticon.com/512/3209/3209144.png',
    envImage: 'https://images.unsplash.com/photo-159023346142e-6bc173ecfb7a?auto=format&fit=crop&q=80&w=1200&h=800',
    totalSeats: 1800,
    cutMark: '70 - 82',
    association: 'State Medical Faculty of Bangladesh',
    curriculum: ['Kinesiology', 'Therapeutic Exercise', 'Electrotherapy', 'Rehab'],
    jobFacilities: ['Rehab Centers', 'Sports Clinics', 'Govt. Hospitals'],
    outcomes: ['Physical Assessment', 'Rehab Planning', 'Mobility Therapy'],
    affiliationAuthority: ['SMF Bangladesh', 'Ministry of Health'],
    professionalAssociations: ['Bangladesh Physiotherapy Association'],
    clinicalPartners: ['CRP (Savar)', 'NITOR Hospital'],
    accreditationStatus: 'Recognized by SMF',
    detailedCurriculum: [
      {
        year: '1st Year',
        yearBn: '১ম বর্ষ',
        subjects: ['Paper I: English', 'Paper II: Basic Anatomy', 'Paper III: Basic Physiology', 'Paper IV: Basic Community Medicine & Behavioural Science', 'Paper V: Basic computer science'],
        subjectsBn: ['পেপার ১: ইংরেজি', 'পেপার ২: মৌলিক এনাটমি', 'পেপার ৩: মৌলিক ফিজিওলজি', 'পেপার ৪: মৌলিক কমিউনিটি মেডিসিন ও আচরণগত বিজ্ঞান', 'পেপার ৫: মৌলিক কম্পিউটার বিজ্ঞান']
      },
      {
        year: '2nd Year',
        yearBn: '২য় বর্ষ',
        subjects: ['Paper I: Physics', 'Paper II: Chemistry', 'Paper III: Basic Microbiology & Parasitology', 'Paper IV: Kinesiology', 'Paper V: Therapeutic Exercise'],
        subjectsBn: ['পেপার ১: পদার্থবিজ্ঞান', 'পেপার ২: রসায়ন', 'পেপার ৩: মৌলিক মাইক্রোবায়োলজি ও প্যারাসিটোলজি', 'পেপার ৪: কাইনেসিওলজি', 'পেপার ৫: থেরাপিউটিক এক্সারসাইজ']
      },
      {
        year: '3rd Year',
        yearBn: '৩য় বর্ষ',
        subjects: ['Paper I: Electrotherapy and Hydrotherapy', 'Paper II: Physiotherapy in Medical Conditions', 'Paper III: Physiotherapy in Special Surgical Conditions'],
        subjectsBn: ['পেপার ১: ইলেকট্রোথেরাপি এবং হাইড্রোথেরাপি', 'পেপার ২: মেডিকেল কন্ডিশনে ফিজিওথেরাপি', 'পেপার ৩: বিশেষ সার্জিক্যাল কন্ডিশনে ফিজিওথেরাপি']
      },
      {
        year: '4th Year',
        yearBn: '৪র্থ বর্ষ',
        subjects: ['Paper I: Physiotherapy in Special Medical Conditions', 'Paper II: Clinical Practice & Professional Ethics'],
        subjectsBn: ['পেপার ১: বিশেষ মেডিকেল কন্ডিশনে ফিজিওথেরাপি', 'পেপার ২: ক্লিনিক্যাল প্র্যাকটিস ও পেশাগত নৈতিকতা']
      }
    ]
  },
  {
    id: 'radiotherapy',
    title: 'Radiotherapy Technology',
    titleBn: 'রেডিওথেরাপি টেকনোলজি',
    duration: '3 Years + 1 Year Internship',
    fee: '120,000 BDT',
    qualification: 'SSC/HSC Science (Min GPA 2.5)',
    description: 'Specialize in cancer treatment through radiation. Learn the technical aspects of oncology and patient management during radiotherapy.',
    descriptionBn: 'বিকিরণের মাধ্যমে ক্যান্সারের চিকিৎসায় বিশেষায়িত জ্ঞান অর্জন করুন। রেডিওথেরাপির সময় অনকোলজি এবং রোগী ব্যবস্থাপনার প্রযুক্তিগত দিকগুলো শিখুন।',
    image: 'https://images.unsplash.com/photo-1579152276503-34e84b72648d?auto=format&fit=crop&q=80&w=1200&h=800',
    logo: 'https://cdn-icons-png.flaticon.com/512/2966/2966486.png',
    envImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1200&h=800',
    totalSeats: 800,
    cutMark: '72 - 84',
    association: 'State Medical Faculty of Bangladesh',
    curriculum: ['Radiation Oncology', 'Physics', 'Dosimetry', 'Clinical Radio'],
    jobFacilities: ['Cancer Hospitals', 'Oncology Centers', 'Radiotherapy Units'],
    outcomes: ['Cancer Care', 'Treatment Precision', 'Oncology Support'],
    affiliationAuthority: ['SMF Bangladesh', 'Ministry of Health'],
    professionalAssociations: ['BMTA Radiotherapy Wing'],
    clinicalPartners: ['NICRH (Dhaka)', 'Govt Oncology Dept'],
    accreditationStatus: 'Recognized by SMF',
    detailedCurriculum: [
      {
        year: '1st Year',
        yearBn: '১ম বর্ষ',
        subjects: ['Paper I: English', 'Paper II: Basic Anatomy', 'Paper III: Basic Physiology', 'Paper IV: Basic Community Medicine & Behavioural Science', 'Paper V: Basic computer science'],
        subjectsBn: ['পেপার ১: ইংরেজি', 'পেপার ২: মৌলিক এনাটমি', 'পেপার ৩: মৌলিক ফিজিওলজি', 'পেপার ৪: মৌলিক কমিউনিটি মেডিসিন ও আচরণগত বিজ্ঞান', 'পেপার ৫: মৌলিক কম্পিউটার বিজ্ঞান']
      },
      {
        year: '2nd Year',
        yearBn: '২য় বর্ষ',
        subjects: ['Paper I: Physics', 'Paper II: Chemistry', 'Paper III: Basic Microbiology & Parasitology', 'Paper IV: Basic Radiation Physics and Electronics', 'Paper V: Basic Clinical Oncology'],
        subjectsBn: ['পেপার ১: পদার্থবিজ্ঞান', 'পেপার ২: রসায়ন', 'পেপার ৩: মৌলিক মাইক্রোবায়োলজি ও প্যারাসিটোলজি', 'পেপার ৪: বেসিক রেডিয়েশন ফিজিক্স এবং ইলেকট্রনিক্স', 'পেপার ৫: বেসিক ক্লিনিক্যাল অনকোলজি']
      },
      {
        year: '3rd Year',
        yearBn: '৩য় বর্ষ',
        subjects: ['Paper I: Advance Radiation Physics', 'Paper II: Radiobiology', 'Paper III: Nuclear Medicine, Radiology & Imaging'],
        subjectsBn: ['পেপার ১: অ্যাডভান্সড রেডিয়েশন ফিজিক্স', 'পেপার ২: রেডিওবায়োলজি', 'পেপার ৩: নিউক্লিয়ার মেডিসিন, রেডিওলজি ও ইমেজিং']
      },
      {
        year: '4th Year',
        yearBn: '৪র্থ বর্ষ',
        subjects: ['Paper I: Applied Radiotherapy', 'Paper II: Radiation Protection & Quality Control'],
        subjectsBn: ['পেপার ১: ফলিত রেডিওথেরাপি', 'পেপার ২: রেডিয়েশন প্রোটেকশন ও কোয়ালিটি কন্ট্রোল']
      }
    ]
  },
  {
    id: 'pharmacy',
    title: 'Pharmacy (DP)',
    titleBn: 'ফার্মাসি (DP)',
    duration: '3 Years + 1 Year Internship',
    fee: '120,000 BDT',
    qualification: 'SSC/HSC Science (Min GPA 2.5)',
    description: 'Pharmaceutical science expertise. Learn drug formulation, clinical pharmacy, and management of medicine dispensing systems.',
    descriptionBn: 'ফার্মাসিউটিক্যাল বিজ্ঞানে বিশেষ দক্ষতা। ওষুধের ফর্মুলেশন, ক্লিনিকাল ফার্মাসি এবং ওষুধ বিতরণ ব্যবস্থার ব্যবস্থাপনা শিখুন।',
    image: '/src/assets/images/regenerated_image_1777837781691.jpg',
    logo: 'https://cdn-icons-png.flaticon.com/512/883/883356.png',
    envImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1200&h=800',
    totalSeats: 2000,
    cutMark: '74 - 86',
    association: 'State Medical Faculty of Bangladesh',
    curriculum: ['Pharmacology', 'Pharmaceutics', 'Pharma Chemistry', 'Drug Ethics'],
    jobFacilities: ['Pharma Companies', 'Hospital Pharmacies', 'Drug Regulatory'],
    outcomes: ['Medicine Dispensing', 'Drug Safety', 'Inventory Management'],
    affiliationAuthority: ['SMF Bangladesh', 'Ministry of Health'],
    professionalAssociations: ['Bangladesh Pharmacy Council'],
    clinicalPartners: ['Govt Medicine Warehouse', 'DMC Pharmacy'],
    accreditationStatus: 'Recognized by SMF',
    detailedCurriculum: [
      {
        year: '1st Year',
        yearBn: '১ম বর্ষ',
        subjects: ['English', 'Basic Anatomy', 'Basic Physiology', 'Basic Community Medicine & Behavioural Science', 'Basic computer science'],
        subjectsBn: ['ইংরেজি', 'মৌলিক এনাটমি', 'মৌলিক ফিজিওলজি', 'মৌলিক কমিউনিটি মেডিসিন ও আচরণগত বিজ্ঞান', 'মৌলিক কম্পিউটার বিজ্ঞান']
      },
      {
        year: '2nd Year',
        yearBn: '২য় বর্ষ',
        subjects: ['Pharmacology I', 'Pharmaceutics I', 'Pharmaceutical Chemistry I', 'Biochemistry', 'Microbiology'],
        subjectsBn: ['ফার্মাকোলজি ১', 'ফার্মাসিউটিকস ১', 'ফার্মাসিউটিক্যাল কেমিস্ট্রি ১', 'বায়োকেমিস্ট্রি', 'মাইক্রোবায়োলজি']
      },
      {
        year: '3rd Year',
        yearBn: '৩য় বর্ষ',
        subjects: ['Pharmacology II', 'Pharmaceutics II', 'Pharmaceutical Chemistry II', 'Hospital Pharmacy', 'Drug Ethics'],
        subjectsBn: ['ফার্মাকোলজি ২', 'ফার্মাসিউটিকস ২', 'ফার্মাসিউটিক্যাল কেমিস্ট্রি ২', 'হসপিটাল ফার্মাসি', 'ড্রাগ এথিক্স']
      }
    ]
  },
  {
    id: 'ota',
    title: 'OT Technology (OTA)',
    titleBn: 'ওটি টেকনোলজি (OTA)',
    duration: '3 Years + 1 Year Internship',
    fee: '120,000 BDT',
    qualification: 'SSC/HSC Science (Min GPA 2.5)',
    description: 'Training in Operation Theatre (OT) management, sterilization techniques, and assist surgeons during complex procedures for clinical safety.',
    descriptionBn: 'অপারেশন থিয়েটার (ওটি) ব্যবস্থাপনা, স্টেরিলাইজেশন কৌশল এবং ক্লিনিকাল নিরাপত্তার জন্য জটিল অস্ত্রোপচারের সময় সার্জনদের সহায়তা করার প্রশিক্ষণ।',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=1200&h=800',
    logo: 'https://cdn-icons-png.flaticon.com/512/1000/1000947.png',
    envImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200&h=800',
    totalSeats: 900,
    cutMark: '70 - 82',
    association: 'State Medical Faculty of Bangladesh',
    curriculum: ['Surgical Instrumentation', 'Sterilization', 'OT Management', 'Anesthesia Help'],
    jobFacilities: ['Govt. OT Units', 'Surgical Clinics', 'Emergency Centers'],
    outcomes: ['Surgical Assisting', 'Sterile Environment', 'Instrument Handling'],
    affiliationAuthority: ['SMF Bangladesh', 'Ministry of Health'],
    professionalAssociations: ['BMTA Surgical Wing'],
    clinicalPartners: ['DMC Surgical Units', 'Labaid Hospital'],
    accreditationStatus: 'Recognized by SMF',
    detailedCurriculum: [
      {
        year: '1st Year',
        yearBn: '১ম বর্ষ',
        subjects: ['Paper I: English', 'Paper II: Basic Anatomy', 'Paper III: Basic Physiology', 'Paper IV: Basic Community Medicine & Behavioural Science', 'Paper V: Basic computer science'],
        subjectsBn: ['পেপার ১: ইংরেজি', 'পেপার ২: মৌলিক এনাটমি', 'পেপার ৩: মৌলিক ফিজিওলজি', 'পেপার ৪: মৌলিক কমিউনিটি মেডিসিন ও আচরণগত বিজ্ঞান', 'পেপার ৫: মৌলিক কম্পিউটার বিজ্ঞান']
      },
      {
        year: '2nd Year',
        yearBn: '২য় বর্ষ',
        subjects: ['Paper I: Physics', 'Paper II: Chemistry', 'Paper III: Basic Microbiology & Parasitology', 'Paper IV: Emergency Care', 'Paper V: Patient Assessment'],
        subjectsBn: ['পেপার ১: পদার্থবিজ্ঞান', 'পেপার ২: রসায়ন', 'পেপার ৩: মৌলিক মাইক্রোবায়োলজি ও প্যারাসিটোলজি', 'পেপার ৪: জরুরি সেবা', 'পেপার ৫: রোগী মূল্যায়ন']
      },
      {
        year: '3rd Year',
        yearBn: '৩য় বর্ষ',
        subjects: ['Paper I: Preparation For Surgery', 'Paper II: Adjuncts To Surgery', 'Paper III: Basic Of Operation'],
        subjectsBn: ['পেপার ১: অস্ত্রোপচারের প্রস্তুতি', 'পেপার ২: অস্ত্রোপচারের সহযোগী উপকরণ', 'পেপার ৩: অপারেশনের মূল বিষয়বস্তু']
      },
      {
        year: '4th Year',
        yearBn: '৪র্থ বর্ষ',
        subjects: ['Paper I: Post-Operative Care', 'Paper II: Special Surgery'],
        subjectsBn: ['পেপার ১: অপারেশন পরবর্তী যত্ন', 'পেপার ২: বিশেষ অস্ত্রোপচার']
      }
    ]
  },
  {
    id: 'ica',
    title: 'ICU Assistant (ICA)',
    titleBn: 'আইসিইউ অ্যাসিস্ট্যান্ট (ICA)',
    duration: '3 Years + 1 Year Internship',
    fee: '120,000 BDT',
    qualification: 'SSC/HSC Science (Min GPA 2.5)',
    description: 'Specialized training in intensive care support, focusing on ventilator management, critical patient monitoring, and emergency medical response.',
    descriptionBn: 'ইনটেনসিভ কেয়ার সাপোর্টে বিশেষায়িত প্রশিক্ষণ, ভেন্টিলেটর ব্যবস্থাপনা, গুরুতর রোগী পর্যবেক্ষণ এবং জরুরি চিকিৎসা প্রতিক্রিয়ার ওপর ফোকাস করা।',
    image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=1200&h=800',
    logo: 'https://cdn-icons-png.flaticon.com/512/3022/3022131.png',
    envImage: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=1200&h=800',
    totalSeats: 600,
    cutMark: '65 - 78',
    association: 'State Medical Faculty of Bangladesh',
    curriculum: ['Ventilator Support', 'Critical Care', 'Emergency Response', 'ICU Tech'],
    jobFacilities: ['ICU Departments', 'Cardiac Units', 'Emergency Wings'],
    outcomes: ['Life Support Tech', 'Patient Monitoring', 'ICU Management'],
    affiliationAuthority: ['SMF Bangladesh', 'Ministry of Health'],
    professionalAssociations: ['Critical Care Society BD'],
    clinicalPartners: ['NICVD (Cardiac)', 'DMC ICU'],
    accreditationStatus: 'Recognized by SMF',
    detailedCurriculum: [
      {
        year: '1st Year',
        yearBn: '১ম বর্ষ',
        subjects: ['Paper I: English', 'Paper II: Basic Anatomy', 'Paper III: Basic Physiology', 'Paper IV: Basic Community Medicine & Behavioural Science', 'Paper V: Basic computer science'],
        subjectsBn: ['পেপার ১: ইংরেজি', 'পেপার ২: মৌলিক এনাটমি', 'পেপার ৩: মৌলিক ফিজিওলজি', 'পেপার ৪: মৌলিক কমিউনিটি মেডিসিন ও আচরণগত বিজ্ঞান', 'পেপার ৫: মৌলিক কম্পিউটার বিজ্ঞান']
      },
      {
        year: '2nd Year',
        yearBn: '২য় বর্ষ',
        subjects: ['Paper I: Physics', 'Paper II: Chemistry', 'Paper III: Basic Microbiology & Parasitology', 'Paper IV: General Paediatric and Geriatric Nursing', 'Paper V: Core subjects'],
        subjectsBn: ['পেপার ১: পদার্থবিজ্ঞান', 'পেপার ২: রসায়ন', 'পেপার ৩: মৌলিক মাইক্রোবায়োলজি ও প্যারাসিটোলজি', 'পেপার ৪: সাধারণ পেডিয়াট্রিক এবং জেরিয়াট্রিক নার্সিং', 'পেপার ৫: মূল বিষয়সমূহ']
      },
      {
        year: '3rd Year',
        yearBn: '৩য় বর্ষ',
        subjects: ['Paper I: Critical & Emergency Care', 'Paper II: Preoperative and Oncology Nursing', 'Paper III: Clinical procedures'],
        subjectsBn: ['পেপার ১: ক্রিতিক্যাল এবং ইমার্জেন্সি কেয়ার', 'পেপার ২: প্রি-অপারেটিভ এবং অনকোলজি নার্সিং', 'পেপার ৩: ক্লিনিক্যাল পদ্ধতিসমূহ']
      },
      {
        year: '4th Year',
        yearBn: '৪র্থ বর্ষ',
        subjects: ['Paper I: ICU Management', 'Paper II: Critical patients care'],
        subjectsBn: ['পেপার ১: আইসিইউ ব্যবস্থাপনা', 'পেপার ২: গুরুতর রোগীর যত্ন']
      }
    ]
  },
  {
    id: 'sanitary',
    title: 'Sanitary Inspection (SIT)',
    titleBn: 'স্যানিটারি ইন্সপেকশন (SIT)',
    duration: '3 Years + 1 Year Internship',
    fee: '120,000 BDT',
    qualification: 'SSC Science (Min GPA 2.5)',
    description: 'Focuses on public health, food safety, water sanitation, and environmental health management in urban and rural communities.',
    descriptionBn: 'জনস্বাস্থ্য, খাদ্য নিরাপত্তা, পানি স্যানিটেশন এবং শহর ও গ্রামীণ সম্প্রদায়ের পরিবেশগত স্বাস্থ্য ব্যবস্থাপনার ওপর গুরুত্ব আরোপ করে।',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1200&h=800',
    logo: 'https://cdn-icons-png.flaticon.com/512/822/822102.png',
    envImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200&h=800',
    totalSeats: 1000,
    cutMark: '60 - 75',
    association: 'State Medical Faculty of Bangladesh',
    curriculum: ['Environmental Health', 'Food Safety', 'Epidemiology', 'Waste Management'],
    jobFacilities: ['Public Health Dept', 'Municipalities', 'Environmental Agencies'],
    outcomes: ['Health Inspection', 'Safety Auditing', 'Environmental Analysis'],
    affiliationAuthority: ['SMF Bangladesh', 'Ministry of Health'],
    professionalAssociations: ['Bangladesh Sanitary Inspectors Association'],
    clinicalPartners: ['City Corporations', 'WASA'],
    accreditationStatus: 'Recognized by SMF',
    detailedCurriculum: [
      {
        year: '1st Year',
        yearBn: '১ম বর্ষ',
        subjects: ['Paper I: English', 'Paper II: Basic Anatomy', 'Paper III: Basic Physiology', 'Paper IV: Basic Community Medicine & Behavioural Science', 'Paper V: Basic computer science'],
        subjectsBn: ['পেপার ১: ইংরেজি', 'পেপার ২: মৌলিক এনাটমি', 'পেপার ৩: মৌলিক ফিজিওলজি', 'পেপার ৪: মৌলিক কমিউনিটি মেডিসিন ও আচরণগত বিজ্ঞান', 'পেপার ৫: মৌলিক কম্পিউটার বিজ্ঞান']
      },
      {
        year: '2nd Year',
        yearBn: '২য় বর্ষ',
        subjects: ['Paper I: Physics', 'Paper II: Chemistry', 'Paper III: Basic Microbiology & Parasitology', 'Paper IV: Environmental Health', 'Paper V: Food Hygiene'],
        subjectsBn: ['পেপার ১: পদার্থবিজ্ঞান', 'পেপার ২: রসায়ন', 'পেপার ৩: মৌলিক মাইক্রোবায়োলজি ও প্যারাসিটোলজি', 'পেপার ৪: পরিবেশগত স্বাস্থ্য', 'পেপার ৫: খাদ্য স্বাস্থ্যবিধি']
      },
      {
        year: '3rd Year',
        yearBn: '৩য় বর্ষ',
        subjects: ['Paper I: Epidemiology', 'Paper II: Communicable Diseases', 'Paper III: Health Statistics'],
        subjectsBn: ['পেপার ১: মহামারীবিদ্যা', 'পেপার ২: সংক্রামক রোগ', 'পেপার ৩: স্বাস্থ্য পরিসংখ্যান']
      }
    ]
  }
];

export const CALENDAR_EVENTS = [
  { id: '1', title: 'Spring Semester Admission Open', date: '2026-05-15', type: 'admission' },
  { id: '2', title: 'Mid-term Exams - DMT Batch 24', date: '2026-06-10', type: 'exam' },
  { id: '3', title: 'Special Workshop: Modern ICU Care', date: '2026-06-25', type: 'workshop' },
  { id: '4', title: 'Summer Vacation Starts', date: '2026-07-01', type: 'holiday' },
];
