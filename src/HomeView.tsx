/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Users, 
  Quote,
  BookOpen, 
  Microscope, 
  GraduationCap, 
  Clock, 
  ShieldCheck, 
  Search, 
  Building2, 
  MapPin,
  Globe,
  Target,
  TrendingUp,
  Award,
  ChevronRight,
  Calculator,
  CreditCard,
  Activity,
  Facebook
} from 'lucide-react';
import medicalHero from '../assets/images/regenerated_image_1777921032256.jpg';
import rajshahiImg from '../assets/images/regenerated_image_1777920175521.png';
import chattogramImg from '../assets/images/regenerated_image_1777920177962.jpg';

interface HomeViewProps {
  onNavigate: (page: string, courseId?: string) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="pt-16 bg-[#f0f7ff]" role="main">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32" aria-labelledby="hero-title">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative z-10"
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-blue-600/10 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-blue-600/20 text-blue-600 mb-8 shadow-sm"
              >
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" aria-hidden="true"></div>
                {t('hero.badge')}
              </motion.div>
              
              <h1 id="hero-title" className="text-6xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase text-slate-900">
                {t('hero.titlePrefix')} <br/>
                <span className="text-blue-600">{t('hero.titleSuffix')}</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-xl font-medium leading-relaxed">
                {t('hero.subtitle')}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-12">
                <motion.div 
                  animate={{ 
                    scale: isSearchFocused ? 1.02 : 1,
                    borderColor: isSearchFocused ? '#2563eb' : '#f1f5f9',
                    boxShadow: isSearchFocused ? '0 25px 50px -12px rgba(37, 99, 235, 0.15)' : '0 25px 50px -12px rgba(191, 219, 254, 0.5)'
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="bg-white p-2 rounded-[2rem] border flex items-center flex-1 min-w-[300px]"
                >
                  <div className="pl-6 text-slate-400">
                    <Search size={22} className={isSearchFocused ? 'text-blue-600 transition-colors' : 'transition-colors'} />
                  </div>
                  <input 
                    type="text" 
                    placeholder={t('common.searchPlaceholder')}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    onKeyPress={e => e.key === 'Enter' && onNavigate('institutes', searchQuery)}
                    className="flex-1 bg-transparent px-4 py-4 outline-none font-bold text-slate-900 placeholder:text-slate-300"
                    aria-label="Search for institutes"
                  />
                  <button 
                    onClick={() => onNavigate('institutes', searchQuery)}
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95"
                    aria-label="Submit search"
                  >
                    {t('hero.findCampus')}
                  </button>
                </motion.div>
                
                <button 
                  onClick={() => onNavigate('login')}
                  className="bg-slate-900 text-white px-8 py-2 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-3 border-4 border-white shadow-xl shadow-slate-200"
                  aria-label="Student Portal Login"
                >
                  <Users size={18} className="text-blue-400" />
                  {t('hero.studentLogin')}
                </button>
              </div>

              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900 italic">24</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('hero.stats.institutes')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    <Users size={20} />
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900 italic">8.4k</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('hero.stats.seats')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900 italic">100%</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('hero.stats.verified')}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.6 }}
               className="relative lg:block hidden"
            >
               <div className="relative rounded-[4rem] overflow-hidden border-[12px] border-white shadow-2xl shadow-blue-200">
                 <img 
                   src={medicalHero} 
                   alt="Medical Lab"
                   className="w-full h-full object-cover"
                   referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply"></div>
               </div>
               
               {/* Floating Badges */}
               <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-12 top-1/4 bg-white p-6 rounded-3xl shadow-2xl border border-slate-50 flex items-center gap-4"
               >
                 <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                   <ShieldCheck size={28} />
                 </div>
                 <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official</div>
                   <div className="font-black text-slate-900 uppercase">Govt. Linked</div>
                 </div>
               </motion.div>

               <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -right-8 bottom-1/4 bg-slate-900 text-white p-6 rounded-3xl shadow-2xl flex items-center gap-4"
               >
                 <Award size={32} className="text-blue-400" />
                 <div>
                   <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">SMF Approved</div>
                   <div className="font-black uppercase">Standard Labs</div>
                 </div>
               </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Quick Actions */}
      <section className="py-20 relative z-10 -mt-16" aria-label="Quick actions">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { title: t('quickActions.campus'), desc: t('quickActions.campusDesc'), icon: MapPin, color: 'bg-blue-600', link: 'institutes' },
              { title: t('quickActions.portal'), desc: t('quickActions.portalDesc'), icon: Users, color: 'bg-slate-900', link: 'login' },
              { title: t('quickActions.admission'), desc: t('quickActions.admissionDesc'), icon: BookOpen, color: 'bg-emerald-600', link: 'admission' },
              { title: t('quickActions.calculator'), desc: t('quickActions.calculatorDesc'), icon: Calculator, color: 'bg-indigo-600', link: 'gpa' },
              { title: t('quickActions.calendar'), desc: t('quickActions.calendarDesc'), icon: Clock, color: 'bg-rose-600', link: 'calendar' },
              { title: t('quickActions.fbResources'), desc: t('quickActions.fbResourcesDesc'), icon: Facebook, color: 'bg-blue-500', link: 'query' },
              { title: t('quickActions.results'), desc: t('quickActions.resultsDesc'), icon: ShieldCheck, color: 'bg-amber-600', link: 'notices' },
            ].map((card, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i}
                onClick={() => onNavigate(card.link)}
                className="bg-white p-6 rounded-[2.5rem] shadow-xl hover:shadow-2xl shadow-blue-100/50 border border-white cursor-pointer group transition-all"
                role="button"
                tabIndex={0}
                aria-label={`Go to ${card.title}`}
                onKeyDown={(e) => e.key === 'Enter' && onNavigate(card.link)}
              >
                <div className={`w-12 h-12 ${card.color} text-white rounded-2xl flex items-center justify-center mb-5 shadow-xl group-hover:scale-110 transition-transform`}>
                  <card.icon size={24} />
                </div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-2 flex items-center gap-2 text-wrap">
                  {card.title} <ChevronRight size={14} className="text-blue-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Preparation Subjects Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-6"
            >
              <BookOpen size={14} />
              Our Admission Program
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase">
              Comprehensive <span className="text-indigo-600">Preparation</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
              We focus exclusively on entrance exam preparation. Our students master the seven core subjects required to secure a seat in government medical technology institutes.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { name: 'Bangla', icon: 'অ', color: 'bg-rose-50 text-rose-600 border-rose-100' },
              { name: 'English', icon: 'A', color: 'bg-blue-50 text-blue-600 border-blue-100' },
              { name: 'Physics', icon: 'Φ', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
              { name: 'Chemistry', icon: 'H₂O', color: 'bg-amber-50 text-amber-600 border-amber-100' },
              { name: 'Biology', icon: 'DNA', color: 'bg-purple-50 text-purple-600 border-purple-100' },
              { name: 'General Math', icon: 'Σ', color: 'bg-cyan-50 text-cyan-600 border-cyan-100' },
              { name: 'GK & News', icon: '!', color: 'bg-slate-50 text-slate-600 border-slate-100' },
            ].map((subject, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-3xl border-2 ${subject.color} flex flex-col items-center justify-center text-center group hover:scale-105 transition-all`}
              >
                <div className="text-2xl font-black mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
                  {subject.icon}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest">{subject.name}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-slate-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-tight text-xl">Exclusive Admission Focused</h3>
                <p className="text-slate-400 text-sm font-medium">We do not teach DMT courses. We provide technical details for career guidance only.</p>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('admission')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
            >
              Start Preparation
            </button>
          </div>
        </div>
      </section>

      {/* High-Graphics Admission Offer Ad */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600 skew-y-3 origin-right scale-110 translate-y-20 -z-10" />
        <div className="absolute inset-0 bg-slate-900 -z-20" />
        
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 text-white"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-8 shadow-xl shadow-emerald-500/20">
                <Star size={14} fill="currentColor" /> Limited Time Offer
              </div>
              <h2 className="text-5xl lg:text-7xl font-black mb-8 leading-[0.9] tracking-tighter uppercase">
                Master the <br />
                <span className="text-emerald-400">Entrance Exam</span>
              </h2>
              <p className="text-indigo-100 text-xl font-medium mb-12 leading-relaxed max-w-xl">
                Get full access to our comprehensive admission program. Everything you need to secure your seat in IHT or MATS.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {[
                  { icon: BookOpen, title: 'Unlimited Exams', desc: 'Practice until you are perfect' },
                  { icon: Users, title: 'Mentor Support', desc: 'Direct guidance from specialists' },
                  { icon: ShieldCheck, title: 'Full Syllabus', desc: 'All 7 mandatory subjects' },
                  { icon: Activity, title: 'Live Progress', desc: 'Real-time performance tracking' }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4 items-start bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                      <feature.icon size={20} />
                    </div>
                    <div>
                      <div className="font-black text-sm uppercase tracking-tight">{feature.title}</div>
                      <div className="text-xs text-indigo-200 font-medium">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              {/* Visual "Price Tag" Card */}
              <div className="relative bg-[#ffffff] rounded-[3.5rem] p-10 md:p-16 shadow-2xl shadow-indigo-500/20 overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10 text-center">
                  <div className="text-slate-400 font-black text-sm uppercase tracking-[0.3em] mb-4">Complete Course Access</div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl font-black text-[#e10000] border-[#be1c1c] line-through">1500</span>
                    <span className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter">300</span>
                    <span className="text-2xl font-black text-emerald-600">TK</span>
                  </div>
                  <p className="text-slate-500 font-bold mb-10">One-time payment. Lifetime support until exam.</p>
                  
                  <div className="space-y-4">
                    <button 
                      onClick={() => onNavigate('admission')}
                      className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-lg uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-4 group"
                    >
                      Enroll Now <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                    <div className="flex items-center justify-center gap-6 pt-6 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/BKash_logo.svg/1024px-BKash_logo.svg.png" className="h-6 object-contain" alt="bkash" />
                       <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Nagad_Logo.svg/2560px-Nagad_Logo.svg.png" className="h-8 object-contain" alt="nagad" />
                    </div>
                  </div>
                </div>

                {/* Achievement Badges */}
                <div className="absolute -left-12 top-20 rotate-[-90deg]">
                   <span className="text-[10px] font-bold text-slate-200 uppercase tracking-[1em]">PREMIUM ADMISSION COACHING</span>
                </div>
              </div>

              {/* Floating Decorative Elements */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-400 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-2xl -rotate-12"
              >
                %
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Institutes Preview */}
      <section className="py-32" aria-labelledby="featured-title">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-xl">
              <h2 id="featured-title" className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter uppercase mb-6 leading-none">
                {t('featured.title')} <span className="text-blue-600 italic">{t('featured.titleHighlight')}</span>
              </h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">{t('featured.subtitle')}</p>
            </div>
            <button 
              onClick={() => onNavigate('institutes')}
              className="bg-slate-50 text-blue-600 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest border border-blue-600/10 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
            >
              {t('featured.seeAll')} →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: 'dhaka-iht', name: 'Dhaka IHT', location: 'Mohakhali, Dhaka', seats: 320, image: medicalHero },
              { id: 'rajshahi-iht', name: 'Rajshahi IHT', location: 'Greater Road, Rajshahi', seats: 277, image: rajshahiImg },
              { id: 'chattogram-iht', name: 'Chattogram IHT', location: 'Panchlaish, CTG', seats: 277, image: chattogramImg },
            ].map(inst => (
              <motion.div 
                key={inst.id}
                whileHover={{ y: -10 }}
                onClick={() => onNavigate('institute-detail', inst.id)}
                className="bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-50 border border-slate-100 group cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`View details for ${inst.name}`}
                onKeyDown={(e) => e.key === 'Enter' && onNavigate('institute-detail', inst.id)}
              >
                <div className="h-64 relative overflow-hidden">
                  <img src={inst.image} alt={inst.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-8">
                     <div className="text-white">
                        <div className="text-[10px] font-black uppercase tracking-widest bg-blue-600 px-3 py-1 rounded-full mb-3 w-fit shadow-lg">Govt. Campus</div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">{inst.name}</h3>
                     </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-50">
                    <div className="flex items-center gap-2 text-slate-400">
                       <MapPin size={14} className="text-blue-600" />
                       <span className="text-xs font-black uppercase tracking-widest">{inst.location}</span>
                    </div>
                    <div className="text-[10px] font-black text-slate-900 italic">{inst.seats} Total Seats</div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                    Explore Details <ChevronRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-24 bg-slate-950 text-white overflow-hidden relative" aria-labelledby="success-title">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-transparent to-blue-500" aria-hidden="true"></div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-6 border border-emerald-500/20">
                <Star size={14} fill="currentColor" /> Student Journeys
              </div>
              <h2 id="success-title" className="text-4xl lg:text-6xl font-black tracking-tighter uppercase mb-6 leading-none">
                Their Success <br/> <span className="text-emerald-500 italic">Your Inspiration</span>
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">Discover how our graduates are leading change in healthcare labs and clinics nationwide.</p>
            </div>
            <button 
              onClick={() => onNavigate('success-stories')}
              className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest border border-white/10 transition-all flex items-center gap-3"
            >
              Read Full Stories <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Ariful Islam",
                role: "Senior Lab Technologist",
                story: "Getting into IHT Dhaka was the turning point of my life. The rigorous training helped me master diagnostic procedures...",
                impact: "Clinical Excellence",
                img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400&h=400"
              },
              {
                name: "Sadia Sultana",
                role: "Health CEO",
                story: "IHT provided the technical foundation. Today, I lead a team of therapists helping hundreds recover from injuries.",
                impact: "Entrepreneur",
                img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400&h=400"
              },
              {
                name: "Rakibul Hassan",
                role: "Medical Technologist",
                story: "The balance between theory and practice at IHT is unmatched. Securing a government job was easier because of it.",
                impact: "Public Service",
                img: "/src/assets/images/regenerated_image_1778956522345.png"
              }
            ].map((story, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-[3rem] p-8 hover:bg-white/[0.07] transition-all group"
              >
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10">
                    <img src={story.img} alt={story.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-tight text-white">{story.name}</h3>
                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{story.role}</div>
                  </div>
                </div>
                <Quote className="text-emerald-500/20 mb-4" size={32} />
                <p className="text-slate-400 text-sm italic font-medium leading-relaxed mb-8">"{story.story}"</p>
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">{story.impact}</div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} size={10} className="text-emerald-500" fill="currentColor" />)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facebook Community Hub Section */}
      <section className="py-24 bg-white relative overflow-hidden" aria-labelledby="resources-title">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-[4rem] p-12 lg:p-20 relative overflow-hidden group shadow-2xl border border-white/5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-blue-500/30">
                  <Facebook size={14} fill="currentColor" /> Association Network
                </div>
                <h2 id="resources-title" className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase mb-6 leading-none">
                  Important <br/> <span className="text-blue-500">Official Resources</span>
                </h2>
                <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10 max-w-xl">
                  Quick access to Bangladesh's leading medical technology associations, societies, and educational boards. Dedicated to professional growth and excellence.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => onNavigate('resources')}
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-blue-600 transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center gap-3"
                  >
                    View All Resources <ArrowRight size={18} />
                  </button>
                  <a 
                    href="https://www.facebook.com/groups/ihtadmissionhelp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 transition-all flex items-center gap-3"
                  >
                    Main Community <Facebook size={18} fill="currentColor" />
                  </a>
                </div>
              </div>
              
              <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                {[
                  { label: "Associations", icon: Award, color: "text-blue-400" },
                  { label: "OT & IC Hub", icon: ShieldCheck, color: "text-emerald-400" },
                  { label: "Societies", icon: Globe, color: "text-indigo-400" },
                  { label: "DGME Info", icon: GraduationCap, color: "text-rose-400" },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all cursor-pointer group/card backdrop-blur-md">
                    <item.icon className={`${item.color} mb-6 group-hover/card:scale-110 transition-transform`} size={32} />
                    <div className="text-[10px] font-black text-white uppercase tracking-widest">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Accreditation Section */}
      <section className="py-24 bg-white overflow-hidden relative" aria-labelledby="excellence-title">
        <div className="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-blue-600 via-transparent to-emerald-500" aria-hidden="true"></div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 space-y-12">
               <div>
                  <h2 id="excellence-title" className="text-5xl font-black text-slate-900 tracking-tighter uppercase mb-6 leading-none">
                    {t('excellence.title')} <br/> <span className="text-emerald-500">{t('excellence.titleHighlight')}</span>
                  </h2>
                  <p className="text-slate-500 text-lg font-medium leading-relaxed font-sans">{t('excellence.subtitle')}</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="flex gap-1">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={20} />
                    <div>
                       <div className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1">{t('excellence.smf')}</div>
                       <p className="text-xs text-slate-400 font-medium">{t('excellence.smfDesc')}</p>
                    </div>
                 </div>
                 <div className="flex gap-1">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={20} />
                    <div>
                       <div className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1">{t('excellence.clinical')}</div>
                       <p className="text-xs text-slate-400 font-medium">{t('excellence.clinicalDesc')}</p>
                    </div>
                 </div>
                 <div className="flex gap-1">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={20} />
                    <div>
                       <div className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1">{t('excellence.faculty')}</div>
                       <p className="text-xs text-slate-400 font-medium">{t('excellence.facultyDesc')}</p>
                    </div>
                 </div>
                 <div className="flex gap-1">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={20} />
                    <div>
                       <div className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1">{t('excellence.job')}</div>
                       <p className="text-xs text-slate-400 font-medium">{t('excellence.jobDesc')}</p>
                    </div>
                 </div>
               </div>
            </div>

            <div className="lg:w-1/2 relative">
               <div className="bg-slate-50 p-12 lg:p-20 rounded-[4rem] border border-slate-100 relative shadow-inner">
                  <div className="absolute top-0 right-12 w-24 h-24 bg-blue-600 rounded-3xl -translate-y-1/2 flex items-center justify-center text-white shadow-2xl rotate-12">
                    <ShieldCheck size={40} />
                  </div>
                  <Microscope size={80} className="text-blue-100 mb-10" />
                  <blockquote className="text-2xl font-black text-slate-400 italic leading-tight mb-10">
                    "Technical education is the <span className="text-slate-900">backbone</span> of our medical industry. Our mission is to produce world-class health technologists for Bangladesh."
                  </blockquote>
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black italic">SMF</div>
                     <div>
                        <div className="text-sm font-black text-slate-900 uppercase tracking-tight">Academic Board</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">State Medical Faculty</div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Admission Portal Callout */}
      <section className="py-12 max-w-7xl mx-auto px-4" aria-labelledby="official-title">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-[4rem] border border-blue-100 shadow-2xl shadow-blue-50/50 overflow-hidden relative group"
        >
          <div className="absolute top-0 right-12 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000 pointer-events-none" aria-hidden="true">
             <ShieldCheck size={320} className="text-blue-600" />
          </div>
          
          <div className="p-8 md:p-16 relative z-10">
             <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                <div className="max-w-3xl">
                   <div className="inline-flex items-center gap-3 bg-emerald-50 text-emerald-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-emerald-100 shadow-sm">
                      <ShieldCheck size={14} aria-hidden="true" /> {t('officialAdmission.govtBadge')}
                   </div>
                   <h2 id="official-title" className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase leading-[0.9]">
                      {t('officialAdmission.title')}
                   </h2>
                   <p className="text-blue-600 font-bold text-xl mb-12 flex items-center gap-3">
                      <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                      {t('officialAdmission.subtitle')}
                   </p>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                      {[
                        { label: t('officialAdmission.links.admitCard'), icon: CreditCard, url: 'https://dgme.teletalk.com.bd/iht_mats/admit_card.php' },
                        { label: t('officialAdmission.links.result'), icon: Activity, url: 'https://dgme.teletalk.com.bd/iht_mats/result.php' },
                        { label: t('officialAdmission.links.circular'), icon: BookOpen, url: 'https://dgme.teletalk.com.bd/iht_mats/circular.php' },
                      ].map((link, i) => (
                         <a 
                           key={i}
                           href={link.url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="flex items-center gap-4 bg-slate-50 hover:bg-white hover:shadow-2xl hover:border-blue-200 border border-slate-100 px-8 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest text-slate-600 transition-all active:scale-95 group/link"
                         >
                            <link.icon size={18} className="text-blue-400 group-hover:text-blue-600 transition-colors" />
                            {link.label}
                         </a>
                      ))}
                   </div>

                   <div className="bg-amber-50/60 backdrop-blur-md border-l-8 border-amber-400 p-8 rounded-[2rem] mb-4">
                      <div className="flex gap-5">
                         <Activity size={28} className="text-amber-600 shrink-0" />
                         <div>
                            <p className="text-[11px] font-black text-amber-900 mb-2 uppercase tracking-widest">{t('officialAdmission.updates')}</p>
                            <p className="text-sm font-bold text-amber-800 leading-relaxed italic">
                               {t('officialAdmission.warning')}
                            </p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="lg:w-[380px] space-y-6">
                   <motion.a 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="https://dgme.teletalk.com.bd/iht_mats/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white w-full py-10 rounded-[2.5rem] font-black text-[14px] uppercase tracking-[0.25em] flex items-center justify-center gap-5 shadow-[0_35px_60px_-15px_rgba(37,99,235,0.3)] group/btn transition-all hover:bg-blue-700 hover:shadow-blue-300"
                   >
                      {t('officialAdmission.applyNow')}
                      <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform" />
                   </motion.a>
                   
                   <div className="text-center p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 border-dashed">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                         {t('officialAdmission.disclaimer')}
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 mb-24" aria-labelledby="cta-title">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="bg-blue-600 rounded-[4rem] p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-300"
         >
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse" aria-hidden="true" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-950/20 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" aria-hidden="true" />
           
           <div className="relative z-10">
             <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-10 border border-white/10">
               {t('cta.badge')}
             </div>
             <h2 id="cta-title" className="text-5xl lg:text-8xl font-black tracking-tighter uppercase leading-none mb-12">
               {t('cta.title')} <br className="hidden lg:block" /> {t('cta.titleHighlight')}
             </h2>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button 
                  onClick={() => onNavigate('admission')}
                  className="w-full sm:w-auto bg-white text-blue-600 px-16 py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
                >
                  {t('cta.apply')}
                </button>
                <button 
                  onClick={() => onNavigate('institutes')}
                  className="w-full sm:w-auto bg-slate-950 text-white px-16 py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all border border-white/5"
                >
                  {t('cta.browse')}
                </button>
             </div>
           </div>
         </motion.div>
      </section>
    </div>
  );
}
