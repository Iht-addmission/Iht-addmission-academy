/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  GraduationCap, 
  Users, 
  Target, 
  ShieldCheck, 
  BookOpen, 
  Briefcase, 
  CheckCircle2,
  Award,
  Wallet,
  DollarSign
} from 'lucide-react';
import { COURSES } from '../constants';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../lib/i18nUtils';

interface CourseDetailViewProps {
  courseId: string;
  onNavigate: (page: string, courseId?: string) => void;
}

export default function CourseDetailView({ courseId, onNavigate }: CourseDetailViewProps) {
  const { i18n } = useTranslation();
  const course = COURSES.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="pt-48 pb-24 text-center">
        <h2 className="text-2xl font-black text-slate-400 uppercase tracking-widest">Department Not Found</h2>
        <button 
          onClick={() => onNavigate('courses')}
          className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs"
        >
          Back to Departments
        </button>
      </div>
    );
  }

  // Extract numeric fee for better formatting if possible
  const numericFee = course.fee ? parseFloat(course.fee.replace(/,/g, '')) : 0;
  const displayFee = isNaN(numericFee) ? course.fee : formatPrice(numericFee);

  return (
    <div className="pt-32 pb-24 bg-slate-50/30">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button 
          onClick={() => onNavigate('courses')}
          className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-12 font-black text-[10px] uppercase tracking-widest"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to All Departments
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Info Column */}
          <div className="lg:col-span-12 space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-blue-50 overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-[400px] lg:h-auto overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                  {course.logo && (
                    <div className="absolute top-8 left-8 w-20 h-20 bg-white rounded-3xl p-4 shadow-2xl flex items-center justify-center">
                      <img src={course.logo} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>

                <div className="p-8 lg:p-16 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-100 w-fit">
                    <Award size={14} /> State Medical Faculty Approved
                  </div>
                  <h1 className="text-3xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight uppercase leading-tight">
                    {i18n.language === 'bn' ? (course.titleBn || course.title) : course.title}
                  </h1>
                  <p className="text-slate-500 text-lg font-medium leading-relaxed mb-10">
                    {i18n.language === 'bn' ? (course.descriptionBn || course.description) : course.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                       <div className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest text-center sm:text-left">Duration</div>
                       <div className="text-xl font-black text-slate-900 flex items-center justify-center sm:justify-start gap-2">
                          <Clock size={18} className="text-blue-600" /> {course.duration}
                       </div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                       <div className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest text-center sm:text-left">Qualification</div>
                       <div className="text-lg md:text-xl font-black text-slate-900 flex items-center justify-center sm:justify-start gap-2">
                          <GraduationCap size={18} className="text-blue-600" /> {course.duration.includes('Year') && !course.qualification ? 'SSC/HSC Science' : course.qualification || 'SSC Science'}
                       </div>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 shadow-lg shadow-emerald-500/5">
                       <div className="text-[10px] text-emerald-600 font-black uppercase mb-1 tracking-widest text-center sm:text-left">Course Fee</div>
                       <div className="text-xl font-black text-emerald-700 flex items-center justify-center sm:justify-start gap-2">
                          <DollarSign size={18} className="text-emerald-500" /> {displayFee}
                       </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => onNavigate('admission', course.id)}
                    className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95"
                  >
                    Start Admission Process <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Detailed Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Stats & Association */}
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="md:col-span-1 space-y-8"
              >
                 <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-blue-50/50">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-10 flex items-center gap-3">
                       <Target size={20} className="text-blue-600" /> Intake Profile
                    </h3>
                    <div className="space-y-8">
                       <div className="flex justify-between items-center pb-6 border-b border-slate-50">
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Seats</span>
                          <span className="text-xl font-black text-slate-900">{course.totalSeats || '600+'}</span>
                       </div>
                       <div className="flex justify-between items-center pb-6 border-b border-slate-50">
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Target Mark</span>
                          <span className="text-xl font-black text-blue-600">{course.cutMark || '72+'}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Admission Fee</span>
                          <span className="text-xl font-black text-emerald-600">{displayFee}</span>
                       </div>
                    </div>
                 </div>

                 <div className="bg-blue-600 text-white p-10 rounded-[3rem] shadow-2xl shadow-blue-200 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    <ShieldCheck size={40} className="text-blue-200 mb-8" />
                    <h4 className="text-sm font-black uppercase tracking-widest mb-4">Official Verification</h4>
                    <p className="text-[13px] text-blue-100 leading-relaxed font-medium mb-8">
                       Graduates are eligible for government registration under the {course.association}.
                    </p>
                    <div className="flex items-center gap-2 bg-white/10 p-3 rounded-2xl border border-white/10">
                       <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse"></div>
                       <span className="text-[10px] font-black uppercase tracking-widest">Credentialed Course</span>
                    </div>
                 </div>
              </motion.div>

              {/* Curriculum */}
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.1 }}
                 className="md:col-span-1 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-blue-50/50"
              >
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-10 flex items-center gap-3">
                   <BookOpen size={20} className="text-blue-600" /> Learning Path
                </h3>
                <div className="space-y-6">
                  {course.curriculum?.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                       <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 font-black text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          {idx + 1}
                       </div>
                       <span className="text-sm font-bold text-slate-700 pt-1.5">{item}</span>
                    </div>
                  ))}
                  <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 border-dashed">
                     <p className="text-[10px] text-blue-700 font-bold uppercase tracking-widest text-center">
                        + Continuous Clinical Workshops
                     </p>
                  </div>
                </div>
              </motion.div>

              {/* Opportunities & Outcomes */}
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.2 }}
                 className="md:col-span-1 space-y-8"
              >
                 <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-blue-50/50">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                       <Briefcase size={20} className="text-blue-600" /> Career Matrix
                    </h3>
                    <div className="space-y-4">
                       {course.jobFacilities?.map((job, idx) => (
                         <div key={idx} className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                            {job}
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-blue-50/50">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                       <Target size={20} className="text-blue-600" /> Competencies
                    </h3>
                    <div className="space-y-4">
                       {course.outcomes?.map((outcome, idx) => (
                         <div key={idx} className="flex gap-3 text-slate-600 text-sm font-medium leading-tight">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></div>
                            {outcome}
                         </div>
                       ))}
                    </div>
                 </div>
              </motion.div>
            </div>

            {/* Detailed Curriculum Section */}
            {course.detailedCurriculum && (
              <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-blue-50/50"
              >
                 <div className="mb-12">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-2 flex items-center gap-3">
                       <BookOpen size={24} className="text-blue-600" />
                       Academic Curriculum
                    </h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Full Session Syllabus Overview (As per SMF)</p>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {course.detailedCurriculum.map((yearInfo, yIdx) => (
                       <div key={yIdx} className="space-y-6">
                          <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-l-4 border-blue-600 pl-4 py-1">
                             {i18n.language === 'bn' ? (yearInfo.yearBn || yearInfo.year) : yearInfo.year}
                          </div>
                          <div className="space-y-3">
                             {yearInfo.subjects.map((subject, sIdx) => (
                                <div key={sIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group/sub">
                                   <span className="text-xs font-bold text-slate-700 leading-tight block group-hover/sub:text-blue-700">
                                      {i18n.language === 'bn' && yearInfo.subjectsBn && yearInfo.subjectsBn[sIdx] ? yearInfo.subjectsBn[sIdx] : subject}
                                   </span>
                                </div>
                             ))}
                          </div>
                       </div>
                    ))}
                 </div>
              </motion.div>
            )}

            {/* Financial Roadmap Section */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-blue-50/50 overflow-hidden relative"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
               <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                  <div>
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-2 flex items-center gap-3">
                        <Wallet size={24} className="text-emerald-600" />
                        Tuition & Financial Roadmap
                     </h3>
                     <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Course Investment Structure</p>
                  </div>
                  <div className="text-center md:text-right">
                     <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total Course Fee</div>
                     <div className="text-4xl font-black text-slate-900 tracking-tighter">
                        {displayFee}
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                     <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm mb-6">
                        <CheckCircle2 size={20} />
                     </div>
                     <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Total Transparency</h4>
                     <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        The mentioned fee covers laboratory usage, clinical equipment training, and academic support throughout the duration of the course.
                     </p>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                     <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm mb-6">
                        <ShieldCheck size={20} />
                     </div>
                     <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Govt. Regulations</h4>
                     <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Course fees are strictly regulated as per the State Medical Faculty (SMF) guidelines for all medical technology institutes.
                     </p>
                  </div>
                  <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden group">
                     <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                     <div className="relative z-10">
                        <h4 className="text-sm font-black uppercase tracking-widest mb-4">Payment Support</h4>
                        <p className="text-[11px] text-slate-400 group-hover:text-white/80 leading-relaxed font-medium mb-6">
                           Flexible payment options and departmental scholarships may be available based on academic merit and financial need.
                        </p>
                        <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                           Consult Accounts <ArrowRight size={14} />
                        </button>
                     </div>
                  </div>
               </div>
            </motion.div>

            {/* Association & Affiliation Section */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-blue-50/50"
            >
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                  <div>
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-2 flex items-center gap-3">
                        <ShieldCheck size={24} className="text-blue-600" />
                        Official Association & Affiliation
                     </h3>
                     <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Regulatory Compliance & Professional Networks</p>
                  </div>
                  <div className="inline-flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl text-[11px] font-black border border-emerald-100 shadow-sm">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     {course.accreditationStatus}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="space-y-6">
                     <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-l-4 border-blue-600 pl-4">Affiliation Authority</div>
                     <div className="flex flex-wrap gap-2">
                        {course.affiliationAuthority?.map((auth, idx) => (
                           <div key={idx} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                              <Award size={12} className="text-blue-400" />
                              {auth}
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-slate-200 pl-4">Clinical Training Partners</div>
                     <div className="flex flex-wrap gap-2">
                        {course.clinicalPartners?.map((partner, idx) => (
                           <div key={idx} className="bg-orange-50 text-orange-700 px-4 py-2 rounded-xl text-[11px] font-bold border border-orange-100 flex items-center gap-2">
                              <CheckCircle2 size={12} />
                              {partner}
                           </div>
                        ))}
                     </div>
                     <p className="text-[10px] text-slate-400 italic">Practical clinical rotations are mandatory as per SMF regulations.</p>
                  </div>

                  <div className="space-y-6">
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-slate-200 pl-4">Professional Associations</div>
                     <div className="flex flex-wrap gap-2">
                        {course.professionalAssociations?.map((assoc, idx) => (
                           <a 
                             key={idx} 
                             href="https://www.facebook.com/share/18hzqcSZuW/"
                             target="_blank"
                             rel="noopener noreferrer"
                             className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-[11px] font-bold border border-blue-100 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all group/assoc"
                           >
                              <Users size={12} className="group-hover/assoc:scale-110 transition-transform" />
                              {assoc}
                           </a>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="mt-16 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center">
                  <p className="text-[10px] text-slate-400 font-medium italic leading-relaxed max-w-3xl mx-auto">
                     "All affiliations and associations listed are based on publicly available and officially recognized sources from the State Medical Faculty of Bangladesh (SMF). Clinical placements and training partners may vary based on academic session and institutional arrangements."
                  </p>
               </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
