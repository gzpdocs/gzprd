import React from 'react';
import { Rocket, Sun, Moon, ChevronRight, Settings2, FileText, Eye, Settings, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { ViewState } from '../types';

interface HeaderProps {
  scrolled: boolean;
  view: ViewState;
  setView: (view: ViewState) => void;
  isDark: boolean;
  toggleTheme: () => void;
  onPublish: () => void;
  onOpenSettings: () => void;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  scrolled,
  view,
  setView,
  isDark,
  toggleTheme,
  onPublish,
  onOpenSettings,
  hasApiKey
}) => {
  const steps = [
    { id: 'config', label: 'Structure', icon: <Settings2 size={16} /> },
    { id: 'edit', label: 'Write', icon: <FileText size={16} /> },
    { id: 'preview', label: 'Preview', icon: <Eye size={16} /> },
  ];

  if (view === 'public') return null;

  return (
    <header className={`
      sticky top-0 z-30 transition-all duration-300
      ${scrolled 
          ? 'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shadow-sm border-b border-zinc-200 dark:border-zinc-800' 
          : 'bg-transparent pt-6 pb-2'}
    `}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setView('landing')}
            className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight hover:opacity-70 transition-opacity"
          >
            GZPRD
          </button>
        </div>

        {/* Centered Navigation Pill - Desktop */}
        <div className="hidden md:flex items-center p-1.5 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full border border-zinc-200/60 dark:border-zinc-800 backdrop-blur-sm">
           {steps.map((step) => {
               const isActive = view === step.id;
               return (
                   <button
                      key={step.id}
                      onClick={() => setView(step.id as ViewState)}
                      className={`
                          flex items-center gap-2.5 px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-200
                          ${isActive 
                              ? 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white shadow-sm ring-1 ring-zinc-900/5 dark:ring-zinc-100/10' 
                              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'}
                      `}
                   >
                       {step.icon}
                       {step.label}
                   </button>
               )
           })}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
           <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
           >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
           </button>

           <button
              onClick={onOpenSettings}
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              title={!hasApiKey ? 'Configure API Key' : 'Settings'}
           >
              <Settings size={20} />
              {!hasApiKey && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white dark:border-zinc-950 animate-pulse" />
              )}
           </button>

           {view === 'preview' ? (
               <Button onClick={onPublish} variant="primary" size="md" rightIcon={<ChevronRight size={18}/>}>
                   Publish
               </Button>
           ) : (
               <Button onClick={() => setView('preview')} variant="secondary" size="md" className="hidden sm:inline-flex">
                   Preview
               </Button>
           )}
        </div>
      </div>
    </header>
  );
};