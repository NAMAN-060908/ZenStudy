
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems: { id: View; icon: string; label: string }[] = [
    { id: 'dashboard', icon: 'fa-house', label: 'Home' },
    { id: 'planner', icon: 'fa-calendar-check', label: 'Planner' },
    { id: 'timer', icon: 'fa-stopwatch', label: 'Focus' },
    { id: 'image-gen', icon: 'fa-palette', label: 'Studio' },
    { id: 'badges', icon: 'fa-award', label: 'Mala' },
    { id: 'stats', icon: 'fa-chart-simple', label: 'Rank' },
    { id: 'settings', icon: 'fa-sliders', label: 'Settings' },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 flex justify-around p-3 md:hidden z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeView === item.id 
              ? 'text-indigo-600 scale-110' 
              : 'text-slate-400'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg`}></i>
            <span className="text-[7px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>

      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 space-y-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-700 to-violet-800 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-500/20">
            <i className="fa-solid fa-arrow-trend-up text-white text-xl"></i>
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-violet-700 bg-clip-text text-transparent tracking-tighter">
            RankUp
          </h1>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                activeView === item.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 translate-x-1'
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-6`}></i>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl p-4 border border-indigo-100 dark:border-slate-700">
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest mb-1">Elite Performance</p>
            <p className="text-[10px] text-slate-500 leading-snug font-medium">
              Achieve Mala 108 for ultimate focus mastery.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
