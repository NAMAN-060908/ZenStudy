
import React, { useState, useEffect, useMemo } from 'react';
import { Task, View, AppSettings, StudyLog, UserStats, Exam } from './types';
import { INITIAL_SETTINGS, QUOTES, EXAMS as INITIAL_EXAMS, BADGE_DEFS } from './constants';
import Dashboard from './components/Dashboard';
import Planner from './components/Planner';
import Exams from './components/Exams';
import Pomodoro from './components/Pomodoro';
import Stats from './components/Stats';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import ImageGenerator from './components/ImageGenerator';
import Badges from './components/Badges';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('rankup_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('rankup_exams');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((e: any) => ({ ...e, date: new Date(e.date) }));
    }
    return INITIAL_EXAMS;
  });
  const [logs, setLogs] = useState<StudyLog[]>(() => {
    const saved = localStorage.getItem('rankup_logs');
    return saved ? JSON.parse(saved) : [];
  });
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('rankup_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('rankup_stats');
    return saved ? JSON.parse(saved) : { streak: 0, lastActiveDate: null, totalStudyMinutes: 0, badges: [] };
  });

  // Persist Data
  useEffect(() => localStorage.setItem('rankup_tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('rankup_exams', JSON.stringify(exams)), [exams]);
  useEffect(() => localStorage.setItem('rankup_logs', JSON.stringify(logs)), [logs]);
  useEffect(() => localStorage.setItem('rankup_stats', JSON.stringify(stats)), [stats]);
  useEffect(() => {
    localStorage.setItem('rankup_settings', JSON.stringify(settings));
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings]);

  // ULTRA ACHIEVEMENT LOGIC (108 Milestones)
  useEffect(() => {
    const newUnlocked = [...stats.badges];
    let changed = false;

    const tryUnlock = (id: string) => {
      if (!newUnlocked.includes(id)) {
        newUnlocked.push(id);
        changed = true;
      }
    };

    const completedTasksCount = tasks.filter(t => t.completed).length;
    const studyMins = stats.totalStudyMinutes;
    const streak = stats.streak;
    const sessionCount = logs.length;

    // 1. Task Tiers
    [1, 5, 10, 20, 30, 40, 50, 75, 100, 150, 200, 250, 300, 400, 500, 750, 1000, 1500].forEach(n => {
      if (completedTasksCount >= n) tryUnlock(`task-${n}`);
    });

    // 2. Time Tiers
    [60, 120, 300, 600, 1200, 2400, 3000, 4500, 6000, 9000, 12000, 18000, 24000, 30000, 45000, 60000, 90000, 120000].forEach(m => {
      if (studyMins >= m) tryUnlock(`study-${m}`);
    });

    // 3. Streak Tiers
    [1, 2, 3, 4, 5, 6, 7, 10, 14, 21, 30, 45, 60, 75, 90, 120, 180, 365].forEach(s => {
      if (streak >= s) tryUnlock(`streak-${s}`);
    });

    // 4. Session Tiers
    [1, 5, 10, 20, 30, 40, 50, 75, 100, 150, 200, 250, 300, 400, 500, 750, 1000, 2000].forEach(p => {
      if (sessionCount >= p) tryUnlock(`timer-${p}`);
    });

    // 5. Sage Threshold (100h = 6000 minutes per Category)
    settings.subjects.forEach((sub, idx) => {
      const subMins = logs.filter(l => l.subject === sub).reduce((acc, l) => acc + l.minutes, 0);
      if (subMins >= 6000) tryUnlock(`sage-slot-${idx}`); // Map subject to sage slot
      
      // Specific Subject Badges (50h = 3000 mins)
      if (sub === 'Mathematics' && subMins >= 3000) tryUnlock('math-wizard');
      if (sub === 'Computer Science' && subMins >= 3000) tryUnlock('cs-ninja');
      if (sub === 'Deep Work' && subMins >= 3000) tryUnlock('work-executive');
    });

    // 6. Special conditions
    const hour = new Date().getHours();
    if (hour < 5 && sessionCount > 0) tryUnlock('early-5am');
    if (hour >= 2 && sessionCount > 0) tryUnlock('night-2am');
    if (completedTasksCount > 0 && tasks.filter(t => t.date === new Date().toISOString().split('T')[0]).every(t => t.completed)) tryUnlock('rank-up');
    
    // Mala counts
    if (newUnlocked.length >= 10) tryUnlock('mala-10');
    if (newUnlocked.length >= 50) tryUnlock('mala-50');
    if (newUnlocked.length >= 100) tryUnlock('mala-100');
    if (newUnlocked.length >= 107) tryUnlock('nirvana');

    if (changed) {
      setStats(prev => ({ ...prev, badges: newUnlocked }));
    }
  }, [tasks, logs, stats.streak, stats.totalStudyMinutes, settings.subjects]);

  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24 md:pb-8 space-y-8">
          {activeView === 'dashboard' && <Dashboard tasks={tasks} setTasks={setTasks} quote={quote} stats={stats} setActiveView={setActiveView} />}
          {activeView === 'planner' && <Planner tasks={tasks} setTasks={setTasks} categories={settings.subjects} />}
          {activeView === 'exams' && <Exams exams={exams} setExams={setExams} />}
          {activeView === 'timer' && <Pomodoro settings={settings} logs={logs} setLogs={setLogs} setStats={setStats} />}
          {activeView === 'stats' && <Stats logs={logs} tasks={tasks} />}
          {activeView === 'settings' && <Settings settings={settings} setSettings={setSettings} />}
          {activeView === 'image-gen' && <ImageGenerator />}
          {activeView === 'badges' && <Badges stats={stats} />}
        </div>
      </main>
    </div>
  );
};

export default App;
