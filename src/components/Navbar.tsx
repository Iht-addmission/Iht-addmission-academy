/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, Calendar, Mail, MapPin, Phone, GraduationCap, LayoutDashboard, LogOut, Menu, X, MessageSquare, Building2, Languages, Users, Calculator, ShieldCheck, Sun, Moon, Sparkles, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export default function Navbar({ user, onLogout, onNavigate, currentTheme, onThemeChange }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(nextLang);
  };

  const currentRole = user?.role || 'guest';

  const navItems = [
    { name: t('common.home'), id: 'home', icon: BookOpen },
    { name: t('common.courses'), id: 'courses', icon: GraduationCap },
    { name: t('common.institutes'), id: 'institutes', icon: Building2 },
    { 
      name: t('common.admission'), 
      id: 'admission', 
      icon: LayoutDashboard,
      hideFor: ['teacher', 'admin']
    },
    { 
      name: 'GPA Calc', 
      id: 'gpa', 
      icon: Calculator,
      hideFor: ['teacher', 'admin']
    },
    { name: 'FB Community', id: 'resources', icon: Users },
    { name: t('common.notices'), id: 'notices', icon: MessageSquare },
    { name: t('common.calendar'), id: 'calendar', icon: Calendar },
    { 
      name: 'User Hub', 
      id: 'dashboard', 
      icon: ShieldCheck,
      showFor: ['admin']
    },
  ].filter((item: any) => {
    if (item.hideFor?.includes(currentRole as any)) return false;
    if (item.showFor && !item.showFor.includes(currentRole as any)) return false;
    return true;
  });

  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    closed: { x: -20, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-blue-700 text-white border-b border-blue-600 shadow-xl h-16" role="navigation" aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('home')}
          role="link"
          tabIndex={0}
          aria-label="Go to Home"
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('home')}
        >
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-700 font-bold text-xl group-hover:scale-110 transition-transform">
            <div className="w-6 h-2 bg-blue-700 rounded-full"></div>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight block leading-none">IHT ADDMISSION</span>
            <span className="text-[10px] text-blue-200 font-medium tracking-widest uppercase">Academy</span>
          </div>
        </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8" role="menubar">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="text-sm font-medium text-blue-100 hover:text-white transition-colors opacity-80 hover:opacity-100"
                role="menuitem"
              >
                {item.name}
              </button>
            ))}
            
            <div className="h-6 w-[1px] bg-blue-600 mx-2" aria-hidden="true" />
  
            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 bg-blue-800/50 hover:bg-blue-600 px-3 py-1.5 rounded-lg transition-all border border-blue-500/30 text-xs font-bold uppercase tracking-wider group text-white cursor-pointer"
              aria-label={`Switch to ${i18n.language === 'en' ? 'Bengali' : 'English'}`}
            >
              <Languages size={16} className="text-blue-300 group-hover:text-white transition-colors" />
              <span>{i18n.language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>

            <div className="h-6 w-[1px] bg-blue-600 mx-2" aria-hidden="true" />

            {/* Study Theme Toggle Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="flex items-center gap-2 bg-blue-800/50 hover:bg-blue-600 px-3 py-1.5 rounded-lg transition-all border border-blue-500/30 text-xs font-bold uppercase tracking-wider group text-white cursor-pointer"
                aria-label="Change study theme"
              >
                {currentTheme === 'light' && <Sun size={16} className="text-amber-400 rotate-slow" />}
                {currentTheme === 'dark' && <Moon size={16} className="text-slate-200" />}
                {currentTheme === 'navy' && <Sparkles size={16} className="text-sky-300 animate-pulse" />}
                {currentTheme === 'warm' && <Eye size={16} className="text-orange-300" />}
                <span className="capitalize">{currentTheme === 'light' ? 'Light' : currentTheme === 'dark' ? 'Slate' : currentTheme === 'navy' ? 'Midnight' : 'Warm'}</span>
              </button>
              
              {showThemeMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowThemeMenu(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-2 z-20 text-slate-800 animate-fade-in">
                    <button
                      onClick={() => { onThemeChange('light'); setShowThemeMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors text-left text-slate-700 cursor-pointer"
                    >
                      <Sun size={14} className="text-amber-500" />
                      <span>Light (Official)</span>
                    </button>
                    <button
                      onClick={() => { onThemeChange('dark'); setShowThemeMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors text-left text-slate-700 cursor-pointer"
                    >
                      <Moon size={14} className="text-slate-500" />
                      <span>Slate (Study)</span>
                    </button>
                    <button
                      onClick={() => { onThemeChange('navy'); setShowThemeMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors text-left text-slate-700 cursor-pointer"
                    >
                      <Sparkles size={14} className="text-blue-500" />
                      <span>Midnight (Deep Dark)</span>
                    </button>
                    <button
                      onClick={() => { onThemeChange('warm'); setShowThemeMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors text-left text-slate-700 cursor-pointer"
                    >
                      <Eye size={14} className="text-orange-500" />
                      <span>Warm (Late-Night)</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="h-6 w-[1px] bg-blue-600 mx-2" aria-hidden="true" />

          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2 text-sm font-semibold hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </button>
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 text-sm font-semibold text-orange-200 hover:bg-orange-500/10 px-3 py-1.5 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate('login')}
              className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-black hover:bg-slate-800 shadow-lg shadow-blue-900/40 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
            >
              Portal Access
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 active:scale-90 transition-all" 
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed top-16 left-0 right-0 bottom-0 bg-white md:hidden z-50 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
          >
            <div className="p-6 space-y-4">
              {navItems.map((item) => (
                <motion.button
                  variants={itemVariants}
                  key={item.id}
                  onClick={() => { onNavigate(item.id); setIsOpen(false); }}
                  className="w-full flex items-center gap-4 py-4 px-6 text-slate-700 hover:bg-blue-50 active:bg-blue-100 rounded-2xl transition-all group"
                >
                  <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    <item.icon size={20} />
                  </div>
                  <span className="font-bold text-lg">{item.name}</span>
                </motion.button>
              ))}
              
              <motion.div 
                variants={itemVariants}
                className="pt-6 mt-6 border-t border-slate-100 flex flex-col gap-4"
              >
                {/* Language Switcher Mobile */}
                <button 
                  onClick={toggleLanguage}
                  className="w-full flex items-center justify-between gap-4 py-4 px-6 bg-slate-50 text-slate-700 rounded-2xl font-bold active:scale-95 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                      <Languages size={20} />
                    </div>
                    <span>{t('common.language')}</span>
                  </div>
                  <span className="text-blue-600 font-black uppercase text-xs tracking-widest bg-white px-3 py-1 rounded-lg shadow-sm">
                    {i18n.language === 'en' ? 'বাংলা' : 'English'}
                  </span>
                </button>

                {/* Theme Selector Mobile */}
                <div className="bg-slate-50 p-5 rounded-2xl flex flex-col gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Study Session Theme</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'light', name: 'Light', icon: Sun, color: 'text-amber-500' },
                      { id: 'dark', name: 'Slate', icon: Moon, color: 'text-slate-500' },
                      { id: 'navy', name: 'Midnight', icon: Sparkles, color: 'text-blue-500' },
                      { id: 'warm', name: 'Warm', icon: Eye, color: 'text-orange-500' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => onThemeChange(t.id)}
                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all ${currentTheme === t.id ? 'bg-white shadow-md scale-105 border border-blue-200' : 'bg-transparent border border-transparent'}`}
                      >
                        <t.icon size={18} className={t.color} />
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-600">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {user ? (
                  <>
                    <button 
                      onClick={() => { onNavigate('dashboard'); setIsOpen(false); }}
                      className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-5 rounded-2xl font-bold shadow-xl shadow-blue-900/20 active:scale-95 transition-all"
                    >
                      <LayoutDashboard size={20} />
                      Go to Dashboard
                    </button>
                    <button 
                      onClick={() => { onLogout(); setIsOpen(false); }}
                      className="w-full flex items-center justify-center gap-3 bg-orange-50 text-orange-600 py-5 rounded-2xl font-bold active:scale-95 transition-all"
                    >
                      <LogOut size={20} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => { onNavigate('login'); setIsOpen(false); }}
                    className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-2xl font-black shadow-xl shadow-slate-200 active:scale-95 transition-all uppercase tracking-widest text-xs"
                  >
                    Portal Access
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
