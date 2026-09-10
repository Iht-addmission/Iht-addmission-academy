import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, Award, Briefcase, GraduationCap, ArrowRight, CheckCircle2, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Story {
  id: number;
  name: string;
  nameBn?: string;
  course: string;
  courseBn?: string;
  institute: string;
  instituteBn?: string;
  batch: string;
  currentRole: string;
  currentRoleBn?: string;
  story: string;
  storyBn?: string;
  image: string;
  impact: string;
  impactBn?: string;
}

const successStories: Story[] = [
  {
    id: 1,
    name: "Ariful Islam",
    nameBn: "আরিফুল ইসলাম",
    course: "B.Sc in Health Technology (Laboratory)",
    courseBn: "বিএসসি ইন হেলথ টেকনোলজি (ল্যাবরেটরি)",
    institute: "IHT Dhaka",
    instituteBn: "আইএইচটি ঢাকা",
    batch: "2018-19",
    currentRole: "Senior Lab Technologist at United Hospital",
    currentRoleBn: "সিনিয়র ল্যাব টেকনোলজিস্ট, ইউনাইটেড হাসপাতাল",
    story: "Getting into IHT Dhaka was the turning point of my life. The rigorous training and clinical exposure helped me master diagnostic procedures that are now critical in my daily work at one of the country's top hospitals.",
    storyBn: "আইএইচটি ঢাকাতে ভর্তি হওয়া ছিল আমার জীবনের মোড় ঘুরিয়ে দেওয়ার মতো একটি সিদ্ধান্ত। সেখানকার কঠোর প্রশিক্ষণ এবং ক্লিনিক্যাল এক্সপোজার আমাকে ডায়াগনস্টিক পদ্ধতিতে পারদর্শী করে তুলেছে, যা এখন দেশের অন্যতম সেরা হাসপাতালে আমার দৈনন্দিন কাজে অত্যন্ত গুরুত্বপূর্ণ।",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400&h=400",
    impact: "Clinical Excellence",
    impactBn: "ক্লিনিক্যাল এক্সিলেন্স"
  },
  {
    id: 2,
    name: "Sadia Sultana",
    nameBn: "সাদিয়া সুলতানা",
    course: "Diploma in Physiotherapy",
    courseBn: "ডিপ্লোমা ইন ফিজিওথেরাপি",
    institute: "IHT Rajshahi",
    instituteBn: "আইএইচটি রাজশাহী",
    batch: "2019-20",
    currentRole: "CEO at CureWise Wellness Center",
    currentRoleBn: "সিইও, কিউরমাইজ ওয়েলনেস সেন্টার",
    story: "IHT provided me with the technical foundation to understand human anatomy deeply. Today, I lead a team of therapists helping hundreds recover from musculoskeletal injuries. IHT is truly the cradle of healthcare technical leaders.",
    storyBn: "আইএইচটি আমাকে মানব অ্যানাটমি গভীরভাবে বোঝার প্রযুক্তিগত ভিত্তি প্রদান করেছে। আজ, আমি থেরাপিস্টদের একটি দলের নেতৃত্ব দিচ্ছি যারা শত শত রোগীকে মাস্কুলোস্কেলিটাল ইনজুরি থেকে সুস্থ হতে সাহায্য করছে। আইএইচটি সত্যিই স্বাস্থ্যসেবা প্রযুক্তিগত নেতাদের সূতিকাগার।",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400&h=400",
    impact: "Entrepreneurship",
    impactBn: "উদ্যোক্তা"
  },
  {
    id: 3,
    name: "Rakibul Hassan",
    nameBn: "রাকিবুল হাসান",
    course: "Diploma in Radiology & Imaging",
    courseBn: "ডিপ্লোমা ইন রেডিওলজি অ্যান্ড ইমেজিং",
    institute: "IHT Chattogram",
    instituteBn: "আইএইচটি চট্টগ্রাম",
    batch: "2017-18",
    currentRole: "Medical Technologist at DGHS (Govt.)",
    currentRoleBn: "মেডিকেল টেকনোলজিস্ট, ডিজিএইচএস (সরকারি)",
    story: "The balance between theory and state-of-the-art laboratory practice at IHT is unmatched. Securing a government job was easier because of the strong clinical background I gained during my internship period at IHT.",
    storyBn: "আইএইচটির থিওরি এবং অত্যাধুনিক ল্যাবরেটরি অনুশীলনের ভারসাম্য অতুলনীয়। আইএইচটিতে ইন্টার্নশিপ পিরিয়ডের সময় যে শক্তিশালী ক্লিনিক্যাল ব্যাকগ্রাউন্ড আমি পেয়েছিলাম, তার কারণে সরকারি চাকরি পাওয়াটা আমার জন্য সহজ হয়েছিল।",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400&h=400",
    impact: "Public Service",
    impactBn: "জনসেবা"
  },
  {
    id: 4,
    name: "Tamanna Yasmin",
    nameBn: "তামান্না ইয়াসমিন",
    course: "B.Sc in Radiology & Imaging",
    courseBn: "বিএসসি ইন রেডিওলজি অ্যান্ড ইমেজিং",
    institute: "IHT Dhaka",
    instituteBn: "আইএইচটি ঢাকা",
    batch: "2020-21",
    currentRole: "Imaging Consultant at Apollo Hospitals",
    currentRoleBn: "ইমেজিং কনসালট্যান্ট, অ্যাপোলো হাসপাতাল",
    story: "IHT opened doors to a world of advanced medical technology. The guidance from experienced faculty helped me excel in specialized imaging techniques, providing me a competitive edge in my professional career.",
    storyBn: "আইএইচটি উন্নত চিকিৎসা প্রযুক্তির বিশ্বের দরজা খুলে দিয়েছে। অভিজ্ঞ শিক্ষকদের নির্দেশনা আমাকে বিশেষায়িত ইমেজিং পদ্ধতিতে দক্ষতা অর্জনে সাহায্য করেছে, যা আমার পেশাগত জীবনে একটি প্রতিযোগিতামূলক সুবিধা প্রদান করেছে।",
    image: "https://images.unsplash.com/photo-1559839734-2b71f1536785?auto=format&fit=crop&q=80&w=400&h=400",
    impact: "Advanced Diagnostics",
    impactBn: "উন্নত ডায়াগনস্টিকস"
  }
];

