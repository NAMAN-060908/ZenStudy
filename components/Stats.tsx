
import React, { useMemo } from 'react';
import { StudyLog, Task } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface StatsProps {
  logs: StudyLog[];
  tasks: Task[];
}

const Stats: React.FC<StatsProps> = ({ logs, tasks }) => {
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayLogs = logs.filter(l => l.date === date);
      const totalMinutes = dayLogs.reduce((acc, curr) => acc + curr.minutes, 0);
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        minutes: totalMinutes,
        hours: parseFloat((totalMinutes / 60).toFixed(1))
      };
    });
  }, [logs]);

  const subjectData = useMemo(() => {
    const totals: Record<string, number> = {};
    logs.forEach(log => {
      totals[log.subject] = (totals[log.subject] || 0) + log.minutes;
    });
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [logs]);

  const totalMinutes = logs.reduce((acc, curr) => acc + curr.minutes, 0);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e'];

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Study Analytics</h2>
        <p className="text-slate-500 dark:text-slate-400">Track your progress and subject distribution</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Studied', value: `${Math.round(totalMinutes / 60)}h`, icon: 'fa-clock', color: 'bg-indigo-500' },
          { label: 'Tasks Done', value: completedTasks, icon: 'fa-check-double', color: 'bg-emerald-500' },
          { label: 'Completion', value: `${completionRate}%`, icon: 'fa-bullseye', color: 'bg-rose-500' },
          { label: 'Session Count', value: logs.length, icon: 'fa-bolt', color: 'bg-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
              <i className={`fa-solid ${stat.icon} text-xl`}></i>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="font-bold text-lg">Weekly Study Hours</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="hours" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="font-bold text-lg">Subject Distribution</h3>
          <div className="h-72 w-full flex items-center justify-center">
            {subjectData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center space-y-2 opacity-30">
                <i className="fa-solid fa-chart-pie text-6xl"></i>
                <p className="font-bold">No study data yet</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {subjectData.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
