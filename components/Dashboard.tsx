
import React from 'react';
import { Task, UserStats, View } from '../types';
import { getPriorityColor } from '../utils';

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

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400">
              <i className="fa-solid fa-fire text-lg"></i>
            </div>
            <div>
              <p className="text-sm font-bold">{stats.streak} Days</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Streak</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Quote Card */}
      <section className="relative overflow-hidden bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 dark:shadow-none">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <i className="fa-solid fa-quote-left text-indigo-400 text-3xl"></i>
          <p className="text-xl md:text-2xl font-medium leading-relaxed italic">"{quote}"</p>
          <div className="h-1 w-12 bg-indigo-400 rounded-full"></div>
        </div>
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500 rounded-full blur-2xl opacity-40 -ml-10 -mb-10"></div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Card */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <i className="fa-solid fa-chart-pie text-indigo-500"></i>
            Today's Progress
          </h3>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-100 dark:text-slate-800"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 58}
                  strokeDashoffset={2 * Math.PI * 58 * (1 - progressPercent / 100)}
                  strokeLinecap="round"
                  className="text-indigo-600 transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{progressPercent}%</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Done</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">{completedCount} of {todaysTasks.length} tasks completed</p>
              <p className="text-xs text-slate-500 mt-1">
                {progressPercent === 100 ? "Amazing! You're on fire! 🔥" : "Keep going, you've got this!"}
              </p>
            </div>
            <button 
              onClick={() => setActiveView('planner')}
              className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              Manage Tasks
            </button>
          </div>
        </div>

        {/* Goals List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <i className="fa-solid fa-list-check text-indigo-500"></i>
              Daily Goals
            </h3>
            <button 
              onClick={() => setActiveView('planner')}
              className="text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {todaysTasks.length > 0 ? (
              todaysTasks.map(task => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    task.completed 
                    ? 'bg-slate-50 dark:bg-slate-800/50 border-transparent opacity-60' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      task.completed 
                      ? 'bg-indigo-600 border-indigo-600' 
                      : 'border-slate-300 dark:border-slate-600 group-hover:border-indigo-400'
                    }`}>
                      {task.completed && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                    </div>
                    <div>
                      <h4 className={`font-semibold ${task.completed ? 'line-through' : ''}`}>
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span>{task.subject}</span>
                        <span>•</span>
                        <span>{task.time}</span>
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-3">
                <i className="fa-regular fa-calendar-plus text-4xl opacity-20"></i>
                <p className="text-sm font-medium">No goals set for today</p>
                <button 
                  onClick={() => setActiveView('planner')}
                  className="text-xs text-indigo-600 font-bold border border-indigo-200 px-4 py-2 rounded-lg"
                >
                  Create Task
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
