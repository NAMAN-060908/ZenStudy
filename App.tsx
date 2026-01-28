
import React, { useState, useEffect, useMemo } from 'react';
import { Task, View, AppSettings, StudyLog, UserStats, Exam } from './types';
import { INITIAL_SETTINGS, QUOTES, EXAMS as INITIAL_EXAMS } from './constants';
import Dashboard from './components/Dashboard';
import Planner from './components/Planner';
import Exams from './components/Exams';
import Pomodoro from './components/Pomodoro';
import Stats from './components/Stats';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  // State from Local Storage or Defaults
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('zenstudy_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('zenstudy_exams');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((e: any) => ({ ...e, date: new Date(e.date) }));
    }
    return INITIAL_EXAMS;
  });
  const [logs, setLogs] = useState<StudyLog[]>(() => {
    const saved = localStorage.getItem('zenstudy_logs');
    return saved ? JSON.parse(saved) : [];
  });
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('zenstudy_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('zenstudy_stats');
    return saved ? JSON.parse(saved) : { streak: 0, lastActiveDate: null, totalStudyMinutes: 0 };
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('zenstudy_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('zenstudy_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('zenstudy_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('zenstudy_settings', JSON.stringify(settings));
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('zenstudy_stats', JSON.stringify(stats));
  }, [stats]);

  // Handle streak and initial setup
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (stats.lastActiveDate !== todayStr) {
      setStats(prev => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        let newStreak = prev.streak;
        if (prev.lastActiveDate === yesterdayStr) {
          // Keep current streak
        } else if (prev.lastActiveDate !== todayStr) {
          newStreak = 0;
        }

        return {
          ...prev,
          lastActiveDate: todayStr,
          streak: newStreak
        };
      });
    }
  }, []);

  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
          {activeView === 'dashboard' && (
            <Dashboard 
              tasks={tasks} 
              setTasks={setTasks} 
              quote={quote} 
              stats={stats}
              setActiveView={setActiveView}
            />
          )}
          {activeView === 'planner' && (
            <Planner tasks={tasks} setTasks={setTasks} />
          )}
          {activeView === 'exams' && (
            <Exams exams={exams} setExams={setExams} />
          )}
          {activeView === 'timer' && (
            <Pomodoro 
              settings={settings} 
              logs={logs} 
              setLogs={setLogs} 
              setStats={setStats}
            />
          )}
          {activeView === 'stats' && (
            <Stats logs={logs} tasks={tasks} />
          )}
          {activeView === 'settings' && (
            <Settings settings={settings} setSettings={setSettings} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
