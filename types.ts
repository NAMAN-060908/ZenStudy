
export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  subject: string;
  time: string;
  priority: Priority;
  completed: boolean;
  date: string;
}

export interface Exam {
  id: string;
  name: string;
  date: Date;
  session?: string;
}

export interface StudyLog {
  date: string;
  subject: string;
  minutes: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  color: string;
  category: 'habit' | 'task' | 'study' | 'subject' | 'timer';
}

export interface UserStats {
  streak: number;
  lastActiveDate: string | null;
  totalStudyMinutes: number;
  badges: string[]; // List of badge IDs unlocked
}

export type View = 'dashboard' | 'planner' | 'exams' | 'timer' | 'stats' | 'settings' | 'image-gen' | 'badges';

export interface AppSettings {
  theme: 'light' | 'dark';
  pomodoroWork: number;
  pomodoroShortBreak: number;
  pomodoroLongBreak: number;
  language: 'English' | 'Hindi';
  subjects: string[];
}
