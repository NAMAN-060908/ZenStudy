
import { Exam } from './types';

export const EXAMS: Exam[] = [
  { id: '1', name: 'JEE Main 2026 Session 1', date: new Date('2026-01-21') },
  { id: '2', name: 'JEE Main 2026 Session 2', date: new Date('2026-04-02') },
  { id: '3', name: 'BITSAT 2026 Session 1', date: new Date('2026-04-15') },
  { id: '4', name: 'KCET 2026', date: new Date('2026-04-23') },
  { id: '5', name: 'JEE Advanced 2026', date: new Date('2026-05-17') },
  { id: '6', name: 'BITSAT 2026 Session 2', date: new Date('2026-05-24') },
];

export const QUOTES = [
  "The only way to learn mathematics is to do mathematics.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "Your education is a dress rehearsal for a life that is yours to lead.",
  "Don't let what you cannot do interfere with what you can do.",
  "The expert in anything was once a beginner.",
  "Believe you can and you're halfway there.",
  "Hard work beats talent when talent doesn't work hard."
];

export const SUBJECTS = [
  'Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Aptitude', 'General Knowledge'
];

export const INITIAL_SETTINGS = {
  theme: 'light' as const,
  pomodoroWork: 25,
  pomodoroShortBreak: 5,
  pomodoroLongBreak: 15,
  language: 'English' as const
};
