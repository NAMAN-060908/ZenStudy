
import React, { useState, useEffect, useRef } from 'react';
import { AppSettings, StudyLog, UserStats } from '../types';
import { SUBJECTS } from '../constants';

interface PomodoroProps {
  settings: AppSettings;
  logs: StudyLog[];
  setLogs: React.Dispatch<React.SetStateAction<StudyLog[]>>;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

type Mode = 'work' | 'shortBreak' | 'longBreak';

const Pomodoro: React.FC<PomodoroProps> = ({ settings, setLogs, setStats }) => {
  const [mode, setMode] = useState<Mode>('work');
  const [timeLeft, setTimeLeft] = useState(settings.pomodoroWork * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  
  // Fix: Use ReturnType<typeof setInterval> instead of NodeJS.Timeout to avoid namespace errors in browser environment
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    resetTimer();
  }, [mode, settings]);

  const resetTimer = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    const mins = mode === 'work' ? settings.pomodoroWork : 
                 mode === 'shortBreak' ? settings.pomodoroShortBreak : 
                 settings.pomodoroLongBreak;
    setTimeLeft(mins * 60);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Notification logic
    try {
      if ('vibrate' in navigator) navigator.vibrate(200);
      new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3').play();
    } catch (e) {}

    if (mode === 'work') {
      const newSessionCount = sessionsCompleted + 1;
      setSessionsCompleted(newSessionCount);
      
      // Log session
      const log: StudyLog = {
        date: new Date().toISOString().split('T')[0],
        subject: selectedSubject,
        minutes: settings.pomodoroWork
      };
      setLogs(prev => [...prev, log]);
      setStats(prev => ({
        ...prev,
        totalStudyMinutes: prev.totalStudyMinutes + settings.pomodoroWork
      }));

      // Auto suggest break
      if (newSessionCount % 4 === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }
    } else {
      setMode('work');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work' ? 1 - timeLeft / (settings.pomodoroWork * 60) :
                   mode === 'shortBreak' ? 1 - timeLeft / (settings.pomodoroShortBreak * 60) :
                   1 - timeLeft / (settings.pomodoroLongBreak * 60);

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto space-y-12 py-8">
      <header className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Focus Timer</h2>
        <p className="text-slate-500 dark:text-slate-400">Maximize your study sessions using the Pomodoro technique</p>
      </header>

      {/* Mode Toggles */}
      <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-full">
        {(['work', 'shortBreak', 'longBreak'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              mode === m 
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
              : 'text-slate-500'
            }`}
          >
            {m === 'work' ? 'Focus' : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </button>
        ))}
      </div>

      {/* Circle Timer */}
      <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-slate-100 dark:text-slate-900"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray="283"
            strokeDashoffset={283 * (1 - progress)}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-linear ${
              mode === 'work' ? 'text-indigo-600' : 'text-green-500'
            }`}
            style={{ strokeDasharray: '282.7', strokeDashoffset: 282.7 * (1 - progress) }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
          <span className="text-7xl font-black tabular-nums tracking-tighter">
            {formatTime(timeLeft)}
          </span>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            {mode === 'work' ? 'Time to focus' : 'Rest period'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6 w-full">
        <button 
          onClick={resetTimer}
          className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-4 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-slate-600 dark:text-slate-400"
        >
          Reset
        </button>
        <button 
          onClick={toggleTimer}
          className={`flex-[2] py-4 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 ${
            isActive 
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' 
            : 'bg-indigo-600 text-white shadow-indigo-500/30'
          }`}
        >
          {isActive ? 'PAUSE' : 'START'}
        </button>
      </div>

      {mode === 'work' && (
        <div className="w-full bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold flex items-center gap-2">
              <i className="fa-solid fa-graduation-cap text-indigo-500"></i>
              Currently Studying
            </h4>
            <span className="text-xs font-bold text-slate-400">SESSION #{sessionsCompleted + 1}</span>
          </div>
          <select 
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={isActive}
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 font-bold focus:ring-2 focus:ring-indigo-500 transition-all appearance-none disabled:opacity-50"
          >
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}

      {sessionsCompleted > 0 && (
        <p className="text-slate-400 text-sm font-medium animate-bounce">
          🎉 Great job! You've completed {sessionsCompleted} sessions today.
        </p>
      )}
    </div>
  );
};

export default Pomodoro;
