
import React, { useState } from 'react';
import { Task, Priority } from '../types';
import { getPriorityColor } from '../utils';

interface PlannerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  categories: string[];
}

const Planner: React.FC<PlannerProps> = ({ tasks, setTasks, categories }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Today' | 'Upcoming' | 'Completed'>('All');
  
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(categories[0] || 'Uncategorized');
  const [time, setTime] = useState('09:00');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      subject,
      time,
      priority,
      completed: false,
      date
    };

    setTasks(prev => [newTask, ...prev]);
    setTitle('');
    setIsAdding(false);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Today') return t.date === todayStr;
    if (filter === 'Upcoming') return t.date > todayStr;
    if (filter === 'Completed') return t.completed;
    return true;
  }).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-4 md:space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">Daily Ops</h2>
          <p className="text-xs md:text-base text-slate-500 font-medium">Strategize your performance blocks</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white p-3 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-black flex items-center gap-2 shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
        >
          <i className="fa-solid fa-plus"></i>
          <span className="hidden sm:inline">Commit Task</span>
        </button>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {['All', 'Today', 'Upcoming', 'Completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              filter === f 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div 
              key={task.id}
              className={`bg-white dark:bg-slate-900 rounded-[2rem] p-5 md:p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-all ${
                task.completed ? 'opacity-60 bg-slate-50 dark:bg-slate-950' : 'hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[8px] md:text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                >
                  <i className="fa-solid fa-trash-can text-xs"></i>
                </button>
              </div>
              
              <h4 className={`text-base md:text-lg font-black mb-1 truncate ${task.completed ? 'line-through text-slate-400' : ''}`}>
                {task.title}
              </h4>
              <p className="text-xs md:text-sm text-slate-500 font-bold flex items-center gap-2 mb-4">
                <i className="fa-solid fa-tag text-indigo-400 opacity-50"></i>
                {task.subject}
              </p>

              <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-col text-[10px] text-slate-400 font-bold">
                  <span className="flex items-center gap-1">
                    <i className="fa-regular fa-clock"></i> {task.time}
                  </span>
                  <span className="uppercase tracking-tighter">{new Date(task.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-black transition-all uppercase tracking-widest ${
                    task.completed 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md active:scale-95'
                  }`}
                >
                  {task.completed ? 'Achieved' : 'Rank Up'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4 opacity-30">
            <i className="fa-solid fa-mountain-sun text-6xl text-slate-200"></i>
            <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">The summit is clear</h3>
          </div>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full h-full md:h-auto md:max-w-md md:rounded-[3rem] p-8 flex flex-col shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black tracking-tight">Define Mission</h3>
              <button onClick={() => setIsAdding(false)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleAddTask} className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Objective</label>
                <input 
                  autoFocus
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Focus block name..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Division</label>
                  <select 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold appearance-none"
                  >
                    {categories.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Priority</label>
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold appearance-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Deploy Time</label>
                  <input 
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Date</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-indigo-500/20 active:scale-95 transition-all mt-6 uppercase tracking-widest"
              >
                Engage Target
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;
