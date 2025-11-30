import React from 'react';
import { Cpu, Zap, Brain } from 'lucide-react';

interface ModelDropdownProps {
  onSelect: (modelId: string) => void;
  onClose: () => void;
}

export const ModelDropdown: React.FC<ModelDropdownProps> = ({ onSelect, onClose }) => {
  const options = [
    {
      id: 'gemini-2.5-flash',
      label: 'Gemini 2.5 Flash',
      description: 'Fast & Efficient',
      icon: <Zap size={16} />
    },
    {
      id: 'gemini-3-pro-preview',
      label: 'Gemini 3.0 Pro',
      description: 'Complex Reasoning',
      icon: <Brain size={16} />
    },
  ];

  return (
    <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-zinc-900 rounded-xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden z-50 animate-enter origin-top p-1">
      <div className="flex flex-col gap-0.5">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => {
              onSelect(option.id);
              onClose();
            }}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-left"
          >
            <span className="text-zinc-400 dark:text-zinc-500">{option.icon}</span>
            <div className="flex flex-col">
              <span className="font-semibold text-zinc-900 dark:text-white">{option.label}</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{option.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
