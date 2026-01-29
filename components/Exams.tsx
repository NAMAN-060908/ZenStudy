
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
  
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000); 
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
    <div className="space-y-6 md:space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Exams</h2>
          <p className="text-xs md:text-base text-slate-500">Milestones countdown</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white p-3 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-bold flex items-center gap-2 shadow-lg"
        >
          <i className="fa-solid fa-plus"></i>
          <span className="hidden sm:inline">Add Exam</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {exams.length > 0 ? (
          exams.map(exam => {
            const { days, hours } = formatTimeLeft(exam.date);
            const statusClass = getExamStatusColor(days);
            
            return (
              <div 
                key={exam.id}
                className="group bg-white dark:bg-slate-900 rounded-xl md:rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col sm:flex-row relative"
              >
                <button 
                  onClick={() => deleteExam(exam.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 flex items-center justify-center z-10"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>

                <div className={`p-4 md:p-6 sm:w-1/3 flex flex-col items-center justify-center text-center ${statusClass}`}>
                  <span className="text-3xl md:text-4xl font-black">{days}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Days Left</span>
                </div>
                
                <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1 truncate pr-6">{exam.name}</h3>
                    <div className="flex items-center gap-2 text-slate-500 text-xs md:text-sm">
                      <i className="fa-regular fa-calendar-days"></i>
                      <span className="font-medium">
                        {exam.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-6 flex items-center justify-between">
                    <div className="flex -space-x-1.5">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] md:text-[10px] font-bold ${
                          i === 1 ? 'bg-indigo-500 text-white' : i === 2 ? 'bg-violet-500 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {i === 1 ? 'H' : i === 2 ? 'M' : 'L'}
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] md:text-xs text-slate-400 font-medium">{hours}h remaining</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center space-y-3">
            <i className="fa-solid fa-hourglass-empty text-4xl text-slate-200"></i>
            <h3 className="text-base font-bold text-slate-400">No exams added</h3>
          </div>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full h-full md:h-auto md:max-w-md md:rounded-3xl p-6 md:p-8 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold">New Exam</h3>
              <button onClick={() => setIsAdding(false)} className="p-2 text-slate-400">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleAddExam} className="flex-1 space-y-4 md:space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Exam Name</label>
                <input 
                  autoFocus
                  type="text" 
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g., Final Exam"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 md:p-4 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Date</label>
                <input 
                  type="date" 
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 md:p-4 text-sm font-medium"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg mt-auto md:mt-4"
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
