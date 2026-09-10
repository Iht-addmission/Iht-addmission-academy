/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Youtube,
  MessageCircle,
  Users,
  Twitter, 
  Instagram, 
  Linkedin,
  ShieldCheck,
  ChevronRight,
  GraduationCap,
  Target
} from 'lucide-react';


interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [aboutData, setAboutData] = useState<any>(null);

  useEffect(() => {
    fetchAbout().then(setAboutData).catch(console.error);
  }, []);

  return (
    <footer className="bg-slate-950 text-white pt-24 pb-12 overflow-hidden relative">
      {/* Decorative Gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Column */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/30 group-hover:scale-110 transition-transform duration-500">
                <HeartPulse size={28} className="text-white" />
              </div>
              <div>
                <div className="text-xl font-black uppercase tracking-tighter leading-none italic">IHT ADDMISSION ACADEMY</div>
                <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mt-1">Directory Portal</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              The central knowledge platform for Institute of Health Technology (IHT) across Bangladesh. Empowering students with accurate data and modern technical curriculum.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { Icon: Facebook, color: 'hover:bg-[#1877F2]', name: 'Facebook Page', url: 'https://www.facebook.com/ihtdhaka.official' },
                { Icon: Users, color: 'hover:bg-[#0866FF]', name: 'Facebook Group', url: 'https://www.facebook.com/groups/ihtadmissionhelp' },
                { Icon: Youtube, color: 'hover:bg-[#FF0000]', name: 'YouTube Channel', url: '#' },
                { Icon: MessageCircle, color: 'hover:bg-[#25D366]', name: 'WhatsApp', url: 'https://wa.me/8801819248542' },
                { Icon: Instagram, color: 'hover:bg-[#E4405F]', name: 'Instagram', url: '#' },
                { Icon: Linkedin, color: 'hover:bg-[#0A66C2]', name: 'LinkedIn', url: '#' }
              ].map((item, i) => (
                <a 
                  key={i} 
                  href={item.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                  className={`w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-400 hover:text-white ${item.color} transition-all duration-300 border border-white/5 hover:scale-110 hover:-translate-y-1 shadow-lg shadow-black/20`}
                >
                  <item.Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Directory Links */}
          <div>
            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-8">Navigation</h4>
            <ul className="space-y-4">
              {[
                { label: 'Institute Directory', id: 'institutes' },
                { label: 'Available Departments', id: 'courses' },
                { label: 'GPA Calculator', id: 'gpa' },
                { label: 'Academic Resources', id: 'query' },
                { label: 'FB Community Hub', id: 'resources' },
                { label: 'Academic Calendar', id: 'calendar' },
                { label: 'Official Notices', id: 'notices' },
                { label: 'Admission Portal', id: 'admission' }
              ].map(link => (
                <li key={link.id}>
                  <button 
                    onClick={() => onNavigate(link.id)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group text-sm font-bold"
                  >
                    <ChevronRight size={14} className="text-blue-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Info */}
          <div>
            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-8">Campus Stats</h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="text-2xl font-black text-white italic">24</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Government <br/> Institutes</div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl font-black text-blue-400 italic">3,500+</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Total <br/> Annual Seats</div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl font-black text-emerald-400 italic">450+</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Faculty <br/> Members</div>
              </div>
            </div>
          </div>

          {/* Contact Column */}
          <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
            <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-6">Contact Helpline</h4>
            <div className="space-y-6">
              <div className="flex gap-3 text-sm">
                <MapPin size={18} className="text-blue-500 shrink-0" />
                <a 
                  href="https://maps.app.goo.gl/A6Q67qDwkN9u3CGe7" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-400 font-medium leading-relaxed hover:text-blue-400 transition-colors"
                  style={{ fontFamily: 'system-ui' }}
                >
                  IHT DHAKA,MOHAKHALI, DHAKA-1212 BANGLADESH
                </a>
              </div>
              <div className="flex gap-3 text-sm">
                <Phone size={18} className="text-blue-500 shrink-0" />
                <span className="text-slate-300 font-black">01819248542</span>
              </div>
              <div className="flex gap-3 text-sm">
                <Mail size={18} className="text-blue-500 shrink-0" />
                <span className="text-slate-300 font-bold">xoysharif@gmail.com</span>
              </div>
              <div className="pt-4 flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                <ShieldCheck size={14} /> DGHS Authorized Portal
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar / Leadership Info */}
        <div className="pt-12 border-t border-white/5 flex flex-col items-center gap-10">
          
          {aboutData && (
            <div className="w-full bg-white/5 border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 max-w-4xl">
               <div className="relative shrink-0">
                  <img src={aboutData.photoUrl} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/50" />
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 p-1 rounded-lg">
                    <HeartPulse size={12} />
                  </div>
               </div>
               <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                    <h5 className="text-sm font-black uppercase tracking-tight">{aboutData.ownerName}</h5>
                    <span className="hidden md:block text-slate-700">•</span>
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{aboutData.qualification}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic max-w-2xl mx-auto md:mx-0">
                    "{aboutData.bio}"
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-6">
                    <a href={`tel:${aboutData.phone}`} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-white transition-colors">
                      <Phone size={12} className="text-blue-500" /> {aboutData.phone}
                    </a>
                    <a href={`mailto:${aboutData.email}`} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-white transition-colors">
                      <Mail size={12} className="text-blue-500" /> {aboutData.email}
                    </a>
                  </div>
               </div>
            </div>
          )}

          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                © {currentYear} IHT ADDMISSION ACADEMY. <br className="md:hidden" /> Developed for Medical Technology Students.
              </p>
              <div className="mt-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">
                Created & Developed by MD SHARIF ISLAM JOY
              </div>
            </div>
            <div className="flex gap-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
               <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
               <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
