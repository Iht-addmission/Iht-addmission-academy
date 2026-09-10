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
import InstitutesView from './views/InstitutesView';
import InstituteDetailView from './views/InstituteDetailView';
import GPACalculator from './views/GPACalculator';
import { CalendarView, ContactView, LoginView } from './views/OtherViews';
import { User, Institute } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(undefined);
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | undefined>(undefined);
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | undefined>(undefined);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleNavigate = (view: string, id?: string) => {
    if (view === 'course-detail') {
      setSelectedCourseId(id);
    } else if (view === 'notice-detail') {
      setSelectedNoticeId(id);
    }
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onNavigate={handleNavigate} />;
      case 'admission':
        return <AdmissionView onNavigate={handleNavigate} />;
      case 'courses':
        return <CoursesView onNavigate={handleNavigate} />;
      case 'course-detail':
        return <CourseDetailView courseId={selectedCourseId} onNavigate={handleNavigate} />;
      case 'notices':
        return <NoticeView onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardView />;
      case 'query':
        return <QueryView />;
      case 'success-stories':
        return <SuccessStoriesView />;
      case 'resources':
        return <ResourcesView onNavigate={handleNavigate} />;
      case 'institutes':
        return <InstitutesView onNavigate={(inst) => { setSelectedInstitute(inst); setCurrentView('institute-detail'); }} />;
      case 'institute-detail':
        return <InstituteDetailView institute={selectedInstitute} onBack={() => setCurrentView('institutes')} />;
      case 'gpa-calculator':
        return <GPACalculator />;
      case 'calendar':
        return <CalendarView />;
      case 'contact':
        return <ContactView />;
      case 'login':
        return <LoginView onLoginSuccess={() => setCurrentView('dashboard')} />;
      default:
        return <HomeView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar currentView={currentView} onNavigate={handleNavigate} />
      <main className="flex-grow">
        {renderView()}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
