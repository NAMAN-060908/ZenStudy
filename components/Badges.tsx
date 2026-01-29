
import React, { useState } from 'react';
import { Badge, UserStats } from '../types';
import { BADGE_DEFS } from '../constants';

interface BadgesProps {
  stats: UserStats;
}

const Badges: React.FC<BadgesProps> = ({ stats }) => {
  const [filter, setFilter] = useState<string>('all');
  
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'habit', label: 'Habits' },
    { id: 'task', label: 'Tasks' },
    { id: 'study', label: 'Study' },
    { id: 'subject', label: 'Mastery' },
    { id: 'timer', label: 'Focus' },
  ];

  const filteredBadges = BADGE_DEFS.filter(b => filter === 'all' || b.category === filter);
  const unlockedCount = stats.badges.length;

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter">Hall of Fame</h2>
          <p className="text-slate-500 font-medium">Unlock all 50 milestones to reach Zen Master status</p>
        </div>
        <div className="bg-indigo-600 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl shadow-indigo-500/20">
          <i className="fa-solid fa-trophy text-xl text-yellow-300"></i>
          <div>
            <p className="text-xs font-black uppercase tracking-widest leading-none">Unlocked</p>
            <p className="text-xl font-black">{unlockedCount} / {BADGE_DEFS.length}</p>
          </div>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              filter === cat.id 
              ? 'bg-indigo-600 text-white shadow-lg' 
              : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredBadges.map((badge) => {
          const isUnlocked = stats.badges.includes(badge.id);
          return (
            <div 
              key={badge.id}
              className={`relative bg-white dark:bg-slate-900 rounded-[2rem] p-5 border transition-all flex flex-col items-center text-center gap-4 group ${
                isUnlocked 
                ? 'border-indigo-100 dark:border-indigo-900/30 shadow-sm' 
                : 'border-slate-100 dark:border-slate-800 grayscale opacity-40'
              }`}
            >
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-white shadow-lg transform transition-transform group-hover:scale-110`}>
                <i className={`fa-solid ${badge.icon} text-xl md:text-2xl`}></i>
              </div>
              <div>
                <h4 className="font-black text-xs md:text-sm tracking-tight leading-tight mb-1">{badge.name}</h4>
                <p className="text-[9px] text-slate-400 font-medium leading-tight">{badge.description}</p>
              </div>
              
              {!isUnlocked && (
                <div className="absolute top-2 right-2">
                  <i className="fa-solid fa-lock text-[10px] text-slate-300"></i>
                </div>
              )}

              {isUnlocked && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                  <i className="fa-solid fa-check text-[8px] text-white"></i>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Badges;
