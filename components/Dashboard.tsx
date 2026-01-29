
import React from 'react';
import { Task, UserStats, View } from '../types';
import { getPriorityColor } from '../utils';
import { BADGE_DEFS } from '../constants';

interface DashboardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  quote: string;
  stats: UserStats;
  setActiveView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, setTasks, quote, stats, setActiveView }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter(t => t.date === todayStr);
  const completedCount = todaysTasks.filter(t => t.completed).length;
  const progressPercent = todaysTasks.length > 0 
    ? Math.round((completedCount / todaysTasks.length) * 100) 
    : 0;

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const recentBadges = BADGE_DEFS.filter(b => stats.badges.includes(b.id)).slice(-3);

  return (
    <div className="space-y-6 md:space-y-8">
      <header className="flex flex-row items-center justify-between gap-2">
        <div>
          <h2 className="text-xl md:text-3xl font-black tracking-tight">Focus Central</h2>
          <p className="text-xs md:text-base text-slate-500 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div 
          onClick={() => setActiveView('badges')}
          className="bg-white dark:bg-slate-900 p-2 md:p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 md:gap-3 shadow-sm cursor-pointer hover:border-indigo-300 transition-colors"
        >
          <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600">
            <i className="fa-solid fa-fire text-sm md:text-lg"></i>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs md:text-sm font-bold">{stats.streak} Days</p>
            <p className="text-[8px] md:text-[10px] text-slate-400 uppercase font-semibold">Streak</p>
          </div>
        </div>
      </header>

      {/* Hero Quote */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl md:rounded-3xl p-6 md:p-10 text-white shadow-xl shadow-indigo-500/20">
        <div className="relative z-10 space-y-3 md:space-y-4 max-w-2xl">
          <i className="fa-solid fa-quote-left text-indigo-400 text-3xl"></i>
          <p className="text-xl md:text-3xl font-bold leading-tight italic">"{quote}"</p>
          <div className="h-1 w-16 bg-white/30 rounded-full"></div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-30 -mr-20 -mt-20"></div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Progress & Badges */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="font-bold text-base flex items-center gap-2">
              <i className="fa-solid fa-circle-notch text-indigo-500"></i>
              Daily Completion
            </h3>
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                  <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="251" strokeDashoffset={251 * (1 - progressPercent / 100)} strokeLinecap="round" className="text-indigo-600 transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black">{progressPercent}%</span>
                </div>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase">{completedCount} of {todaysTasks.length} Done</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base flex items-center gap-2">
              <i className="fa-solid fa-medal text-amber-500"></i>
              Recent Medals
            </h3>
            <div className="flex gap-2">
              {recentBadges.length > 0 ? recentBadges.map(b => (
                <div key={b.id} className={`w-10 h-10 rounded-full bg-gradient-to-br ${b.color} flex items-center justify-center text-white text-xs shadow-md`} title={b.name}>
                  <i className={`fa-solid ${b.icon}`}></i>
                </div>
              )) : (
                <p className="text-xs text-slate-400 font-medium">Earn medals by studying!</p>
              )}
            </div>
            <button onClick={() => setActiveView('badges')} className="text-[10px] font-black uppercase text-indigo-600 hover:underline">View All Badges</button>
          </div>
        </div>

        {/* Goals List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base flex items-center gap-2">
              <i className="fa-solid fa-bullseye text-indigo-500"></i>
              Priority Goals
            </h3>
            <button onClick={() => setActiveView('planner')} className="text-indigo-600 text-xs font-bold hover:underline">Edit Plan</button>
          </div>

          <div className="space-y-3">
            {todaysTasks.length > 0 ? todaysTasks.map(task => (
              <div key={task.id} onClick={() => toggleTask(task.id)} className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${task.completed ? 'bg-slate-50 dark:bg-slate-800/50 border-transparent opacity-50' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:shadow-md'}`}>
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${task.completed ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                    {task.completed && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                  </div>
                  <div className="truncate">
                    <h4 className={`font-bold text-sm truncate ${task.completed ? 'line-through' : ''}`}>{task.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{task.subject}</p>
                  </div>
                </div>
                <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest flex-shrink-0 ${getPriorityColor(task.priority)}`}>{task.priority}</span>
              </div>
            )) : (
              <div className="text-center py-10 opacity-30">
                <i className="fa-solid fa-calendar-day text-4xl mb-2"></i>
                <p className="text-xs font-bold">Plan your day to start!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
