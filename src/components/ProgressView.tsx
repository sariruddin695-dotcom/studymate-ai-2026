import React, { useState } from "react";
import {
  BarChart2,
  Clock,
  CheckCircle2,
  Flame,
  Award,
  TrendingUp,
  BookOpen,
  Plus,
  Zap,
  PieChart as PieIcon
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";
import { AppState, StudySessionLog } from "../types";

interface ProgressViewProps {
  state: AppState;
  onLogStudySession: (log: Omit<StudySessionLog, "id">) => void;
  onOpenPomodoro: () => void;
}

const COLORS = ["#4f46e5", "#2563eb", "#d97706", "#059669", "#7c3aed", "#e11d48"];

export const ProgressView: React.FC<ProgressViewProps> = ({
  state,
  onLogStudySession,
  onOpenPomodoro,
}) => {
  const { studyLogs, tasks, homework, stats } = state;

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logSubject, setLogSubject] = useState("Computer Science");
  const [logMinutes, setLogMinutes] = useState(45);
  const [logNotes, setLogNotes] = useState("");

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogStudySession({
      subject: logSubject,
      durationMinutes: logMinutes,
      date: new Date().toISOString().split("T")[0],
      notes: logNotes,
    });
    setIsLogModalOpen(false);
    setLogNotes("");
  };

  // Prepare BarChart Data: Study minutes grouped by date for last 7 days
  const last7DaysData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });

    const totalMins = studyLogs
      .filter((log) => log.date === dateStr)
      .reduce((sum, log) => sum + log.durationMinutes, 0);

    return {
      day: dayLabel,
      hours: Number((totalMins / 60).toFixed(1)),
      minutes: totalMins,
    };
  });

  // Prepare PieChart Data: Subject distribution
  const subjectTotals: Record<string, number> = {};
  studyLogs.forEach((log) => {
    subjectTotals[log.subject] = (subjectTotals[log.subject] || 0) + log.durationMinutes;
  });

  const pieChartData = Object.keys(subjectTotals).map((subj) => ({
    name: subj,
    value: Number((subjectTotals[subj] / 60).toFixed(1)),
  }));

  // Achievements Badges
  const badges = [
    { id: "b1", title: "Study Starter", desc: "Logged 1st study session", earned: studyLogs.length > 0, icon: "🎯" },
    { id: "b2", title: "Task Crusher", desc: "Completed 10+ tasks", earned: stats.completedTasksCount >= 10, icon: "✅" },
    { id: "b3", title: "Consistency King", desc: "Reached a 3-day streak", earned: stats.currentStreakDays >= 3, icon: "🔥" },
    { id: "b4", title: "AI Enthusiast", desc: "Used AI Study Tutor 5+ times", earned: stats.aiQueriesCount >= 5, icon: "🤖" },
    { id: "b5", title: "Marathon Scholar", desc: "Logged over 10 hours total", earned: stats.totalStudyMinutes >= 600, icon: "🏆" },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="h-7 w-7 text-indigo-600" />
            <span>Progress & Analytics Dashboard</span>
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            Track study hours, task completion trends, and earn achievement badges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPomodoro}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300"
          >
            <Clock className="h-4 w-4" />
            <span>Pomodoro Focus</span>
          </button>

          <button
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-indigo-700 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Log Study Minutes</span>
          </button>
        </div>
      </div>

      {/* Top Stats Overview Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Total Hours</span>
            <Clock className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {(stats.totalStudyMinutes / 60).toFixed(1)} hrs
          </div>
          <p className="mt-1 text-xs text-slate-500">{stats.totalStudyMinutes} minutes total</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Tasks Finished</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {stats.completedTasksCount}
          </div>
          <p className="mt-1 text-xs text-slate-500">Study goals achieved</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Current Streak</span>
            <Flame className="h-5 w-5 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {stats.currentStreakDays} Days
          </div>
          <p className="mt-1 text-xs text-slate-500">Daily study habit</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">AI Queries</span>
            <Zap className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {stats.aiQueriesCount}
          </div>
          <p className="mt-1 text-xs text-slate-500">Questions answered</p>
        </div>
      </div>

      {/* Recharts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weekly Hours Bar Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Weekly Study Hours Logged
          </h2>
          <p className="text-xs text-slate-500 mb-6">Daily focus duration over the past 7 days</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7DaysData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} unit="h" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="hours" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Breakdown Pie Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Subject Time Distribution
          </h2>
          <p className="text-xs text-slate-500 mb-4">Hours spent per subject</p>

          {pieChartData.length === 0 ? (
            <p className="text-xs text-slate-500 py-10 text-center">No study logs recorded yet.</p>
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[10px]">
                {pieChartData.map((entry, idx) => (
                  <span key={entry.name} className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    {entry.name} ({entry.value}h)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          <span>Study Badges & Achievements</span>
        </h2>
        <p className="text-xs text-slate-500 mb-4">Earn badges by staying consistent with your study schedule</p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition ${
                b.earned
                  ? "border-amber-200 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/20"
                  : "border-slate-100 bg-slate-50/50 opacity-40 dark:border-slate-800 dark:bg-slate-800/40"
              }`}
            >
              <span className="text-3xl">{b.icon}</span>
              <h3 className="mt-2 text-xs font-bold text-slate-900 dark:text-white">{b.title}</h3>
              <p className="mt-1 text-[10px] text-slate-500">{b.desc}</p>
              <span
                className={`mt-2 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                  b.earned ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-600 dark:bg-slate-700"
                }`}
              >
                {b.earned ? "UNLOCKED" : "LOCKED"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Study Minutes Logger Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Log Study Minutes</h2>
            <form onSubmit={handleLogSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={logSubject}
                  onChange={(e) => setLogSubject(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min={5}
                  step={5}
                  required
                  value={logMinutes}
                  onChange={(e) => setLogMinutes(parseInt(e.target.value) || 15)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Study Notes / Topics Covered
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Practiced 5 tree recursion problems"
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-indigo-700"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
