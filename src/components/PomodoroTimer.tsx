/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  Coffee, 
  Sparkles, 
  Check, 
  Calendar as CalendarIcon,
  Volume2, 
  VolumeX,
  Target,
  Award,
  BookOpen,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Zap,
  Info
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, limit } from "firebase/firestore";

export interface StudySession {
  id?: string;
  userEmail: string;
  task: string;
  durationMinutes: number;
  completedAt: Date | any;
  mode: 'work' | 'short_break' | 'long_break';
}

interface PomodoroTimerProps {
  user: {
    email: string;
    name?: string;
    displayName?: string;
  } | null;
}

interface DaySummary {
  date: Date;
  dateKey: string;
  dayLabel: string;
  shortDate: string;
  totalMinutes: number;
  sessionsCount: number;
  isToday: boolean;
  tasks: string[];
}

const MOTIVATIONAL_QUOTES = [
  { en: "The stethoscope fits those who persist! Keep studying.", bn: "স্টেথোস্কোপ তাদেরই মানায় যারা অবিচল থাকে! অধ্যয়ন চালিয়ে যান।" },
  { en: "Your dedication today determines a patient's smile tomorrow.", bn: "আজ আপনার একাগ্রতা নির্ধারণ করবে আগামীকাল রোগীর হাসি।" },
  { en: "Honorable medical technologists are the silent backbone of healthcare.", bn: "সম্মানিত মেডিকেল টেকনোলজিস্টরা স্বাস্থ্যসেবার নীরব মেরুদণ্ড।" },
  { en: "Deep study builds sharp diagnostic minds. Keep going!", bn: "গভীর পড়াশোনা তীক্ষ্ণ ডায়াগনস্টিক মন গড়ে তোলে। চালিয়ে যান!" },
  { en: "Great things come from small focused efforts. One session at a time.", bn: "ছোট ছোট মনোযোগী প্রচেষ্টা থেকেই বড় সাফল্য আসে। প্রতিটি সেশন মূল্যবান।" }
];

const DAILY_GOAL_OPTIONS = [30, 45, 60, 90, 120];

