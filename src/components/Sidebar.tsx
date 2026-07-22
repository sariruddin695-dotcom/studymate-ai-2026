import React from "react";
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  Calendar,
  BarChart2,
  Sparkles,
  Layers,
  Clock,
  Settings
} from "lucide-react";

export type NavTab = "dashboard" | "tasks" | "homework" | "timetable" | "progress" | "ai" | "flashcards";

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenPomodoro: () => void;
  pendingTasksCount: number;
  dueHomeworkCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenPomodoro,
  pendingTasksCount,
  dueHomeworkCount,
}) => {
  const navItems = [
    { id: "dashboard" as NavTab, label: "Dashboard", icon: LayoutDashboard },
    { id: "tasks" as NavTab, label: "Tasks", icon: CheckSquare, badge: pendingTasksCount > 0 ? pendingTasksCount : undefined },
    { id: "homework" as NavTab, label: "Homework", icon: FileText, badge: dueHomeworkCount > 0 ? dueHomeworkCount : undefined },
    { id: "timetable" as NavTab, label: "Timetable", icon: Calendar },
    { id: "progress" as NavTab, label: "Progress", icon: BarChart2 },
    { id: "ai" as NavTab, label: "AI Assistant", icon: Sparkles, highlight: true },
    { id: "flashcards" as NavTab, label: "Flashcards", icon: Layers },
  ];

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:flex md:flex-col md:justify-between">
        <div className="space-y-6">
          <div className="px-3 py-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Navigation
            </p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`group relative flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 dark:bg-indigo-600 dark:text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                        isActive
                          ? "text-white"
                          : item.highlight
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-slate-400 dark:text-slate-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Pomodoro Timer Launcher Banner */}
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-blue-50/50 p-4 dark:border-indigo-950/60 dark:from-indigo-950/40 dark:to-slate-900">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
            <Clock className="h-5 w-5 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wide">Focus Session</span>
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            Boost focus with Pomodoro timers and log study sessions.
          </p>
          <button
            onClick={onOpenPomodoro}
            className="mt-3 w-full rounded-xl bg-indigo-600 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95"
          >
            Start Pomodoro
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex h-16 border-t border-slate-200 bg-white/95 px-2 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 md:hidden">
        <div className="grid w-full grid-cols-6 items-center">
          {navItems.slice(0, 6).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 transition ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge !== undefined && (
                    <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="mt-1 text-[10px] font-medium leading-none">{item.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
