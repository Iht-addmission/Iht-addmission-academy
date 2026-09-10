/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Bell, Megaphone, Info } from 'lucide-react';

import { Notice } from '../types';
import { formatDate } from '../lib/i18nUtils';

export default function NoticeView() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices().then(setNotices).finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Megaphone size={32} />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Notice Board</h1>
        <p className="text-slate-500 italic">Stay updated with the latest sessions, announcements, and news from IHT ADDMISSION ACADEMY.</p>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : notices.length > 0 ? (
          notices.map((notice, i) => (
            <motion.div 
              key={notice.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 -rotate-45 transform translate-x-16 -translate-y-16 rounded-full" />
              
              <div className="flex items-start gap-4 h-full relative z-10">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Bell size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[10px] text-blue-500 font-bold uppercase tracking-widest mb-2">
                    <CalendarIcon size={12} />
                    {formatDate(notice.date, 'MMMM d, yyyy')}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{notice.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{notice.content}</p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <Info size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-400 font-medium italic">No active notices at this moment.</p>
          </div>
        )}
      </div>

      <div className="mt-12 p-6 bg-slate-900 text-slate-400 rounded-2xl text-xs flex items-center gap-4">
        <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center shrink-0">!</div>
        <p>This notice board is updated real-time by the academy administration. Please check back regularly for changes in exam schedules or admission deadlines.</p>
      </div>
    </div>
  );
}
