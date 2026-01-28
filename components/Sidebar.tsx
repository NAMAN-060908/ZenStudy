
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems: { id: View; icon: string; label: string }[] = [
    { id: 'dashboard', icon: 'fa-house', label: 'Dashboard' },
    { id: 'planner', icon: 'fa-calendar-check', label: 'Planner' },
    { id: 'exams', icon: 'fa-hourglass-half', label: 'Exams' },
    { id: 'timer', icon: 'fa-clock', label: 'Pomodoro' },
    { id: 'stats', icon: 'fa-chart-line', label: 'Analytics' },
    { id: 'settings', icon: 'fa-gear', label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around p-3 md:hidden z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeView === item.id 
              ? 'text-indigo-600 dark:text-indigo-400' 
              : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg`}></i>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 space-y-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i className="fa-solid fa-brain text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            ZenStudy
          </h1>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeView === item.id
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-6`}></i>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl p-4">
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider mb-2">Pro Tip</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Complete your daily goals early to keep your study streak alive!
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
