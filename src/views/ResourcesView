import React from 'react';
import { motion } from 'motion/react';
import { Facebook, ArrowRight, ShieldCheck, Globe, Users, Award, ExternalLink } from 'lucide-react';

const medicalResources = [
  { id: 1, name: "Bangladesh Medical Technologist OT and IC Association", url: "https://www.facebook.com/share/1B9kfh2ok2/" },
  { id: 2, name: "Dhaka IHT", url: "https://www.facebook.com/share/1L1Xba4bxz/" },
  { id: 3, name: "Diploma Physiotherapy Association of Bangladesh", url: "https://www.facebook.com/share/1BJbrmLTGk/" },
  { id: 4, name: "Bangladesh Physiotherapy Association", url: "https://www.facebook.com/share/18scC1LpMt/" },
  { id: 5, name: "Bangladesh Society of Laboratory Medicine", url: "https://www.facebook.com/share/1EWurjYHiU/" },
  { id: 6, name: "Bangladesh Radiotherapy Technologists Society", url: "https://www.facebook.com/share/1JFpKj4CVR/" },
  { id: 7, name: "Bangladesh Association of Radiology and Imaging Technologist", url: "https://www.facebook.com/share/1LGB5eg5PL/" },
  { id: 8, name: "Bangladesh Medical Technology Association", url: "https://www.facebook.com/share/1G4JEvXurA/" },
  { id: 9, name: "Director General of Medical Education", url: "https://www.facebook.com/share/1B3Li984Xp/" },
];

export default function ResourcesView() {
  return (
    <div className="min-h-screen bg-[#0a0c10] text-white pt-32 pb-24 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Futuristic Header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 backdrop-blur-md"
          >
            <Globe size={16} className="animate-spin-slow" />
            Global Tech Network
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black mb-8 tracking-tighter uppercase leading-[0.9]"
          >
            📚 Important <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Medical Tech</span> Resources
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed"
          >
            Direct access to official organizations and professional associations shaping the landscape of medical technology in Bangladesh.
          </motion.p>
        </div>

        {/* Premium Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {medicalResources.map((resource, i) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -10 }}
              className="group relative h-full"
            >
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative h-full bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-10 flex flex-col items-center text-center transition-all group-hover:border-blue-500/30 group-hover:bg-slate-900/60 shadow-2xl">
                
                {/* Organization Icon/Logo Style */}
                <div className="relative mb-10">
                  <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-600/40 group-hover:rotate-[15deg] transition-transform duration-500">
                     <Users size={32} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-800 border border-white/10 rounded-2xl flex items-center justify-center text-blue-400 shadow-xl">
                    <Facebook size={20} fill="currentColor" />
                  </div>
                </div>

                <div className="mb-8 flex-grow">
                  <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3">Official Facebook Resource</div>
                  <h3 className="text-xl font-black text-white px-2 leading-tight uppercase tracking-tight group-hover:text-blue-400 transition-colors">
                    {resource.name}
                  </h3>
                </div>

                <a 
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-auto bg-white/5 hover:bg-blue-600 text-white font-black py-5 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all border border-white/10 hover:border-blue-500 shadow-xl group/btn active:scale-95"
                >
                  Visit Page <ExternalLink size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Association Verification Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 p-12 lg:p-20 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-white/5 rounded-[4rem] flex flex-col md:flex-row items-center gap-12 backdrop-blur-3xl overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white shrink-0 shadow-2xl shadow-blue-600/20">
            <ShieldCheck size={48} />
          </div>
          
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">Verified Career Guidance</h2>
            <p className="text-slate-400 text-lg font-medium">We ensure all links provided are verified official outlets for their respective medical technology associations. Stay informed and follow official sources only.</p>
          </div>

          <div className="shrink-0 flex gap-4">
             <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <Award className="text-blue-500" />
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
