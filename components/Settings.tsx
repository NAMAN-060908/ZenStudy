
import React from 'react';
import { AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings }) => {
  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400">Customize your study experience</p>
      </header>

      <div className="space-y-6">
        {/* Appearance Section */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <i className="fa-solid fa-palette text-indigo-500"></i>
            Appearance
          </h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Dark Mode</p>
              <p className="text-sm text-slate-500">Toggle dark and light themes</p>
            </div>
            <button 
              onClick={() => updateSetting('theme', settings.theme === 'light' ? 'dark' : 'light')}
              className={`w-14 h-8 rounded-full p-1 transition-all ${
                settings.theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all ${
                settings.theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
              }`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Language</p>
              <p className="text-sm text-slate-500">Select your preferred language</p>
            </div>
            <select 
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 font-bold appearance-none min-w-[120px]"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>
        </section>

        {/* Timer Config Section */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <i className="fa-solid fa-stopwatch text-indigo-500"></i>
            Timer Configuration
          </h3>
          
          <div className="space-y-6">
            {[
              { label: 'Focus Interval', key: 'pomodoroWork', icon: 'fa-brain' },
              { label: 'Short Break', key: 'pomodoroShortBreak', icon: 'fa-mug-hot' },
              { label: 'Long Break', key: 'pomodoroLongBreak', icon: 'fa-couch' },
            ].map((item) => (
              <div key={item.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-xs text-slate-500">Minutes per session</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="1" 
                    max="360" 
                    step="1"
                    value={settings[item.key as keyof AppSettings] as number}
                    onChange={(e) => updateSetting(item.key as any, parseInt(e.target.value))}
                    className="w-40 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="w-16 text-center font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg">
                    {settings[item.key as keyof AppSettings]}m
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-red-50 dark:bg-red-900/10 rounded-3xl p-6 border border-red-100 dark:border-red-900/20 space-y-4">
          <h3 className="text-red-700 dark:text-red-400 font-bold">Data Management</h3>
          <p className="text-sm text-red-800/70 dark:text-red-100/60">
            Deleting your data will remove all your tasks, logs, and stats permanently from this device.
          </p>
          <button 
            onClick={() => {
              if (confirm('Are you sure you want to clear all data?')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 transition-all"
          >
            Clear All Data
          </button>
        </section>
      </div>
    </div>
  );
};

export default Settings;
