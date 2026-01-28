
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

export interface UserStats {
  streak: number;
  lastActiveDate: string | null;
  totalStudyMinutes: number;
}

export type View = 'dashboard' | 'planner' | 'exams' | 'timer' | 'stats' | 'settings';

export interface AppSettings {
  theme: 'light' | 'dark';
  pomodoroWork: number;
  pomodoroShortBreak: number;
  pomodoroLongBreak: number;
  language: 'English' | 'Hindi';
}
