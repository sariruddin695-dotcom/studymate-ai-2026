import { AppState, User, StudyTask, HomeworkItem, TimetableSlot, FlashcardDeck, StudySessionLog, UserStats } from "../types";

const STORAGE_KEY = "studymate_ai_data_v1";

const DEFAULT_USER: User = {
  id: "user_demo_1",
  name: "Alex Morgan",
  email: "alex.morgan@student.edu",
  gradeLevel: "Computer Science Major - Year 2",
  majorOrSubjects: ["Computer Science", "Calculus II", "Physics 101", "World History"],
  createdAt: new Date().toISOString(),
};

const DEFAULT_TASKS: StudyTask[] = [
  {
    id: "task-1",
    title: "Read Chapter 4: Binary Search Trees & Heaps",
    subject: "Computer Science",
    category: "reading",
    priority: "high",
    dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    estimatedMinutes: 45,
    completed: false,
    notes: "Focus on heapify algorithm and time complexity analysis.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "Solve Integration by Parts practice set 3",
    subject: "Calculus II",
    category: "practice",
    priority: "medium",
    dueDate: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    estimatedMinutes: 60,
    completed: false,
    notes: "Review LIATE rule for choosing u and dv.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "Review Thermodynamics Laws & Diagrams",
    subject: "Physics 101",
    category: "revision",
    priority: "high",
    dueDate: new Date(Date.now() + 259200000).toISOString().split("T")[0],
    estimatedMinutes: 30,
    completed: true,
    completedAt: new Date().toISOString(),
    notes: "Finished 1st and 2nd law summary cards.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-4",
    title: "Draft Industrial Revolution Research Outline",
    subject: "World History",
    category: "assignment",
    priority: "low",
    dueDate: new Date(Date.now() + 432000000).toISOString().split("T")[0],
    estimatedMinutes: 90,
    completed: false,
    notes: "Include steam engine innovations and socio-economic shifts.",
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_HOMEWORK: HomeworkItem[] = [
  {
    id: "hw-1",
    title: "Data Structures Lab 3: Graph Traversal Algorithms",
    subject: "Computer Science",
    teacher: "Dr. Henderson",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
    status: "in_progress",
    priority: "high",
    description: "Implement BFS and DFS in C++/Python with adjacency list matrix representations.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "hw-2",
    title: "Calculus Problem Set #5: Infinite Series",
    subject: "Calculus II",
    teacher: "Prof. Vance",
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16),
    status: "not_started",
    priority: "medium",
    description: "Problems 12 through 28 on page 340. Ratio test and Root test.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "hw-3",
    title: "Physics Lab Report: Pendulum Motion",
    subject: "Physics 101",
    teacher: "Dr. Aris",
    dueDate: new Date(Date.now() - 86400000).toISOString().slice(0, 16),
    status: "completed",
    priority: "high",
    score: "98/100",
    description: "Graph period vs length and calculate gravitational constant g.",
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_TIMETABLE: TimetableSlot[] = [
  { id: "slot-1", day: "Monday", startTime: "09:00", endTime: "10:30", subject: "Computer Science", topic: "Algorithms Lecture", location: "Hall B1", color: "bg-indigo-500" },
  { id: "slot-2", day: "Monday", startTime: "11:00", endTime: "12:30", subject: "Calculus II", topic: "Integration Techniques", location: "Math Bldg 204", color: "bg-blue-500" },
  { id: "slot-3", day: "Tuesday", startTime: "10:00", endTime: "11:30", subject: "Physics 101", topic: "Thermodynamics", location: "Science Lab 3", color: "bg-amber-500" },
  { id: "slot-4", day: "Wednesday", startTime: "09:00", endTime: "10:30", subject: "Computer Science", topic: "Graph Algorithms", location: "Hall B1", color: "bg-indigo-500" },
  { id: "slot-5", day: "Thursday", startTime: "13:00", endTime: "14:30", subject: "World History", topic: "19th Century History", location: "Humanities 102", color: "bg-emerald-500" },
  { id: "slot-6", day: "Friday", startTime: "14:00", endTime: "16:00", subject: "Physics 101", topic: "Weekly Review & Quiz", location: "Science Lab 3", color: "bg-amber-500" },
];

const DEFAULT_FLASHCARDS: FlashcardDeck[] = [
  {
    id: "deck-1",
    title: "Data Structures & Big-O Notation",
    subject: "Computer Science",
    createdAt: new Date().toISOString(),
    cards: [
      { id: "c1", front: "What is the worst-case time complexity of QuickSort?", back: "O(n²) when the pivot chosen is always the minimum or maximum element.", mastered: true },
      { id: "c2", front: "What is a Hash Collision?", back: "When two different keys generate the same index in a hash table array.", mastered: false },
      { id: "c3", front: "Difference between Stack and Queue?", back: "Stack is LIFO (Last In First Out); Queue is FIFO (First In First Out).", mastered: true },
      { id: "c4", front: "Time complexity to search an item in a balanced BST?", back: "O(log n).", mastered: false },
    ],
  },
  {
    id: "deck-2",
    title: "Calculus II Core Formulas",
    subject: "Calculus II",
    createdAt: new Date().toISOString(),
    cards: [
      { id: "c5", front: "Integration by Parts Formula?", back: "∫ u dv = uv - ∫ v du", mastered: true },
      { id: "c6", front: "Derivative of arctan(x)?", back: "1 / (1 + x²)", mastered: false },
      { id: "c7", front: "Ratio Test condition for absolute convergence?", back: "lim |a_{n+1} / a_n| < 1 as n → ∞", mastered: true },
    ],
  },
];

const DEFAULT_STUDY_LOGS: StudySessionLog[] = [
  { id: "log-1", subject: "Computer Science", durationMinutes: 60, date: new Date(Date.now() - 86400000 * 4).toISOString().split("T")[0], notes: "Solved graph problems" },
  { id: "log-2", subject: "Calculus II", durationMinutes: 45, date: new Date(Date.now() - 86400000 * 3).toISOString().split("T")[0], notes: "Practiced series tests" },
  { id: "log-3", subject: "Physics 101", durationMinutes: 90, date: new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0], notes: "Read thermodynamics chapter" },
  { id: "log-4", subject: "Computer Science", durationMinutes: 75, date: new Date(Date.now() - 86400000 * 1).toISOString().split("T")[0], notes: "Built binary tree visualizer" },
  { id: "log-5", subject: "World History", durationMinutes: 50, date: new Date().toISOString().split("T")[0], notes: "Drafted essay outline" },
];

const DEFAULT_STATS: UserStats = {
  totalStudyMinutes: 320,
  completedTasksCount: 14,
  completedHomeworkCount: 8,
  currentStreakDays: 5,
  lastStudyDate: new Date().toISOString().split("T")[0],
  aiQueriesCount: 12,
};

export function loadInitialState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        user: parsed.user ?? DEFAULT_USER,
        tasks: parsed.tasks ?? DEFAULT_TASKS,
        homework: parsed.homework ?? DEFAULT_HOMEWORK,
        timetable: parsed.timetable ?? DEFAULT_TIMETABLE,
        flashcardDecks: parsed.flashcardDecks ?? DEFAULT_FLASHCARDS,
        studyLogs: parsed.studyLogs ?? DEFAULT_STUDY_LOGS,
        stats: parsed.stats ?? DEFAULT_STATS,
        theme: parsed.theme ?? "light",
      };
    }
  } catch (e) {
    console.warn("Could not parse local storage state:", e);
  }

  // Return seed default state
  return {
    user: DEFAULT_USER,
    tasks: DEFAULT_TASKS,
    homework: DEFAULT_HOMEWORK,
    timetable: DEFAULT_TIMETABLE,
    flashcardDecks: DEFAULT_FLASHCARDS,
    studyLogs: DEFAULT_STUDY_LOGS,
    stats: DEFAULT_STATS,
    theme: "light",
  };
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state to localStorage:", e);
  }
}

export function exportUserData(state: AppState): string {
  return JSON.stringify(state, null, 2);
}

export function importUserData(jsonString: string): AppState | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && typeof parsed === "object") {
      saveState(parsed);
      return parsed as AppState;
    }
  } catch (e) {
    console.error("Failed to import user data:", e);
  }
  return null;
}
