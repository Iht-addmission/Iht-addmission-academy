/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './views/HomeView';
import AdmissionView from './views/AdmissionView';
import CoursesView from './views/CoursesView';
import CourseDetailView from './views/CourseDetailView';
import NoticeView from './views/NoticeView';
import DashboardView from './views/DashboardView';
import QueryView from './views/QueryView';
import SuccessStoriesView from './views/SuccessStoriesView';
import ResourcesView from './views/ResourcesView';
import { InstitutesView } from './views/InstitutesView';
import InstituteDetailView from './views/InstituteDetailView';
import GPACalculator from './views/GPACalculator';
import { CalendarView, ContactView, LoginView } from './views/OtherViews';
import { User, Institute } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { fetchInstitutes } from './api';

import { FirebaseProvider, useAuth } from './components/FirebaseProvider';
import { auth as firebaseAuth } from './lib/firebase';
import { signOut } from 'firebase/auth';

export default function App() {
  return (
    <FirebaseProvider>
      <AppContent />
    </FirebaseProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.removeAttribute('data-theme');
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'navy') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'navy');
    } else if (theme === 'warm') {
      root.setAttribute('data-theme', 'warm');
    }
    
    localStorage.setItem('app-theme', theme);
  }, [theme]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedInstituteId, setSelectedInstituteId] = useState<string | null>(null);
  const [preselectedSearchQuery, setPreselectedSearchQuery] = useState<string>('');
  const [institutes, setInstitutes] = useState<Institute[]>([]);

  useEffect(() => {
    fetchInstitutes().then(setInstitutes).catch(console.error);
  }, []);

  // Set internal page to dashboard if user logs in
  useEffect(() => {
    if (user && (currentPage === 'login')) {
      setCurrentPage('dashboard');
    }
  }, [user]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleNavigate = (page: string, id?: string) => {
    if (page === 'course-detail') {
      setSelectedCourseId(id || null);
    } else if (page === 'institute-detail') {
      setSelectedInstituteId(id || null);
    } else if (page === 'admission') {
      setSelectedCourseId(id || null);
    } else if (page === 'institutes') {
      setPreselectedSearchQuery(id || '');
    } else {
      setSelectedCourseId(null);
      setSelectedInstituteId(null);
      setPreselectedSearchQuery('');
    }
    setCurrentPage(page);
  };

  const handleLogin = (loggedUser: User) => {
    // Note: user state is now managed by FirebaseProvider
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    await signOut(firebaseAuth);
    setCurrentPage('home');
  };

  const selectedInstitute = institutes.find(i => i.id === selectedInstituteId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar user={user} onLogout={handleLogout} onNavigate={handleNavigate} currentTheme={theme} onThemeChange={setTheme} />
      
      <main className="min-h-[calc(100vh-64px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentPage === 'home' && <HomeView onNavigate={handleNavigate} />}
            {currentPage === 'admission' && <AdmissionView user={user} onNavigate={handleNavigate} preselectedCourseId={selectedCourseId || undefined} />}
            {currentPage === 'courses' && <CoursesView onNavigate={handleNavigate} />}
            {currentPage === 'course-detail' && <CourseDetailView onNavigate={handleNavigate} courseId={selectedCourseId || ''} />}
            {currentPage === 'institutes' && <InstitutesView onNavigate={handleNavigate} initialSearchQuery={preselectedSearchQuery} />}
            {currentPage === 'institute-detail' && selectedInstitute && (
              <InstituteDetailView 
                institute={selectedInstitute} 
                onBack={() => handleNavigate('institutes')} 
                onNavigate={handleNavigate}
              />
            )}
            {currentPage === 'gpa' && <GPACalculator />}
            {currentPage === 'notices' && <NoticeView />}
            {currentPage === 'query' && <QueryView />}
            {currentPage === 'resources' && <ResourcesView />}
            {currentPage === 'success-stories' && <SuccessStoriesView />}
            {currentPage === 'calendar' && <CalendarView />}
            {currentPage === 'contact' && <ContactView />}
            {currentPage === 'login' && <LoginView onLogin={handleLogin} />}
            {currentPage === 'dashboard' && user && <DashboardView user={user} onNavigate={handleNavigate} />}
            {currentPage === 'dashboard' && !user && <LoginView onLogin={handleLogin} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onNavigate={handleNavigate} />

      {/* Floating WhatsApp for fast access */}
      <a 
        href="https://wa.me/8801234567890" 
        target="_blank" 
        rel="no-referrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50 animate-bounce"
        style={{ animationDuration: '3s' }}
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
