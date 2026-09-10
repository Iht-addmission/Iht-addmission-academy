/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import {
  Calendar as CalendarIcon,
  Clock,
  Link as LinkIcon,
  Download,
  Play,
  Video,
  FileText,
  User,
  ChevronRight,
  X,
  ExternalLink,
  Activity,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Send,
  Plus,
  Trash2,
  Edit2,
  ShieldCheck,
  Check,
  Search,
  Filter,
  Building2,
  MapPin,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  Users,
  Settings,
  MoreVertical,
  Hand,
  MonitorUp,
  Bell,
  Info,
  Mail,
  Phone,
  Target,
  Loader2,
  LogOut,
} from "lucide-react";
import { User as UserType, Admission, Course, Institute } from "../types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  fetchAdmissions,
  updateAdmissionStatus,
  fetchAdmissionStatus,
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  fetchTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  fetchInstitutes,
  addInstitute,
  updateInstitute,
  deleteInstitute,
  fetchNotices,
  createNotice,
  deleteNotice,
  fetchAbout,
  updateAbout,
  fetchExams,
  createExam,
  submitExamResult,
  fetchExamResults,
  fetchAllExamResults,
  markNotificationAsRead,
  createBroadcastNotification,
  seedDatabase,
  fetchStudents,
  createChat,
  sendChatMessage,
  fetchAllUsers,
  updateUserApproval,
  updateUserRole,
  updateUserProfile,
  fetchAdmins,
  fetchRecordedClasses,
  createRecordedClass,
  deleteRecordedClass,
} from "../lib/firebase";

import { formatPrice, formatDate, formatNumber } from "../lib/i18nUtils";
import { CALENDAR_EVENTS } from "../constants";
import { useAuth } from "../components/FirebaseProvider";
import { LiveClasses } from "../components/LiveClasses";
import { AdminClassManager } from "../components/AdminClassManager";
import PomodoroTimer from "../components/PomodoroTimer";

interface DashboardViewProps {
  user: UserType;
  onNavigate: (page: string) => void;
}

export default function DashboardView({
  user: initialUser,
  onNavigate,
}: DashboardViewProps) {
  const { t, i18n } = useTranslation();
  const { isPaid, isAdmin, user, loading: authLoading } = useAuth();

  const currentUser = user || initialUser;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (user && !user.isApproved && !isAdmin) {
    return (
      <div className="min-h-screen pt-48 pb-24 bg-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-blue-100 border border-slate-100 text-center"
        >
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <ShieldCheck size={48} className="animate-pulse" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">
            Approval Pending
          </h1>
          <p className="text-slate-500 font-medium leading-relaxed mb-10">
            Your account is currently being reviewed by the administration. You
            will have full access to the dashboard once your profile is
            verified.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => {
                import("../lib/firebase").then((m) => m.auth.signOut());
                window.location.reload();
              }}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-600 transition-all flex items-center justify-center gap-3"
            >
              Sign Out <LogOut size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const isStudent = currentUser.role === "student" && !isAdmin;
  const isTeacher = currentUser.role === "teacher";

  const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'exams' | 'resources' | 'admin' | 'settings'>('overview');
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [recordedClasses, setRecordedClasses] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [examResults, setExamResults] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchNotices().then(setNotices).catch(console.error);
    fetchExams().then(setExams).catch(console.error);
    fetchCourses().then(setCourses).catch(console.error);
    fetchTeachers().then(setTeachers).catch(console.error);
    fetchInstitutes().then(setInstitutes).catch(console.error);
    fetchRecordedClasses().then(setRecordedClasses).catch(console.error);

    if (isAdmin) {
      fetchAdmissions().then(setAdmissions).catch(console.error);
      fetchAllExamResults().then(setExamResults).catch(console.error);
      fetchAllUsers().then(setAllUsers).catch(console.error);
    }
  }, [isAdmin]);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top User Greeting Banner */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white mb-10 shadow-xl shadow-slate-900/10 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
              Welcome back, {currentUser?.name || currentUser?.displayName || 'Student'}!
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-xl font-medium">
              Track your classes, exams, and academic progress all in one unified platform.
            </p>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <button 
              onClick={() => {
                import("../lib/firebase").then((m) => m.auth.signOut());
                window.location.reload();
              }}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-red-500/20"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'classes', label: 'Live Classes', icon: Video },
            { id: 'exams', label: 'Exams & Results', icon: Award },
            { id: 'resources', label: 'Resources', icon: FileText },
            { id: 'admin', label: 'Admin Panel', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shrink-0 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Views */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2 text-lg">
                    <Clock className="text-blue-600" size={20} /> Study Focus Timer
                  </h3>
                  <PomodoroTimer />
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="font-extrabold text-slate-900 mb-6 flex items-center gap-2 text-base uppercase tracking-wider">
                    <CalendarIcon className="text-blue-600" size={18} /> Schedule
                  </h3>
                  <div className="space-y-4">
                    {CALENDAR_EVENTS.slice(0, 3).map((ev) => (
                      <div key={ev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{ev.type}</span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">{ev.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">{ev.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'classes' && <LiveClasses />}
          {activeTab === 'admin' && <AdminClassManager />}

          {activeTab !== 'overview' && activeTab !== 'classes' && activeTab !== 'admin' && (
            <div className="bg-white p-12 rounded-3xl text-center border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Module Active</h3>
              <p className="text-slate-400 text-sm">Managing content for the current academic session.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
