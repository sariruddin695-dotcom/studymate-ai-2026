import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AppState, StudyTask, HomeworkItem, TimetableSlot, FlashcardDeck, StudySessionLog, User } from "../types";
import { loadInitialState, saveState } from "../utils/storage";

export interface StudyStoreContextType {
  appState: AppState;
  state: AppState;
  user: User | null;
  tasks: StudyTask[];
  homework: HomeworkItem[];
  timetable: TimetableSlot[];
  flashcardDecks: FlashcardDeck[];
  studyLogs: StudySessionLog[];
  stats: AppState["stats"];
  theme: "light" | "dark";

  // Actions
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  handleLogin: (user: User) => void;
  login: (user: User) => void;
  handleUpdateUser: (user: User) => void;
  updateUser: (user: User) => void;
  handleLogout: () => void;
  logout: () => void;
  handleToggleTheme: () => void;
  toggleTheme: () => void;

  // Tasks
  handleAddTask: (taskData: Omit<StudyTask, "id" | "createdAt" | "completed">) => void;
  addTask: (taskData: Omit<StudyTask, "id" | "createdAt" | "completed">) => void;
  handleUpdateTask: (id: string, partial: Partial<StudyTask>) => void;
  updateTask: (id: string, partial: Partial<StudyTask>) => void;
  handleDeleteTask: (id: string) => void;
  deleteTask: (id: string) => void;
  handleToggleTaskComplete: (id: string) => void;
  toggleTaskComplete: (id: string) => void;

  // Homework
  handleAddHomework: (hwData: Omit<HomeworkItem, "id" | "createdAt">) => void;
  addHomework: (hwData: Omit<HomeworkItem, "id" | "createdAt">) => void;
  handleUpdateHomework: (id: string, partial: Partial<HomeworkItem>) => void;
  updateHomework: (id: string, partial: Partial<HomeworkItem>) => void;
  handleDeleteHomework: (id: string) => void;
  deleteHomework: (id: string) => void;

  // Timetable
  handleAddTimetableSlot: (slotData: Omit<TimetableSlot, "id">) => void;
  addTimetableSlot: (slotData: Omit<TimetableSlot, "id">) => void;
  addSlot: (slotData: Omit<TimetableSlot, "id">) => void;
  handleDeleteTimetableSlot: (id: string) => void;
  deleteTimetableSlot: (id: string) => void;
  deleteSlot: (id: string) => void;

  // Flashcards
  handleAddFlashcardDeck: (deckData: Omit<FlashcardDeck, "id" | "createdAt">) => void;
  addFlashcardDeck: (deckData: Omit<FlashcardDeck, "id" | "createdAt">) => void;
  addDeck: (deckData: Omit<FlashcardDeck, "id" | "createdAt">) => void;
  handleDeleteFlashcardDeck: (id: string) => void;
  deleteFlashcardDeck: (id: string) => void;
  deleteDeck: (id: string) => void;
  handleToggleMasteredCard: (deckId: string, cardId: string) => void;
  toggleMasteredCard: (deckId: string, cardId: string) => void;

  // Study Logs
  handleLogStudySession: (logData: Omit<StudySessionLog, "id">) => void;
  logStudySession: (logData: Omit<StudySessionLog, "id">) => void;
  logSession: (logData: Omit<StudySessionLog, "id">) => void;

  // AI & Stats
  handleIncrementAIQueries: () => void;
  incrementAIQueries: () => void;
}

export const StudyStoreContext = createContext<StudyStoreContextType | undefined>(undefined);

