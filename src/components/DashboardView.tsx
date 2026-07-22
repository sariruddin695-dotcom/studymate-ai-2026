import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  FileText,
  Flame,
  Plus,
  ArrowRight,
  BookOpen,
  Calendar,
  Zap,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { AppState, StudyTask, HomeworkItem } from "../types";
import { NavTab } from "./Sidebar";

interface DashboardViewProps {
  state: AppState;
  onNavigate: (tab: NavTab) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onOpenAddTask: () => void;
  onOpenAddHomework: () => void;
  onAskAIQuick: (question: string) => void;
  onOpenPomodoro: () => void;
}

const MOTIVATIONAL_QUOTES = [
  "“An investment in knowledge pays the best interest.” – Benjamin Franklin",
  "“Success is the sum of small efforts repeated day in and day out.” – Robert Collier",
  "“The expert in anything was once a beginner.” – Helen Hayes",
  "“Focus on progress, not perfection.”",
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  onNavigate,
  onToggleTaskComplete,
  onOpenAddTask,
  onOpenAddHomework,
  onAskAIQuick,
  onOpenPomodoro,
}) => {
  const { user, tasks, homework, timetable, stats } = state;
  const [quickQuestion, setQuickQuestion] = useState("");

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const pendingHomework = homework.filter((h) => h.status !== "completed" && h.status !== "submitted");

  const todayStr = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const todaySchedule = timetable.filter(
    (s) => s.day.toLowerCase() === todayStr.toLowerCase()
  );

  const randomQuote = MOTIVATIONAL_QUOTES[new Date().getDate() % MOTIVATIONAL_QUOTES.length];

  const handleQuickQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuestion.trim()) return;
    onAskAIQuick(quickQuestion);
    setQuickQuestion("");
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-700 p-6 text-white shadow-xl shadow-indigo-500/10 md:p-8">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 right-20 h-48 w-48 rounded-full bg-indigo-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Welcome back, {user?.name || "Student"}! 👋
            </h1>
            <p className="text-xs text-indigo-100 sm:text-sm font-medium leading-relaxed italic">
              {randomQuote}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenPomodoro}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-indigo-700 shadow-md transition hover:bg-indigo-50 active:scale-95 sm:text-sm"
            >
              <Clock className="h-4 w-4 text-indigo-600 animate-spin-slow" />
              <span>Pomodoro Timer</span>
            </button>
            <button
              onClick={() => onNavigate("ai")}
              className="flex items-center gap-2 rounded-xl bg-indigo-500/40 px-4 py-2.5 text-xs font-bold text-white border border-white/20 backdrop-blur-md transition hover:bg-indigo-500/60 active:scale-95 sm:text-sm"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>AI Study Hub</span>
            </button>
          </div>
        </div>

        {/* Quick AI Question Input Bar */}
        <form
          onSubmit={handleQuickQuestionSubmit}
          className="relative z-10 mt-6 flex items-center rounded-2xl bg-white/10 p-1.5 border border-white/20 backdrop-blur-md"
        >
          <Sparkles className="ml-3 h-5 w-5 text-amber-300 flex-shrink-0" />
          <input
            type="text"
            placeholder="Ask AI Study Assistant anything (e.g. 'Explain photosynthesis simply', 'Integration formula')..."
            value={quickQuestion}
            onChange={(e) => setQuickQuestion(e.target.value)}
            className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-indigo-200 focus:outline-none sm:text-sm"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-indigo-700 shadow transition hover:bg-indigo-50 active:scale-95"
          >
            <span>Ask</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Metric 1: Pending Tasks */}
        <div
          onClick={() => onNavigate("tasks")}
          className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Pending Tasks</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {pendingTasks.length}
            </span>
            <span className="text-xs text-slate-500">/ {tasks.length} total</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-1.5 rounded-full bg-indigo-600 transition-all duration-500"
              style={{
                width: `${tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Metric 2: Due Homework */}
        <div
          onClick={() => onNavigate("homework")}
          className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Homework Due</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {pendingHomework.length}
            </span>
            <span className="text-xs text-slate-500">assignments</span>
          </div>
          <p className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Check deadlines</span>
          </p>
        </div>

        {/* Metric 3: Study Hours Logged */}
        <div
          onClick={() => onNavigate("progress")}
          className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-violet-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Study Time</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {(stats.totalStudyMinutes / 60).toFixed(1)}
            </span>
            <span className="text-xs text-slate-500">hours total</span>
          </div>
          <p className="mt-2 text-xs text-violet-600 dark:text-violet-400 font-medium flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Keep logging time</span>
          </p>
        </div>

        {/* Metric 4: Streak & AI */}
        <div
          onClick={() => onNavigate("progress")}
          className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-amber-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Study Streak</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Flame className="h-5 w-5 animate-bounce" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              {stats.currentStreakDays} Days
            </span>
          </div>
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
            🔥 You're on a roll!
          </p>
        </div>
      </div>

      {/* Main Grid Section: Tasks & Schedule */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Active Study Tasks List */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Active Study Tasks
              </h2>
              <p className="text-xs text-slate-500">Focus on your immediate priorities</p>
            </div>
            <button
              onClick={onOpenAddTask}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300"
            >
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </button>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-500/40" />
              <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                All study tasks completed! 🎉
              </p>
              <p className="text-xs text-slate-500">Great job! Add new study goals to keep progressing.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 transition hover:bg-slate-100/80 dark:border-slate-800/80 dark:bg-slate-800/40 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleTaskComplete(task.id)}
                      className="flex h-5 w-5 items-center justify-center rounded-md border border-slate-300 bg-white text-transparent transition hover:border-indigo-600 dark:border-slate-700 dark:bg-slate-900"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {task.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          {task.subject}
                        </span>
                        <span>• {task.estimatedMinutes} mins</span>
                        <span>• Due {task.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      task.priority === "high"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                        : task.priority === "medium"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}

          {tasks.length > 5 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => onNavigate("tasks")}
                className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                View all {tasks.length} tasks →
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Widgets: Homework & Today Schedule */}
        <div className="space-y-6">
          {/* Homework Quick Deadlines */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>Upcoming Homework</span>
              </h3>
              <button
                onClick={onOpenAddHomework}
                className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                + Add
              </button>
            </div>

            {pendingHomework.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">No pending homework assignments.</p>
            ) : (
              <div className="space-y-2.5">
                {pendingHomework.slice(0, 3).map((hw) => (
                  <div
                    key={hw.id}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50"
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {hw.title}
                      </p>
                      <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {hw.subject}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">Due: {hw.dueDate}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's Timetable Slots */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-600" />
                <span>Today's Classes ({todayStr})</span>
              </h3>
              <button
                onClick={() => onNavigate("timetable")}
                className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Timetable
              </button>
            </div>

            {todaySchedule.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">No scheduled classes for today.</p>
            ) : (
              <div className="space-y-2">
                {todaySchedule.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5 dark:border-slate-800"
                  >
                    <div className={`h-8 w-1.5 rounded-full ${slot.color}`} />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {slot.subject}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {slot.startTime} - {slot.endTime} • {slot.topic || slot.location || "Study block"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
