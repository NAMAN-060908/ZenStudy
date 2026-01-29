
import React, { useState, useEffect, useRef } from 'react';
import { AppSettings, StudyLog, UserStats } from '../types';

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
  const [selectedSubject, setSelectedSubject] = useState(settings.subjects[0] || 'Uncategorized');
  
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
    
    try {
      if ('vibrate' in navigator) navigator.vibrate(200);
      new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3').play();
    } catch (e) {}

    if (mode === 'work') {
      const newSessionCount = sessionsCompleted + 1;
      setSessionsCompleted(newSessionCount);
      
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
    <div className="flex flex-col items-center max-w-2xl mx-auto space-y-8 md:space-y-12 py-4 md:py-8">
      <header className="text-center space-y-1">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase">Deep Focus</h2>
        <p className="text-xs md:text-base text-slate-500 font-bold tracking-widest">RANKUP PERFORMANCE CORE</p>
      </header>

      <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-full border border-slate-200 dark:border-slate-800">
        {(['work', 'shortBreak', 'longBreak'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${
              mode === m 
              ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-md' 
              : 'text-slate-400'
            }`}
          >
            {m === 'work' ? 'Execute' : m === 'shortBreak' ? 'Recovery' : 'Deep Rest'}
          </button>
        ))}
      </div>

      <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="42%"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-100 dark:text-slate-900"
          />
          <circle
            cx="50%"
            cy="50%"
            r="42%"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray="264"
            strokeDashoffset={264 * (1 - progress)}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-linear ${
              mode === 'work' ? 'text-indigo-600' : 'text-emerald-500'
            }`}
            style={{ strokeDasharray: '263.8', strokeDashoffset: 263.8 * (1 - progress) }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-7xl md:text-8xl font-black tabular-nums tracking-tighter">
            {formatTime(timeLeft)}
          </span>
          <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.3em] mt-2">
            {mode === 'work' ? 'Flowing' : 'Resetting'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6 w-full px-4">
        <button 
          onClick={resetTimer}
          className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
        >
          Abort
        </button>
        <button 
          onClick={toggleTimer}
          className={`flex-[2] py-4 rounded-2xl font-black text-sm md:text-xl shadow-2xl transition-all uppercase tracking-widest active:scale-95 ${
            isActive ? 'bg-slate-900 text-white shadow-slate-950/20' : 'bg-indigo-600 text-white shadow-indigo-500/40'
          }`}
        >
          {isActive ? 'Pause Flow' : 'Begin Flow'}
        </button>
      </div>

      {mode === 'work' && (
        <div className="w-full bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <i className="fa-solid fa-crosshairs text-indigo-500"></i>
              Target Category
            </h4>
          </div>
          <select 
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={isActive}
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm font-black appearance-none focus:ring-2 focus:ring-indigo-500"
          >
            {settings.subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}
    </div>
  );
};

export default Pomodoro;
