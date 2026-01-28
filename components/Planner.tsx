
import React, { useState } from 'react';
import { Task, Priority } from '../types';
import { SUBJECTS } from '../constants';
import { getPriorityColor } from '../utils';

interface PlannerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const Planner: React.FC<PlannerProps> = ({ tasks, setTasks }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Today' | 'Upcoming' | 'Completed'>('All');
  
  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0]);
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
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Daily Planner</h2>
          <p className="text-slate-500 dark:text-slate-400">Design your day for maximum productivity</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/30 transition-all"
        >
          <i className="fa-solid fa-plus"></i>
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </header>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Today', 'Upcoming', 'Completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              filter === f 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div 
              key={task.id}
              className={`relative bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md group ${
                task.completed ? 'opacity-70' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40"
                  >
                    <i className="fa-solid fa-trash-can text-xs"></i>
                  </button>
                </div>
              </div>
              
              <h4 className={`text-lg font-bold mb-1 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                {task.title}
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
                <i className="fa-solid fa-book-open text-indigo-400"></i>
                {task.subject}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-400">
                  <i className="fa-regular fa-clock text-xs"></i>
                  <span className="text-xs font-semibold">{task.time}</span>
                  <span className="text-xs">•</span>
                  <span className="text-xs">{new Date(task.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    task.completed 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-indigo-600 hover:text-white'
                  }`}
                >
                  {task.completed ? 'Completed' : 'Done?'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-calendar-xmark text-4xl text-slate-300 dark:text-slate-700"></i>
            </div>
            <h3 className="text-lg font-bold">No tasks found</h3>
            <p className="text-slate-500">Try changing your filters or add a new task</p>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Create New Task</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Task Title</label>
                <input 
                  autoFocus
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Study Organic Chemistry"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Subject</label>
                  <select 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium appearance-none"
                  >
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Priority</label>
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium appearance-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Time</label>
                  <input 
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Date</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all"
              >
                Add to Schedule
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;
