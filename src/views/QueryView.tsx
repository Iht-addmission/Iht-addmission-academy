import { Facebook, ExternalLink, MessageCircle, Users, Bell, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface FBPage {
  name: string;
  description: string;
  url: string;
  followers?: string;
  type: 'group' | 'page';
}

const fbResources: FBPage[] = [
  {
    name: "IHT Dhaka - Official",
    description: "Official Facebook page of Institute of Health Technology, Dhaka. Get official notices and updates.",
    url: "https://www.facebook.com/ihtdhaka.official",
    followers: "50K+",
    type: 'page'
  },
  {
    name: "IHT Admission Help Desk",
    description: "A community group to help aspirants with admission queries, forms, and results.",
    url: "https://www.facebook.com/groups/ihtadmissionhelp",
    followers: "25K+",
    type: 'group'
  },
  {
    name: "Medical Technology Students Association",
    description: "Unified platform for all medical technology students across Bangladesh.",
    url: "https://www.facebook.com/medtech.bd",
    followers: "15K+",
    type: 'page'
  },
  {
    name: "MATS & IHT Students News",
    description: "Latest news regarding MATS and IHT courses, exams, and job circulars.",
    url: "https://www.facebook.com/matsihtnews",
    followers: "80K+",
    type: 'page'
  },
  {
    name: "IHT Dhaka Alumni Association",
    description: "Connect with the seniors and professionals who graduated from IHT Dhaka.",
    url: "https://www.facebook.com/groups/ihtdalumni",
    followers: "10K+",
    type: 'group'
  },
  {
    name: "Health Technology Career Care",
    description: "Guidance for career and job opportunities after completing B.Sc or Diploma in Health Technology.",
    url: "https://www.facebook.com/groups/htcareercare",
    followers: "30K+",
    type: 'group'
  },
  {
    name: "Dhaka University Health Faculty Updates",
    description: "Updates regarding B.Sc courses affiliated with DU Medical Faculty.",
    url: "https://www.facebook.com/duhealthfaculty",
    followers: "12K+",
    type: 'page'
  },
  {
    name: "Physiotherapy Students Forum",
    description: "Exclusive group for Physiotherapy students for academic discussion and case studies.",
    url: "https://www.facebook.com/groups/physioforum",
    followers: "8K+",
    type: 'group'
  },
  {
    name: "Lab Medicine Insights",
    description: "Knowledge sharing for Laboratory Medicine students and professionals.",
    url: "https://www.facebook.com/labmedinsights",
    followers: "20K+",
    type: 'page'
  },
  {
    name: "Radiology & Imaging Hub BD",
    description: "Diagnostic imaging resources and career updates for Radiology enthusiasts.",
    url: "https://www.facebook.com/radiologyhub.bd",
    followers: "18K+",
    type: 'page'
  }
];

export default function QueryView() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <section className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest mb-6"
          >
            <Facebook size={14} />
            Social Resources
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight uppercase"
          >
            Academic <span className="text-blue-600">Query Hub</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed"
          >
             Connect with the community! Find official announcements, admission assistance, 
             and academic discussions through these trusted Facebook groups and pages.
          </motion.p>
        </section>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fbResources.map((resource, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group relative overflow-hidden flex flex-col"
            >
              {/* Highlight Background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative z-10 flex-1">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 ${resource.type === 'page' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'} rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/5`}>
                    {resource.type === 'page' ? <Facebook size={24} /> : <Users size={24} />}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{resource.type}</span>
                    <span className="text-sm font-bold text-slate-900">{resource.followers}</span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                  {resource.name}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8">
                  {resource.description}
                </p>
              </div>

              <div className="relative z-10 pt-6 border-t border-slate-50">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 shadow-xl shadow-slate-900/10 transition-all active:scale-95 group/btn"
                >
                  Visit Resource
                  <ExternalLink size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Support Section */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mt-20 p-12 bg-blue-600 rounded-[3.5rem] text-white overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <MessageCircle size={20} />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-100">Direct Support</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-6 uppercase tracking-tight">Need specific answers?</h2>
              <p className="text-blue-100 font-medium leading-relaxed">
                If you can't find what you're looking for in these groups, our faculty members are available for 
                direct consultation through the Academic Portal messaging system.
              </p>
            </div>
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600">
                  <Bell size={24} />
                </div>
                <div>
                  <div className="font-black text-sm uppercase tracking-wider">Fast Updates</div>
                  <p className="text-xs text-blue-100 font-medium">Daily news & official circular alerts</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600">
                  <Info size={24} />
                </div>
                <div>
                  <div className="font-black text-sm uppercase tracking-wider">Reliable Info</div>
                  <p className="text-xs text-blue-100 font-medium">Verified sources and expert guidance</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
