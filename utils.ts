
export const formatTimeLeft = (targetDate: Date) => {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  
  if (diff <= 0) return { days: 0, hours: 0, totalHours: 0 };
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  
  return { days, hours, totalHours };
};

export const getExamStatusColor = (daysLeft: number) => {
  if (daysLeft < 30) return 'text-red-500 bg-red-50 dark:bg-red-900/20';
  if (daysLeft < 90) return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
  return 'text-green-500 bg-green-50 dark:bg-green-900/20';
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
    case 'Medium': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400';
    case 'Low': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
    default: return 'text-gray-600 bg-gray-100';
  }
};
