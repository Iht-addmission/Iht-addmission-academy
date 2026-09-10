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
                   src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800" 
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
                    <span className="text-2xl font-black text-rose-500 line-through">1500</span>
                    <span className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter">300</span>
                    <span className="text-2xl font-black text-emerald-600">TK</span>
                  </div>
                  <p className="text-slate-500 font-bold mb-10">One-time payment. Lifetime support until exam.</p>
                  
                  <div className="space-y-4">
                    <button 
                      onClick={() => onNavigate('admission')}
                      className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-lg uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-4 group"
                    >
                      Enroll Now <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
