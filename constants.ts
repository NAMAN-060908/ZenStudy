
import { Exam, Badge } from './types';

export const EXAMS: Exam[] = [
  { id: '1', name: 'JEE Main 2026 Session 1', date: new Date('2026-01-21') },
  { id: '2', name: 'JEE Main 2026 Session 2', date: new Date('2026-04-02') },
];

export const QUOTES = [
  "Rank is earned in the silence of deep work.",
  "The only way to learn mathematics is to do mathematics.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "Your potential is a rank waiting to be claimed.",
  "Believe you can and you're halfway there.",
  "Hard work beats talent when talent doesn't work hard."
];

export const DEFAULT_SUBJECTS = [
  'Deep Work', 'Computer Science', 'Physics', 'Chemistry', 'Mathematics', 'General Admin', 'Personal Project'
];

const generateBadges = (): Badge[] => {
  const badges: Badge[] = [];
  
  // 1-18: Task Milestones (Tiered)
  const taskSteps = [1, 5, 10, 20, 30, 40, 50, 75, 100, 150, 200, 250, 300, 400, 500, 750, 1000, 1500];
  const taskTiers = ['Initiator', 'Doer', 'Achiever', 'Producer', 'Driver', 'Captain', 'Sustainer', 'Grinder', 'Elite', 'Vanguard', 'Titan', 'Colossus', 'Overlord', 'Mythic', 'Eternal', 'Godly', 'Ascendant', 'Absolute'];
  taskSteps.forEach((n, i) => badges.push({
    id: `task-${n}`, name: taskTiers[i], 
    description: `Complete ${n} tasks`, icon: 'fa-check-to-slot', 
    color: i < 6 ? 'from-slate-400 to-slate-600' : i < 12 ? 'from-blue-400 to-indigo-600' : 'from-amber-400 to-orange-600', 
    category: 'task', unlockedAt: null
  }));

  // 19-36: Focus Hours (Tiered) - 1h to 2000h
  const timeSteps = [60, 120, 300, 600, 1200, 2400, 3000, 4500, 6000, 9000, 12000, 18000, 24000, 30000, 45000, 60000, 90000, 120000];
  const timeTiers = ['Spark', 'Flame', 'Burner', 'Torch', 'Beacon', 'Lighthouse', 'Sun', 'Nova', 'Supernova', 'Quasar', 'Galaxy', 'Cluster', 'Universe', 'Multiverse', 'Void', 'Origin', 'Alpha', 'Omega'];
  timeSteps.forEach((m, i) => badges.push({
    id: `study-${m}`, name: timeTiers[i], 
    description: `Focus for ${Math.floor(m/60)} hours`, icon: 'fa-clock', 
    color: 'from-emerald-400 to-teal-600', category: 'study', unlockedAt: null
  }));

  // 37-54: Streaks (Tiered)
  const streakSteps = [1, 2, 3, 4, 5, 6, 7, 10, 14, 21, 30, 45, 60, 75, 90, 120, 180, 365];
  const streakTiers = ['Dawn', 'Morning', 'Day', 'Week', 'Cycle', 'Phase', 'Orbit', 'Season', 'Eclipse', 'Solstice', 'Equinox', 'Era', 'Age', 'Epoch', 'Eon', 'Infinity', 'Timeless', 'Immortal'];
  streakSteps.forEach((s, i) => badges.push({
    id: `streak-${s}`, name: streakTiers[i], 
    description: `Maintain a ${s}-day streak`, icon: 'fa-fire-alt', 
    color: 'from-orange-400 to-rose-600', category: 'habit', unlockedAt: null
  }));

  // 55-72: Focus Sessions (Pomodoros)
  const pSteps = [1, 5, 10, 20, 30, 40, 50, 75, 100, 150, 200, 250, 300, 400, 500, 750, 1000, 2000];
  pSteps.forEach((p, i) => badges.push({
    id: `timer-${p}`, name: `Zen Level ${i+1}`, 
    description: `Complete ${p} focus sessions`, icon: 'fa-brain', 
    color: 'from-cyan-400 to-blue-600', category: 'timer', unlockedAt: null
  }));

  // 73-84: Sage Status (100 Hours per Category - Dynamic logic in App.tsx)
  const sageIcons = ['fa-microchip', 'fa-code', 'fa-atom', 'fa-flask', 'fa-plus-minus', 'fa-briefcase', 'fa-user-gear', 'fa-palette', 'fa-shield', 'fa-dna', 'fa-earth-americas', 'fa-star'];
  for (let i = 0; i < 12; i++) {
    badges.push({
      id: `sage-slot-${i}`, name: 'Sage Milestone', 
      description: 'Study a specific category for 100+ hours', icon: sageIcons[i % sageIcons.length], 
      color: 'from-violet-500 to-fuchsia-600', category: 'subject', unlockedAt: null
    });
  }

  // 85-108: Special Achievement Mala
  const specialBadges = [
    { id: 'early-5am', name: '5 AM Club', desc: 'Log a session before 5 AM', icon: 'fa-sun' },
    { id: 'night-2am', name: 'Oil of Midnight', desc: 'Focus until after 2 AM', icon: 'fa-moon' },
    { id: 'weekend-hero', name: 'Weekend Hero', desc: '10 hours in one weekend', icon: 'fa-shield-heart' },
    { id: 'perfect-week', name: 'Perfect Week', desc: 'Zero missed tasks for 7 days', icon: 'fa-crown' },
    { id: 'visionary-1k', name: 'Visionary 1K', desc: 'Generate a 1K concept', icon: 'fa-wand-magic' },
    { id: 'visionary-2k', name: 'Visionary 2K', desc: 'Generate a 2K masterpiece', icon: 'fa-wand-sparkles' },
    { id: 'visionary-4k', name: 'Visionary 4K', desc: 'Generate a 4K ultimate render', icon: 'fa-gem' },
    { id: 'exam-ready', name: 'Battle Ready', desc: 'Add 5 upcoming exams', icon: 'fa-swords' },
    { id: 'deep-4h', name: 'Flow State', desc: '4 hours focus in one day', icon: 'fa-water' },
    { id: 'deep-8h', name: 'Unstoppable Force', desc: '8 hours focus in one day', icon: 'fa-mountain' },
    { id: 'marathon', name: 'Marathoner', desc: '12 hours focus in one day', icon: 'fa-route' },
    { id: 'task-burst', name: 'Turbocharged', desc: 'Finish 10 tasks in 1 hour', icon: 'fa-bolt-lightning' },
    { id: 'consistency-30', name: 'The Habit', desc: '30 day streak achieved', icon: 'fa-infinity' },
    { id: 'rank-up', name: 'First Rank Up', desc: 'Complete 100% of tasks today', icon: 'fa-arrow-up-right-dots' },
    { id: 'math-wizard', name: 'Math Wizard', desc: 'Log 50 hours of Mathematics', icon: 'fa-calculator' },
    { id: 'cs-ninja', name: 'CS Ninja', desc: 'Log 50 hours of Comp Sci', icon: 'fa-keyboard' },
    { id: 'work-executive', name: 'Executive', desc: 'Log 50 hours of Work', icon: 'fa-tie' },
    { id: 'social-break', name: 'Balanced', desc: 'Take 20 planned short breaks', icon: 'fa-mug-hot' },
    { id: 'zen-master', name: 'Zen Master', desc: '100 total focus sessions', icon: 'fa-yin-yang' },
    { id: 'planner-pro', name: 'Architect', desc: 'Plan 100 tasks in advance', icon: 'fa-compass-drafting' },
    { id: 'mala-10', name: 'Mala Beginner', desc: 'Unlock 10 total badges', icon: 'fa-circle-1' },
    { id: 'mala-50', name: 'Mala Adept', desc: 'Unlock 50 total badges', icon: 'fa-circle-5' },
    { id: 'mala-100', name: 'Mala Master', desc: 'Unlock 100 total badges', icon: 'fa-circle-h' },
    { id: 'nirvana', name: 'Nirvana', desc: 'Unlock all 108 badges', icon: 'fa-om' }
  ];

  specialBadges.forEach(b => badges.push({
    id: b.id, name: b.name, description: b.desc, icon: b.icon, 
    color: 'from-pink-500 to-rose-600', category: 'habit', unlockedAt: null
  }));

  return badges;
};

export const BADGE_DEFS = generateBadges();

export const INITIAL_SETTINGS = {
  theme: 'light' as const,
  pomodoroWork: 25,
  pomodoroShortBreak: 5,
  pomodoroLongBreak: 15,
  language: 'English' as const,
  subjects: DEFAULT_SUBJECTS
};
