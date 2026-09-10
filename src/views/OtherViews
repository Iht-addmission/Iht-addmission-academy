/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, MapPin, Phone, Mail, MessageSquare, Send, CheckCircle2, Info, LogOut, Loader2, Award, ShieldAlert, Sparkles, ArrowRight, User } from 'lucide-react';
import { CALENDAR_EVENTS } from '../constants';
import { formatDate } from '../lib/i18nUtils';

export function CalendarView() {
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 uppercase tracking-tight">Academic Calendar 2026</h1>
        <p className="text-slate-500 font-medium italic">Synchronized institutional schedule and official public holidays.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Live Google Calendar Embed */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-blue-50 overflow-hidden"
          >
            <div className="aspect-video w-full rounded-[1.5rem] overflow-hidden border border-slate-50">
              <iframe 
                src="https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=Asia%2FDhaka&showTitle=0&showPrint=0&showTabs=1&showCalendars=0&showTld=0&src=ZW4uYmQjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%230B8043" 
                className="w-full h-full"
                frameBorder="0" 
                scrolling="no"
              ></iframe>
            </div>
            <div className="p-6 flex items-center justify-between text-slate-400">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  Live Sync Active
               </div>
               <p className="text-[10px] font-bold italic">Source: Bangladesh Public Holidays & Institutional Events</p>
            </div>
          </motion.div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-blue-50/50">
            <h2 className="text-sm font-black text-slate-900 mb-10 flex items-center gap-3 uppercase tracking-widest">
              <CalendarIcon className="text-blue-600" size={20} /> Upcoming Milestones
            </h2>
            <div className="space-y-6">
              {CALENDAR_EVENTS.map((event, i) => (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-blue-50 transition-colors"
                >
                  <div className="w-16 h-16 bg-white rounded-xl flex flex-col items-center justify-center border border-slate-200 shrink-0 group-hover:border-blue-200 transition-colors">
                     <span className="text-[10px] font-bold text-slate-400 uppercase">{formatDate(event.date, 'MMM')}</span>
                     <span className="text-2xl font-black text-slate-900">{formatDate(event.date, 'd')}</span>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">{event.type}</div>
                    <h3 className="text-lg font-bold text-slate-900">{event.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">Starting from 9:00 AM onwards. Mandatory attendance for relevant batches.</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900 p-8 rounded-3xl text-white">
             <h3 className="font-bold mb-4">Export Calendar</h3>
             <p className="text-slate-400 text-xs mb-6Leading-relaxed">Sync our academic schedule with your personal Google or Outlook calendar to never miss an important update.</p>
             <button className="w-full bg-blue-600 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
               Download .ICS <Send size={16} />
             </button>
           </div>

           <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 relative overflow-hidden">
              <Sparkles className="absolute -right-4 -top-4 text-blue-200/50" size={100} />
              <h3 className="font-bold text-blue-900 mb-4 relative z-10">Exam Policy</h3>
              <p className="text-blue-800 text-xs mb-4 leading-relaxed font-medium relative z-10">Please ensure you have cleared all dues at least 15 days before the examination dates mentioned in the calendar.</p>
              <ul className="text-[10px] space-y-2 text-blue-600 font-bold uppercase tracking-tight relative z-10">
                <li className="flex items-center gap-2"><CheckCircle2 size={12} /> ID Card Mandatory</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={12} /> Clinical Scrub Attire</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={12} /> Digital Device Policy</li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}

export function ContactView() {
  return (
    <div className="pt-32 pb-24 max-w-5xl mx-auto px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Get in Touch</h1>
        <p className="text-slate-500 italic">We are here to assist you with any admissions, educational, or technical inquiries.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
           <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex gap-6">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                <MapPin size={28} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Our Campus</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Mohakhali, Dhaka-1212 (Near DGHS Office), Bangladesh</p>
              </div>
           </div>
           <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex gap-6">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                <Phone size={28} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Phone</h3>
                <p className="text-slate-500 text-sm italic">+880 1818-195968 (Official)</p>
                <p className="text-slate-500 text-sm leading-relaxed">02-9881234 (Office Admin)</p>
              </div>
           </div>
           <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex gap-6">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                <Mail size={28} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Email</h3>
                <p className="text-slate-500 text-sm">ihtd@ac.dghs.gov.bd</p>
                <p className="text-slate-500 text-sm">principal@ihtdhaka.gov.bd</p>
              </div>
           </div>

           <a 
            href="https://wa.me/8801819248542" 
            target="_blank" 
            rel="no-referrer"
            className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-extrabold py-5 rounded-2xl transition-all shadow-xl shadow-green-900/20 w-full"
          >
            <MessageSquare size={24} />
            Chat on WhatsApp
          </a>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-100 border border-slate-100">
           <h3 className="text-2xl font-bold text-slate-900 mb-8">Send a Message</h3>
           <form className="space-y-6">
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Your Name</label>
                <input type="text" className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium" placeholder="Full Name" />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email Address</label>
                <input type="email" className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium" placeholder="email@example.com" />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Message</label>
                <textarea rows={4} className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium resize-none" placeholder="How can we help?"></textarea>
             </div>
             <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
               Send Inquiry
             </button>
           </form>
        </div>
      </div>
    </div>
  );
}

export function LoginView({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'student' | 'teacher'>('student');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const api = await import('../api');
      const user = await api.loginWithGoogle();
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const api = await import('../api');
      let user;
      if (mode === 'login') {
        user = await api.login({ email, password });
      } else {
        user = await api.signup({ email, password, name, role });
      }
      onLogin(user);
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Login is disabled. Please enable Email/Password login in Firebase Console (Authentication > Sign-in method).');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. IHT Academy servers are unreachable. Please check your internet.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid credentials. If you haven\'t created an account yet, please use the Sign Up tab.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-48 pb-24 max-w-md mx-auto px-4">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-blue-100 border border-slate-100 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -right-20 -top-20 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
        
        <div className="text-center mb-12 relative z-10">
          <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white font-black text-2xl mx-auto mb-8 shadow-2xl shadow-slate-200 ring-8 ring-slate-50">
             {mode === 'login' ? <ShieldAlert size={32} className="text-blue-400" /> : <User size={32} className="text-blue-400" />}
          </div>
          <h1 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">
            {mode === 'login' ? 'Unified Portal Access' : 'New Account Registration'}
          </h1>
          <h2 className="text-3xl font-black text-slate-900 leading-tight uppercase tracking-tight">
            {mode === 'login' ? 'Login Credentials' : 'Create Profile'}
          </h2>
          <p className="text-slate-400 text-sm mt-4 font-medium leading-relaxed">
            {mode === 'login' 
              ? 'Access your student dashboard or administrative workspace using your verified account.'
              : 'Register now to track your admission status and access academic resources.'}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 bg-red-50 text-red-600 text-[11px] font-black uppercase tracking-widest rounded-2xl border border-red-100 flex items-center gap-3"
          >
             <ShieldAlert size={20} className="shrink-0" /> {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {mode === 'signup' && (
            <>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Account Type</label>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setRole('student')}
                    className={`flex-1 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${role === 'student' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}
                  >
                    Student
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`flex-1 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${role === 'teacher' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}
                  >
                    Teacher
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    type="text" 
                    required 
                    className="w-full pl-14 pr-6 py-5 rounded-2xl border-none ring-1 ring-slate-100 bg-slate-50/50 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-900" 
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Registered Email ID</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="email" 
                required 
                className="w-full pl-14 pr-6 py-5 rounded-2xl border-none ring-1 ring-slate-100 bg-slate-50/50 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-900" 
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center px-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Password</label>
               {mode === 'login' && <button type="button" className="text-[10px] text-blue-600 font-black uppercase tracking-widest hover:underline">Reset</button>}
            </div>
            <div className="relative">
              <LogOut className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 rotate-90" size={20} />
              <input 
                type="password" 
                required 
                className="w-full pl-14 pr-6 py-5 rounded-2xl border-none ring-1 ring-slate-100 bg-slate-50/50 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-900" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>{mode === 'login' ? 'Enter Dashboard' : 'Register Account'} <ArrowRight size={18} /></>
            )}
          </button>

          <div className="relative py-4 flex items-center justify-center">
             <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
             </div>
             <span className="relative z-10 px-4 bg-white text-[10px] font-black text-slate-300 uppercase tracking-widest">Or Continue With</span>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border border-slate-100 py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" className="opacity-70 group-hover:opacity-100">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Google Account</span>
          </button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <button 
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
          >
            {mode === 'login' ? 'Don\'t have an account? Sign Up' : 'Already have an account? Login'}
          </button>
        </div>

        {mode === 'login' && (
          <div className="mt-12 pt-8 border-t border-slate-50 text-center">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-6">Quick Access demo accounts</p>
            <div className="grid grid-cols-3 gap-4">
               <button 
                onClick={() => {
                  setEmail('student1@gmail.com');
                  setPassword('password');
                }}
                className="p-4 bg-blue-50 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-all group"
               >
                  <div className="text-[9px] font-black text-blue-600 uppercase mb-1">Student</div>
                  <div className="text-[8px] font-bold text-blue-400 group-hover:text-blue-500 uppercase tracking-tighter">Login</div>
               </button>
               <button 
                onClick={() => {
                  setEmail('teacher1@gmail.com');
                  setPassword('password');
                }}
                className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-all group"
               >
                  <div className="text-[9px] font-black text-indigo-600 uppercase mb-1">Teacher</div>
                  <div className="text-[8px] font-bold text-indigo-400 group-hover:text-indigo-500 uppercase tracking-tighter">Login</div>
               </button>
               <button 
                onClick={() => {
                  setEmail('xoysharif@gmail.com');
                  setPassword('admin123');
                }}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all group"
               >
                  <div className="text-[9px] font-black text-slate-900 uppercase mb-1">Owner Admin</div>
                  <div className="text-[8px] font-bold text-slate-400 group-hover:text-slate-500 uppercase tracking-tighter">Existing</div>
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