export function StudyStoreProvider({ children }: { children: ReactNode }) {
  const [appState, setAppState] = useState<AppState>(loadInitialState);

  useEffect(() => {
    saveState(appState);
  }, [appState]);

  useEffect(() => {
    if (appState.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [appState.theme]);

  const handleLogin = (user: User) => {
    setAppState((prev) => ({ ...prev, user }));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setAppState((prev) => ({ ...prev, user: updatedUser }));
  };

  const handleLogout = () => {
    setAppState((prev) => ({ ...prev, user: null }));
  };

  const handleToggleTheme = () => {
    setAppState((prev) => ({
      ...prev,
      theme: prev.theme === "dark" ? "light" : "dark",
    }));
  };

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
      const targetTask = prev.tasks.find((t) => t.id === id);
      if (!targetTask) return prev;
      const isCompleting = !targetTask.completed;
      const updatedTasks = prev.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: isCompleting,
              completedAt: isCompleting ? new Date().toISOString() : undefined,
            }
          : t
      );
      const updatedStats = {
        ...prev.stats,
        completedTasksCount: isCompleting
          ? prev.stats.completedTasksCount + 1
          : Math.max(0, prev.stats.completedTasksCount - 1),
      };
      return {
        ...prev,
        tasks: updatedTasks,
        stats: updatedStats,
      };
    });
  };

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
      const oldHw = prev.homework.find((h) => h.id === id);
      const updated = prev.homework.map((h) => (h.id === id ? { ...h, ...partial } : h));
      let completedInc = 0;
      if (oldHw && oldHw.status !== "completed" && partial.status === "completed") {
        completedInc = 1;
      }
      return {
        ...prev,
        homework: updated,
        stats: {
          ...prev.stats,
          completedHomeworkCount: prev.stats.completedHomeworkCount + completedInc,
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
        if (deck.id !== deckId) return deck;
        return {
          ...deck,
          cards: deck.cards.map((card) =>
            card.id === cardId ? { ...card, mastered: !card.mastered } : card
          ),
        };
      }),
    }));
  };

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

  const handleIncrementAIQueries = () => {
    setAppState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        aiQueriesCount: prev.stats.aiQueriesCount + 1,
      },
    }));
  };

  const value: StudyStoreContextType = {
    appState,
    state: appState,
    user: appState.user,
    tasks: appState.tasks,
    homework: appState.homework,
    timetable: appState.timetable,
    flashcardDecks: appState.flashcardDecks,
    studyLogs: appState.studyLogs,
    stats: appState.stats,
    theme: appState.theme,

    setAppState,
    handleLogin,
    login: handleLogin,
    handleUpdateUser,
    updateUser: handleUpdateUser,
    handleLogout,
    logout: handleLogout,
    handleToggleTheme,
    toggleTheme: handleToggleTheme,

    handleAddTask,
    addTask: handleAddTask,
    handleUpdateTask,
    updateTask: handleUpdateTask,
    handleDeleteTask,
    deleteTask: handleDeleteTask,
    handleToggleTaskComplete,
    toggleTaskComplete: handleToggleTaskComplete,

    handleAddHomework,
    addHomework: handleAddHomework,
    handleUpdateHomework,
    updateHomework: handleUpdateHomework,
    handleDeleteHomework,
    deleteHomework: handleDeleteHomework,

    handleAddTimetableSlot,
    addTimetableSlot: handleAddTimetableSlot,
    addSlot: handleAddTimetableSlot,
    handleDeleteTimetableSlot,
    deleteTimetableSlot: handleDeleteTimetableSlot,
    deleteSlot: handleDeleteTimetableSlot,

    handleAddFlashcardDeck,
    addFlashcardDeck: handleAddFlashcardDeck,
    addDeck: handleAddFlashcardDeck,
    handleDeleteFlashcardDeck,
    deleteFlashcardDeck: handleDeleteFlashcardDeck,
    deleteDeck: handleDeleteFlashcardDeck,
    handleToggleMasteredCard,
    toggleMasteredCard: handleToggleMasteredCard,

    handleLogStudySession,
    logStudySession: handleLogStudySession,
    logSession: handleLogStudySession,

    handleIncrementAIQueries,
    incrementAIQueries: handleIncrementAIQueries,
  };

  return <StudyStoreContext.Provider value={value}>{children}</StudyStoreContext.Provider>;
}

export const StudyProvider = StudyStoreProvider;

export function useStudyStore(): StudyStoreContextType {
  const context = useContext(StudyStoreContext);
  if (context) {
    return context;
  }

  // Fallback for standalone usage outside of provider
  const initial = loadInitialState();
  const dummyState: StudyStoreContextType = {
    appState: initial,
    state: initial,
    user: initial.user,
    tasks: initial.tasks,
    homework: initial.homework,
    timetable: initial.timetable,
    flashcardDecks: initial.flashcardDecks,
    studyLogs: initial.studyLogs,
    stats: initial.stats,
    theme: initial.theme,

    setAppState: () => {},
    handleLogin: () => {},
    login: () => {},
    handleUpdateUser: () => {},
    updateUser: () => {},
    handleLogout: () => {},
    logout: () => {},
    handleToggleTheme: () => {},
    toggleTheme: () => {},

    handleAddTask: () => {},
    addTask: () => {},
    handleUpdateTask: () => {},
    updateTask: () => {},
    handleDeleteTask: () => {},
    deleteTask: () => {},
    handleToggleTaskComplete: () => {},
    toggleTaskComplete: () => {},

    handleAddHomework: () => {},
    addHomework: () => {},
    handleUpdateHomework: () => {},
    updateHomework: () => {},
    handleDeleteHomework: () => {},
    deleteHomework: () => {},

    handleAddTimetableSlot: () => {},
    addTimetableSlot: () => {},
    addSlot: () => {},
    handleDeleteTimetableSlot: () => {},
    deleteTimetableSlot: () => {},
    deleteSlot: () => {},

    handleAddFlashcardDeck: () => {},
    addFlashcardDeck: () => {},
    addDeck: () => {},
    handleDeleteFlashcardDeck: () => {},
    deleteFlashcardDeck: () => {},
    deleteDeck: () => {},
    handleToggleMasteredCard: () => {},
    toggleMasteredCard: () => {},

    handleLogStudySession: () => {},
    logStudySession: () => {},
    logSession: () => {},

    handleIncrementAIQueries: () => {},
    incrementAIQueries: () => {},
  };
  return dummyState;
}

export const useStudyData = useStudyStore;
export const useStudy = useStudyStore;

export default useStudyStore;
