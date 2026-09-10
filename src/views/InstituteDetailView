/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Globe, 
  Facebook, 
  Phone, 
  Mail, 
  ArrowLeft, 
  Building2, 
  Users, 
  Info,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  ImageIcon,
  X,
  Maximize2
} from 'lucide-react';
import { Institute, Course, DepartmentInfo } from '../types';
import { fetchCourses } from '../api';

interface InstituteDetailViewProps {
  institute: Institute;
  onBack: () => void;
  onNavigate: (page: string, courseId?: string) => void;
}

export default function InstituteDetailView({ institute, onBack, onNavigate }: InstituteDetailViewProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'seats' | 'gallery'>('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const galleryImages = institute.gallery || [
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1538108197017-c13466739195?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1586771107445-d3ca888129ee?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=800'
  ];

  const handleNext = useCallback(() => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % galleryImages.length);
    }
  }, [selectedImageIndex, galleryImages.length]);

  const handlePrev = useCallback(() => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + galleryImages.length) % galleryImages.length);
    }
  }, [selectedImageIndex, galleryImages.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') setSelectedImageIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, handleNext, handlePrev]);

  useEffect(() => {
    fetchCourses().then(setCourses).catch(console.error);
    window.scrollTo(0, 0);
  }, []);

  const totalSeats = Object.values(institute.seats).reduce((acc: number, val) => {
    const seats = typeof val === 'object' && val !== null ? (val as DepartmentInfo).seats : Number(val);
    return acc + (seats || 0);
  }, 0);

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumbs & Back */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 font-black text-[10px] uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Directory
        </button>

        {/* Hero Section */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-blue-50 overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="h-[300px] lg:h-auto relative overflow-hidden">
              <img 
                src={institute.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200'} 
                alt={institute.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                 <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
                   <Building2 size={12} /> Govt. Institute
                 </div>
                 <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                   {institute.name}
                 </h1>
              </div>
            </div>

            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-blue-600 mb-6 group cursor-default">
                <MapPin size={20} className="group-hover:bounce-y" />
                <span className="text-lg font-bold text-slate-700">{institute.location}</span>
              </div>
              
              <p className="text-slate-500 text-lg leading-relaxed mb-10 font-medium">
                {institute.description || 'Welcome to the Institute of Health Technology. We provide world-class medical technology education sanctioned by the State Medical Faculty of Bangladesh.'}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <div className="text-[10px] text-blue-400 font-black uppercase mb-1 tracking-widest">Total Seats</div>
                  <div className="text-2xl font-black text-blue-700 font-mono">{totalSeats}</div>
                </div>
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                  <div className="text-[10px] text-emerald-400 font-black uppercase mb-1 tracking-widest">Departments</div>
                  <div className="text-2xl font-black text-emerald-700 font-mono">{Object.keys(institute.seats).length}</div>
                </div>
                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                  <div className="text-[10px] text-amber-500 font-black uppercase mb-1 tracking-widest">Status</div>
                  <div className="text-lg font-black text-amber-700 uppercase leading-none mt-2">Verified</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {institute.website && (
                  <a href={institute.website} target="_blank" rel="no-referrer" className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all">
                    <Globe size={14} /> Website <ExternalLink size={12} />
                  </a>
                )}
                {institute.facebook && (
                  <a href={institute.facebook} target="_blank" rel="no-referrer" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all">
                    <Facebook size={14} /> Official Page
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="flex gap-8 mb-8 border-b border-slate-200">
              {[
                { id: 'overview', label: 'Overview', icon: Info },
                { id: 'seats', label: 'Seat Distribution', icon: Users },
                { id: 'gallery', label: 'Image Gallery', icon: ImageIcon }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 pb-4 font-black text-[11px] uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <tab.icon size={16} /> {tab.label}
                  {activeTab === tab.id && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full" />}
                </button>
              ))}
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {activeTab === 'overview' && (
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-50/50">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">About the Campus</h3>
                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium">
                    <p className="mb-4">Located in {institute.location}, this institute stands as a beacon of health technical education. It features state-of-the-art laboratories, a comprehensive medical library, and professional simulation centers where students gain hands-on clinical experience.</p>
                    <p>Students here follow a rigorous curriculum that blends theoretical knowledge with practical clinical rotations in government medical college hospitals.</p>
                  </div>
                  
                  {institute.mapEmbed && (
                    <div className="mt-10 rounded-3xl overflow-hidden border border-slate-100 shadow-inner h-[400px]">
                      <iframe 
                        src={institute.mapEmbed}
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Institute Location"
                      ></iframe>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'seats' && (
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-50/50">
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Academic Seat Matrix</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Note: Codes and Seats are distinct values</p>
                    </div>
                    <div className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase tracking-widest">Session 2026-27</div>
                  </div>
                  
                  <div className="overflow-hidden rounded-3xl border border-slate-100">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Department</th>
                          <th className="px-8 py-5 text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] text-center">Subject Code</th>
                          <th className="px-8 py-5 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] text-center">Seat Capacity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {Object.entries(institute.seats).map(([deptId, info]) => {
                          const course = courses.find(c => c.id === deptId);
                          const subjectCode = typeof info === 'object' ? info.code : 'N/A';
                          const seatCount = typeof info === 'object' ? info.seats : info;
                          return (
                            <tr key={deptId} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-8 py-6">
                                <div className="text-sm font-black text-slate-900 uppercase group-hover:text-blue-600 transition-colors">
                                  {course?.title.replace('DMT in ', '') || deptId.toUpperCase()}
                                </div>
                                <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-none mt-1">Full Course Available</div>
                              </td>
                              <td className="px-8 py-6 text-center">
                                <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-xl font-mono font-black text-sm border border-blue-100">
                                  {subjectCode}
                                </span>
                              </td>
                              <td className="px-8 py-6 text-center">
                                <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-xl font-mono font-black text-lg border border-emerald-100">
                                  {seatCount}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="bg-slate-900 text-white">
                          <td className="px-8 py-6 text-sm font-black uppercase tracking-widest">Total Institutional Capacity</td>
                          <td className="px-8 py-6 text-center">—</td>
                          <td className="px-8 py-6 text-center text-2xl font-black text-blue-400">{totalSeats}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8 p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
                    <Info size={20} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-medium text-amber-800 leading-relaxed italic">
                      Verify these numbers with the official SMF notification for each session. Subject codes are strictly for application identification and must not be used as seat counts.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-50/50">
                   <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Campus Gallery</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       {galleryImages.length} Visual Assets
                     </p>
                   </div>
                   
                   <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                     {galleryImages.map((img, i) => (
                       <motion.div 
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: i * 0.1 }}
                         key={i} 
                         onClick={() => setSelectedImageIndex(i)}
                         className={`relative aspect-[4/3] rounded-3xl overflow-hidden group cursor-pointer border border-slate-100 
                           ${i % 4 === 0 ? 'md:col-span-2 md:row-span-2 md:aspect-auto' : ''}`}
                       >
                         <img 
                           src={img} 
                           alt={`Campus ${i + 1}`} 
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                           referrerPolicy="no-referrer"
                         />
                         <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors duration-300 flex items-center justify-center">
                           <div className="bg-white/20 backdrop-blur-md p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100">
                             <Maximize2 size={24} className="text-white" />
                           </div>
                         </div>
                       </motion.div>
                     ))}
                   </div>
                </div>
              )}
            </motion.div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            {/* Contact Info */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-50/50">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                <ChevronRight size={18} className="text-blue-600" /> Admin Contact
              </h4>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                    <Phone size= {18} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</div>
                    <div className="font-bold text-slate-900">{institute.phone || '02-XXXXXXX'}</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</div>
                    <div className="font-bold text-slate-900 truncate max-w-[200px]">{institute.email || `info@${institute.id}.gov.bd`}</div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('admission')}
                className="w-full mt-10 bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95"
              >
                Apply for Admission
              </button>
            </div>

            {/* Quick Links */}
            <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] relative overflow-hidden group">
               <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
               <Building2 size={40} className="text-blue-400 mb-8" />
               <h4 className="text-xl font-black mb-4 uppercase tracking-tight">Need Help?</h4>
               <p className="text-sm text-slate-400 leading-relaxed mb-8">Not sure which department to choose? Our academic advisors are here to guide your career path.</p>
               <a href="https://wa.me/8801234567890" target="_blank" rel="no-referrer" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">
                 Message Advisor
               </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/98 flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedImageIndex(null)}
          >
            {/* Header / Meta */}
            <div className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between pointer-events-none">
              <div className="text-white">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Campus Vision</div>
                <div className="text-sm font-black uppercase tracking-widest">{institute.name}</div>
              </div>
              <div className="flex items-center gap-6 pointer-events-auto">
                <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                  {selectedImageIndex + 1} / {galleryImages.length}
                </div>
                <button 
                  onClick={() => setSelectedImageIndex(null)}
                  className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-all border border-white/10 backdrop-blur-sm"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute inset-x-4 md:inset-x-8 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
              <button 
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="w-14 h-14 md:w-20 md:h-20 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-all border border-white/10 backdrop-blur-md pointer-events-auto group"
              >
                <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="w-14 h-14 md:w-20 md:h-20 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-all border border-white/10 backdrop-blur-md pointer-events-auto group"
              >
                <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative max-w-5xl w-full aspect-[4/3] md:aspect-video flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <img 
                key={selectedImageIndex}
                src={galleryImages[selectedImageIndex]} 
                alt="Full view" 
                className="w-full h-full object-contain md:rounded-[3rem] shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Footer Prompt */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 text-[9px] font-black uppercase tracking-[0.4em] pointer-events-none">
              Use Arrows to Navigate
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
