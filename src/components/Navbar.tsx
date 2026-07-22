import React from "react";
import {
  Sparkles,
  Sun,
  Moon,
  Search,
  User as UserIcon,
  Flame,
  CheckCircle2,
  Clock,
  BookOpen
} from "lucide-react";
import { AppState } from "../types";

interface NavbarProps {
  state: AppState;
  onToggleTheme: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenAI: () => void;
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  onToggleTheme,
  onOpenAuth,
  onOpenProfile,
  onOpenAI,
  onSearchChange,
  searchQuery = "",
}) => {
  const { user, theme, stats } = state;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 md:px-6">
      {/* Brand & Search */}
      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-500/20">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 bg-clip-text text-lg font-bold tracking-tight text-transparent dark:from-indigo-400 dark:via-blue-400 dark:to-violet-400">
              StudyMate AI
            </span>
            <span className="ml-1.5 hidden rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 sm:inline-block">
              PRO
            </span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden w-64 md:block lg:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks, homework, subjects..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-sm text-slate-900 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-800"
          />
        </div>
      </div>

      {/* Action Controls & User Info */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak Pill */}
        <div
          title="Current Study Streak"
          className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50"
        >
          <Flame className="h-4 w-4 text-amber-500 animate-pulse" />
          <span>{stats.currentStreakDays} Day Streak</span>
        </div>

        {/* Quick Launch AI Assistant Button */}
        <button
          onClick={onOpenAI}
          className="group relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition hover:shadow-md hover:from-indigo-500 hover:to-blue-500 active:scale-95 sm:text-sm"
        >
          <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
          <span className="hidden sm:inline">Ask AI Tutor</span>
          <span className="sm:hidden">AI</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
        >
          {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
        </button>

        {/* User Account Avatar / Auth Button */}
        {user ? (
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 py-1 pr-3 pl-1 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/80 dark:hover:bg-slate-700"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-sm">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="hidden text-xs font-semibold text-slate-700 dark:text-slate-200 md:inline-block max-w-[100px] truncate">
              {user.name}
            </span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/80"
          >
            <UserIcon className="h-4 w-4" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
