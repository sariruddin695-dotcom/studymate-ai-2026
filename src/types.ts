export type Priority = "low" | "medium" | "high";
export type TaskCategory = "revision" | "reading" | "practice" | "assignment" | "exam_prep" | "other";
export type HomeworkStatus = "not_started" | "in_progress" | "completed" | "submitted";
export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  gradeLevel?: string;
  majorOrSubjects?: string[];
  createdAt: string;
}

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  category: TaskCategory;
  priority: Priority;
  dueDate: string; // YYYY-MM-DD
  estimatedMinutes: number;
  completed: boolean;
  completedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface HomeworkItem {
  id: string;
  title: string;
  subject: string;
  teacher?: string;
  dueDate: string; // YYYY-MM-DD HH:mm
  status: HomeworkStatus;
  priority: Priority;
  score?: string; // e.g., "95/100" or "A"
  description?: string;
  aiHelpGenerated?: string;
  createdAt: string;
}

export interface TimetableSlot {
  id: string;
  day: DayOfWeek;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:30"
  subject: string;
  topic?: string;
  location?: string;
  color: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  mastered?: boolean;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  subject: string;
  cards: Flashcard[];
  createdAt: string;
}

export interface StudySessionLog {
  id: string;
  subject: string;
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  notes?: string;
}

export interface UserStats {
  totalStudyMinutes: number;
  completedTasksCount: number;
  completedHomeworkCount: number;
  currentStreakDays: number;
  lastStudyDate: string;
  aiQueriesCount: number;
}

export interface AppState {
  user: User | null;
  tasks: StudyTask[];
  homework: HomeworkItem[];
  timetable: TimetableSlot[];
  flashcardDecks: FlashcardDeck[];
  studyLogs: StudySessionLog[];
  stats: UserStats;
  theme: "light" | "dark";
}
