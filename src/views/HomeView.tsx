/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRight, 
  Star, 
  Users, 
  BookOpen, 
  ShieldCheck, 
  Search, 
  Building2, 
  MapPin,
  TrendingUp,
  Award,
  ChevronRight,
  Calculator,
  Activity,
  Facebook,
  Clock
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (page: string, courseId?: string) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="pt-16 bg-[#f0f7ff]" role="main">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32" aria-labelledby="hero-title">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative z-10"
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-blue-600/10 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-blue-600/20 text-blue-600 mb-8 shadow-sm"
              >
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" aria-hidden="true"></div>
                {t('hero.badge')}
              </motion.div>
              
              <h1 id="hero-title" className="text-6xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase text-slate-900">
                {t('hero.titlePrefix')} <br/>
                <span className="text-blue-600">{t('hero.titleSuffix')}</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-xl font-medium leading-relaxed">
                {t('hero.subtitle')}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-12">
                <div className="bg-white p-2 rounded-[2rem] border flex items-center flex-1 min-w-[300px]">
                  <div className="pl-6 text-slate-400">
                    <Search size={22} />
                  </div>
                  <input 
                    type="text" 
                    placeholder={t('common.searchPlaceholder')}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && onNavigate('institutes', searchQuery)}
                    className="flex-1 bg-transparent px-4 py-4 outline-none font-bold text-slate-900 placeholder:text-slate-300"
                    aria-label="Search for institutes"
                  />
                  <button 
                    onClick={() => onNavigate('institutes', searchQuery)}
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95"
                  >
                    {t('hero.findCampus')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