export default function PomodoroTimer({ user }: PomodoroTimerProps) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  // Timer Configuration (minutes)
  const [workTime, setWorkTime] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);

  // Daily target goal (minutes)
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(() => {
    const saved = localStorage.getItem(`pomodoro_goal_${user?.email || "guest"}`);
    return saved ? parseInt(saved, 10) : 60;
  });

  const [mode, setMode] = useState<'work' | 'short_break' | 'long_break'>('work');
  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [task, setTask] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'consistency' | 'logs'>('overview');
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  // Stats & Sessions
  const [sessionLogs, setSessionLogs] = useState<StudySession[]>([]);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Total seconds for current mode
  const totalSeconds = mode === 'work' ? workTime * 60 : mode === 'short_break' ? shortBreak * 60 : longBreak * 60;
  const progress = totalSeconds > 0 ? (timeLeft / totalSeconds) * 100 : 0;

  // Sync daily target changes to localStorage
  const handleUpdateDailyGoal = (goal: number) => {
    setDailyGoalMinutes(goal);
    localStorage.setItem(`pomodoro_goal_${user?.email || "guest"}`, goal.toString());
  };

  // Initialize timer when mode or base configurations change
  useEffect(() => {
    if (!isRunning) {
      if (mode === 'work') {
        setTimeLeft(workTime * 60);
      } else if (mode === 'short_break') {
        setTimeLeft(shortBreak * 60);
      } else {
        setTimeLeft(longBreak * 60);
      }
    }
  }, [mode, workTime, shortBreak, longBreak]);

  // Load history & streak of sessions
  const loadSessions = async () => {
    try {
      // 1. First load from Local Storage as immediate cache
      const cached = localStorage.getItem(`pomodoro_logs_${user?.email || "guest"}`);
      let localLogs: StudySession[] = [];
      if (cached) {
        try {
          localLogs = JSON.parse(cached).map((l: any) => ({
            ...l,
            completedAt: new Date(l.completedAt)
          }));
          setSessionLogs(localLogs);
        } catch {
          // ignore corrupted json
        }
      }

      // 2. Fetch from Firestore if user is logged in
      if (user?.email && db) {
        let fbLogs: StudySession[] = [];
        try {
          const q = query(
            collection(db, "study_sessions"),
            where("userEmail", "==", user.email),
            orderBy("completedAt", "desc"),
            limit(100)
          );
          const snapshot = await getDocs(q);
          snapshot.forEach((dt) => {
            const item = dt.data();
            fbLogs.push({
              id: dt.id,
              userEmail: item.userEmail,
              task: item.task,
              durationMinutes: item.durationMinutes || 0,
              completedAt: item.completedAt?.toDate ? item.completedAt.toDate() : new Date(item.completedAt || Date.now()),
              mode: item.mode || 'work'
            });
          });
        } catch (queryErr) {
          // Fallback if composite index is building or not present
          console.warn("Retrying with non-ordered query:", queryErr);
          const qSimple = query(
            collection(db, "study_sessions"),
            where("userEmail", "==", user.email),
            limit(100)
          );
          const snapshot = await getDocs(qSimple);
          snapshot.forEach((dt) => {
            const item = dt.data();
            fbLogs.push({
              id: dt.id,
              userEmail: item.userEmail,
              task: item.task,
              durationMinutes: item.durationMinutes || 0,
              completedAt: item.completedAt?.toDate ? item.completedAt.toDate() : new Date(item.completedAt || Date.now()),
              mode: item.mode || 'work'
            });
          });
          // Sort descending locally
          fbLogs.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
        }

        if (fbLogs.length > 0) {
          setSessionLogs(fbLogs);
          localStorage.setItem(`pomodoro_logs_${user.email}`, JSON.stringify(fbLogs));
        } else if (localLogs.length === 0) {
          // Seed with a few helpful initial sessions so the consistency chart looks welcoming
          const initialSeed: StudySession[] = [
            {
              userEmail: user.email,
              task: isEn ? "Anatomy & Physiology Revision" : "অ্যানাটমি ও ফিজিওলজি রিভিশন",
              durationMinutes: 30,
              completedAt: new Date(Date.now() - 24 * 3600 * 1000 * 2),
              mode: 'work'
            },
            {
              userEmail: user.email,
              task: isEn ? "Biochemistry MCQ Practice" : "বায়োকেমিস্ট্রি MCQ অনুশীলন",
              durationMinutes: 45,
              completedAt: new Date(Date.now() - 24 * 3600 * 1000),
              mode: 'work'
            },
            {
              userEmail: user.email,
              task: isEn ? "Medical Technology Core Notes" : "মেডিকেল টেকনোলজি কোর নোটস",
              durationMinutes: 25,
              completedAt: new Date(),
              mode: 'work'
            }
          ];
          setSessionLogs(initialSeed);
          localStorage.setItem(`pomodoro_logs_${user.email}`, JSON.stringify(initialSeed));
        }
      }
    } catch (e) {
      console.error("Failed to fetch sessions from Firestore:", e);
    }
  };

  useEffect(() => {
    loadSessions();
    setQuoteIndex(Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length));
  }, [user?.email]);

  // Handle timer tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, mode]);

  // Audio Synth Alert (no external audio assets needed)
  const playAlertSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc1.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.3); // C6

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
      osc2.frequency.exponentialRampToValueAtTime(1318.51, audioCtx.currentTime + 0.35); // E6

      gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);

      osc1.start();
      osc2.start();
      osc1.stop(audioCtx.currentTime + 1.3);
      osc2.stop(audioCtx.currentTime + 1.3);
    } catch (e) {
      console.warn("Audio Context blocked or failed:", e);
    }
  };

  // Session completion logic
  const handleSessionComplete = async () => {
    setIsRunning(false);
    playAlertSound();

    const completedSeconds = totalSeconds;
    const completedMinutes = Math.max(1, Math.round(completedSeconds / 60));

    const sessionTask = task.trim() || (mode === 'work' ? (isEn ? "General Focus Session" : "সাধারণ ফোকাস সেশন") : (isEn ? "Study Break" : "অধ্যয়ন বিরতি"));

    const newSession: StudySession = {
      userEmail: user?.email || "guest@iht.org",
      task: sessionTask,
      durationMinutes: completedMinutes,
      completedAt: new Date(),
      mode: mode
    };

    // Update local state immediately
    const updatedLogs = [newSession, ...sessionLogs].slice(0, 100);
    setSessionLogs(updatedLogs);
    localStorage.setItem(`pomodoro_logs_${user?.email || "guest"}`, JSON.stringify(updatedLogs));

    // Persist to database if signed in
    if (user?.email && db) {
      try {
        await addDoc(collection(db, "study_sessions"), {
          userEmail: user.email,
          task: sessionTask,
          durationMinutes: completedMinutes,
          completedAt: serverTimestamp(),
          mode: mode
        });
      } catch (err) {
        console.error("Failed to save focus session to Firestore:", err);
      }
    }

    // Switch to alternate mode
    if (mode === 'work') {
      alertNotify(isEn ? "Focus Session Complete! Take a well-deserved break." : "ফোকাস সেশন সম্পন্ন হয়েছে! এবার একটি প্রশান্ত বিরতি নিন।");
      setMode('short_break');
    } else {
      alertNotify(isEn ? "Break complete. Time to focus!" : "বিরতি শেষ। পুনরায় পড়াশোনায় মনোনিবেশ করুন!");
      setMode('work');
    }

    // Advance quote
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const alertNotify = (msg: string) => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification("IHT Admission Academy Study Timer", { body: msg });
    }
  };

  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  const formatTimerValue = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPercentageString = () => {
    return `${Math.round(progress)}%`;
  };

  // -------------------------------------------------------------
  // DAILY SUMMARY & 7-DAY STUDY CONSISTENCY AGGREGATION
  // -------------------------------------------------------------
  const { past7Days, todayStats, weekTotalMinutes, activeDaysCount, maxDailyMinutes, consistencyRate } = useMemo(() => {
    const now = new Date();
    const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const days: DaySummary[] = [];

    // Construct the last 7 calendar days (from 6 days ago up to today)
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      
      const dayNamesEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayNamesBn = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"];
      const monthNamesEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthNamesBn = ["জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টে", "অক্টো", "নভে", "ডিসে"];

      const dayIdx = d.getDay();
      const monthIdx = d.getMonth();
      const isToday = (dateKey === todayKey);

      let dayLabel = isEn ? dayNamesEn[dayIdx] : dayNamesBn[dayIdx];
      if (isToday) {
        dayLabel = isEn ? "Today" : "আজ";
      }

      const shortDate = isEn 
        ? `${d.getDate()} ${monthNamesEn[monthIdx]}` 
        : `${d.getDate()} ${monthNamesBn[monthIdx]}`;

      // Aggregate sessions that occurred on this specific day
      let dayMins = 0;
      let count = 0;
      const tasks: string[] = [];

      sessionLogs.forEach((sess) => {
        const sessDate = sess.completedAt instanceof Date 
          ? sess.completedAt 
          : new Date(sess.completedAt || Date.now());
        const sessKey = `${sessDate.getFullYear()}-${String(sessDate.getMonth() + 1).padStart(2, '0')}-${String(sessDate.getDate()).padStart(2, '0')}`;

        if (sessKey === dateKey && sess.mode === 'work') {
          dayMins += sess.durationMinutes || 0;
          count += 1;
          if (sess.task && !tasks.includes(sess.task)) {
            tasks.push(sess.task);
          }
        }
      });

      days.push({
        date: d,
        dateKey,
        dayLabel,
        shortDate,
        totalMinutes: dayMins,
        sessionsCount: count,
        isToday,
        tasks
      });
    }

    const todayObj = days.find((d) => d.isToday) || {
      date: now,
      dateKey: todayKey,
      dayLabel: isEn ? "Today" : "আজ",
      shortDate: `${now.getDate()} ${now.getMonth() + 1}`,
      totalMinutes: 0,
      sessionsCount: 0,
      isToday: true,
      tasks: []
    };

    const weekTotal = days.reduce((acc, d) => acc + d.totalMinutes, 0);
    const activeDays = days.filter((d) => d.totalMinutes > 0).length;
    const maxMins = Math.max(...days.map((d) => d.totalMinutes), dailyGoalMinutes, 60);
    const consistency = Math.round((activeDays / 7) * 100);

    return {
      past7Days: days,
      todayStats: todayObj,
      weekTotalMinutes: weekTotal,
      activeDaysCount: activeDays,
      maxDailyMinutes: maxMins,
      consistencyRate: consistency
    };
  }, [sessionLogs, isEn, dailyGoalMinutes]);

  const selectedDay = useMemo(() => {
    if (!selectedDayKey) return todayStats;
    return past7Days.find(d => d.dateKey === selectedDayKey) || todayStats;
  }, [selectedDayKey, past7Days, todayStats]);

  const todayGoalPercent = Math.min(100, Math.round((todayStats.totalMinutes / dailyGoalMinutes) * 100));
  const isGoalAchieved = todayStats.totalMinutes >= dailyGoalMinutes;

  return (
    <section className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-[3.5rem] border border-white/60 shadow-2xl shadow-blue-500/5 relative overflow-hidden group">
      {/* Subtle background ambient icon */}
      <div className="absolute top-0 right-0 p-5 opacity-5 pointer-events-none">
        <Flame size={90} className="text-orange-500 animate-pulse" />
      </div>

      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Flame size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                {isEn ? "Study Pomodoro & Consistency" : "অধ্যয়ন পোমোডোরো ও দৈনিক সামারি"}
              </h3>
              {isGoalAchieved && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 size={11} /> {isEn ? "Goal Met" : "লক্ষ্য অর্জিত"}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              {isEn ? "Track daily focused minutes & study habits" : "দৈনিক পড়ালেখার মিনিট ও ধারাবাহিকতা পর্যবেক্ষণ করুন"}
            </p>
          </div>
        </div>

        {/* View Navigation Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Clock size={12} />
              {isEn ? "Timer" : "টাইমার"}
            </button>
            <button
              onClick={() => setActiveTab('consistency')}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'consistency' ? 'bg-white text-slate-900 shadow-sm text-orange-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <BarChart3 size={12} />
              {isEn ? "Daily Summary" : "দৈনিক সামারি"}
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'logs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <BookOpen size={12} />
              {isEn ? "Logs" : "লগস"}
            </button>
          </div>

          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl transition-all cursor-pointer border ${soundEnabled ? 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}
            title={soundEnabled ? "Mute sound alerts" : "Enable sound alerts"}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>

      {/* TODAY'S DAILY SUMMARY HERO CARD (Always Visible for Quick Clarity) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-5 sm:p-6 rounded-3xl text-white shadow-xl shadow-slate-900/10 mb-8 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Left: Today's Focus Metrics */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-400">
              <CalendarIcon size={14} className="text-orange-400" />
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-300">
                {isEn ? "Today's Study Focus" : "আজকের ফোকাস স্টাডি"} • {todayStats.shortDate}
              </span>
            </div>
            
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                {todayStats.totalMinutes}
              </span>
              <span className="text-sm font-black uppercase tracking-widest text-orange-400">
                {isEn ? "Minutes Focused" : "মিনিট মনোযোগ"}
              </span>
              <span className="text-xs text-slate-400 font-bold">
                / {dailyGoalMinutes} {isEn ? "min goal" : "মিনিট টার্গেট"}
              </span>
            </div>

            {/* Goal Progress bar */}
            <div className="w-full max-w-md pt-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1">
                <span>{isEn ? "Daily Goal Progress" : "দৈনিক লক্ষ্যের অগ্রগতি"}</span>
                <span className={`font-black ${todayGoalPercent >= 100 ? 'text-emerald-400' : 'text-orange-300'}`}>
                  {todayGoalPercent}% {todayGoalPercent >= 100 ? "✓" : ""}
                </span>
              </div>
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5">
                <motion.div
                  className={`h-full rounded-full ${todayGoalPercent >= 100 ? 'bg-gradient-to-r from-emerald-400 to-teal-300' : 'bg-gradient-to-r from-orange-400 to-amber-300'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${todayGoalPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          {/* Right: Quick Daily Target Chooser & Consistency Badge */}
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center gap-4 bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1.5 flex items-center gap-1">
                <Target size={11} className="text-orange-400" />
                {isEn ? "Set Daily Target" : "দৈনিক টার্গেট সেট করুন"}
              </span>
              <div className="flex items-center gap-1">
                {DAILY_GOAL_OPTIONS.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => handleUpdateDailyGoal(goal)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${dailyGoalMinutes === goal ? 'bg-orange-500 text-white shadow-md' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
                  >
                    {goal}m
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-4">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                {isEn ? "7-Day Consistency" : "৭ দিনের ধারাবাহিকতা"}
              </span>
              <div className="flex items-center gap-2">
                <div className="text-xl font-black text-emerald-400">
                  {consistencyRate}%
                </div>
                <div className="text-[9px] text-slate-400 font-bold leading-tight">
                  {activeDaysCount} {isEn ? "of 7 days" : "দিন উপস্থিত"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: TIMER INTERACTION VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Mode Selectors */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            {[
              { id: 'work', label: isEn ? 'Study Work' : 'অফিসিয়াল পড়া', icon: Flame, color: 'text-orange-500 bg-orange-50' },
              { id: 'short_break', label: isEn ? 'Short Break' : 'ছোট বিরতি', icon: Coffee, color: 'text-blue-500 bg-blue-50' },
              { id: 'long_break', label: isEn ? 'Long Break' : 'দীর্ঘ বিরতি', icon: Sparkles, color: 'text-indigo-500 bg-indigo-50' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  if (isRunning) {
                    if (window.confirm(isEn ? "Switching modes will reset current timer. Continue?" : "মোড পরিবর্তন করলে রানিং টাইমার রিসেট হবে। আপনি কি নিশ্চিত?")) {
                      setMode(m.id as any);
                      setIsRunning(false);
                    }
                  } else {
                    setMode(m.id as any);
                  }
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${mode === m.id ? 'bg-white text-slate-900 shadow-md scale-[1.01] border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <m.icon size={13} className={mode === m.id ? m.color : 'text-slate-300'} />
                <span className="truncate">{m.label}</span>
              </button>
            ))}
          </div>

          {/* Countdown Display & Controls */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12">
            {/* Circular Countdown Tracker */}
            <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="82"
                  className="stroke-slate-100"
                  strokeWidth="12"
                  fill="transparent"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="82"
                  className={`${mode === 'work' ? 'stroke-orange-500' : mode === 'short_break' ? 'stroke-blue-500' : 'stroke-indigo-500'}`}
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 82}
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: (2 * Math.PI * 82) * (1 - progress / 100) }}
                  transition={{ ease: "linear", duration: 0.5 }}
                  strokeLinecap="round"
                />
              </svg>

              {/* Digital Time Readout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black tracking-tighter text-slate-800 leading-tight">
                  {formatTimerValue(timeLeft)}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                  {mode === 'work' ? (isEn ? "Deep Focus" : "মনোযোগ") : (isEn ? "Break Time" : "বিরতি")}
                </span>
                <span className="text-[9px] font-bold text-orange-500 tracking-tight mt-0.5">
                  {getPercentageString()}
                </span>
              </div>
            </div>

            {/* Inputs & Action Buttons */}
            <div className="flex-1 w-full space-y-5">
              {/* Task Objective Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-1.5">
                  <Target size={12} className="text-orange-500" />
                  {isEn ? "Current Learning Objective" : "বর্তমান পড়াশোনার লক্ষ্য"}
                </label>
                <input
                  type="text"
                  placeholder={isEn ? "e.g., Physiology Nervous System, Anatomy Bones..." : "যেমন: অ্যানাটমি কঙ্কালতন্ত্র, ফিজিওলজি রিভিশন..."}
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 focus:ring-4 ring-orange-100 outline-none transition-all placeholder:text-slate-300"
                />
              </div>

              {/* Quick Length Adjusters */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 text-center">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                    {isEn ? "Work" : "পড়া"}
                  </span>
                  <div className="flex justify-center items-center gap-1">
                    <button 
                      onClick={() => setWorkTime(Math.max(5, workTime - 5))} 
                      className="w-5 h-5 text-xs bg-white border border-slate-200 rounded flex items-center justify-center cursor-pointer font-black hover:bg-slate-50"
                    >
                      -
                    </button>
                    <span className="text-xs font-black text-slate-700">{workTime}m</span>
                    <button 
                      onClick={() => setWorkTime(Math.min(60, workTime + 5))} 
                      className="w-5 h-5 text-xs bg-white border border-slate-200 rounded flex items-center justify-center cursor-pointer font-black hover:bg-slate-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 text-center">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                    {isEn ? "Break" : "বিরতি"}
                  </span>
                  <div className="flex justify-center items-center gap-1">
                    <button 
                      onClick={() => setShortBreak(Math.max(1, shortBreak - 1))} 
                      className="w-5 h-5 text-xs bg-white border border-slate-200 rounded flex items-center justify-center cursor-pointer font-black hover:bg-slate-50"
                    >
                      -
                    </button>
                    <span className="text-xs font-black text-slate-700">{shortBreak}m</span>
                    <button 
                      onClick={() => setShortBreak(Math.min(15, shortBreak + 1))} 
                      className="w-5 h-5 text-xs bg-white border border-slate-200 rounded flex items-center justify-center cursor-pointer font-black hover:bg-slate-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 text-center">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                    {isEn ? "Long Break" : "বড় বিরতি"}
                  </span>
                  <div className="flex justify-center items-center gap-1">
                    <button 
                      onClick={() => setLongBreak(Math.max(5, longBreak - 5))} 
                      className="w-5 h-5 text-xs bg-white border border-slate-200 rounded flex items-center justify-center cursor-pointer font-black hover:bg-slate-50"
                    >
                      -
                    </button>
                    <span className="text-xs font-black text-slate-700">{longBreak}m</span>
                    <button 
                      onClick={() => setLongBreak(Math.min(45, longBreak + 5))} 
                      className="w-5 h-5 text-xs bg-white border border-slate-200 rounded flex items-center justify-center cursor-pointer font-black hover:bg-slate-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer ${isRunning ? 'bg-slate-900 border border-slate-800 text-white hover:bg-black/90' : 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20'}`}
                >
                  {isRunning ? <Pause size={15} /> : <Play size={15} />}
                  {isRunning ? (isEn ? "Pause Session" : "সেশন থামান") : (isEn ? "Start Focused Session" : "ফোকাস সেশন শুরু")}
                </button>
                
                <button
                  onClick={() => {
                    if (window.confirm(isEn ? "Reset current session?" : "আপনি কি বর্তমান সেশনটি রিসেট করতে চান?")) {
                      setIsRunning(false);
                      setTimeLeft(totalSeconds);
                    }
                  }}
                  className="p-4 bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-2xl transition-all cursor-pointer"
                  title="Reset Timer"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Motivational Snippet */}
          <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl text-center">
            <p className="text-xs font-bold text-orange-700 leading-relaxed max-w-xl mx-auto italic">
              "{isEn ? MOTIVATIONAL_QUOTES[quoteIndex].en : MOTIVATIONAL_QUOTES[quoteIndex].bn}"
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: DAILY SUMMARY & 7-DAY CONSISTENCY VISUALIZER */}
      {/* ------------------------------------------------------------- */}
      {(activeTab === 'consistency' || activeTab === 'overview') && (
        <div className="mt-8 pt-8 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BarChart3 size={15} className="text-orange-500" />
                {isEn ? "Daily Study Consistency (Past 7 Days)" : "দৈনিক স্টাডি কনসিস্টেন্সি ও সময় গ্রাফ (গত ৭ দিন)"}
              </h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                {isEn ? "Click any bar to inspect daily breakdown" : "নির্দিষ্ট দিনের বিবরণ দেখতে বারে ক্লিক করুন"}
              </p>
            </div>

            <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 inline-block" />
                {isEn ? "Study Time" : "পড়ার সময়"}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block" />
                {isEn ? "Goal Met (≥" + dailyGoalMinutes + "m)" : "টার্গেট পূরণ"}
              </span>
            </div>
          </div>

          {/* 7-DAY VISUAL CONSISTENCY BAR CHART */}
          <div className="bg-slate-50/70 p-5 rounded-3xl border border-slate-100 mb-6">
            <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-44 pt-6 pb-2">
              {past7Days.map((day) => {
                const heightPercent = maxDailyMinutes > 0 ? Math.min(100, Math.round((day.totalMinutes / maxDailyMinutes) * 100)) : 0;
                const metGoal = day.totalMinutes >= dailyGoalMinutes;
                const isSelected = selectedDay.dateKey === day.dateKey;

                return (
                  <div
                    key={day.dateKey}
                    onClick={() => setSelectedDayKey(day.dateKey)}
                    className="flex flex-col items-center justify-end h-full group/bar cursor-pointer"
                  >
                    {/* Top Minute Label */}
                    <span className={`text-[10px] font-black mb-1.5 transition-all ${isSelected ? 'text-orange-600 scale-110' : 'text-slate-400 group-hover/bar:text-slate-700'}`}>
                      {day.totalMinutes > 0 ? `${day.totalMinutes}m` : "0m"}
                    </span>

                    {/* Bar Container */}
                    <div className="w-full max-w-[36px] bg-slate-200/60 rounded-xl h-28 flex items-end p-1 relative overflow-hidden">
                      {/* Daily Goal Reference Mark */}
                      <div 
                        className="absolute left-0 right-0 border-b border-dashed border-slate-400/40 z-10 pointer-events-none"
                        style={{ bottom: `${Math.min(95, (dailyGoalMinutes / maxDailyMinutes) * 100)}%` }}
                        title={`Daily Goal: ${dailyGoalMinutes}m`}
                      />

                      {/* Animated Active Bar */}
                      <motion.div
                        className={`w-full rounded-lg transition-all ${metGoal ? 'bg-gradient-to-t from-emerald-500 to-teal-400 shadow-md shadow-emerald-500/20' : day.totalMinutes > 0 ? 'bg-gradient-to-t from-orange-500 to-amber-400 shadow-md shadow-orange-500/20' : 'bg-transparent'} ${isSelected ? 'ring-2 ring-slate-900' : ''}`}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(day.totalMinutes > 0 ? 12 : 0, heightPercent)}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>

                    {/* Day & Date Labels */}
                    <div className="text-center mt-2">
                      <span className={`block text-[10px] font-black uppercase tracking-tight ${day.isToday ? 'text-orange-600 font-extrabold' : isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                        {day.dayLabel}
                      </span>
                      <span className="block text-[8px] font-bold text-slate-400">
                        {day.date.getDate()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* INSPECTION CARD FOR SELECTED DAY */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedDay.totalMinutes >= dailyGoalMinutes ? 'bg-emerald-100 text-emerald-600' : selectedDay.totalMinutes > 0 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                {selectedDay.totalMinutes >= dailyGoalMinutes ? <CheckCircle2 size={20} /> : <Clock size={20} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="text-sm font-black text-slate-800">
                    {selectedDay.dayLabel} ({selectedDay.shortDate})
                  </h5>
                  {selectedDay.isToday && (
                    <span className="text-[9px] bg-orange-100 text-orange-700 font-black px-2 py-0.5 rounded-md">
                      {isEn ? "Today" : "আজ"}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-bold mt-0.5">
                  {selectedDay.totalMinutes} {isEn ? "minutes across" : "মিনিট মনোযোগ"} {selectedDay.sessionsCount} {isEn ? "sessions" : "সেশনে"}
                  {selectedDay.tasks.length > 0 && ` • ${selectedDay.tasks.slice(0, 2).join(", ")}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t sm:border-t-0 pt-2 sm:pt-0">
              <div className="text-right">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                  {isEn ? "Target Status" : "টার্গেট অবস্থা"}
                </span>
                <span className={`text-xs font-black ${selectedDay.totalMinutes >= dailyGoalMinutes ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {selectedDay.totalMinutes >= dailyGoalMinutes 
                    ? (isEn ? "Achieved 🎉" : "সম্পন্ন 🎉") 
                    : `${Math.max(0, dailyGoalMinutes - selectedDay.totalMinutes)}m ${isEn ? "remaining" : "বাকি"}`}
                </span>
              </div>
            </div>
          </div>

          {/* 3 STAT METRICS TILES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                <Award size={18} />
              </div>
              <div>
                <span className="text-base font-black text-slate-800 block">
                  {weekTotalMinutes} {isEn ? "mins" : "মিনিট"}
                </span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                  {isEn ? "7-Day Total Focus" : "৭ দিনে মোট পড়া"}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <TrendingUp size={18} />
              </div>
              <div>
                <span className="text-base font-black text-slate-800 block">
                  {Math.round(weekTotalMinutes / (activeDaysCount || 1))} {isEn ? "min/active day" : "মিনিট/দিন"}
                </span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                  {isEn ? "Daily Study Average" : "দৈনিক গড় সময়"}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <Zap size={18} />
              </div>
              <div>
                <span className="text-base font-black text-slate-800 block">
                  {activeDaysCount} / 7 {isEn ? "Days" : "দিন"}
                </span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                  {isEn ? "Study Consistency" : "ধারাবাহিক দিন"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: FOCUS SESSION LOGS */}
      {/* ------------------------------------------------------------- */}
      {(activeTab === 'logs' || activeTab === 'overview') && (
        <div className="mt-8 pt-8 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4 px-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <BookOpen size={12} />
              {isEn ? "Recent Study Session Logs" : "সাম্প্রতিক স্টাডি সেশন লগস"}
            </h4>
            <span className="text-[9px] font-black text-slate-400 uppercase">
              {sessionLogs.length} {isEn ? "Recorded" : "রেকর্ডকৃত"}
            </span>
          </div>

          {sessionLogs.length > 0 ? (
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {sessionLogs.map((log, index) => {
                const logDate = log.completedAt instanceof Date 
                  ? log.completedAt 
                  : new Date(log.completedAt || Date.now());

                return (
                  <div 
                    key={log.id || index}
                    className="flex items-center justify-between p-3 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${log.mode === 'work' ? 'bg-orange-500 shadow-sm shadow-orange-500/50' : 'bg-blue-500'}`} />
                      <div className="min-w-0">
                        <span className="text-xs font-black text-slate-800 block truncate uppercase tracking-tight">
                          {log.task}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold block">
                          {logDate.toLocaleDateString([], { month: 'short', day: 'numeric' })} • {logDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-100 shrink-0">
                      <Check size={11} className="text-emerald-500" />
                      <span className="text-[10px] font-black text-slate-700">
                        {log.durationMinutes}m
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs font-bold text-slate-400">
                {isEn ? "No sessions completed yet. Start your first focus session above!" : "এখনো কোনো সেশন সম্পন্ন হয়নি। উপরে প্রথম ফোকাস সেশনটি শুরু করুন!"}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
