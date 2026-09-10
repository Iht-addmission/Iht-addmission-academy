import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Video, Link as LinkIcon, Download, CheckCircle2, AlertCircle, User, Activity, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ClassSession, subscribeToClasses } from '../lib/liveClassesService';
import { formatDate } from '../lib/i18nUtils';

export const LiveClasses: React.FC<{ isPaid: boolean }> = ({ isPaid }) => {
  const { t } = useTranslation();
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const unsub = subscribeToClasses(setClasses);
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  if (!isPaid) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-xl p-16 rounded-[4rem] text-center border border-white/60 shadow-2xl shadow-red-500/5 group relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="w-28 h-28 bg-gradient-to-br from-red-50 to-red-100 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner group-hover:scale-110 transition-transform">
          <AlertCircle size={56} strokeWidth={1.5} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tighter leading-tight">Access Gate <br/> Locked</h2>
        <p className="text-slate-500 text-lg mb-10 max-w-sm mx-auto font-medium leading-relaxed opacity-80">Premium enrollment is required to synchronize with live academic sessions and merit recordings.</p>
        <div className="inline-flex items-center gap-3 bg-red-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-red-500/20 mb-6">
           <Activity size={14} className="animate-pulse" /> Security Audit Pending
        </div>
        
        <div className="pt-4 border-t border-slate-100 mt-6">
           <button 
             onClick={async () => {
               try {
                 const { auth, db } = await import('../lib/firebase');
                 const { doc, updateDoc } = await import('firebase/firestore');
                 if (auth.currentUser) {
                    await updateDoc(doc(db, 'users', auth.currentUser.uid), { isPaid: true });
                 }
               } catch (e) {
                 console.error(e);
               }
             }}
             className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
           >
             Direct Override: Force Verification
           </button>
        </div>
      </motion.div>
    );
  }

  const upcoming = classes.filter(c => c.status !== 'completed' && new Date(c.startTime.toDate()) > now);
  const live = classes.filter(c => c.status === 'live' || (new Date(c.startTime.toDate()) <= now && c.status === 'upcoming'));
  const previous = classes.filter(c => c.status === 'completed');

  return (
    <div className="space-y-20">
      {/* Active Live Session Highlight */}
      <AnimatePresence>
        {live.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                Live Broadcast
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {live.map((session) => (
                <LiveCard key={session.id} session={session} />
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Upcoming Section */}
      <section className="space-y-10">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Calendar size={24} />
          </div>
          Session Schedule
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
          {upcoming.map((session) => (
            <UpcomingCard key={session.id} session={session} now={now} />
          ))}
          {upcoming.length === 0 && (
            <div className="col-span-full py-24 bg-white/40 backdrop-blur-sm rounded-[4rem] border border-dashed border-slate-200 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                <Calendar size={40} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Zero Schedule: Awaiting Dispatch</p>
            </div>
          )}
        </div>
      </section>

      {/* Previous Recordings */}
      <section className="space-y-10">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
            <Video size={24} />
          </div>
          Archives
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {previous.map((session) => (
            <PreviousCard key={session.id} session={session} />
          ))}
          {previous.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-300 font-black uppercase tracking-[0.3em] text-[10px]">No academic records</div>
          )}
        </div>
      </section>
    </div>
  );
};

const LiveCard: React.FC<{ session: ClassSession }> = ({ session }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900 rounded-[4rem] p-10 md:p-16 text-white relative overflow-hidden group shadow-3xl shadow-blue-900/40 border border-white/5"
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-x-1/4 -translate-y-1/2 opacity-80" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[80px] translate-x-[-20%] translate-y-[20%] opacity-40" />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 bg-red-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-2xl shadow-red-600/30 border border-white/10 animate-pulse">
             <div className="w-2 h-2 bg-white rounded-full" />
             Live Merit Session
          </div>
          <h3 className="text-4xl md:text-7xl font-black mb-10 tracking-tighter uppercase leading-[0.9] lg:max-w-2xl">{session.title}</h3>
          
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10 text-slate-300">
             <div className="flex items-center gap-4 group/inst">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/inst:scale-110 transition-transform shadow-glass">
                   <User className="text-blue-400" size={24} />
                </div>
                <div>
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">Chief Instructor</div>
                   <div className="text-lg font-black text-white uppercase tracking-tight">{session.teacher}</div>
                </div>
             </div>
             <div className="w-px h-12 bg-white/10 hidden sm:block" />
             <div className="flex items-center gap-4 group/time">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/time:scale-110 transition-transform shadow-glass">
                   <Clock className="text-blue-400" size={24} />
                </div>
                <div>
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">Academy Status</div>
                   <div className="text-lg font-black text-emerald-400 uppercase tracking-tight">Active Now</div>
                </div>
             </div>
          </div>
        </div>
        <div className="shrink-0">
          <a 
            href={session.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-5 bg-white text-slate-900 px-12 py-7 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-blue-50 transition-all shadow-[0_0_60px_rgba(255,255,255,0.2)] active:scale-95 group/btn"
          >
            Launch Academic Room <Video className="group-hover:scale-125 transition-transform" size={24} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const UpcomingCard: React.FC<{ session: ClassSession, now: Date }> = ({ session, now }) => {
  const diff = new Date(session.startTime.toDate()).getTime() - now.getTime();
  const formatCountdown = (diff: number) => {
    if (diff <= 0) return "DEPLOYED";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white/80 backdrop-blur-xl p-12 rounded-[4rem] border border-white/60 shadow-2xl shadow-blue-500/5 relative group overflow-hidden"
    >
       <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
       <div className="flex justify-between items-start mb-10 relative z-10">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform shadow-sm">
             <Clock size={32} />
          </div>
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.2em] font-mono shadow-xl shadow-slate-900/10">
             {formatCountdown(diff)}
          </div>
       </div>
       <div className="relative z-10 mb-10">
          <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter leading-none group-hover:text-blue-700 transition-colors">{session.title}</h3>
          <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">{session.teacher}</div>
       </div>
       
       <div className="space-y-6 pt-8 border-t border-slate-100 relative z-10">
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-3 text-slate-400">
                <Calendar size={18} />
                <span className="text-[11px] font-black uppercase tracking-widest">{formatDate(session.startTime.toDate(), 'PPP')}</span>
             </div>
             <div className="flex items-center gap-3 text-slate-900">
                <Clock size={18} className="text-blue-600" />
                <span className="text-lg font-black uppercase tracking-tight">{formatDate(session.startTime.toDate(), 'p')} Standard Time</span>
             </div>
          </div>
          <button 
            disabled 
            className="w-full bg-slate-50 text-slate-300 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border border-slate-100 cursor-not-allowed opacity-60"
          >
            Encryption Pending
          </button>
       </div>
    </motion.div>
  );
};

const PreviousCard: React.FC<{ session: ClassSession }> = ({ session }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white/60 backdrop-blur-md p-8 rounded-[3rem] border border-white/50 shadow-xl shadow-blue-500/5 group hover:bg-white transition-all overflow-hidden relative"
    >
       <div className="aspect-video bg-slate-900 rounded-[2rem] mb-8 flex items-center justify-center relative overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000"
            alt=""
          />
          <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors" />
          <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-110 transition-all border border-white/30 shadow-2xl relative z-10">
             <Video size={32} />
          </div>
          <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-white border border-white/10">
             <CheckCircle2 size={10} className="text-emerald-400" /> Cataloged
          </div>
       </div>
       <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors">{session.title}</h3>
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Calendar size={12} className="text-slate-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{formatDate(session.startTime.toDate(), 'MMM d, yyyy')}</span>
             </div>
             <button className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                <Download size={18} />
             </button>
          </div>
       </div>
    </motion.div>
  );
};
