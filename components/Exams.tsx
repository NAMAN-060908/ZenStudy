
import React, { useState, useEffect } from 'react';
import { Exam } from '../types';
import { formatTimeLeft, getExamStatusColor } from '../utils';

interface ExamsProps {
  exams: Exam[];
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>;
}

const Exams: React.FC<ExamsProps> = ({ exams, setExams }) => {
  const [now, setNow] = useState(new Date());
  const [isAdding, setIsAdding] = useState(false);
  
  // New Exam Form State
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName || !examDate) return;

    const newExam: Exam = {
      id: crypto.randomUUID(),
      name: examName,
      date: new Date(examDate)
    };

    setExams(prev => [...prev, newExam].sort((a, b) => a.date.getTime() - b.date.getTime()));
    setExamName('');
    setExamDate('');
    setIsAdding(false);
  };

  const deleteExam = (id: string) => {
    if (confirm('Remove this exam from your list?')) {
      setExams(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Exam Countdown</h2>
          <p className="text-slate-500 dark:text-slate-400">Keep track of important milestones</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/30 transition-all"
        >
          <i className="fa-solid fa-plus"></i>
          <span className="hidden sm:inline">Add Exam</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.length > 0 ? (
          exams.map(exam => {
            const { days, hours } = formatTimeLeft(exam.date);
            const statusClass = getExamStatusColor(days);
            
            return (
              <div 
                key={exam.id}
                className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row relative"
              >
                <button 
                  onClick={() => deleteExam(exam.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>

                <div className={`p-6 sm:w-1/3 flex flex-col items-center justify-center text-center ${statusClass}`}>
                  <span className="text-4xl font-black">{days}</span>
                  <span className="text-xs font-bold uppercase tracking-widest">Days Left</span>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{exam.name}</h3>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                      <i className="fa-regular fa-calendar-days"></i>
                      <span className="font-medium">
                        {exam.date.toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold ${
                          i === 1 ? 'bg-indigo-500 text-white' : i === 2 ? 'bg-violet-500 text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {i === 1 ? 'H' : i === 2 ? 'M' : 'L'}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Approx {hours} hours left</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-hourglass-empty text-4xl text-slate-300 dark:text-slate-700"></i>
            </div>
            <h3 className="text-lg font-bold">No exams added</h3>
            <p className="text-slate-500">Add your important dates to start the countdown</p>
          </div>
        )}
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 text-2xl flex-shrink-0">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div>
          <h4 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-1">Stay Focused!</h4>
          <p className="text-sm text-amber-800/70 dark:text-amber-100/60 leading-relaxed">
            Preparation is the key to success. Starting your focused preparation today will put you ahead of the competition. Consistency is your biggest ally.
          </p>
        </div>
      </div>

      {/* Add Exam Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Add New Exam</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleAddExam} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Exam Name</label>
                <input 
                  autoFocus
                  type="text" 
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g., JEE Advanced 2026"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Date</label>
                <input 
                  type="date" 
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all"
              >
                Create Countdown
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exams;
