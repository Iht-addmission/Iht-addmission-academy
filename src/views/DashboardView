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
} from "../api";
import { formatPrice, formatDate, formatNumber } from "../lib/i18nUtils";
import { CALENDAR_EVENTS } from "../constants";
import { useAuth } from "../components/FirebaseProvider";
import { LiveClasses } from "../components/LiveClasses";
import { AdminClassManager } from "../components/AdminClassManager";
import PomodoroTimer from "../components/PomodoroTimer";

const chartData = [
  { name: "Jan", students: 400 },
  { name: "Feb", students: 520 },
  { name: "Mar", students: 680 },
  { name: "Apr", students: 950 },
  { name: "May", students: 1240 },
];

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

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
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-left">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Status
              </div>
              <div className="text-sm font-bold text-blue-600 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                Verification in Progress
              </div>
            </div>
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
  // isAdmin is provided by useAuth()

  // Helper for dynamic fields
  const t_lang = (en: string | undefined, bn?: string) => {
    if (i18n.language === "bn") return bn || en || "";
    return en || "";
  };

  const [selectedPdf, setSelectedPdf] = useState<{
    title: string;
    url: string;
  } | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [admins, setAdmins] = useState<UserType[]>([]);
  const [aboutData, setAboutData] = useState<any>(null);
  const [loadingAdmissions, setLoadingAdmissions] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [admissionStatus, setAdmissionStatus] = useState<Admission | null>(
    null,
  );
  const [checkingAdmission, setCheckingAdmission] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Admin states
  const [adminTab, setAdminTab] = useState<
    | "overview"
    | "academic-hall"
    | "applications"
    | "users"
    | "courses"
    | "teachers"
    | "institutes"
    | "assessments"
    | "notices"
    | "about"
    | "calendar"
    | "chat"
  >("overview");
  const [teacherTab, setTeacherTab] = useState<
    "notes" | "videos" | "classes" | "chat"
  >("notes");
  const [studentTab, setStudentTab] = useState<
    "learning" | "join" | "exams" | "chat" | "vault" | "profile"
  >("learning");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    displayName: currentUser.displayName || currentUser.name || "",
    phone: currentUser.phone || "",
    address: currentUser.address || "",
    department: currentUser.department || "",
    batch: currentUser.batch || "",
    studentId: currentUser.studentId || "",
    photo: null as File | null,
    idPhoto: null as File | null,
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(
    null,
  );
  const [editingTeacher, setEditingTeacher] = useState<any | null>(null);
  const [editingInstitute, setEditingInstitute] =
    useState<Partial<Institute> | null>(null);
  const [editingNotice, setEditingNotice] = useState<any | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showInstituteModal, setShowInstituteModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [expandedAdmission, setExpandedAdmission] = useState<string | null>(
    null,
  );
  const [activeLiveSession, setActiveLiveSession] = useState<{
    id: string;
    title: string;
    instructor: string;
  } | null>(null);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [liveChat, setLiveChat] = useState<
    { id: string; user: string; text: string; time: string }[]
  >([]);
  const [liveParticipants, setLiveParticipants] = useState([
    { id: "1", name: "Dr. Aris Thorne", role: "Instructor", isMe: false },
    { id: "2", name: "Me", role: "Student", isMe: true },
    { id: "3", name: "Fatima Ahmed", role: "Student", isMe: false },
    { id: "4", name: "Tanvir Hossain", role: "Student", isMe: false },
  ]);
  const [liveRoomTab, setLiveRoomTab] = useState<"chat" | "participants">(
    "chat",
  );
  const [notes, setNotes] = useState([
    {
      id: "1",
      title: "DMT_Lec_04_Heart.pdf",
      size: "2.4 MB",
      url: "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf",
      date: "May 04, 2026",
    },
    {
      id: "2",
      title: "ICU_Basics_Module.pdf",
      size: "5.8 MB",
      url: "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf",
      date: "May 02, 2026",
    },
    {
      id: "3",
      title: "LabMatrix_Manual.pdf",
      size: "1.2 MB",
      url: "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf",
      date: "May 01, 2026",
    },
  ]);
  const [recordedClasses, setRecordedClasses] = useState<any[]>([]);
  const [showNoteUploadModal, setShowNoteUploadModal] = useState(false);
  const [showVideoUploadModal, setShowVideoUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    file: null as File | null,
  });
  const [newVideo, setNewVideo] = useState({ title: "", course: "", url: "" });
  const [recordedSearch, setRecordedSearch] = useState("");
  const [recordedFilter, setRecordedFilter] = useState("All");
  const [exams, setExams] = useState<any[]>([]);
  const [examResults, setExamResults] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const [activeExam, setActiveExam] = useState<any | null>(null);
  const [examAnswers, setExamAnswers] = useState<number[]>([]);
  const [examTimeLeft, setExamTimeLeft] = useState(0);
  const [showExamModal, setShowExamModal] = useState(false);
  const [newExam, setNewExam] = useState<any>({
    title: "",
    courseId: "",
    durationMinutes: 30,
    questions: [],
  });
  const [examTab, setExamTab] = useState<"available" | "results">("available");
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        displayName: currentUser.displayName || currentUser.name || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        department: currentUser.department || "",
        batch: currentUser.batch || "",
        studentId: currentUser.studentId || "",
        photo: null,
        idPhoto: null,
      });
    }
  }, [currentUser]);

  // Chat states
  const [allStudents, setAllStudents] = useState<UserType[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [chatSearch, setChatSearch] = useState("");
  const [userFilterSearch, setUserFilterSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    loadNotices();
    loadAbout();
    loadExams();
    loadTeachers();
    loadInstitutes();
    loadCourses();
    loadRecordedClasses();

    if (isAdmin) {
      loadAdmissions();
      loadAllExamResults();
      loadAllUsers();
    }
    if (isStudent) {
      checkAdmission();
      loadStudentResults();
      loadAdmins();
    }
    if (isTeacher) {
      loadAllExamResults();
      fetchStudents().then(setAllStudents);
      loadAdmins();
    }
  }, [isAdmin, isStudent, isTeacher]);

  useEffect(() => {
    if (!currentUser.id) return;

    // Real-time listener for user's chats
    const chatsQuery = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUser.id),
      orderBy("updatedAt", "desc"),
    );

    const unsubscribeChats = onSnapshot(
      chatsQuery,
      (snapshot) => {
        setChats(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      },
      (err) => console.error("Chats listener error:", err),
    );

    return () => unsubscribeChats();
  }, [currentUser.id]);

  useEffect(() => {
    if (!selectedChat) {
      setChatMessages([]);
      return;
    }

    // Real-time listener for current chat messages
    const messagesQuery = query(
      collection(db, "chats", selectedChat.id, "messages"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribeMessages = onSnapshot(
      messagesQuery,
      (snapshot) => {
        setChatMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt:
              doc.data().createdAt instanceof Timestamp
                ? doc.data().createdAt.toDate().toISOString()
                : new Date().toISOString(),
          })),
        );
        setTimeout(
          () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }),
          100,
        );
      },
      (err) => console.error("Messages listener error:", err),
    );

    return () => unsubscribeMessages();
  }, [selectedChat]);

  useEffect(() => {
    if (!currentUser.id) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", currentUser.id),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt:
            doc.data().createdAt instanceof Timestamp
              ? doc.data().createdAt.toDate().toISOString()
              : new Date().toISOString(),
        }));
        setNotifications(data);
      },
      (error) => {
        console.error("Notification listener error:", error);
      },
    );

    return () => unsubscribe();
  }, [currentUser.id]);

  useEffect(() => {
    if (currentUser) {
      loadExams();
      if (isStudent) {
        loadStudentResults();
      } else if (isAdmin || isTeacher) {
        loadAllExamResults();
      }
    }
  }, [currentUser, isStudent, isAdmin, isTeacher]);

  const loadExams = async () => {
    try {
      const data = await fetchExams();
      setExams(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRecordedClasses = async () => {
    try {
      const data = await fetchRecordedClasses();
      setRecordedClasses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadStudentResults = async () => {
    try {
      const data = await fetchExamResults(user.email);
      setExamResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAllExamResults = async () => {
    try {
      const data = await fetchAllExamResults();
      setExamResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  const startExam = (exam: any) => {
    setActiveExam(exam);
    setExamAnswers(new Array(exam.questions.length).fill(-1));
    setExamTimeLeft(exam.durationMinutes * 60);
  };

  useEffect(() => {
    if (activeExam && examTimeLeft > 0) {
      const timer = setInterval(() => {
        setExamTimeLeft((prev) => {
          if (prev <= 1) {
            submitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeExam, examTimeLeft]);

  const submitExam = async () => {
    if (!activeExam) return;

    let score = 0;
    activeExam.questions.forEach((q: any, i: number) => {
      if (examAnswers[i] === q.correctOptionIndex) {
        score += activeExam.totalMarks / activeExam.questions.length;
      }
    });

    const result = {
      examId: activeExam.id,
      examTitle: activeExam.title,
      userEmail: user.email,
      userName: user.name || user.email.split("@")[0],
      score: Math.round(score),
      totalMarks: activeExam.totalMarks,
    };

    try {
      await submitExamResult(result);
      alert(`Exam Submitted! Your score: ${result.score}/${result.totalMarks}`);
      setActiveExam(null);
      loadStudentResults();
    } catch (err) {
      alert("Failed to submit exam");
    }
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const examData = {
        ...newExam,
        totalMarks: newExam.questions.length * 10,
        status: "active",
      };
      await createExam(examData);
      loadExams();
      setShowExamModal(false);
      setNewExam({
        title: "",
        courseId: "",
        durationMinutes: 30,
        questions: [],
      });
    } catch (err) {
      alert("Failed to create exam");
    }
  };

  const addQuestion = () => {
    const q = {
      id: Date.now().toString(),
      text: "",
      options: ["", "", "", ""],
      correctOptionIndex: 0,
    };
    setNewExam({ ...newExam, questions: [...newExam.questions, q] });
  };

  const loadNotices = async () => {
    try {
      const data = await fetchNotices();
      setNotices(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAbout = async () => {
    try {
      const data = await fetchAbout();
      setAboutData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAbout(aboutData);
      alert("Profile updated successfully");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice) return;
    try {
      await createNotice(editingNotice);
      loadNotices();
      setShowNoticeModal(false);
      setEditingNotice(null);
    } catch (err) {
      alert("Failed to post notice");
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (!confirm("Remove this notice?")) return;
    try {
      await deleteNotice(id);
      loadNotices();
    } catch (err) {
      alert("Failed to delete notice");
    }
  };

  const loadInstitutes = async () => {
    try {
      const data = await fetchInstitutes();
      setInstitutes(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveInstitute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInstitute) return;
    try {
      if (editingInstitute.id) {
        await updateInstitute(editingInstitute.id, editingInstitute);
      } else {
        await addInstitute(editingInstitute);
      }
      loadInstitutes();
      setShowInstituteModal(false);
      setEditingInstitute(null);
    } catch (err) {
      alert("Failed to save institute");
    }
  };

  const handleDeleteInstitute = async (id: string) => {
    if (!confirm("Are you sure you want to delete this institute?")) return;
    try {
      await deleteInstitute(id);
      loadInstitutes();
    } catch (err) {
      alert("Failed to delete institute");
    }
  };

  const loadCourses = async () => {
    try {
      const data = await fetchCourses();
      setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadTeachers = async () => {
    try {
      const data = await fetchTeachers();
      setTeachers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const checkAdmission = async () => {
    setCheckingAdmission(true);
    try {
      const status = await fetchAdmissionStatus(user.email);
      setAdmissionStatus(status);
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingAdmission(false);
    }
  };

  const handleStartChat = async (user: any) => {
    try {
      const chat = await createChat(
        currentUser.id,
        user.id || user.uid,
        user.name || user.displayName || user.email,
        currentUser.name || currentUser.displayName || currentUser.email,
      );
      setSelectedChat(chat);
      if (isStudent) setStudentTab("chat");
      else if (isTeacher) setTeacherTab("chat");
      else if (isAdmin) setAdminTab("chat");
    } catch (err) {
      console.error("Failed to start chat:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || isSendingMessage) return;

    setIsSendingMessage(true);
    try {
      await sendChatMessage(selectedChat.id, currentUser.id, newMessage.trim());
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const loadAdmissions = async () => {
    setLoadingAdmissions(true);
    try {
      const data = await fetchAdmissions();
      setAdmissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAdmissions(false);
    }
  };

  const loadAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await fetchAllUsers();
      setAllUsers(data);
      setAdmins(data.filter((u) => u.role === "admin"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadAdmins = async () => {
    try {
      const data = await fetchAdmins();
      setAdmins(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateUserApproval = async (
    userId: string,
    isApproved: boolean,
  ) => {
    try {
      await updateUserApproval(userId, isApproved);
      setAllUsers(
        allUsers.map((u) => (u.uid === userId || u.id === userId ? { ...u, isApproved } : u)),
      );
    } catch (err) {
      alert("Failed to update approval status.");
    }
  };

  const handleUpdateUserRole = async (
    userId: string,
    role: "student" | "teacher" | "admin",
  ) => {
    try {
      await updateUserRole(userId, role);
      setAllUsers(
        allUsers.map((u) => (u.uid === userId || u.id === userId ? { ...u, role } : u)),
      );
      alert(`User role updated to ${role} successfully.`);
    } catch (err) {
      alert("Failed to update user role.");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser.id || isSavingProfile) return;

    setIsSavingProfile(true);
    try {
      await updateUserProfile(currentUser.id, profileForm);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleStatusUpdate = async (
    id: string,
    status: "approved" | "rejected",
  ) => {
    setVerifyingId(id);
    try {
      await updateAdmissionStatus(id, status);

      // If approved, also update the user's isPaid status in Firestore if we can find them
      if (status === "approved") {
        const admission = admissions.find((a) => a.id === id);
        if (admission && admission.userEmail) {
          // This is a bit of a hack since we don't have the UID here directly,
          // but we can try to find the user document by email if we had a collection for it.
          // In this app, we typically use the UID as the document ID.
          // For the demo, the student can use the "Direct Override" button.
        }
      }

      setAdmissions(
        admissions.map((a) => (a.id === id ? { ...a, status } : a)),
      );
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setVerifyingId(null);
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    try {
      if (editingCourse.id) {
        await updateCourse(editingCourse.id, editingCourse);
      } else {
        await createCourse(editingCourse);
      }
      loadCourses();
      setShowCourseModal(false);
      setEditingCourse(null);
    } catch (err) {
      alert("Failed to save course");
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteCourse(id);
      loadCourses();
    } catch (err) {
      alert("Failed to delete course");
    }
  };

  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;
    try {
      if (editingTeacher.id) {
        await updateTeacher(editingTeacher.id, editingTeacher);
      } else {
        await createTeacher(editingTeacher);
      }
      loadTeachers();
      setShowTeacherModal(false);
      setEditingTeacher(null);
    } catch (err) {
      alert("Failed to save teacher profile");
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    if (!confirm("Are you sure you want to remove this teacher?")) return;
    try {
      await deleteTeacher(id);
      loadTeachers();
    } catch (err) {
      alert("Failed to delete teacher");
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, selectedChat]);

  const handleSeedDatabase = async () => {
    setSeeding(true);
    setSeedSuccess(false);
    try {
      await seedDatabase();
      // Refresh local states
      loadAdmissions();
      loadNotices();
      loadCourses();
      loadInstitutes();
      loadTeachers();
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 5000);
    } catch (err) {
      console.error("Seeding error:", err);
    } finally {
      setSeeding(false);
    }
  };

  const handleUploadNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title) return;

    setIsUploading(true);
    // Simulate upload delay
    await new Promise((r) => setTimeout(r, 1500));

    const note = {
      id: Date.now().toString(),
      title: newNote.title.endsWith(".pdf")
        ? newNote.title
        : `${newNote.title}.pdf`,
      size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      url: "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf", // Using same demo PDF
      date: formatDate(new Date(), 'MMM dd, yyyy'),
    };

    setNotes([note, ...notes]);

    try {
      await createBroadcastNotification(
        `New Resource: ${note.title}`,
        `A new academic PDF document has been uploaded to the repository.`,
        "resource",
      );
    } catch (e) {
      console.error("Failed to broadcast note notification:", e);
    }

    setShowNoteUploadModal(false);
    setNewNote({ title: "", file: null });
    setIsUploading(false);
  };

  const handleDeleteNote = (id: string) => {
    if (!confirm("Permanently remove this academic resource?")) return;
    setNotes(notes.filter((n) => n.id !== id));
  };

  const handleUploadVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.course) return;

    setIsUploading(true);
    try {
      const videoData = {
        title: newVideo.title,
        course: newVideo.course,
        url: newVideo.url || "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
        instructor: user.name || "Staff",
        duration: "00:00",
      };

      await createRecordedClass(videoData);
      await loadRecordedClasses();
      setShowVideoUploadModal(false);
      setNewVideo({ title: "", course: "", url: "" });
    } catch (err) {
      alert("Failed to upload video");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm("Permanently delete this recording?")) return;
    try {
      await deleteRecordedClass(id);
      await loadRecordedClasses();
    } catch (err) {
      alert("Failed to delete video");
    }
  };

  const filteredVideos = recordedClasses.filter((v) => {
    const matchesSearch = v.title
      .toLowerCase()
      .includes(recordedSearch.toLowerCase());
    const matchesFilter =
      recordedFilter === "All" || v.course === recordedFilter;
    return matchesSearch && matchesFilter;
  });

  const availableCourses = [
    "All",
    ...Array.from(new Set(recordedClasses.map((v) => v.course))),
  ];

  // Example PDFs with demo URLs
  const lectureNotes = [
    {
      title: "DMT_Lec_04_Heart.pdf",
      size: "2.4 MB",
      url: "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf",
    },
    {
      title: "ICU_Basics_Module.pdf",
      size: "5.8 MB",
      url: "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf",
    },
    {
      title: "LabMatrix_Manual.pdf",
      size: "1.2 MB",
      url: "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf",
    },
  ];

  if (isStudent && checkingAdmission) {
    return (
      <div className="pt-48 pb-24 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
          Verifying enrollment credentials...
        </p>
      </div>
    );
  }

  if (
    isStudent &&
    (!admissionStatus ||
      admissionStatus.status === "pending" ||
      admissionStatus.status === "rejected")
  ) {
    return (
      <div className="pt-32 pb-24 max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl shadow-blue-100 border border-slate-100 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner ${admissionStatus?.status === "rejected" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600 animate-pulse"}`}
          >
            {admissionStatus?.status === "rejected" ? (
              <X size={48} strokeWidth={3} />
            ) : (
              <Activity size={48} strokeWidth={3} />
            )}
          </div>

          <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
            {admissionStatus?.status === "rejected"
              ? "Application Rejected"
              : admissionStatus
                ? "Payment Under Review"
                : "Admission Required"}
          </h1>

          <div
            className={`p-6 rounded-2xl mb-8 border border-dashed ${admissionStatus?.status === "rejected" ? "bg-red-50/50 border-red-200" : "bg-blue-50/30 border-blue-100"}`}
          >
            <p
              className={`text-sm font-bold ${admissionStatus?.status === "rejected" ? "text-red-700" : "text-blue-700"}`}
            >
              {!admissionStatus
                ? "You have not submitted your admission application yet. Access to the academy is restricted to enrolled students."
                : admissionStatus?.status === "rejected"
                  ? "Revision Required: Your payment details could not be verified. Please contact support or resubmit."
                  : "Status: Awaiting manual verification by Academic Admin."}
            </p>
          </div>

          {!admissionStatus ? (
            <button
              onClick={() => onNavigate("admission")}
              className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 mb-6"
            >
              Complete Admission Now
            </button>
          ) : (
            <div className="bg-slate-50 p-6 rounded-3xl text-left space-y-4 mb-10 border border-slate-100">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-blue-600 shrink-0 font-black text-xs">
                  01
                </div>
                <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                  Verify your Transaction ID:{" "}
                  <span className="font-black text-slate-900 font-mono tracking-tighter">
                    {admissionStatus?.transactionId || "---"}
                  </span>
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-blue-600 shrink-0 font-black text-xs">
                  02
                </div>
                <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                  Manual audit takes between{" "}
                  <span className="font-black text-slate-900 underline decoration-blue-500 decoration-2 underline-offset-4">
                    6 - 12 hours
                  </span>
                  .
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-blue-600 shrink-0 font-black text-xs">
                  03
                </div>
                <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                  Once approved, you will have instant access to Live Classes &
                  Notes.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            {admissionStatus && (
              <button
                onClick={checkAdmission}
                disabled={checkingAdmission}
                className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 disabled:opacity-50"
              >
                {checkingAdmission ? "Checking..." : "Check Status Again"}
              </button>
            )}
            <a
              href="https://wa.me/8801234567890"
              target="_blank"
              rel="no-referrer"
              className="flex-1 bg-green-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
            >
              Direct Support Help
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4">
      <AnimatePresence>
        {/* Live Room Overlay */}
        {activeLiveSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-slate-900 flex flex-col"
          >
            {/* Header */}
            <div className="h-16 border-b border-white/10 bg-black/40 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <Activity size={18} />
                </div>
                <div className="hidden sm:block">
                  <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">
                    Live Academic Session
                  </div>
                  <h2 className="text-sm font-bold text-white leading-none truncate max-w-xs">
                    {activeLiveSession.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                    Live
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-white/10 mx-2" />
                <button
                  onClick={() => setActiveLiveSession(null)}
                  className="bg-white/10 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                >
                  {isTeacher ? "End Session" : "Leave Room"} <X size={16} />
                </button>
              </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex overflow-hidden">
              {/* Video Stage */}
              <div className="flex-1 flex flex-col p-4 gap-4 relative">
                {/* Main Speaker */}
                <div className="flex-1 bg-slate-800 rounded-3xl overflow-hidden relative shadow-2xl border border-white/5">
                  <img
                    src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1200"
                    className="w-full h-full object-cover opacity-60"
                    alt="Instructor Stream"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                    {isCamOn ? (
                      <div className="w-32 h-32 rounded-full bg-blue-600/20 flex items-center justify-center animate-pulse border-4 border-blue-500/30">
                        <Video size={48} className="text-blue-400" />
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center border-4 border-slate-600">
                        <VideoOff size={48} className="text-slate-500" />
                      </div>
                    )}
                    <h3 className="mt-8 text-2xl font-black text-white">
                      {activeLiveSession.instructor}
                    </h3>
                    <p className="text-blue-400 font-bold uppercase tracking-widest text-xs mt-2">
                      Active Speaker
                    </p>
                  </div>
                  <div className="absolute bottom-6 left-6 flex items-center gap-3">
                    <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2">
                      <Mic size={14} className="text-blue-400" /> Instructor Mic
                      Active
                    </div>
                  </div>
                </div>

                {/* Controls Float */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex items-center gap-2 shadow-2xl">
                  <button
                    onClick={() => setIsMicOn(!isMicOn)}
                    className={`p-4 rounded-xl transition-all ${isMicOn ? "bg-white/10 text-white hover:bg-white/20" : "bg-red-500 text-white shadow-lg shadow-red-500/20"}`}
                  >
                    {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
                  </button>
                  <button
                    onClick={() => setIsCamOn(!isCamOn)}
                    className={`p-4 rounded-xl transition-all ${isCamOn ? "bg-white/10 text-white hover:bg-white/20" : "bg-red-500 text-white shadow-lg shadow-red-500/20"}`}
                  >
                    {isCamOn ? <Video size={20} /> : <VideoOff size={20} />}
                  </button>
                  <div className="w-px h-8 bg-white/10 mx-2" />
                  <button className="p-4 bg-white/10 text-white hover:bg-white/20 rounded-xl transition-all">
                    <MonitorUp size={20} />
                  </button>
                  <button className="p-4 bg-white/10 text-white hover:bg-white/20 rounded-xl transition-all">
                    <Hand size={20} />
                  </button>
                  <button className="p-4 bg-white/10 text-white hover:bg-white/20 rounded-xl transition-all">
                    <Settings size={20} />
                  </button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="w-80 border-l border-white/10 bg-black/20 backdrop-blur-sm flex flex-col sr-only sm:not-sr-only">
                <div className="p-6 flex-1 flex flex-col overflow-hidden">
                  <div className="flex bg-white/5 p-1 rounded-xl mb-6 shrink-0">
                    <button
                      onClick={() => setLiveRoomTab("chat")}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${liveRoomTab === "chat" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}
                    >
                      Chat
                    </button>
                    <button
                      onClick={() => setLiveRoomTab("participants")}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${liveRoomTab === "participants" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}
                    >
                      Participants ({liveParticipants.length})
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar-dark pr-2">
                    {liveRoomTab === "chat" ? (
                      <div className="space-y-6">
                        {[
                          {
                            user: "Fatima",
                            text: "Dr. Thorne, could you repeat the part about cardiac cycles?",
                            time: "12:04",
                          },
                          {
                            user: "Tanvir",
                            text: "I have the same question.",
                            time: "12:05",
                          },
                          {
                            user: "Me",
                            text: "I believe it matches the slide from last week.",
                            time: "12:06",
                            isMe: true,
                          },
                        ].map((m, i) => (
                          <div
                            key={i}
                            className={`flex flex-col ${m.isMe ? "items-end" : "items-start"}`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                                {m.user}
                              </span>
                              <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">
                                {m.time}
                              </span>
                            </div>
                            <div
                              className={`p-3 rounded-2xl text-xs leading-relaxed ${m.isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-white/5 text-white/80 rounded-tl-none border border-white/5"}`}
                            >
                              {m.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {liveParticipants.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                                {p.name[0]}
                              </div>
                              <div>
                                <div className="text-[11px] font-bold text-white flex items-center gap-2">
                                  {p.name}{" "}
                                  {p.isMe && (
                                    <span className="text-[8px] bg-white/10 px-1 rounded uppercase tracking-tighter text-white/40">
                                      Me
                                    </span>
                                  )}
                                </div>
                                <div className="text-[9px] font-black text-white/30 uppercase tracking-widest">
                                  {p.role}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Mic size={12} className="text-white/20" />
                              <Video size={12} className="text-white/20" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-auto p-4 border-t border-white/10">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Message academic group..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-xs placeholder:text-white/20 focus:ring-1 ring-blue-500/50 outline-none"
                    />
                    <button className="absolute right-2 top-1.5 p-1.5 text-blue-400 hover:text-blue-300">
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Video Upload Modal */}
        {showVideoUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">
                  Publish Lecture Recording
                </h3>
                <button
                  onClick={() => setShowVideoUploadModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleUploadVideo} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                    Lecture Title
                  </label>
                  <input
                    required
                    placeholder="e.g. Intro to Cytology"
                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                    value={newVideo.title}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                    Course / Department
                  </label>
                  <input
                    required
                    placeholder="e.g. DMT"
                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                    value={newVideo.course}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, course: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                    Streaming URL (Optional)
                  </label>
                  <input
                    placeholder="https://..."
                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                    value={newVideo.url}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, url: e.target.value })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
                >
                  Deploy Video Asset
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Note Upload Modal */}
        {showNoteUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">
                  Upload Lecture Material
                </h3>
                <button
                  onClick={() => setShowNoteUploadModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleUploadNote} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                    Document Title
                  </label>
                  <input
                    required
                    placeholder="e.g. Clinical Hematology - Lec 05"
                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                    value={newNote.title}
                    onChange={(e) =>
                      setNewNote({ ...newNote, title: e.target.value })
                    }
                  />
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 relative group hover:border-blue-300 transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setNewNote({ ...newNote, file });
                    }}
                  />
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 mb-4 group-hover:text-blue-500 transition-colors">
                      <FileText size={24} />
                    </div>
                    <div className="text-sm font-bold text-slate-700 mb-1">
                      {newNote.file ? newNote.file.name : "Select or Drag PDF"}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Maximum size 25MB
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUploading || !newNote.title}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                >
                  {isUploading
                    ? "Encrypting & Syncing..."
                    : "Deploy Study Resource"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Create Exam Modal */}
        {showExamModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8 shrink-0">
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">
                  Create Online Assessment
                </h3>
                <button
                  onClick={() => setShowExamModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              <form
                onSubmit={handleCreateExam}
                className="space-y-6 overflow-y-auto pr-2 custom-scrollbar pb-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                      Assessment Title
                    </label>
                    <input
                      required
                      placeholder="e.g. Mid-term: Pathology"
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      value={newExam.title}
                      onChange={(e) =>
                        setNewExam({ ...newExam, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                      Course ID
                    </label>
                    <input
                      required
                      placeholder="e.g. laboratory"
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      value={newExam.courseId}
                      onChange={(e) =>
                        setNewExam({ ...newExam, courseId: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                      Time Duration (Minutes)
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="30"
                      min="1"
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      value={newExam.durationMinutes}
                      onChange={(e) =>
                        setNewExam({
                          ...newExam,
                          durationMinutes: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-xs uppercase tracking-widest text-slate-900">
                      Questions ({newExam.questions.length})
                    </h4>
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-lg"
                    >
                      <Plus size={14} /> Add Question
                    </button>
                  </div>

                  {newExam.questions.map((q: any, i: number) => (
                    <div
                      key={q.id}
                      className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Question {i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const questions = [...newExam.questions];
                            questions.splice(i, 1);
                            setNewExam({ ...newExam, questions });
                          }}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <input
                        required
                        placeholder="Question text..."
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm"
                        value={q.text}
                        onChange={(e) => {
                          const questions = [...newExam.questions];
                          questions[i].text = e.target.value;
                          setNewExam({ ...newExam, questions });
                        }}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        {q.options.map((opt: string, optIdx: number) => (
                          <div key={optIdx} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`correct-${q.id}`}
                              checked={q.correctOptionIndex === optIdx}
                              onChange={() => {
                                const questions = [...newExam.questions];
                                questions[i].correctOptionIndex = optIdx;
                                setNewExam({ ...newExam, questions });
                              }}
                            />
                            <input
                              required
                              placeholder={`Option ${optIdx + 1}`}
                              className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-100 text-xs font-medium"
                              value={opt}
                              onChange={(e) => {
                                const questions = [...newExam.questions];
                                questions[i].options[optIdx] = e.target.value;
                                setNewExam({ ...newExam, questions });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={newExam.questions.length === 0}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 mt-4"
                >
                  Publish to Student Portal
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Exam Hall Hall Overlay */}
        {activeExam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] bg-slate-950 flex flex-col"
          >
            <div className="h-20 border-b border-white/10 px-8 flex items-center justify-between bg-black/40 backdrop-blur-xl">
              <div>
                <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">
                  PROCTORED ASSESSMENT
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {activeExam.title}
                </h2>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-center px-6 border-x border-white/10">
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">
                    Remaining Time
                  </div>
                  <div
                    className={`text-2xl font-mono font-black ${examTimeLeft < 300 ? "text-red-500 animate-pulse" : "text-white"}`}
                  >
                    {Math.floor(examTimeLeft / 60)}:
                    {String(examTimeLeft % 60).padStart(2, "0")}
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (confirm("Submit assessment now?")) submitExam();
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-900/20"
                >
                  Finalize & Submit
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar-dark">
              <div className="max-w-4xl mx-auto space-y-12 pb-24">
                {activeExam.questions.map((q: any, i: number) => (
                  <div key={q.id} className="relative">
                    <div className="flex items-start gap-8">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-lg font-black text-blue-500">
                          {i + 1}
                        </span>
                      </div>
                      <div className="flex-1 space-y-8">
                        <h3 className="text-2xl font-bold text-white leading-tight">
                          {q.text}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {q.options.map((opt: string, optIdx: number) => (
                            <button
                              key={optIdx}
                              onClick={() => {
                                const answers = [...examAnswers];
                                answers[i] = optIdx;
                                setExamAnswers(answers);
                              }}
                              className={`group relative p-6 rounded-3xl border text-left transition-all overflow-hidden ${examAnswers[i] === optIdx ? "bg-blue-600 border-blue-500 shadow-2xl shadow-blue-900/40" : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"}`}
                            >
                              <div className="flex items-center gap-4 relative z-10">
                                <div
                                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all ${examAnswers[i] === optIdx ? "bg-white border-white text-blue-600" : "border-white/20 text-white/40 group-hover:border-white/40"}`}
                                >
                                  {String.fromCharCode(65 + optIdx)}
                                </div>
                                <span
                                  className={`font-bold transition-all ${examAnswers[i] === optIdx ? "text-white" : "text-white/60"}`}
                                >
                                  {opt}
                                </span>
                              </div>
                              {examAnswers[i] === optIdx && (
                                <motion.div
                                  layoutId="active-opt"
                                  className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-50"
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Course Modal */}
        {showCourseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">
                  {editingCourse?.id ? "Edit Department" : "Add New Department"}
                </h3>
                <button
                  onClick={() => setShowCourseModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              <form
                onSubmit={handleSaveCourse}
                className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar"
              >
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                      Course Title (ENG)
                    </label>
                    <input
                      required
                      className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      value={editingCourse?.title || ""}
                      onChange={(e) =>
                        setEditingCourse({
                          ...editingCourse,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                      কোর্সের শিরোনাম (BN)
                    </label>
                    <input
                      className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      value={editingCourse?.titleBn || ""}
                      onChange={(e) =>
                        setEditingCourse({
                          ...editingCourse,
                          titleBn: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                      Duration (ENG)
                    </label>
                    <input
                      required
                      className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      value={editingCourse?.duration || ""}
                      onChange={(e) =>
                        setEditingCourse({
                          ...editingCourse,
                          duration: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                      দূরত্ব/সময় (BN)
                    </label>
                    <input
                      className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      value={editingCourse?.durationBn || ""}
                      onChange={(e) =>
                        setEditingCourse({
                          ...editingCourse,
                          durationBn: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                    Fee (BDT)
                  </label>
                  <input
                    required
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                    value={editingCourse?.fee || ""}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        fee: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                    Brief Description (ENG)
                  </label>
                  <textarea
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm h-24"
                    value={editingCourse?.description || ""}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                    সংক্ষিপ্ত বর্ণনা (BN)
                  </label>
                  <textarea
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm h-24"
                    value={editingCourse?.descriptionBn || ""}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        descriptionBn: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                    Curriculum (Comma separated subjects)
                  </label>
                  <textarea
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm h-24"
                    placeholder="e.g. Anatomy, Physiology, Microbiology"
                    value={editingCourse?.curriculum?.join(", ") || ""}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        curriculum: e.target.value.split(",").map(s => s.trim()).filter(Boolean),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                    Course Outcomes (One per line)
                  </label>
                  <textarea
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm h-24"
                    value={editingCourse?.outcomes?.join("\n") || ""}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        outcomes: e.target.value.split("\n").map(s => s.trim()).filter(Boolean),
                      })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all mt-4"
                >
                  {t("dashboard.actions.save")}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Notice Modal */}
        {showNoticeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">
                  Broadcast New Notice
                </h3>
                <button
                  onClick={() => setShowNoticeModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSaveNotice} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                    Notice Title (ENG)
                  </label>
                  <input
                    required
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                    value={editingNotice?.title || ""}
                    onChange={(e) =>
                      setEditingNotice({
                        ...editingNotice,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                    নোটিশ শিরোনাম (BN)
                  </label>
                  <input
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                    value={editingNotice?.titleBn || ""}
                    onChange={(e) =>
                      setEditingNotice({
                        ...editingNotice,
                        titleBn: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                    Detailed Content (ENG)
                  </label>
                  <textarea
                    required
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm h-32"
                    value={editingNotice?.content || ""}
                    onChange={(e) =>
                      setEditingNotice({
                        ...editingNotice,
                        content: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                    বিস্তারিত বিষয়বস্তু (BN)
                  </label>
                  <textarea
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm h-32"
                    value={editingNotice?.contentBn || ""}
                    onChange={(e) =>
                      setEditingNotice({
                        ...editingNotice,
                        contentBn: e.target.value,
                      })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all mt-4"
                >
                  {t("dashboard.actions.save")}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Teacher Modal */}
        {showTeacherModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">
                  {editingTeacher?.id
                    ? "Update Faculty Profile"
                    : "Register New Faculty"}
                </h3>
                <button
                  onClick={() => setShowTeacherModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSaveTeacher} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                    Instructor Name
                  </label>
                  <input
                    required
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                    value={editingTeacher?.name || ""}
                    onChange={(e) =>
                      setEditingTeacher({
                        ...editingTeacher,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                    value={editingTeacher?.email || ""}
                    onChange={(e) =>
                      setEditingTeacher({
                        ...editingTeacher,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                    Course Assignment
                  </label>
                  <input
                    required
                    placeholder="e.g. Pathology & Microscopy"
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                    value={editingTeacher?.assignment || ""}
                    onChange={(e) =>
                      setEditingTeacher({
                        ...editingTeacher,
                        assignment: e.target.value,
                      })
                    }
                  />
                </div>
                {!editingTeacher?.id && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                      Temporary Password
                    </label>
                    <input
                      required
                      type="password"
                      className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      value={editingTeacher?.password || ""}
                      onChange={(e) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all mt-4"
                >
                  Authorize Faculty Member
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Institute Modal */}
        {showInstituteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8 shrink-0">
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">
                  {editingInstitute?.id
                    ? "Edit Institute Matrix"
                    : "Register New Institute"}
                </h3>
                <button
                  onClick={() => setShowInstituteModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <form
                onSubmit={handleSaveInstitute}
                className="space-y-6 overflow-y-auto pr-4 custom-scrollbar pb-6 px-1"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                      Institute Name (ENG)
                    </label>
                    <input
                      required
                      className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      value={editingInstitute?.name || ""}
                      onChange={(e) =>
                        setEditingInstitute({
                          ...editingInstitute,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                      ইনস্টিটিউটের নাম (BN)
                    </label>
                    <input
                      className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      value={editingInstitute?.nameBn || ""}
                      onChange={(e) =>
                        setEditingInstitute({
                          ...editingInstitute,
                          nameBn: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                      Location (ENG)
                    </label>
                    <input
                      required
                      className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      value={editingInstitute?.location || ""}
                      onChange={(e) =>
                        setEditingInstitute({
                          ...editingInstitute,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                      অবস্থান (BN)
                    </label>
                    <input
                      className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      value={editingInstitute?.locationBn || ""}
                      onChange={(e) =>
                        setEditingInstitute({
                          ...editingInstitute,
                          locationBn: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                    Description (ENG)
                  </label>
                  <textarea
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm h-24"
                    value={editingInstitute?.description || ""}
                    onChange={(e) =>
                      setEditingInstitute({
                        ...editingInstitute,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                    বর্ণনা (BN)
                  </label>
                  <textarea
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm h-24"
                    value={editingInstitute?.descriptionBn || ""}
                    onChange={(e) =>
                      setEditingInstitute({
                        ...editingInstitute,
                        descriptionBn: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                      Seat Distribution
                    </h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                      Department-wise Capacity
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-4"
                      >
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight line-clamp-1">
                          {course.title.replace("DMT in ", "")}
                        </span>
                        <input
                          type="number"
                          className="w-20 px-3 py-1.5 rounded-lg border border-slate-200 text-right font-black text-blue-600 outline-none focus:ring-2 ring-blue-100"
                          value={editingInstitute?.seats?.[course.id] || 0}
                          onChange={(e) => {
                            const seats = {
                              ...(editingInstitute?.seats || {}),
                            };
                            seats[course.id] = parseInt(e.target.value) || 0;
                            setEditingInstitute({ ...editingInstitute, seats });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 shrink-0"
                >
                  Secure Matrix Configuration
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {selectedPdf && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8 bg-slate-900/40 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-5xl h-full max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/20"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white text-slate-900 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight">
                      {selectedPdf.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                      Secure Document Viewer
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={selectedPdf.url}
                    target="_blank"
                    rel="no-referrer"
                    className="p-2 hover:bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold"
                  >
                    <ExternalLink size={18} />{" "}
                    <span className="hidden sm:inline">Open Native</span>
                  </a>
                  <button
                    onClick={() => setSelectedPdf(null)}
                    className="p-2 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-slate-100 relative overflow-hidden">
                {pdfLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    <div className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">
                      Rendering Document...
                    </div>
                  </div>
                )}
                <iframe
                  src={selectedPdf.url}
                  className="w-full h-full"
                  title={selectedPdf.title}
                  onLoad={() => setPdfLoading(false)}
                />
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
                <p className="text-[10px] text-slate-400 font-bold">
                  © 2026 IHT ADDMISSION ACADEMY LMS
                </p>
                <div className="flex gap-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-2">
                    <Download size={14} /> Download File
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-3 px-1 flex items-center gap-2">
            <div className="w-8 h-[1px] bg-blue-200" />
            {isAdmin
              ? "System Administrator Portal"
              : isTeacher
                ? "Academic Instructor Portal"
                : "Student Academic Portal"}
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
            Welcome Back,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {user.name || user.email.split("@")[0]}
            </span>
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-5 bg-white/50 backdrop-blur-md p-4 rounded-[2rem] border border-white/60 shadow-xl shadow-blue-500/5"
        >
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-4 rounded-2xl transition-all relative ${showNotifications ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-white text-slate-400 hover:text-blue-600 shadow-sm border border-slate-100/50 hover:bg-blue-50"}`}
            >
              <Bell size={20} />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-bounce font-black">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-80 bg-white rounded-[2.5rem] shadow-4xl shadow-blue-900/10 border border-slate-100 overflow-hidden z-[300]"
                >
                  <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                      Notifications
                    </h3>
                    <button
                      onClick={() => {
                        notifications
                          .filter((n) => !n.read)
                          .forEach((n) => markNotificationAsRead(n.id));
                      }}
                      className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto custom-scrollbar p-2">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-5 rounded-2xl transition-all cursor-pointer mb-1 ${n.read ? "opacity-60 grayscale-[0.5]" : "bg-blue-50/40 border border-blue-100 shadow-sm"}`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.type === "notice" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}
                            >
                              {n.type === "notice" ? (
                                <Bell size={14} />
                              ) : (
                                <FileText size={14} />
                              )}
                            </div>
                            <div>
                              <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-tight mb-1">
                                {n.title}
                              </div>
                              <div className="text-[10px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                                {n.message}
                              </div>
                              <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                                {formatDate(n.createdAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center flex flex-col items-center">
                        <Bell size={24} className="text-slate-100 mb-4" />
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                          No notifications found
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
              {user.role.toUpperCase()} ACCOUNT
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Session Active: 10:24 AM
            </div>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-500/20">
            {user.name?.[0]?.toUpperCase() ||
              user.email?.[0]?.toUpperCase() ||
              "U"}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {isStudent && (
            <div className="space-y-12 transition-all duration-500">
              {/* Student Tab Navigation */}
              <div className="flex flex-wrap gap-2 p-2 bg-white/40 backdrop-blur-xl rounded-[2.5rem] w-fit border border-white/60 shadow-2xl shadow-blue-500/5">
                {[
                  { id: "learning", label: "Learning Hall", icon: Video },
                  { id: "join", label: "Join Room", icon: Play },
                  { id: "exams", label: "Merit Portal", icon: Target },
                  { id: "chat", label: "Faculty Support", icon: MessageSquare },
                  { id: "vault", label: "Academic Vault", icon: FileText },
                  { id: "profile", label: "My Student ID", icon: User },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStudentTab(tab.id as any)}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group ${studentTab === tab.id ? "bg-white text-blue-600 shadow-xl shadow-blue-500/10" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    <tab.icon
                      size={16}
                      className={`${studentTab === tab.id ? "text-blue-500" : "text-slate-300 group-hover:text-slate-500"} transition-colors`}
                    />
                    {tab.label}
                  </button>
                ))}
              </div>

              {studentTab === "join" && (
                /* Quick Join Section */
                <div className="space-y-12">
                  <motion.section
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-900 p-10 md:p-16 rounded-[4rem] text-white relative overflow-hidden group shadow-[0_40px_100px_rgba(0,0,0,0.4)] border border-white/5"
                  >
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                      <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-white/10">
                          <Activity size={14} className="animate-pulse" /> Live
                          Link Dispatch
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter uppercase leading-[0.9]">
                          Ready for <br />{" "}
                          <span className="text-blue-400">Class?</span>
                        </h2>
                        <p className="text-slate-400 text-lg font-medium opacity-80 mb-12 max-w-lg mx-auto lg:mx-0">
                          Join your live Google Meet sessions instantly using
                          the link provided by your course instructors below.
                        </p>
                      </div>
                      <div className="shrink-0">
                        <div className="w-48 h-48 bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center backdrop-blur-sm">
                          <Video
                            size={80}
                            className="text-white/20 animate-pulse"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.section>

                  <div className="bg-white p-10 md:p-16 rounded-[4rem] border border-slate-100 shadow-2xl shadow-blue-50/50">
                    <div className="mb-12">
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                        Active Academic Rooms
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                        Select your department session to enter
                      </p>
                    </div>
                    <LiveClasses isPaid={isPaid} />
                  </div>
                </div>
              )}

              {studentTab === "learning" && (
                /* Learning System */
                <section className="bg-white rounded-[3.5rem] border border-blue-100 shadow-2xl shadow-blue-50/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 p-10 md:p-14 text-white relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                      <div className="max-w-xl text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                          <Activity size={14} className="text-blue-300" />{" "}
                          Advanced LMS Active
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase leading-tight">
                          Live Academic{" "}
                          <span className="text-blue-300 underline decoration-blue-500/50 decoration-4 underline-offset-8">
                            Sessions
                          </span>
                        </h2>
                        <p className="text-blue-100 text-lg font-medium opacity-80 leading-relaxed">
                          Engage with industry experts in real-time. Access
                          high-definition lectures, interactive chat, and
                          instantly downloadable academic resources.
                        </p>
                      </div>
                      <div className="hidden lg:block shrink-0">
                        <div className="w-48 h-48 bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center backdrop-blur-sm">
                          <Video size={80} className="text-white/20" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 md:p-12 bg-white">
                    <LiveClasses isPaid={isPaid} />
                  </div>
                </section>
              )}

              {studentTab === "exams" && (
                /* Online Exam Portal */
                <section className="bg-white/80 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/60 shadow-2xl shadow-blue-500/5 group relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 relative z-10">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-700 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                        <Target size={32} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                          Examination Hub
                        </h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                          Assessments & Merit Ranking
                        </p>
                      </div>
                    </div>
                    <div className="flex bg-slate-50 p-1.5 rounded-2xl shrink-0 border border-slate-100">
                      <button
                        onClick={() => setExamTab("available")}
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${examTab === "available" ? "bg-white text-indigo-600 shadow-xl shadow-blue-500/10" : "text-slate-400 hover:text-slate-600"}`}
                      >
                        Available
                      </button>
                      <button
                        onClick={() => setExamTab("results")}
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${examTab === "results" ? "bg-white text-indigo-600 shadow-xl shadow-blue-500/10" : "text-slate-400 hover:text-slate-600"}`}
                      >
                        History
                      </button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={examTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="relative z-10"
                    >
                      {examTab === "available" ? (
                        <div className="space-y-5">
                          {exams.length > 0 ? (
                            exams.map((exam) => (
                              <div
                                key={exam.id}
                                className="group flex flex-col sm:flex-row sm:items-center justify-between p-8 bg-white/40 backdrop-blur-sm rounded-[2.5rem] border border-white/60 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all"
                              >
                                <div>
                                  <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest mb-3">
                                    {exam.courseId} • {exam.durationMinutes}M
                                  </div>
                                  <h4 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">
                                    {exam.title}
                                  </h4>
                                  <div className="flex items-center gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-2">
                                      <div className="w-1 h-1 bg-indigo-300 rounded-full" />{" "}
                                      {exam.questions.length} Questions
                                    </span>
                                    <span className="flex items-center gap-2">
                                      <div className="w-1 h-1 bg-indigo-300 rounded-full" />{" "}
                                      {exam.totalMarks} Points
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => startExam(exam)}
                                  className="mt-6 sm:mt-0 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-slate-200 group-hover:shadow-indigo-500/20"
                                >
                                  Begin Merit Test
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 shadow-inner">
                                <Target size={40} />
                              </div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                                System Monitoring: No Active Assessments
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {examResults.length > 0 ? (
                            examResults.map((res) => (
                              <div
                                key={res.id}
                                className="flex items-center justify-between p-6 bg-white/40 rounded-[2rem] border border-white/60 hover:bg-white transition-all group"
                              >
                                <div className="flex items-center gap-6">
                                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 font-black border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                                    {Math.round(
                                      (res.score / res.totalMarks) * 100,
                                    )}
                                    %
                                  </div>
                                  <div>
                                    <div className="text-lg font-black text-slate-800 uppercase tracking-tight">
                                      {res.examTitle}
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                      Merit Score: {res.score} /{" "}
                                      {res.totalMarks} • Verified on{" "}
                                      {formatDate(res.submittedAt)}
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${res.score / res.totalMarks >= 0.4 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}
                                >
                                  {res.score / res.totalMarks >= 0.4
                                    ? "Success"
                                    : "Fail"}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                                No academic records found
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </section>
              )}

              {/* Communication Hub / Messaging */}
              {studentTab === "vault" && (
                /* Recorded Classes & PDF */
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/60 shadow-2xl shadow-blue-500/5 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="flex flex-col gap-6 mb-10 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-all">
                          <Play size={28} fill="currentColor" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                          Academic Vault
                        </h3>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative flex-1 w-full">
                          <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            size={16}
                          />
                          <input
                            type="text"
                            placeholder="Find sessions..."
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 ring-orange-50 transition-all"
                            value={recordedSearch}
                            onChange={(e) => setRecordedSearch(e.target.value)}
                          />
                        </div>
                        <div className="relative w-full sm:w-auto">
                          <Filter
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            size={16}
                          />
                          <select
                            className="w-full pl-12 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 ring-orange-50 appearance-none cursor-pointer transition-all"
                            value={recordedFilter}
                            onChange={(e) => setRecordedFilter(e.target.value)}
                          >
                            {availableCourses.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 h-[450px] overflow-y-auto pr-3 custom-scrollbar relative z-10">
                      {filteredVideos.map((v) => (
                        <div
                          key={v.id}
                          className="bg-white/40 border border-white/60 p-5 rounded-[2rem] group/item hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-100 transition-all cursor-pointer"
                        >
                          <div className="aspect-video bg-slate-900 rounded-[1.5rem] mb-5 overflow-hidden relative shadow-lg">
                            <img
                              src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=400"
                              className="w-full h-full object-cover opacity-60 group-hover/item:scale-110 transition-transform duration-700"
                              alt={v.title}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-14 h-14 bg-white/30 backdrop-blur-xl rounded-full flex items-center justify-center text-white scale-90 group-hover/item:scale-110 transition-all border border-white/40 shadow-2xl">
                                <Play size={28} fill="currentColor" />
                              </div>
                            </div>
                            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-[8px] font-black text-white uppercase tracking-widest border border-white/10">
                              <Clock size={10} /> {v.duration}
                            </div>
                          </div>
                          <div className="space-y-2 px-1">
                            <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
                              {v.course} • {v.date}
                            </div>
                            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight line-clamp-1">
                              {v.title}
                            </h4>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                              <User size={12} /> {v.instructor}
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredVideos.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center py-20 bg-slate-50/50 rounded-[2.5rem]">
                          <Search size={48} className="text-slate-200 mb-6" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                            Query Zero: No matching sessions found
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/60 shadow-2xl shadow-blue-500/5 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="flex items-center gap-5 mb-10 relative z-10">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-all">
                        <FileText size={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                          Academic Library
                        </h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">
                          High-Yield Study Resources
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4 h-[500px] overflow-y-auto pr-3 custom-scrollbar relative z-10">
                      {notes.map((f) => (
                        <div
                          key={f.id}
                          onClick={() => {
                            setSelectedPdf(f);
                            setPdfLoading(true);
                          }}
                          className="flex items-center justify-between p-6 bg-white/40 backdrop-blur-sm rounded-[2.5rem] hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-100 border border-white/60 transition-all group cursor-pointer"
                        >
                          <div className="flex items-center gap-5 flex-1 overflow-hidden">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-all border border-slate-50 shrink-0 shadow-sm">
                              <FileText size={28} />
                            </div>
                            <div className="overflow-hidden">
                              <div className="text-[15px] font-black text-slate-900 group-hover:text-blue-700 truncate uppercase tracking-tight">
                                {f.title}
                              </div>
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-3">
                                <span>{f.size}</span>
                                <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                <span>{f.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 px-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const link = document.createElement("a");
                                link.href = f.url;
                                link.download = f.title;
                                link.click();
                              }}
                              className="bg-white p-3 text-slate-400 hover:text-blue-600 hover:scale-110 rounded-xl shadow-lg shadow-blue-500/5 border border-slate-100 transition-all"
                            >
                              <Download size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {studentTab === "profile" && (
                <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ID Card Display */}
                    <div className="lg:col-span-1">
                      <div className="bg-gradient-to-br from-slate-900 to-black p-10 rounded-[3.5rem] shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden group border border-white/10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10 flex flex-col items-center text-center">
                          <div className="w-40 h-40 rounded-[2.5rem] bg-white/5 border border-white/10 p-2 mb-8 relative group/photo">
                            {currentUser.photoUrl ? (
                              <img
                                src={currentUser.photoUrl}
                                className="w-full h-full object-cover rounded-[2rem]"
                                alt="Profile"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-[2rem]">
                                <User size={64} className="text-white/20" />
                              </div>
                            )}
                            <label className="absolute inset-2 bg-black/60 rounded-[2rem] flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity cursor-pointer">
                              <Plus size={24} className="text-white" />
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file)
                                    setProfileForm((prev) => ({
                                      ...prev,
                                      photo: file,
                                    }));
                                }}
                              />
                            </label>
                          </div>

                          <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">
                            {currentUser.displayName ||
                              currentUser.name ||
                              "Student Profile"}
                          </h3>
                          <div className="px-4 py-1.5 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
                            {currentUser.role}
                          </div>

                          <div className="w-full space-y-4 pt-8 border-t border-white/10">
                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                Student ID
                              </span>
                              <span className="text-[11px] font-black font-mono">
                                {currentUser.studentId || "UNASSIGNED"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                Batch
                              </span>
                              <span className="text-[11px] font-black uppercase tracking-tight">
                                {currentUser.batch || "B2026-X"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                Department
                              </span>
                              <span className="text-[11px] font-black uppercase tracking-tight">
                                {currentUser.department || "GENERAL"}
                              </span>
                            </div>
                          </div>

                          <div className="mt-10 flex items-center gap-4 text-emerald-400">
                            <ShieldCheck size={20} />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                              Verified Secure Identity
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Profile Settings Form */}
                    <div className="lg:col-span-2">
                      <form
                        onSubmit={handleUpdateProfile}
                        className="bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-[4rem] border border-white/60 shadow-2xl shadow-blue-500/5"
                      >
                        <div className="flex items-center gap-6 mb-12">
                          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-blue-100/50">
                            <Settings size={32} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                              Information Center
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                              Manage your academic profile credentials
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                              Academic Display Name
                            </label>
                            <input
                              type="text"
                              value={profileForm.displayName}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  displayName: e.target.value,
                                })
                              }
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 ring-blue-50 outline-none transition-all placeholder:text-slate-300"
                              placeholder="Full Name"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                              Contact mobile
                            </label>
                            <input
                              type="tel"
                              value={profileForm.phone}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  phone: e.target.value,
                                })
                              }
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 ring-blue-50 outline-none transition-all placeholder:text-slate-300"
                              placeholder="+880 1xxx-xxxxxx"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                              Department
                            </label>
                            <input
                              type="text"
                              value={profileForm.department}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  department: e.target.value,
                                })
                              }
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 ring-blue-50 outline-none transition-all placeholder:text-slate-300"
                              placeholder="e.g. Health Technology"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                              Current Batch
                            </label>
                            <input
                              type="text"
                              value={profileForm.batch}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  batch: e.target.value,
                                })
                              }
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 ring-blue-50 outline-none transition-all placeholder:text-slate-300"
                              placeholder="e.g. 2025-26"
                            />
                          </div>
                          <div className="space-y-3 md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                              Permanent Residential Address
                            </label>
                            <textarea
                              value={profileForm.address}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  address: e.target.value,
                                })
                              }
                              rows={3}
                              className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-6 py-6 text-sm font-bold focus:ring-4 ring-blue-50 outline-none transition-all placeholder:text-slate-300 resize-none"
                              placeholder="Complete mailing address"
                            />
                          </div>
                          <div className="space-y-3 md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                              Student ID Photo (Verified Document)
                            </label>
                            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] group hover:border-blue-300 transition-all">
                              <div className="w-24 h-32 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex items-center justify-center shrink-0">
                                {profileForm.idPhoto ? (
                                  <img
                                    src={URL.createObjectURL(
                                      profileForm.idPhoto,
                                    )}
                                    className="w-full h-full object-cover"
                                  />
                                ) : currentUser.idPhotoUrl ? (
                                  <img
                                    src={currentUser.idPhotoUrl}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <ShieldCheck
                                    size={32}
                                    className="text-slate-200"
                                  />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">
                                  Upload a clear photo of your official Student
                                  ID Card or Institutional Identity Document for
                                  verification.
                                </p>
                                <label className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-xl border border-slate-100 shadow-sm text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-slate-900 hover:text-white transition-all active:scale-95">
                                  <Plus size={16} /> Select ID Document
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file)
                                        setProfileForm((prev) => ({
                                          ...prev,
                                          idPhoto: file,
                                        }));
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-12 pt-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-8">
                          <div className="flex items-center gap-4 text-slate-400">
                            <Info size={16} />
                            <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                              System logs all security updates for academic
                              compliance auditing.
                            </p>
                          </div>
                          <button
                            type="submit"
                            disabled={isSavingProfile}
                            className="w-full md:w-auto bg-slate-900 hover:bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                          >
                            {isSavingProfile ? (
                              <>
                                <Loader2 className="animate-spin" size={16} />{" "}
                                Saving...
                              </>
                            ) : (
                              "Commit Security Updates"
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </section>
              )}
            </div>
          )}

          {isTeacher && (
            <div className="space-y-12 transition-all duration-500">
              {/* Teacher Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-white/80 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/60 shadow-2xl shadow-blue-500/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700" />
                  <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Activity size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                        Academic Command Center
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                        Global Session Synchronization Manager
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 relative z-10">
                    <button
                      onClick={() => setTeacherTab("classes")}
                      className="bg-slate-900 text-white px-8 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center gap-3"
                    >
                      <Video size={18} /> Manage Classes
                    </button>
                    <a
                      href="https://meet.google.com/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-8 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-200 active:scale-95 flex items-center gap-3"
                    >
                      <Video size={18} /> Create Meet Room
                    </a>
                  </div>
                </div>
                <div className="bg-slate-900 p-8 rounded-[3.5rem] shadow-2xl shadow-slate-900/10 flex items-center justify-between group cursor-pointer overflow-hidden border border-white/5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl opacity-50" />
                  <div className="relative z-10">
                    <h4 className="text-white font-black text-lg uppercase tracking-tight mb-1">
                      Merit Audit
                    </h4>
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">
                      Verify Exams
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/10 group-hover:bg-blue-600 transition-all shadow-inner">
                    <Target size={20} />
                  </div>
                </div>
              </div>

              {/* Teacher Tab Navigation */}
              <div className="flex flex-wrap gap-2 p-2 bg-white/40 backdrop-blur-xl rounded-[2.5rem] w-fit border border-white/60 shadow-2xl shadow-blue-500/5">
                {[
                  { id: "notes", label: "Class Notes", icon: FileText },
                  { id: "videos", label: "Class Videos", icon: Play },
                  { id: "classes", label: "Class Join Link", icon: Video },
                  {
                    id: "chat",
                    label: "Communication Hub",
                    icon: MessageSquare,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTeacherTab(tab.id as any)}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group ${teacherTab === tab.id ? "bg-white text-blue-600 shadow-xl shadow-blue-500/10" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    <tab.icon
                      size={16}
                      className={`${teacherTab === tab.id ? "text-blue-500" : "text-slate-300 group-hover:text-slate-500"} transition-colors`}
                    />
                    {tab.label}
                  </button>
                ))}
              </div>

              {teacherTab === "notes" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <section className="bg-white/80 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/60 shadow-2xl shadow-blue-500/5">
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100/50">
                          <FileText size={28} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                            Notes Manager
                          </h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                            {notes.length} Active Documents
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowNoteUploadModal(true)}
                        className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group"
                        >
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm border border-slate-50 group-hover:scale-110 transition-transform">
                              <FileText size={20} />
                            </div>
                            <div>
                              <div className="text-sm font-black text-slate-800 uppercase tracking-tight">
                                {note.title}
                              </div>
                              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                {note.size} • Uploaded {note.date}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedPdf(note);
                                setPdfLoading(true);
                              }}
                              className="p-3 bg-white text-slate-400 hover:text-blue-600 rounded-xl shadow-sm border border-slate-100 transition-all"
                            >
                              <ExternalLink size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="p-3 bg-white text-slate-400 hover:text-red-500 rounded-xl shadow-sm border border-slate-100 transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {teacherTab === "classes" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <AdminClassManager />
                </div>
              )}

              {teacherTab === "videos" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <section className="bg-white/80 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/60 shadow-2xl shadow-blue-500/5">
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100/50">
                          <Play size={28} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                            Video Library
                          </h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                            {recordedClasses.length} Digital Assets
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowVideoUploadModal(true)}
                        className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      {recordedClasses.map((v) => (
                        <div
                          key={v.id}
                          className="p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 group relative hover:bg-white hover:shadow-xl transition-all"
                        >
                          <div className="flex items-center gap-5 mb-5">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm border border-slate-50">
                              <Video size={18} />
                            </div>
                            <div className="overflow-hidden">
                              <div className="text-sm font-black text-slate-800 uppercase tracking-tight truncate">
                                {v.title}
                              </div>
                              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                {v.course} • {v.date}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="flex-1 bg-white text-[10px] font-black uppercase tracking-[0.2em] py-3 rounded-xl border border-slate-100 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                              Open Module
                            </button>
                            <button
                              onClick={() => handleDeleteVideo(v.id)}
                              className="p-3 bg-white text-red-500 rounded-xl border border-slate-100 hover:bg-red-50 shadow-sm transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </div>
          )}
          {isAdmin && (
            <div className="space-y-12 transition-all duration-500">
              {/* Admin Tab Navigation */}
              <div className="flex flex-wrap gap-2 p-2 bg-white/40 backdrop-blur-xl rounded-[2.5rem] w-fit border border-white/60 shadow-2xl shadow-blue-500/5">
                {[
                  {
                    id: "overview",
                    label: t("dashboard.tabs.overview"),
                    icon: Activity,
                  },
                  {
                    id: "academic-hall",
                    label: t("dashboard.tabs.academic"),
                    icon: Play,
                  },
                  {
                    id: "applications",
                    label: t("dashboard.tabs.applications"),
                    icon: FileText,
                    count: admissions.filter((a) => a.status === "pending")
                      .length,
                  },
                  {
                    id: "users",
                    label: t("dashboard.tabs.users"),
                    icon: ShieldCheck,
                    count: allUsers.filter((u) => !u.isApproved).length,
                  },
                  {
                    id: "institutes",
                    label: t("dashboard.tabs.institutes"),
                    icon: Building2,
                  },
                  {
                    id: "assessments",
                    label: t("dashboard.tabs.assessments"),
                    icon: Target,
                  },
                  {
                    id: "courses",
                    label: t("dashboard.tabs.courses"),
                    icon: ShieldCheck,
                  },
                  {
                    id: "teachers",
                    label: t("dashboard.tabs.teachers"),
                    icon: User,
                  },
                  {
                    id: "notices",
                    label: t("dashboard.tabs.notices"),
                    icon: Bell,
                  },
                  { id: "chat", label: "Consultations", icon: MessageSquare },
                  {
                    id: "calendar",
                    label: t("common.calendar"),
                    icon: CalendarIcon,
                  },
                  { id: "about", label: t("dashboard.tabs.about"), icon: Info },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setAdminTab(tab.id as any);
                      if (tab.id === "applications") loadAdmissions();
                    }}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group relative ${adminTab === tab.id ? "bg-white text-blue-600 shadow-xl shadow-blue-500/10" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    <tab.icon
                      size={16}
                      className={`${adminTab === tab.id ? "text-blue-500" : "text-slate-300 group-hover:text-slate-500"} transition-colors`}
                    />
                    {tab.label}
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-bounce">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {adminTab === "overview" && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="bg-slate-900 p-10 rounded-[3.5rem] border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-[2000ms]" />
                    <div className="relative z-10 text-center lg:text-left">
                      <h4 className="text-white font-black uppercase tracking-tighter text-lg mb-1">
                        Infrastructure Control Engine
                      </h4>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-loose">
                        Populate persistent storage with 24 base institutes and
                        academic courses.
                      </p>
                    </div>
                    <button
                      onClick={handleSeedDatabase}
                      disabled={seeding}
                      className={`relative z-10 px-14 py-7 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex items-center gap-5 ${seedSuccess ? "bg-green-600 text-white shadow-green-500/20" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"}`}
                    >
                      {seeding ? (
                        <>
                          <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                          Initializing...
                        </>
                      ) : seedSuccess ? (
                        <>
                          <Check size={20} />
                          Database Seeded
                        </>
                      ) : (
                        <>
                          <Activity size={20} />
                          Seed Global Database
                        </>
                      )}
                    </button>
                  </div>
                  {/* Key Performance Indicators */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[3rem] border border-white/60 shadow-2xl shadow-blue-500/5 group hover:bg-white transition-all">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                          <Building2 size={28} />
                        </div>
                        <div className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                          +2 Growth
                        </div>
                      </div>
                      <div className="text-4xl font-black text-slate-900 tracking-tighter mb-1 uppercase">
                        {institutes.length}
                      </div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        Affiliated Institutes
                      </div>
                      <div className="w-full bg-slate-50 h-1.5 rounded-full mt-6 overflow-hidden border border-slate-100">
                        <div className="bg-blue-500 h-full w-[85%] group-hover:w-[90%] transition-all duration-1000" />
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[3rem] border border-white/60 shadow-2xl shadow-blue-500/5 group hover:bg-white transition-all">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center border border-orange-100 group-hover:scale-110 transition-transform">
                          <ShieldCheck size={28} />
                        </div>
                        <div className="text-[10px] font-black text-orange-500 bg-orange-50 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                          Active Ops
                        </div>
                      </div>
                      <div className="text-4xl font-black text-slate-900 tracking-tighter mb-1 uppercase">
                        {courses.length}
                      </div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        Master Courses
                      </div>
                      <div className="w-full bg-slate-50 h-1.5 rounded-full mt-6 overflow-hidden border border-slate-100">
                        <div className="bg-orange-500 h-full w-[70%] group-hover:w-[75%] transition-all duration-1000" />
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[3rem] border border-white/60 shadow-2xl shadow-blue-500/5 group hover:bg-white transition-all">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center border border-purple-100 group-hover:scale-110 transition-transform">
                          <User size={28} />
                        </div>
                        <div className="text-[10px] font-black text-purple-500 bg-purple-50 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                          Faculty Enrolled
                        </div>
                      </div>
                      <div className="text-4xl font-black text-slate-900 tracking-tighter mb-1 uppercase">
                        {teachers.length}
                      </div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        Verified Mentors
                      </div>
                      <div className="w-full bg-slate-50 h-1.5 rounded-full mt-6 overflow-hidden border border-slate-100">
                        <div className="bg-purple-500 h-full w-[60%] group-hover:w-[65%] transition-all duration-1000" />
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[3rem] border border-white/60 shadow-2xl shadow-red-500/5 group hover:bg-white transition-all">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100 group-hover:scale-110 transition-transform">
                          <Activity size={28} />
                        </div>
                        <div className="text-[10px] font-black text-red-500 bg-red-50 px-3 py-1.5 rounded-xl uppercase tracking-widest animate-pulse">
                          Critical Stack
                        </div>
                      </div>
                      <div className="text-4xl font-black text-slate-900 tracking-tighter mb-1 uppercase">
                        {
                          admissions.filter((a) => a.status === "pending")
                            .length
                        }
                      </div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        Pending Validations
                      </div>
                      <div className="w-full bg-slate-50 h-1.5 rounded-full mt-6 overflow-hidden border border-slate-100">
                        <div className="bg-red-500 h-full w-[45%] group-hover:w-[50%] transition-all duration-1000" />
                      </div>
                    </div>
                  </div>

                  <section className="bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-[4rem] border border-white/60 shadow-3xl shadow-blue-500/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-12 relative z-10">
                      <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4 uppercase tracking-tighter">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                          <Activity size={24} />
                        </div>
                        Academic Pulse & Admission Control
                      </h2>
                      <button
                        onClick={() => setAdminTab("applications")}
                        className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] hover:text-blue-700 underline decoration-blue-200 underline-offset-8 decoration-2"
                      >
                        Query All Logs →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
                      {/* Live Control Quick Access */}
                      <div className="space-y-6">
                        <div
                          onClick={() =>
                            setActiveLiveSession({
                              id: "live-admin-1",
                              title: "Admin Master Hall - Supervision",
                              instructor: user.name || "System",
                            })
                          }
                          className="group cursor-pointer bg-slate-900 p-8 rounded-[3rem] hover:bg-black transition-all border border-blue-500/20 shadow-3xl relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl" />
                          <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/30 group-hover:scale-110 transition-transform">
                              <Video size={24} />
                            </div>
                            <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1.5 rounded-full border border-red-500/30">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                              <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">
                                Master Hall Live
                              </span>
                            </div>
                          </div>
                          <h4 className="text-white font-black text-2xl tracking-tighter mb-2 uppercase group-hover:text-blue-400 transition-colors">
                            Supervise Master Hall
                          </h4>
                          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                            Global Administrative Access
                          </p>
                        </div>

                        <div
                          onClick={() => setAdminTab("academic-hall")}
                          className="group cursor-pointer bg-white/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/60 hover:bg-blue-600 hover:border-blue-700 transition-all shadow-xl shadow-blue-500/5"
                        >
                          <div className="flex items-center justify-between mb-8">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-white/20 group-hover:text-white transition-all shadow-sm border border-slate-50">
                              <Play size={24} />
                            </div>
                            <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest group-hover:text-blue-200">
                              Vault Access
                            </div>
                          </div>
                          <h4 className="text-slate-900 font-black text-2xl tracking-tighter mb-2 uppercase group-hover:text-white transition-all">
                            Academic Repository
                          </h4>
                          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-blue-100 transition-all">
                            {recordedClasses.length} Digital Assets Cataloged
                          </p>
                        </div>
                      </div>

                      {/* Recent Trends Chart */}
                      <div className="lg:col-span-2 bg-white/40 backdrop-blur-md p-10 rounded-[3.5rem] border border-white/60 shadow-xl">
                        <div className="flex justify-between items-center mb-10">
                          <div>
                            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                              Admission Velocity
                            </h4>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1">
                              Growth Index Trace
                            </p>
                          </div>
                          <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
                            <TrendingUp size={18} className="text-blue-500" />
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                              +12.4% vs LW
                            </span>
                          </div>
                        </div>
                        <div className="h-56 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={[
                                { day: "Mon", value: 12 },
                                { day: "Tue", value: 18 },
                                { day: "Wed", value: 15 },
                                { day: "Thu", value: 24 },
                                { day: "Fri", value: 20 },
                                { day: "Sat", value: 28 },
                                { day: "Sun", value: 32 },
                              ]}
                            >
                              <defs>
                                <linearGradient
                                  id="colorVal"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0.4}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                              </defs>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#f1f5f9"
                              />
                              <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                  fontSize: 10,
                                  fill: "#64748b",
                                  fontWeight: 900,
                                }}
                              />
                              <Tooltip
                                contentStyle={{
                                  borderRadius: "24px",
                                  border: "none",
                                  boxShadow:
                                    "0 25px 50px -12px rgb(0 0 0 / 0.1)",
                                  fontSize: "12px",
                                  fontWeight: "900",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.1em",
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#3b82f6"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorVal)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="bg-slate-900 p-14 rounded-[4.5rem] shadow-4xl shadow-slate-900/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16 relative z-10">
                      <h3 className="text-3xl font-black text-white flex items-center gap-4 uppercase tracking-tighter">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 text-blue-400 group-hover:scale-110 transition-transform">
                          <Activity size={28} />
                        </div>
                        System Infrastructure Status
                      </h3>
                      <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] bg-white/5 border border-white/10 px-6 py-3 rounded-2xl shadow-inner">
                        Real-time Analytics Engine
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 relative z-10">
                      {[
                        {
                          label: "Enrolled Academic Students",
                          value: "1,240",
                          color: "bg-white/5 text-blue-100 border-white/10",
                          sub: "+14% Capacity",
                        },
                        {
                          label: "Success Velocity Rate",
                          value: "98.5%",
                          color: "bg-white/5 text-emerald-100 border-white/10",
                          sub: "Critical Pass",
                        },
                        {
                          label: "LMS Latency Optimization",
                          value: "Ultra Low",
                          color: "bg-white/5 text-purple-100 border-white/10",
                          sub: "Edge Optimized",
                        },
                        {
                          label: "Global Server Uptime",
                          value: "99.99%",
                          color: "bg-white/5 text-slate-100 border-white/10",
                          sub: "Cluster Healthy",
                        },
                      ].map((s, i) => (
                        <div
                          key={i}
                          className={`${s.color} p-10 rounded-[3.5rem] text-center border group/card hover:bg-white/10 transition-all cursor-default`}
                        >
                          <div className="text-[10px] font-black uppercase opacity-40 mb-6 tracking-[0.3em] h-8 flex items-center justify-center leading-tight">
                            {s.label}
                          </div>
                          <div className="text-4xl font-black tracking-tighter mb-2 group-hover:scale-110 transition-transform">
                            {s.value}
                          </div>
                          <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest opacity-0 group-hover/card:opacity-100 transition-opacity">
                            {s.sub}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {adminTab === "academic-hall" && <AdminClassManager />}

              {adminTab === "calendar" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/60 shadow-2xl shadow-blue-500/5">
                    <div className="flex items-center justify-between mb-10">
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                        Institutional Calendar Control
                      </h3>
                    </div>
                    <div className="aspect-video w-full rounded-[1.5rem] overflow-hidden border border-slate-50 mb-10">
                      <iframe
                        src="https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=Asia%2FDhaka&showTitle=0&showPrint=0&showTabs=1&showCalendars=0&showTld=0&src=ZW4uYmQjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%230B8043"
                        className="w-full h-full"
                        frameBorder="0"
                        scrolling="no"
                      ></iframe>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {CALENDAR_EVENTS.map((event) => (
                        <div
                          key={event.id}
                          className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100"
                        >
                          <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center border border-slate-200 shrink-0">
                            <span className="text-[8px] font-bold text-slate-400 uppercase">
                              {formatDate(event.date, 'MMM')}
                            </span>
                            <span className="text-xl font-black text-slate-900">
                              {formatDate(event.date, 'd')}
                            </span>
                          </div>
                          <div>
                            <div className="text-[8px] font-bold text-blue-500 uppercase tracking-widest mb-1">
                              {event.type}
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                              {event.title}
                            </h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {adminTab === "users" && (
                <section className="bg-white/80 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/60 shadow-2xl shadow-blue-500/5 transition-all">
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                        Global User Directory
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest leading-relaxed">
                        Authority Control Center • {allUsers.length} Recorded Identites
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="relative group min-w-[300px]">
                        <Search
                          size={16}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"
                        />
                        <input
                          type="text"
                          placeholder="Search identity or email..."
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 ring-blue-50 transition-all"
                          value={userFilterSearch}
                          onChange={(e) => setUserFilterSearch(e.target.value)}
                        />
                      </div>
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 ring-blue-50 transition-all cursor-pointer"
                      >
                        <option value="all">All Roles</option>
                        <option value="student">Students</option>
                        <option value="teacher">Faculty</option>
                        <option value="admin">Administrators</option>
                      </select>
                      <button
                        onClick={loadAllUsers}
                        className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                      >
                        <Activity size={24} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {loadingUsers ? (
                      <div className="py-24 text-center">
                        <Loader2
                          size={48}
                          className="animate-spin text-blue-500 mx-auto mb-6"
                        />
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
                          Synchronizing secure directory...
                        </div>
                      </div>
                    ) : allUsers.length === 0 ? (
                      <div className="py-24 text-center text-slate-300 font-black uppercase tracking-widest text-[10px] border-2 border-dashed border-slate-50 rounded-[3rem]">
                        No user records found in database
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-6">
                        {allUsers
                          .filter((u) => {
                            const matchesSearch =
                              (u.displayName || u.name || "")
                                .toLowerCase()
                                .includes(userFilterSearch.toLowerCase()) ||
                              u.email
                                .toLowerCase()
                                .includes(userFilterSearch.toLowerCase());
                            const matchesRole =
                              roleFilter === "all" || u.role === roleFilter;
                            return matchesSearch && matchesRole;
                          })
                          .map((u) => (
                            <div
                              key={u.id}
                              className="bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col xl:flex-row items-center justify-between gap-8 hover:shadow-2xl hover:border-blue-200 transition-all group relative overflow-hidden"
                            >
                              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                              
                              <div className="flex items-center gap-6 w-full xl:w-auto relative z-10">
                                <div
                                  className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-xl border relative transition-transform group-hover:scale-105 duration-500 ${u.isApproved ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-900 text-white border-slate-800"}`}
                                >
                                  {(u.displayName || u.name || u.email)[0]}
                                  {!u.isApproved && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-[3px] border-white animate-pulse" />
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-3">
                                    <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">
                                      {u.displayName || u.name || "Pulse User"}
                                    </h4>
                                    <span
                                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${u.role === "admin" ? "bg-purple-50 text-purple-700 border-purple-100" : u.role === "teacher" ? "bg-orange-50 text-orange-700 border-orange-100" : "bg-blue-50 text-blue-700 border-blue-100"}`}
                                    >
                                      {u.role}
                                    </span>
                                  </div>
                                  <div className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-2">
                                    <Mail size={12} className="opacity-40" />
                                    {u.email}
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row items-center gap-8 w-full xl:w-auto relative z-10">
                                <div className="hidden sm:block h-12 w-px bg-slate-100" />
                                
                                <div className="flex flex-col gap-2">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center xl:text-left">
                                    Privilege Management
                                  </span>
                                  <div className="flex gap-2">
                                    {(["student", "teacher", "admin"] as const).map((role) => (
                                      <button
                                        key={role}
                                        onClick={() => handleUpdateUserRole(u.uid || u.id, role)}
                                        disabled={u.role === role || u.email === "xoysharif@gmail.com"}
                                        className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${u.role === role ? "bg-slate-900 text-white border-slate-900" : "bg-white border border-slate-100 text-slate-400 hover:border-blue-400 hover:text-blue-500"} disabled:opacity-50`}
                                      >
                                        {role}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex flex-col gap-2 min-w-[200px]">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center xl:text-left">
                                    Access Status
                                  </span>
                                  <div className="flex items-center gap-3">
                                    {u.isApproved ? (
                                      <>
                                        <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                                          <ShieldCheck size={14} /> Verified
                                        </div>
                                        <button
                                          onClick={() => handleUpdateUserApproval(u.uid || u.id, false)}
                                          disabled={u.email === "xoysharif@gmail.com"}
                                          className="p-2.5 bg-white border border-red-100 text-red-500 rounded-xl hover:bg-red-50 transition-all disabled:opacity-20 shadow-sm"
                                          title="Revoke Access"
                                        >
                                          <LogOut size={16} />
                                        </button>
                                      </>
                                    ) : (
                                      <button
                                        onClick={() => handleUpdateUserApproval(u.uid || u.id, true)}
                                        className="w-full px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
                                      >
                                        <Check size={16} /> Approve Access
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {adminTab === "applications" && (
                <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center sm:text-left">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Student Admissions Queue
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider">
                        Manual Verification Required
                      </p>
                    </div>
                    <button
                      onClick={loadAdmissions}
                      className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                    >
                      <Activity size={18} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {loadingAdmissions ? (
                      <div className="py-20 text-center text-slate-300 font-black uppercase tracking-widest text-[10px]">
                        Syncing secure server...
                      </div>
                    ) : admissions.length === 0 ? (
                      <div className="py-20 text-center text-slate-300 font-black uppercase tracking-widest text-[10px]">
                        No pending applications found
                      </div>
                    ) : (
                      admissions.map((a) => (
                        <div
                          key={a.id}
                          className="group bg-white rounded-3xl border border-slate-100 overflow-hidden transition-all hover:shadow-xl hover:border-blue-100"
                        >
                          <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg overflow-hidden">
                                {a.photoUrl ? (
                                  <img
                                    src={a.photoUrl}
                                    alt={a.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  a.name[0]
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">
                                    {a.name}
                                  </h4>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] ${a.status === "approved" ? "bg-green-100 text-green-700" : a.status === "rejected" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}
                                  >
                                    {a.status}
                                  </span>
                                </div>
                                <div className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1">
                                  {courses.find((c) => c.id === a.courseId)
                                    ?.title || a.courseId}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-4 items-center">
                              <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="text-[9px] font-black text-slate-400 uppercase mb-1">
                                  Transaction ID
                                </div>
                                <div className="text-xs font-mono font-bold text-slate-900">
                                  {a.transactionId}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    setExpandedAdmission(
                                      expandedAdmission === a.id ? null : a.id,
                                    )
                                  }
                                  className="px-4 py-2 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all"
                                >
                                  {expandedAdmission === a.id
                                    ? "Collapse"
                                    : "Details"}
                                </button>
                                {a.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleStatusUpdate(a.id, "approved")
                                      }
                                      className="bg-green-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-100 active:scale-95"
                                    >
                                      Verify
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleStatusUpdate(a.id, "rejected")
                                      }
                                      className="bg-white border border-slate-200 text-slate-400 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 active:scale-95"
                                    >
                                      Deny
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <AnimatePresence>
                            {expandedAdmission === a.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-6 pb-6 border-t border-slate-50"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h5 className="text-[9px] font-black text-slate-400 uppercase mb-3">
                                      SSC Background
                                    </h5>
                                    <p className="text-xs font-bold text-slate-700 leading-relaxed">
                                      {a.sscInfo || "Not Provided"}
                                    </p>
                                  </div>
                                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h5 className="text-[9px] font-black text-slate-400 uppercase mb-3">
                                      HSC Background
                                    </h5>
                                    <p className="text-xs font-bold text-slate-700 leading-relaxed">
                                      {a.hscInfo || "Not Provided"}
                                    </p>
                                  </div>
                                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h5 className="text-[9px] font-black text-slate-400 uppercase mb-3">
                                      Contact Payload
                                    </h5>
                                    <p className="text-xs font-bold text-slate-700 mb-1">
                                      Phone: {a.phone}
                                    </p>
                                    <p className="text-[10px] font-bold text-blue-500 uppercase">
                                      Gateway: {a.paymentMethod} (
                                      {a.paymentNumber})
                                    </p>
                                    {a.screenshotUrl && (
                                      <div className="mt-4 pt-4 border-t border-slate-200">
                                        <h5 className="text-[9px] font-black text-slate-400 uppercase mb-2">
                                          Payment Evidence
                                        </h5>
                                        <a
                                          href={a.screenshotUrl}
                                          target="_blank"
                                          rel="no-referrer"
                                        >
                                          <img
                                            src={a.screenshotUrl}
                                            alt="Screenshot"
                                            className="w-full h-32 object-cover rounded-xl border border-slate-200 cursor-zoom-in"
                                          />
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              )}

              {adminTab === "courses" && (
                <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center sm:text-left">
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Academic Departments
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider">
                        SMF Bangladesh Approved Courses
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingCourse({});
                        setShowCourseModal(true);
                      }}
                      className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xl shadow-slate-200"
                    >
                      <Plus size={16} /> New Course
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group relative overflow-hidden"
                      >
                        <div className="absolute right-0 top-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <button
                            onClick={() => {
                              setEditingCourse(course);
                              setShowCourseModal(true);
                            }}
                            className="p-2 bg-white text-blue-600 rounded-lg shadow-sm border border-slate-100"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="p-2 bg-white text-red-500 rounded-lg shadow-sm border border-slate-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="w-12 h-12 bg-white rounded-xl mb-6 shadow-sm flex items-center justify-center text-blue-600 font-black">
                          {course.title[0]}
                        </div>
                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2 pr-12">
                          {t_lang(course.title, course.titleBn)}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 line-clamp-2">
                          {t_lang(course.description, course.descriptionBn)}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {t_lang(course.duration, course.durationBn)}
                          </div>
                          <div className="text-sm font-black text-blue-600 font-sans">
                            {formatPrice(course.fee)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {adminTab === "institutes" && (
                <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center sm:text-left">
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Institute & Seat Management
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider">
                        Configure nationwide seat distribution
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingInstitute({
                          id: "",
                          name: "",
                          location: "",
                          isApproved: true,
                          seats: {},
                        });
                        setShowInstituteModal(true);
                      }}
                      className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xl shadow-slate-200"
                    >
                      <Plus size={16} /> Add Institute
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {institutes.map((inst) => (
                      <div
                        key={inst.id}
                        className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group relative"
                      >
                        <div className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <button
                            onClick={() => {
                              setEditingInstitute(inst);
                              setShowInstituteModal(true);
                            }}
                            className="p-2 bg-white text-blue-600 rounded-lg shadow-sm border border-slate-100"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteInstitute(inst.id)}
                            className="p-2 bg-white text-red-500 rounded-lg shadow-sm border border-slate-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2 pr-16">
                          {t_lang(inst.name, inst.nameBn)}
                        </h4>
                        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[9px] tracking-widest mb-6">
                          <MapPin size={10} className="text-blue-500" />
                          {t_lang(inst.location, inst.locationBn)}
                        </div>

                        <div className="space-y-2">
                          {Object.entries(inst.seats || {}).map(
                            ([deptId, count]) => (
                              <div
                                key={deptId}
                                className="flex items-center justify-between p-3 bg-white rounded-xl text-[10px] font-bold border border-slate-100 shadow-sm transition-all hover:border-blue-200 group/item"
                              >
                                <span className="text-slate-500 uppercase tracking-tight line-clamp-1">
                                  {t_lang(
                                    courses.find((c) => c.id === deptId)?.title,
                                    courses.find((c) => c.id === deptId)
                                      ?.titleBn,
                                  )
                                    .split(" (")[0]
                                    .replace("DMT in ", "") || deptId}
                                </span>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 font-black whitespace-nowrap">
                                  <Users size={10} strokeWidth={3} />
                                  {typeof count === "number"
                                    ? count
                                    : (count as any).seats}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {adminTab === "assessments" && (
                <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Assessment Intelligence
                      </h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                        Cross-Institute Performance Data
                      </p>
                    </div>
                    <div className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                      {examResults.length} Sync Records
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                          <th className="pb-4 px-4">Candidate Identity</th>
                          <th className="pb-4 px-4">Exam Module</th>
                          <th className="pb-4 px-4">Performance Score</th>
                          <th className="pb-4 px-4">Submission Epoch</th>
                          <th className="pb-4 px-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {examResults.map((res) => (
                          <tr
                            key={res.id}
                            className="group hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div className="font-bold text-slate-800">
                                {res.userName}
                              </div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                {res.userEmail}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-xs font-bold text-blue-600">
                              {res.examTitle}
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm font-black text-slate-900">
                                {res.score} / {res.totalMarks}
                              </div>
                              <div className="w-24 bg-slate-100 h-1 rounded-full mt-1.5 overflow-hidden">
                                <div
                                  className={`h-full ${res.score / res.totalMarks >= 0.8 ? "bg-emerald-500" : res.score / res.totalMarks >= 0.4 ? "bg-blue-500" : "bg-red-500"}`}
                                  style={{
                                    width: `${(res.score / res.totalMarks) * 100}%`,
                                  }}
                                />
                              </div>
                            </td>
                            <td className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {formatDate(res.submittedAt, 'PPp')}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span
                                className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${res.score / res.totalMarks >= 0.4 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
                              >
                                {res.score / res.totalMarks >= 0.4
                                  ? "Competent"
                                  : "Deficient"}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {examResults.length === 0 && (
                          <tr>
                            <td
                              colSpan={5}
                              className="py-20 text-center text-slate-300 font-black uppercase tracking-widest text-[10px]"
                            >
                              No assessment telemetry available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {adminTab === "notices" && (
                <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center sm:text-left">
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Broadcast Management
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider">
                        Push announcements to all active portals
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingNotice({ title: "", content: "" });
                        setShowNoticeModal(true);
                      }}
                      className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xl shadow-slate-200"
                    >
                      <Plus size={16} /> New Broadcast
                    </button>
                  </div>
                  <div className="space-y-4">
                    {notices.map((notice) => (
                      <div
                        key={notice.id}
                        className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start justify-between gap-4 group hover:bg-white hover:shadow-xl transition-all"
                      >
                        <div className="flex-1">
                          <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">
                            {formatDate(notice.date)}
                          </div>
                          <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">
                            {t_lang(notice.title, notice.titleBn)}
                          </h4>
                          <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            {t_lang(notice.content, notice.contentBn)}
                          </p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleDeleteNotice(notice.id)}
                            className="p-3 bg-white text-red-500 rounded-xl shadow-sm border border-slate-100 hover:bg-red-50 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {notices.length === 0 && (
                      <div className="py-20 text-center text-slate-300 font-black uppercase tracking-widest text-[10px]">
                        No active broadcasts
                      </div>
                    )}
                  </div>
                </section>
              )}

              {adminTab === "about" && aboutData && (
                <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="mb-10">
                    <h3 className="text-xl font-bold text-slate-900">
                      Bureau Identity & Governance
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider">
                      Manage public profile and leadership details
                    </p>
                  </div>

                  <form
                    onSubmit={handleUpdateAbout}
                    className="space-y-8 max-w-4xl"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                            Owner / Director Name
                          </label>
                          <input
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                            value={aboutData.ownerName}
                            onChange={(e) =>
                              setAboutData({
                                ...aboutData,
                                ownerName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                            Official Designation
                          </label>
                          <input
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                            value={aboutData.designation}
                            onChange={(e) =>
                              setAboutData({
                                ...aboutData,
                                designation: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                            Academic Qualification
                          </label>
                          <input
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                            value={aboutData.qualification}
                            onChange={(e) =>
                              setAboutData({
                                ...aboutData,
                                qualification: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                            Profile Photo URL
                          </label>
                          <div className="flex gap-4 items-end">
                            <img
                              src={aboutData.photoUrl}
                              className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100"
                            />
                            <input
                              className="flex-1 px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-xs"
                              value={aboutData.photoUrl}
                              onChange={(e) =>
                                setAboutData({
                                  ...aboutData,
                                  photoUrl: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                        Leadership Biography
                      </label>
                      <textarea
                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm h-32"
                        value={aboutData.bio}
                        onChange={(e) =>
                          setAboutData({ ...aboutData, bio: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                        Institutional Vision
                      </label>
                      <textarea
                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm h-24"
                        value={aboutData.vision}
                        onChange={(e) =>
                          setAboutData({ ...aboutData, vision: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                          Contact Phone
                        </label>
                        <input
                          className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                          value={aboutData.phone}
                          onChange={(e) =>
                            setAboutData({
                              ...aboutData,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                          Contact Email
                        </label>
                        <input
                          className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                          value={aboutData.email}
                          onChange={(e) =>
                            setAboutData({
                              ...aboutData,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-slate-900 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2"
                    >
                      <Check size={18} /> Update Bureau Identity
                    </button>
                  </form>
                </section>
              )}

              {adminTab === "teachers" && (
                <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center sm:text-left">
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Faculty Roster
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider">
                        Academic Staff Control
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingTeacher({});
                        setShowTeacherModal(true);
                      }}
                      className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xl shadow-slate-200"
                    >
                      <Plus size={16} /> Assign Teacher
                    </button>
                  </div>
                  <div className="space-y-4">
                    {teachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl hover:border-blue-50 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-inner group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <User size={28} />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                              {teacher.name}
                            </h4>
                            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">
                              {teacher.assignment || "Unassigned Department"}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold mt-1 lowercase italic">
                              {teacher.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingTeacher(teacher);
                              setShowTeacherModal(true);
                            }}
                            className="p-3 bg-white text-slate-400 hover:text-blue-600 rounded-xl shadow-sm border border-slate-100 transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteTeacher(teacher.id)}
                            className="p-3 bg-white text-slate-400 hover:text-red-500 rounded-xl shadow-sm border border-slate-100 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {(studentTab === "chat" ||
            (isTeacher && teacherTab === "chat") ||
            (isAdmin && adminTab === "chat")) && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-white/90 backdrop-blur-2xl rounded-[3.5rem] border border-white/60 shadow-2xl shadow-blue-500/5 overflow-hidden flex flex-col md:flex-row h-[700px] relative">
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="w-full md:w-96 border-r border-slate-100 flex flex-col bg-slate-50/40 relative z-10">
                  <div className="p-8 border-b border-slate-200 bg-white/50">
                    <div className="flex items-center gap-3 font-black text-slate-900 mb-6 uppercase tracking-tighter text-lg">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <MessageSquare size={20} />
                      </div>
                      Faculty Support
                    </div>
                    <div className="relative group">
                      <Search
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Search teachers or chats..."
                        className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 ring-blue-50 transition-all"
                        onChange={(e) => {
                          setChatSearch(e.target.value.toLowerCase());
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4">
                        Active Consulting
                      </h4>
                      <div className="space-y-2">
                        {chats
                          .filter((c) => {
                            const otherName =
                              (currentUser.id === c.teacherId
                                ? c.studentName
                                : c.teacherName) || "";
                            return otherName
                              .toLowerCase()
                              .includes(chatSearch.toLowerCase());
                          })
                          .map((chat) => {
                            const otherName =
                              currentUser.id === chat.teacherId
                                ? chat.studentName
                                : chat.teacherName;
                            return (
                              <button
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={`w-full text-left p-4 rounded-3xl border transition-all relative group ${selectedChat?.id === chat.id ? "bg-white border-blue-200 shadow-xl shadow-blue-500/10 ring-1 ring-blue-50" : "bg-transparent border-transparent hover:bg-white/60 hover:shadow-lg"}`}
                              >
                                <div className="flex items-center gap-4 relative z-10">
                                  <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center font-black text-slate-400 text-lg group-hover:scale-105 transition-transform shadow-sm">
                                    {otherName?.[0]}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-[12px] font-black text-slate-900 uppercase tracking-tight leading-tight mb-1 truncate">
                                      {otherName}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold tracking-tight truncate">
                                      {chat.lastMessage ||
                                        "Start conversation..."}
                                    </div>
                                  </div>
                                  <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest shrink-0">
                                    {chat.updatedAt
                                      ? formatDate(
                                          chat.updatedAt instanceof Timestamp
                                            ? chat.updatedAt.toDate()
                                            : chat.updatedAt,
                                          'p'
                                        )
                                      : ""}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4">
                        Contact Directory
                      </h4>
                      <div className="space-y-2">
                        {/* Show Admins if not admin */}
                        {!isAdmin &&
                          admins
                            .filter((u) =>
                              (u.name || u.displayName || u.email)
                                .toLowerCase()
                                .includes(chatSearch.toLowerCase()),
                            )
                            .map((admin) => (
                              <button
                                key={admin.id || admin.uid}
                                onClick={() => handleStartChat(admin)}
                                className="w-full flex items-center justify-between p-4 rounded-3xl hover:bg-white transition-all group"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black text-xs uppercase group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    ADMIN
                                  </div>
                                  <div className="text-left">
                                    <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                                      {admin.displayName ||
                                        admin.name ||
                                        "Admin Support"}
                                    </div>
                                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                      Administrative Support
                                    </div>
                                  </div>
                                </div>
                                <Send
                                  size={14}
                                  className="text-slate-200 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all"
                                />
                              </button>
                            ))}

                        {/* Show Teachers */}
                        {!isTeacher &&
                          teachers
                            .filter((t) =>
                              (t.displayName || t.name || t.email)
                                .toLowerCase()
                                .includes(chatSearch.toLowerCase()),
                            )
                            .map((teacher) => (
                              <button
                                key={teacher.id || teacher.uid}
                                onClick={() => handleStartChat(teacher)}
                                className="w-full flex items-center justify-between p-4 rounded-3xl hover:bg-white transition-all group"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs uppercase group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    {(teacher.displayName ||
                                      teacher.name ||
                                      teacher.email)[0]}
                                  </div>
                                  <div className="text-left">
                                    <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                                      {teacher.displayName ||
                                        teacher.name ||
                                        teacher.email.split("@")[0]}
                                    </div>
                                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                      Faculty Member
                                    </div>
                                  </div>
                                </div>
                                <Send
                                  size={14}
                                  className="text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                                />
                              </button>
                            ))}

                        {/* Show Students for Teachers/Admins */}
                        {(isTeacher || isAdmin) &&
                          (isAdmin ? allUsers : allStudents)
                            .filter(
                              (u) =>
                                u.role === "student" &&
                                (u.displayName || u.email)
                                  .toLowerCase()
                                  .includes(chatSearch.toLowerCase()),
                            )
                            .map((student) => (
                              <button
                                key={student.id || student.uid}
                                onClick={() => handleStartChat(student)}
                                className="w-full flex items-center justify-between p-4 rounded-3xl hover:bg-white transition-all group"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xs uppercase group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    {(student.displayName ||
                                      student.email)[0]}
                                  </div>
                                  <div className="text-left">
                                    <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                                      {student.displayName ||
                                        student.email.split("@")[0]}
                                    </div>
                                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                      Enrolled Student
                                    </div>
                                  </div>
                                </div>
                                <Send
                                  size={14}
                                  className="text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                                />
                              </button>
                            ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col bg-white relative z-10">
                  {selectedChat ? (
                    <>
                      <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-md relative z-10">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black shadow-lg shadow-indigo-500/5 border border-indigo-100 text-xl">
                            {(currentUser.id === selectedChat.teacherId
                              ? selectedChat.studentName
                              : selectedChat.teacherName)?.[0]}
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900 uppercase tracking-tight text-xl">
                              {currentUser.id === selectedChat.teacherId
                                ? selectedChat.studentName
                                : selectedChat.teacherName}
                            </h4>
                            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                              Professional Response Active
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedChat(null)}
                          className="p-4 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"
                        >
                          <X size={24} />
                        </button>
                      </div>
                      <div className="flex-1 p-10 overflow-y-auto space-y-8 bg-slate-50/20 custom-scrollbar">
                        {chatMessages.map((msg) => {
                          const isMe = msg.senderId === currentUser.id;
                          return (
                            <div
                              key={msg.id}
                              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[75%] p-6 rounded-[2.5rem] text-sm leading-relaxed ${isMe ? "bg-slate-900 text-white rounded-tr-none shadow-xl shadow-slate-900/10" : "bg-white border border-slate-100 text-slate-800 rounded-tl-none shadow-sm"}`}
                              >
                                <div className="font-medium">{msg.text}</div>
                                <div
                                  className={`text-[9px] mt-4 font-black uppercase tracking-[0.2em] ${isMe ? "text-blue-300 text-right" : "text-slate-400"}`}
                                >
                                  {formatDate(msg.createdAt, 'p')}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={chatEndRef} />
                      </div>
                      <form
                        onSubmit={handleSendMessage}
                        className="p-8 bg-white border-t border-slate-100 flex gap-5"
                      >
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your academic inquiry..."
                          className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-sm font-bold focus:ring-4 ring-blue-50 outline-none transition-all"
                          disabled={isSendingMessage}
                        />
                        <button
                          type="submit"
                          disabled={!newMessage.trim() || isSendingMessage}
                          className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 active:scale-95 shrink-0 disabled:opacity-50"
                        >
                          <Send size={28} />
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-20 text-slate-400 bg-slate-50/30">
                      <div className="w-32 h-32 bg-white rounded-[3.5rem] flex items-center justify-center mb-10 border border-slate-100 shadow-2xl shadow-blue-500/5">
                        <MessageSquare size={48} className="text-blue-100" />
                      </div>
                      <h4
                        className="text-[28px] font-black text-slate-900 mb-4 uppercase tracking-tighter"
                        id="message-board-title"
                      >
                        Academic Message Board
                      </h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 max-w-[320px] leading-relaxed">
                        Select a faculty member from the directory to start a
                        secure academic consultation session.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Sidebar / Schedule */}
        <div className="space-y-8">
          {/* Global Notice Board */}
          <section className="bg-white/80 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/60 shadow-2xl shadow-blue-500/5 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Bell size={80} className="-rotate-12" />
            </div>
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-3 font-black text-slate-900 uppercase tracking-tighter text-lg">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Bell size={20} />
                </div>
                Notices
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={() => {
                      setEditingNotice({ title: "", content: "" });
                      setShowNoticeModal(true);
                    }}
                    className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    title="Broadcast New Notice"
                  >
                    <Plus size={16} />
                  </button>
                )}
                {notices.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-blue-600 text-white text-[8px] font-black px-3 py-1.5 rounded-full animate-bounce border border-blue-500 shadow-lg shadow-blue-500/20 uppercase tracking-[0.2em]">
                    Dispatch Active
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-5 max-h-[400px] overflow-y-auto pr-3 custom-scrollbar relative z-10">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className="p-6 bg-white/40 rounded-[2rem] border border-white/60 hover:bg-white hover:shadow-xl transition-all relative group/item"
                >
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="absolute top-4 right-4 p-2 bg-white text-red-400 hover:text-red-600 rounded-xl shadow-lg opacity-0 group-hover/item:opacity-100 transition-opacity border border-slate-50"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                  <div className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                    <CalendarIcon size={10} /> {formatDate(notice.date)}
                  </div>
                  <h5 className="text-[14px] font-black text-slate-900 mb-2 pr-8 leading-tight tracking-tight uppercase">
                    {t_lang(notice.title, notice.titleBn)}
                  </h5>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-3">
                    {t_lang(notice.content, notice.contentBn)}
                  </p>
                </div>
              ))}
              {notices.length === 0 && (
                <div className="py-20 text-center text-slate-300 font-black uppercase tracking-[0.3em] text-[10px]">
                  Registry Empty
                </div>
              )}
            </div>
            <button
              onClick={() => onNavigate("calendar")}
              className="w-full mt-10 py-5 bg-slate-900 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3"
            >
              View Full Calendar <ChevronRight size={16} />
            </button>
          </section>

          <section className="bg-white/80 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/60 shadow-2xl shadow-blue-500/5">
            <div className="flex items-center gap-3 font-black text-slate-900 mb-10 uppercase tracking-tighter text-lg">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <CalendarIcon size={20} />
              </div>
              Academic Beat
            </div>
            <div className="space-y-8">
              {[
                {
                  title: "Project Presentation",
                  batch: "Batch B12",
                  date: "Tomorrow",
                  type: "Clinical",
                },
                {
                  title: "Staff Meeting",
                  batch: "Quarterly",
                  date: "Fri, 3 PM",
                  type: "Admin",
                },
                {
                  title: "Graduation Ceremony",
                  batch: "Session 2025",
                  date: "May 30",
                  type: "Event",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="relative pl-10 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-[2px] before:bg-slate-100 group"
                >
                  <div className="absolute left-[-5px] top-1.5 w-3 h-3 rounded-full border-[3px] border-white bg-indigo-600 group-hover:scale-150 group-hover:shadow-lg shadow-indigo-500/20 transition-all"></div>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      {s.date}
                    </div>
                    <div className="text-[8px] font-black bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                      {s.type}
                    </div>
                  </div>
                  <div className="text-[15px] font-black text-slate-900 mb-1 leading-tight uppercase tracking-tight">
                    {s.title}
                  </div>
                  <div className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em]">
                    {s.batch}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {isStudent && (
            <PomodoroTimer user={currentUser} />
          )}

          {isStudent && (
            <section className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl shadow-slate-900/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-xl font-black uppercase tracking-tighter">
                    Academic Merit
                  </h4>
                  <Target size={20} className="text-blue-400" />
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-blue-200">
                      <span>Syllabus Completion</span>
                      <span>78%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden border border-white/5">
                      <div className="bg-blue-500 h-full w-[78%] group-hover:w-[82%] transition-all duration-1000" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-blue-200">
                      <span>Test Performance</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden border border-white/5">
                      <div className="bg-emerald-500 h-full w-[92%] group-hover:w-[95%] transition-all duration-1000" />
                    </div>
                  </div>
                </div>
                <p className="text-slate-400 text-[10px] font-medium leading-relaxed mt-10 text-center opacity-60">
                  Your current ranking is among the{" "}
                  <span className="text-white font-black">Top 5%</span> of this
                  session's academy aspirants.
                </p>
              </div>
            </section>
          )}

          <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 p-10 rounded-[3.5rem] text-white shadow-2xl shadow-blue-500/20 relative group overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                <Phone size={28} className="text-white" />
              </div>
              <h4 className="text-2xl font-black mb-4 uppercase tracking-tighter leading-tight">
                Student <br />
                Helpline
              </h4>
              <p className="text-blue-100 text-[11px] font-medium leading-relaxed mb-10 opacity-80">
                Connected with academic advisors for clinic internship queries
                or digital platform support.
              </p>
              <button className="w-full bg-white hover:bg-blue-50 text-blue-900 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                Connect Now <ChevronRight size={16} />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
