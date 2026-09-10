import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Video, Trash2, Edit2, CheckCircle, Clock, Calendar, Link as LinkIcon, User, Save, X } from 'lucide-react';
import { ClassSession, subscribeToClasses, addClass, updateClassStatus, deleteClass } from '../lib/liveClassesService';
import { formatDate } from '../lib/i18nUtils';
import { createBroadcastNotification } from '../api';

export const AdminClassManager: React.FC = () => {
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClass, setNewClass] = useState({
    title: '',
    teacher: '',
    startTime: '',
    durationMinutes: 60,
    meetLink: '',
    courseId: 'General',
    status: 'upcoming' as const
  });

  useEffect(() => {
    return subscribeToClasses(setClasses);
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const startDate = new Date(newClass.startTime);
    await addClass({
      ...newClass,
      startTime: { toDate: () => startDate } // Rough mapping for service
    } as any);
    
    // Broadcast notification
    try {
      await createBroadcastNotification(
        `New Class Scheduled: ${newClass.title}`,
        `Upcoming session with ${newClass.teacher} on ${formatDate(startDate, 'PPP p')}`,
        'class'
      );
    } catch (err) {
      console.error('Failed to broadcast class notification:', err);
    }

    setShowAddModal(false);
    setNewClass({
      title: '',
      teacher: '',
      startTime: '',
      durationMinutes: 60,
      meetLink: '',
      courseId: 'General',
      status: 'upcoming'
    });
  };

  const handleGoLive = async (c: ClassSession) => {
    await updateClassStatus(c.id, 'live');
    try {
      await createBroadcastNotification(
        `🚨 CLASS LIVE NOW: ${c.title}`,
        `${c.teacher} has started the live session. Join now!`,
        'live'
      );
    } catch (err) {
      console.error('Failed to broadcast live notification:', err);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Academic Hall Admin</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Schedule and manage live sessions for all IHT departments.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-3 shadow-xl shadow-blue-200 active:scale-95"
        >
          <Plus size={18} /> Schedule New Class
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {classes.map((c) => (
          <div key={c.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-blue-50/50 flex flex-col md:flex-row items-center justify-between gap-8 group">
            <div className="flex items-center gap-8 w-full md:w-auto">
               <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg ${c.status === 'live' ? 'bg-red-500 animate-pulse' : c.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-900'}`}>
                  {c.status === 'live' ? <Video size={24} /> : c.status === 'completed' ? <CheckCircle size={24} /> : <Calendar size={24} />}
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none mb-2">{c.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-slate-400">
                     <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-full"><User size={12} /> {c.teacher}</span>
                     <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"><Clock size={12} /> {formatDate(c.startTime.toDate(), 'PPP p')}</span>
                     <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-100 text-slate-500 rounded-full border border-slate-200">{c.courseId}</span>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
               {c.status === 'upcoming' && (
                 <button 
                   onClick={() => handleGoLive(c)}
                   className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all"
                 >
                   Go Live
                 </button>
               )}
               {c.status === 'live' && (
                 <button 
                   onClick={() => updateClassStatus(c.id, 'completed')}
                   className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-800 hover:bg-emerald-600 transition-all"
                 >
                   Mark Complete
                 </button>
               )}
               <button 
                onClick={() => deleteClass(c.id)}
                className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all"
               >
                 <Trash2 size={18} />
               </button>
            </div>
          </div>
        ))}
        {classes.length === 0 && (
          <div className="py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No classes in database</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl relative"
          >
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute right-8 top-8 p-3 hover:bg-slate-100 rounded-full transition-all"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-8">Schedule Academic Session</h3>
            <form onSubmit={handleAdd} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Class Title</label>
                  <input 
                    required 
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900"
                    placeholder="e.g. Heart Anatomy Advanced"
                    value={newClass.title}
                    onChange={e => setNewClass({...newClass, title: e.target.value})}
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Teacher Name</label>
                    <input 
                      required 
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900"
                      value={newClass.teacher}
                      onChange={e => setNewClass({...newClass, teacher: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Duration (Min)</label>
                    <input 
                      type="number"
                      required 
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900"
                      value={newClass.durationMinutes}
                      onChange={e => setNewClass({...newClass, durationMinutes: parseInt(e.target.value)})}
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Department / Course Group</label>
                  <select 
                    required 
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900 appearance-none"
                    value={newClass.courseId}
                    onChange={e => setNewClass({...newClass, courseId: e.target.value})}
                  >
                    <option value="General">General (All Students)</option>
                    <option value="Laboratory">Laboratory Technology</option>
                    <option value="Radiology">Radiology & Imaging</option>
                    <option value="Physiotherapy">Physiotherapy</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Dentistry">Dentistry</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Start Date & Time</label>
                  <input 
                    type="datetime-local" 
                    required 
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900"
                    value={newClass.startTime}
                    onChange={e => setNewClass({...newClass, startTime: e.target.value})}
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Google Meet Link</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required 
                      className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900"
                      placeholder="meet.google.com/xxx-xxxx-xxx"
                      value={newClass.meetLink}
                      onChange={e => setNewClass({...newClass, meetLink: e.target.value})}
                    />
                  </div>
               </div>
               <button 
                type="submit"
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl active:scale-95 mt-4"
               >
                 Push to Student Library
               </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
