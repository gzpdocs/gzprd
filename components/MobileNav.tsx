import React from 'react';
import { ViewState } from '../types';

interface MobileNavProps {
  view: ViewState;
  onViewChange: (view: ViewState) => void;
  steps: { id: string; label: string; icon: React.ReactNode }[];
}

export const MobileNav: React.FC<MobileNavProps> = ({ view, onViewChange, steps }) => {
  return (
    <div className="md:hidden px-4 pb-4 pt-2 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-20 z-20 flex justify-center w-full border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="flex items-center space-x-2 bg-zinc-100 dark:bg-zinc-900 p-2 rounded-full shadow-inner overflow-x-auto max-w-full">
           {steps.map((step) => {
               const isActive = view === step.id;
               return (
                   <button
                      key={step.id}
                      onClick={() => onViewChange(step.id as ViewState)}
                      className={`
                          flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap
                          ${isActive 
                              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/5' 
                              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'}
                      `}
                   >
                       {isActive && <span className="opacity-75">{step.icon}</span>}
                       {step.label}
                   </button>
               )
           })}
        </div>
    </div>
  );
};