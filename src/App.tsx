import React, { useState, useEffect } from "react";
import { AppState, StudyTask, HomeworkItem, TimetableSlot, FlashcardDeck, StudySessionLog, User } from "./types";
import { loadInitialState, saveState } from "./utils/storage";
import { Navbar } from "./components/Navbar";
import { Sidebar, NavTab } from "./components/Sidebar";
import { DashboardView } from "./components/DashboardView";
import { TasksView } from "./components/TasksView";
import { HomeworkView } from "./components/HomeworkView";
import { TimetableView } from "./components/TimetableView";
import { ProgressView } from "./components/ProgressView";
import { AIAssistantView } from "./components/AIAssistantView";
import { FlashcardsView } from "./components/FlashcardsView";
import { PomodoroTimer } from "./components/PomodoroTimer";
import { AuthModal } from "./components/AuthModal";
import { ProfileModal } from "./components/ProfileModal";

export default function App() {
  const [appState, setAppState] = useState<AppState>(loadInitialState);
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [initialAiQuestion, setInitialAiQuestion] = useState("");

  // Apply Theme Effect
  useEffect(() => {
    if (appState.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [appState.theme]);

  // Sync to Local Storage on State Change
  useEffect(() => {
    saveState(appState);
  }, [appState]);

  // Toggle Theme
  const handleToggleTheme = () => {
    setAppState((prev) => ({
      ...prev,
      theme: prev.theme === "dark" ? "light" : "dark",
    }));
  };

  // User Auth & Profile
  const handleLogin = (user: User) => {
    setAppState((prev) => ({
      ...prev,
      user,
    }));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setAppState((prev) => ({
      ...prev,
      user: updatedUser,
    }));
  };

  const handleLogout = () => {
    setAppState((prev) => ({
      ...prev,
      user: null,
    }));
  };

  // Task Handlers
  const handleAddTask = (taskData: Omit<StudyTask, "id" | "createdAt" | "completed">) => {
    const newTask: StudyTask = {
      ...taskData,
      id: `task_${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setAppState((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
  };

  const handleUpdateTask = (id: string, partial: Partial<StudyTask>) => {
    setAppState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, ...partial } : t)),
    }));
  };

  const handleDeleteTask = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  };

  const handleToggleTaskComplete = (id: string) => {
    setAppState((prev) => {
      let isNowCompleted = false;
      const updatedTasks = prev.tasks.map((t) => {
        if (t.id === id) {
          isNowCompleted = !t.completed;
          return {
            ...t,
            completed: isNowCompleted,
            completedAt: isNowCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      });

      const completedCount = updatedTasks.filter((t) => t.completed).length;

      return {
        ...prev,
        tasks: updatedTasks,
        stats: {
          ...prev.stats,
          completedTasksCount: completedCount,
        },
      };
    });
  };

  // Homework Handlers
  const handleAddHomework = (hwData: Omit<HomeworkItem, "id" | "createdAt">) => {
    const newHw: HomeworkItem = {
      ...hwData,
      id: `hw_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAppState((prev) => ({
      ...prev,
      homework: [newHw, ...prev.homework],
    }));
  };

  const handleUpdateHomework = (id: string, partial: Partial<HomeworkItem>) => {
    setAppState((prev) => {
      const updatedHw = prev.homework.map((h) => (h.id === id ? { ...h, ...partial } : h));
      const completedHwCount = updatedHw.filter(
        (h) => h.status === "completed" || h.status === "submitted"
      ).length;

      return {
        ...prev,
        homework: updatedHw,
        stats: {
          ...prev.stats,
          completedHomeworkCount: completedHwCount,
        },
      };
    });
  };

  const handleDeleteHomework = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      homework: prev.homework.filter((h) => h.id !== id),
    }));
  };

  // Timetable Handlers
  const handleAddTimetableSlot = (slotData: Omit<TimetableSlot, "id">) => {
    const newSlot: TimetableSlot = {
      ...slotData,
      id: `slot_${Date.now()}`,
    };
    setAppState((prev) => ({
      ...prev,
      timetable: [...prev.timetable, newSlot],
    }));
  };

  const handleDeleteTimetableSlot = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      timetable: prev.timetable.filter((s) => s.id !== id),
    }));
  };

  // Flashcards Handlers
  const handleAddFlashcardDeck = (deckData: Omit<FlashcardDeck, "id" | "createdAt">) => {
    const newDeck: FlashcardDeck = {
      ...deckData,
      id: `deck_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAppState((prev) => ({
      ...prev,
      flashcardDecks: [newDeck, ...prev.flashcardDecks],
    }));
  };

  const handleDeleteFlashcardDeck = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      flashcardDecks: prev.flashcardDecks.filter((d) => d.id !== id),
    }));
  };

  const handleToggleMasteredCard = (deckId: string, cardId: string) => {
    setAppState((prev) => ({
      ...prev,
      flashcardDecks: prev.flashcardDecks.map((deck) => {
        if (deck.id === deckId) {
          return {
            ...deck,
            cards: deck.cards.map((c) =>
              c.id === cardId ? { ...c, mastered: !c.mastered } : c
            ),
          };
        }
        return deck;
      }),
    }));
  };

  // Study Session Logger
  const handleLogStudySession = (logData: Omit<StudySessionLog, "id">) => {
    const newLog: StudySessionLog = {
      ...logData,
      id: `log_${Date.now()}`,
    };

    setAppState((prev) => ({
      ...prev,
      studyLogs: [newLog, ...prev.studyLogs],
      stats: {
        ...prev.stats,
        totalStudyMinutes: prev.stats.totalStudyMinutes + logData.durationMinutes,
      },
    }));
  };

  // AI Queries Stats Counter
  const handleIncrementAIQueries = () => {
    setAppState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        aiQueriesCount: prev.stats.aiQueriesCount + 1,
      },
    }));
  };

  // Quick launch AI from search / dashboard
  const handleAskAIQuick = (question: string) => {
    setInitialAiQuestion(question);
    setActiveTab("ai");
  };

  const pendingTasksCount = appState.tasks.filter((t) => !t.completed).length;
  const dueHomeworkCount = appState.homework.filter(
    (h) => h.status !== "completed" && h.status !== "submitted"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Bar */}
      <Navbar
        state={appState}
        onToggleTheme={handleToggleTheme}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAI={() => setActiveTab("ai")}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Layout Container */}
      <div className="flex w-full">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenPomodoro={() => setIsPomodoroOpen(true)}
          pendingTasksCount={pendingTasksCount}
          dueHomeworkCount={dueHomeworkCount}
        />

        {/* Content View Stage */}
        <main className="flex-1 px-4 py-6 md:px-8 max-w-7xl mx-auto w-full">
          {activeTab === "dashboard" && (
            <DashboardView
              state={appState}
              onNavigate={setActiveTab}
              onToggleTaskComplete={handleToggleTaskComplete}
              onOpenAddTask={() => setActiveTab("tasks")}
              onOpenAddHomework={() => setActiveTab("homework")}
              onAskAIQuick={handleAskAIQuick}
              onOpenPomodoro={() => setIsPomodoroOpen(true)}
            />
          )}

          {activeTab === "tasks" && (
            <TasksView
              tasks={appState.tasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onToggleComplete={handleToggleTaskComplete}
            />
          )}

          {activeTab === "homework" && (
            <HomeworkView
              homework={appState.homework}
              onAddHomework={handleAddHomework}
              onUpdateHomework={handleUpdateHomework}
              onDeleteHomework={handleDeleteHomework}
            />
          )}

          {activeTab === "timetable" && (
            <TimetableView
              timetable={appState.timetable}
              onAddSlot={handleAddTimetableSlot}
              onDeleteSlot={handleDeleteTimetableSlot}
              onSetTimetable={(slots) =>
                setAppState((prev) => ({ ...prev, timetable: slots }))
              }
            />
          )}

          {activeTab === "progress" && (
            <ProgressView
              state={appState}
              onLogStudySession={handleLogStudySession}
              onOpenPomodoro={() => setIsPomodoroOpen(true)}
            />
          )}

          {activeTab === "ai" && (
            <AIAssistantView
              onSaveFlashcardDeck={handleAddFlashcardDeck}
              onIncrementAIQueries={handleIncrementAIQueries}
              initialQuestion={initialAiQuestion}
            />
          )}

          {activeTab === "flashcards" && (
            <FlashcardsView
              decks={appState.flashcardDecks}
              onAddDeck={handleAddFlashcardDeck}
              onDeleteDeck={handleDeleteFlashcardDeck}
              onToggleMasteredCard={handleToggleMasteredCard}
              onNavigateToAI={() => setActiveTab("ai")}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <PomodoroTimer
        isOpen={isPomodoroOpen}
        onClose={() => setIsPomodoroOpen(false)}
        onLogMinutes={(mins, subject) =>
          handleLogStudySession({
            durationMinutes: mins,
            subject,
            date: new Date().toISOString().split("T")[0],
            notes: "Pomodoro focus block",
          })
        }
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={appState.user}
        state={appState}
        onUpdateUser={handleUpdateUser}
        onLogout={handleLogout}
        onImportState={setAppState}
      />
    </div>
  );
}