export default function SuccessStoriesView() {
  const { i18n, t } = useTranslation();
  const isBn = i18n.language === 'bn';

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <section className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-200"
          >
            <Award size={14} />
            Alumni Success
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter uppercase"
          >
            IHT <span className="text-emerald-600">Success Stories</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed"
          >
            From the classrooms of IHT to leadership roles in global healthcare. 
            Discover the journeys of our bright alumni who are shaping the future of medical technology.
          </motion.p>
        </section>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {successStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[3.5rem] p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col md:flex-row gap-10 group hover:border-emerald-200 transition-all"
            >
              <div className="md:w-1/3 flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-8 border-slate-50 rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-2xl">
                    <img 
                      src={story.image} 
                      alt={story.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="absolute -bottom-4 -right-4 w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl"
                  >
                    <CheckCircle2 size={24} />
                  </motion.div>
                </div>
                <div className="text-center">
                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-1">
                     {isBn ? story.nameBn : story.name}
                   </h3>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                     Batch {story.batch}
                   </div>
                </div>
              </div>

              <div className="md:w-2/3 flex flex-col">
                <Quote className="text-emerald-100 mb-6" size={48} />
                <p className="text-slate-600 text-lg md:text-xl italic font-medium leading-relaxed mb-8 relative z-10">
                  "{isBn ? story.storyBn : story.story}"
                </p>
                
                <div className="mt-auto space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3 mb-2">
                        <GraduationCap size={16} className="text-emerald-600" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Education</span>
                      </div>
                      <div className="text-xs font-black text-slate-900">
                        {isBn ? story.courseBn : story.course}
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold">
                        {isBn ? story.instituteBn : story.institute}
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3 mb-2">
                        <Briefcase size={16} className="text-blue-600" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Role</span>
                      </div>
                      <div className="text-xs font-black text-slate-900">
                         {isBn ? story.currentRoleBn : story.currentRole}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Star className="text-amber-400" size={16} fill="currentColor" />
                      <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">
                        {isBn ? story.impactBn : story.impact}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} className="text-blue-600" fill="currentColor" />)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Community Call to Action */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 p-12 lg:p-20 bg-slate-900 rounded-[4rem] text-white overflow-hidden relative text-center"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 max-w-3xl mx-auto">
             <Heart className="text-rose-500 mb-8 mx-auto animate-pulse" size={48} fill="currentColor" />
             <h2 className="text-3xl md:text-5xl font-black mb-8 uppercase tracking-tighter">Your Journey Starts Here</h2>
             <p className="text-slate-400 text-lg font-medium leading-relaxed mb-12">
               Are you a proud IHT alumni? We want to hear from you! Share your success story with the next generation of medical technology aspirants.
             </p>
             <button className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-500 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95 flex items-center gap-4 mx-auto">
                Submit Your Story <ArrowRight size={18} />
             </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
