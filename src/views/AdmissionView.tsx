/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, ChevronRight, CreditCard, User, Phone, BookOpen, Loader2, Activity, ArrowRight, ShieldCheck, GraduationCap, Target } from 'lucide-react';

import { Course, User as UserType } from '../types';
import { formatNumber, formatPrice } from '../lib/i18nUtils';

function GpaCalculator() {
  const { t } = useTranslation();
  const [gpa, setGpa] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const numericGpa = parseFloat(gpa);
  const isValid = !isNaN(numericGpa) && numericGpa >= 0 && numericGpa <= 5;
  const score = isValid ? (numericGpa * 20).toFixed(2) : '0.00';

  const getGradingHint = (val: number) => {
    if (val === 5) return { text: 'Excellent Performance', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (val >= 4) return { text: 'Very Good standing', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (val >= 3) return { text: 'Good standing', color: 'text-orange-600', bg: 'bg-orange-50' };
    if (val > 0) return { text: 'Average merit score', color: 'text-slate-500', bg: 'bg-slate-50' };
    return null;
  };

  const hint = isValid ? getGradingHint(numericGpa) : null;

  const handleInputChange = (val: string) => {
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setGpa(val);
      const num = parseFloat(val);
      if (val !== '' && (num < 0 || num > 5)) {
        setError('GPA must be between 0.00 and 5.00');
      } else {
        setError(null);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-50/50"
      role="region"
      aria-labelledby="calculator-title"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
           <Activity size={20} aria-hidden="true" />
        </div>
        <div>
          <h3 id="calculator-title" className="text-sm font-black text-slate-900 uppercase tracking-tight">{t('admissionView.meritCalculator')}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('admissionView.gpaToScore')}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label htmlFor="ssc-gpa" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Your SSC GPA</label>
          <div className="relative">
             <input 
               id="ssc-gpa"
               type="text" 
               inputMode="decimal"
               placeholder="e.g. 4.50"
               value={gpa}
               onChange={(e) => handleInputChange(e.target.value)}
               className={`w-full px-6 py-4 rounded-2xl bg-slate-50 border-none ring-1 transition-all outline-none font-black text-slate-900 text-lg ${error ? 'ring-red-400' : 'ring-slate-100 focus:ring-2 focus:ring-blue-500'}`}
               aria-invalid={!!error}
               aria-describedby={error ? "gpa-error" : undefined}
             />
             <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest">Max 5.00</div>
          </div>
          {error && <p id="gpa-error" className="text-[10px] font-bold text-red-500 px-2" role="alert">{error}</p>}
        </div>

        <motion.div 
          animate={isValid && numericGpa > 0 ? { scale: [1, 1.02, 1] } : {}}
          className={`p-6 rounded-2xl border transition-all ${isValid && numericGpa > 0 ? 'bg-blue-600 border-blue-500 text-white shadow-2xl shadow-blue-200' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
        >
          <div className="flex items-end justify-between gap-4">
             <div>
                <p className={`text-[9px] font-black uppercase tracking-[0.25em] mb-1 ${isValid && numericGpa > 0 ? 'text-blue-100' : 'text-slate-400'}`}>{t('admissionView.calculatedMerit')}</p>
                <div className="flex items-baseline gap-1">
                   <span className="text-4xl font-black">{formatNumber(parseFloat(score))}</span>
                   <span className={`text-[10px] font-black uppercase tracking-tight ${isValid && numericGpa > 0 ? 'text-blue-100' : 'text-slate-300'}`}>pts</span>
                </div>
             </div>
             <div className="text-right">
                <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isValid && numericGpa > 0 ? 'text-blue-100/60' : 'text-slate-300'}`}>{t('admissionView.officialRatio')}</p>
                <div className="text-xs font-black italic">GPA × 20</div>
             </div>
          </div>
        </motion.div>

        {hint && (
          <div className={`p-4 rounded-xl flex items-center gap-3 border ${hint.bg} ${hint.color.replace('text-', 'border-').replace('600', '100')}`}>
             <div className={`w-1.5 h-1.5 rounded-full ${hint.color.replace('text-', 'bg-')}`}></div>
             <p className={`text-[10px] font-black uppercase tracking-widest ${hint.color}`}>{hint.text}</p>
          </div>
        )}

        <p className="text-[10px] font-medium text-slate-500 italic leading-relaxed text-center px-4">
           Example: If your GPA is 4.00, your score will be 4.00 × 20 = 80.00
        </p>
      </div>
    </motion.div>
  );
}

interface AdmissionViewProps {
  onNavigate: (page: string, courseId?: string) => void;
  preselectedCourseId?: string;
  user: UserType | null;
}

export default function AdmissionView({ onNavigate, preselectedCourseId, user }: AdmissionViewProps) {
  const { t, i18n } = useTranslation();
  const t_lang = (en: string | undefined, bn?: string) => {
    if (i18n.language === 'bn') return bn || en || '';
    return en || '';
  };
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    userId: user?.id || '',
    phone: '',
    sscInfo: '',
    hscInfo: '',
    courseId: preselectedCourseId || '',
    paymentMethod: 'bkash' as 'bkash' | 'nagad' | 'rocket',
    paymentNumber: '',
    transactionId: '',
    screenshotUrl: '',
    photoUrl: '',
    photo: null as File | null,
    screenshot: null as File | null,
  });

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses();
        setCourses(data);
      } catch (err) {
        console.error('Failed to load courses', err);
      }
    };
    loadCourses();
  }, []);

  const paymentConfig = {
    bkash: { label: 'bKash', number: '01819-248542', type: 'Send Money', icon: 'https://upload.wikimedia.org/wikipedia/commons/8/88/BKash_Logo.svg' },
    nagad: { label: 'Nagad', number: '01819-248542', type: 'Send Money', icon: 'https://seeklogo.com/images/N/nagad-logo-7A70BBDA07-seeklogo.com.png' },
    rocket: { label: 'Rocket', number: '01819-248542', type: 'Send Money', icon: 'https://seeklogo.com/images/D/dutch-bangla-rocket-logo-B4D1CC458D-seeklogo.com.png' },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitAdmission({
        ...formData,
        status: 'pending',
        submittedAt: new Date().toISOString()
      });
      setSuccess(true);
    } catch (err) {
      alert('Failed to submit admission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pt-32 pb-24 max-w-2xl mx-auto px-4 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-blue-100 border border-blue-50"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 size={56} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">Successfully Submitted</h2>
          <div className="bg-emerald-50 p-6 rounded-2xl mb-8 border border-emerald-100">
             <p className="text-emerald-700 font-black text-sm uppercase tracking-widest">Confirmation Status</p>
             <p className="text-emerald-600 font-medium leading-relaxed mt-2">
               Your application has been submitted successfully. Our team will contact you within 24 hours.
             </p>
          </div>
          
          <button 
            onClick={() => onNavigate('home')}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }   return (
    <div className="pt-32 pb-24 max-w-5xl mx-auto px-4" role="main">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Progress Sidebar */}
        <div className="lg:col-span-2 space-y-8" role="complementary" aria-label="Registration Info">
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-200"
            >
              <GraduationCap size={14} />
              Admission Coaching 2025-26
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter uppercase leading-tight">
              Admission <span className="text-indigo-600">Mastery Program</span>
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed">
              Crack the IHT/MATS entrance exam with our specialized coaching covering Bangla, English, Physics, Chemistry, Biology, Math, and GK.
            </p>
          </div>
          
          <div className="space-y-4" role="list">
            {[
              { num: 1, text: t('admissionView.steps.personal'), sub: 'Primary Contact' },
              { num: 2, text: t('admissionView.steps.academic'), sub: 'SSC & HSC Details' },
              { num: 3, text: t('admissionView.steps.finalize'), sub: '300 BDT Registration' },
            ].map((s) => (
              <div 
                key={s.num} 
                className={`flex gap-4 p-4 rounded-2xl border transition-all ${step === s.num ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-white border-slate-100 text-slate-500'}`}
                role="listitem"
                aria-current={step === s.num ? 'step' : undefined}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 font-black text-xs ${step === s.num ? 'border-white/20 bg-white/10 text-white' : 'border-slate-100 text-slate-300'}`} aria-hidden="true">
                  0{s.num}
                </div>
                <div>
                  <div className="font-black text-[12px] uppercase tracking-tight">{s.text}</div>
                  <div className={`text-[9px] uppercase tracking-[0.2em] font-black opacity-60`}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
             <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-4">Support & FAQ</h4>
             <p className="text-sm font-medium leading-relaxed text-slate-300 mb-6 font-mono">For any technical issues or payment queries, please call our 24/7 helpline.</p>
             <a href="tel:+8801819248542" className="flex items-center gap-2 text-white font-black hover:text-blue-400 transition-colors">
                <Phone size={16} /> +880 1819248542
             </a>
          </div>

          {/* GPA Calculator Utility */}
          <GpaCalculator />
        </div>

        {/* Form Area */}
        <div className="lg:col-span-3">
          <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-blue-50 border border-slate-100">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1" 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="flex flex-col items-center mb-8">
                       <div className="relative group">
                          <div className="w-28 h-28 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-400">
                             {formData.photoUrl ? (
                               <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                             ) : (
                               <User className="text-slate-300" size={32} />
                             )}
                             <input 
                               type="file" 
                               accept="image/*"
                               className="absolute inset-0 opacity-0 cursor-pointer"
                               onChange={(e) => {
                                 const file = e.target.files?.[0];
                                 if (file) {
                                   setFormData({ ...formData, photo: file });
                                   const reader = new FileReader();
                                   reader.onloadend = () => {
                                     setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
                                   };
                                   reader.readAsDataURL(file);
                                 }
                               }}
                             />
                          </div>
                          <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-lg">
                             <Activity size={12} />
                          </div>
                       </div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Upload Passport Photo</p>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label htmlFor="student-name" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Student Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} aria-hidden="true" />
                          <input 
                            id="student-name"
                            type="text" 
                            required
                            className="w-full pl-12 pr-4 py-5 rounded-2xl border-none focus:ring-2 ring-blue-500 bg-slate-50 transition-all outline-none font-bold text-slate-900"
                            placeholder="Full name as per SSC certificate" 
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label htmlFor="student-phone" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Primary Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} aria-hidden="true" />
                          <input 
                            id="student-phone"
                            type="tel" 
                            required
                            className="w-full pl-12 pr-4 py-5 rounded-2xl border-none focus:ring-2 ring-blue-500 bg-slate-50 transition-all outline-none font-bold text-slate-900"
                            placeholder="Active mobile number" 
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!formData.name || !formData.phone}
                      className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 disabled:opacity-50 transition-all shadow-xl shadow-slate-200"
                    >
                      Next Step <ChevronRight size={20} />
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2" 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-3">
                        <label htmlFor="ssc-info" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">SSC/Equivalent Information</label>
                        <textarea 
                          id="ssc-info"
                          required
                          className="w-full px-5 py-4 rounded-2xl border-none focus:ring-2 ring-blue-500 bg-slate-50 transition-all outline-none font-bold text-slate-900 min-h-[100px]"
                          placeholder="Roll, Registration, Board, Year & GPA" 
                          value={formData.sscInfo}
                          onChange={(e) => setFormData({ ...formData, sscInfo: e.target.value })}
                        />
                      </div>
                      <div className="space-y-3">
                        <label htmlFor="hsc-info" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">HSC/Equivalent Information</label>
                        <textarea 
                          id="hsc-info"
                          required
                          className="w-full px-5 py-4 rounded-2xl border-none focus:ring-2 ring-blue-500 bg-slate-50 transition-all outline-none font-bold text-slate-900 min-h-[100px]"
                          placeholder="Roll, Registration, Board, Year & GPA" 
                          value={formData.hscInfo}
                          onChange={(e) => setFormData({ ...formData, hscInfo: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 bg-slate-100 text-slate-900 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                      >
                        Back
                      </button>
                      <button 
                        type="button"
                        disabled={!formData.sscInfo || !formData.hscInfo}
                        onClick={() => setStep(3)}
                        className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 disabled:opacity-50 transition-all"
                      >
                        Final Step <ChevronRight size={20} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3" 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                        <div className="space-y-4">
                           <label htmlFor="preferred-dept" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Preferred Department</label>
                           <div className="relative">
                             <select 
                               id="preferred-dept"
                               required
                               className="w-full px-5 py-5 rounded-2xl border-none focus:ring-2 ring-blue-500 bg-slate-50 transition-all outline-none font-bold text-slate-900 appearance-none disabled:opacity-50"
                               value={formData.courseId}
                               onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                               disabled={courses.length === 0}
                             >
                               {courses.length > 0 ? (
                                 <>
                                   <option value="">Select Department...</option>
                                   {courses.map(c => (
                                     <option key={c.id} value={c.id}>{t_lang(c.title, c.titleBn)}</option>
                                   ))}
                                 </>
                               ) : (
                                 <option value="">No Departments Available Yet</option>
                               )}
                             </select>
                             <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                               < ChevronRight size={18} className="rotate-90" />
                             </div>
                           </div>
                           {courses.length === 0 && (
                             <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                <p className="text-[10px] font-bold text-orange-700 leading-relaxed">
                                  {user?.email === 'xoysharif@gmail.com' 
                                    ? 'Admin: Please use the "Seed Global Database" button in your Command Center to populate departments.'
                                    : 'Department list is being updated. Please try again in 30 minutes.'}
                                </p>
                             </div>
                           )}
                        </div>

                    <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 relative overflow-hidden">
                      <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Application Fee Details</h4>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-blue-700/60 uppercase">Registration Fee</span>
                        <span className="text-sm font-black text-blue-900 underline decoration-blue-300">{formatPrice(300)}</span>
                      </div>
                      <p className="text-[10px] text-blue-500 font-medium italic mt-4">* This is an application/registration fee only (300 BDT). Total course fees vary by IHT institute.</p>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Payment Method</label>
                      <div className="grid grid-cols-3 gap-3">
                         {(Object.keys(paymentConfig) as Array<keyof typeof paymentConfig>).map((method) => (
                           <button
                             key={method}
                             type="button"
                             onClick={() => setFormData({ ...formData, paymentMethod: method })}
                             className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all group ${formData.paymentMethod === method ? 'border-blue-600 bg-blue-50/50 shadow-md ring-4 ring-blue-50/50' : 'border-slate-50 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:border-blue-200'}`}
                           >
                              <div className="w-10 h-10 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-sm">
                                 <img src={paymentConfig[method].icon} alt={method} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                              </div>
                              <span className={`text-[9px] font-black uppercase tracking-widest ${formData.paymentMethod === method ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                {paymentConfig[method].label}
                              </span>
                           </button>
                         ))}
                      </div>
                    </div>

                    <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-blue-400">Step-by-Step Payment</h4>
                       <div className="space-y-4">
                          <div className="flex gap-4">
                             <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0">01</div>
                             <p className="text-xs font-bold leading-relaxed">Open your <span className="text-blue-300">{paymentConfig[formData.paymentMethod].label}</span> mobile app.</p>
                          </div>
                          <div className="flex gap-4">
                             <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0">02</div>
                             <p className="text-xs font-bold leading-relaxed">Choose <span className="text-orange-400 underline decoration-2">{paymentConfig[formData.paymentMethod].type}</span> from menu.</p>
                          </div>
                          <div className="flex gap-4">
                             <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0">03</div>
                             <div className="space-y-1">
                                <p className="text-xs font-bold">Transfer Exactly <span className="text-blue-300">300 BDT</span> to:</p>
                                <p className="text-xl font-black tracking-widest text-white font-mono bg-white/5 p-2 rounded-lg inline-block">{paymentConfig[formData.paymentMethod].number}</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label htmlFor="payment-number" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Your Mobile Number</label>
                        <input 
                          id="payment-number"
                          type="tel" 
                          required
                          className="w-full px-6 py-5 rounded-2xl border-none focus:ring-2 ring-blue-500 bg-slate-50 transition-all outline-none text-sm font-black"
                          placeholder="Payment number" 
                          value={formData.paymentNumber}
                          onChange={(e) => setFormData({ ...formData, paymentNumber: e.target.value })}
                        />
                      </div>
                      <div className="space-y-3">
                        <label htmlFor="transaction-id" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Transaction ID</label>
                        <input 
                          id="transaction-id"
                          type="text" 
                          required
                          className="w-full px-6 py-5 rounded-2xl border-none focus:ring-2 ring-blue-500 bg-slate-50 transition-all outline-none text-sm font-black uppercase"
                          placeholder="e.g. 5K976X2P" 
                          value={formData.transactionId}
                          onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Upload Payment Evidence (Screenshot)</label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-100 border-dashed rounded-3xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all overflow-hidden relative">
                          {formData.screenshotUrl ? (
                            <img src={formData.screenshotUrl} alt="Payment Evidence" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <CreditCard className="w-8 h-8 mb-4 text-slate-300" />
                              <p className="mb-2 text-xs font-black text-slate-500 uppercase tracking-tight">Drop your screenshot here</p>
                              <p className="text-[10px] text-slate-400 font-bold">PNG, JPG or PDF (Max 2MB)</p>
                            </div>
                          )}
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setFormData({ ...formData, screenshot: file });
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setFormData(prev => ({ ...prev, screenshotUrl: reader.result as string }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                      <button 
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex-1 bg-slate-100 text-slate-900 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                      >
                        Back
                      </button>
                      <button 
                        type="submit"
                        disabled={loading || !formData.transactionId || !formData.paymentNumber || !formData.courseId}
                        className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xl shadow-blue-200 text-[10px] uppercase tracking-[0.2em]"
                      >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Complete Admission'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Important Notice */}
          <div className="mt-12 p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 border-dashed">
             <div className="flex items-start gap-4">
                <CheckCircle2 className="text-blue-600 shrink-0 mt-1" size={20} />
                <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
                  "Admission is conducted under the <span className="text-blue-700 font-black">State Medical Faculty of Bangladesh</span>. Course fees and structure may vary by institute. Successful registration through this portal initiates your formal intake procedure."
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Official DGME Admission Portal Section */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 bg-white rounded-[3rem] border border-blue-100 shadow-2xl shadow-blue-50/50 overflow-hidden relative group"
      >
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
           <ShieldCheck size={280} className="text-blue-600" />
        </div>
        
        <div className="p-8 md:p-16 relative z-10">
           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
              <div className="max-w-2xl">
                 <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-emerald-100 shadow-sm">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    {t('officialAdmission.govtBadge')}
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase leading-tight">
                    {t('officialAdmission.title')}
                 </h2>
                 <p className="text-blue-600 font-bold text-lg mb-10 flex items-center gap-3">
                    {t('officialAdmission.subtitle')}
                 </p>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
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
                           className="flex items-center gap-3 bg-slate-50 hover:bg-white hover:shadow-xl hover:border-blue-200 border border-slate-100 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all active:scale-95 group/link"
                           aria-label={`Go to ${link.label} (opens in new tab)`}
                         >
                          <link.icon size={16} className="text-blue-400 group-hover:text-blue-600 transition-colors" />
                          {link.label}
                       </a>
                    ))}
                 </div>

                 <div className="bg-amber-50/80 backdrop-blur-sm border-l-4 border-amber-400 p-6 rounded-2xl mb-8">
                    <div className="flex gap-4">
                       <Activity size={24} className="text-amber-600 shrink-0" />
                       <div>
                          <p className="text-xs font-black text-amber-900 mb-1 uppercase tracking-widest">{t('officialAdmission.updates')}</p>
                          <p className="text-[11px] font-bold text-amber-800 leading-relaxed italic">
                             {t('officialAdmission.warning')}
                          </p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="lg:w-[320px] flex flex-col gap-6">
                 <motion.a 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href="https://dgme.teletalk.com.bd/iht_mats/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-10 py-8 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl shadow-blue-200 group/btn transition-all hover:bg-blue-700"
                 >
                    {t('officialAdmission.applyNow')}
                    <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                 </motion.a>
                 
                 <div className="text-center bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter leading-relaxed">
                       {t('officialAdmission.disclaimer')}
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
