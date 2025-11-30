import React from 'react';
import { FileText, FileJson, FileCode, FileType, File } from 'lucide-react';

interface ExportMenuProps {
  onExport: (format: string) => void;
  onClose: () => void;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ onExport, onClose }) => {
  const options = [
    { id: 'pdf', label: 'Export as PDF', icon: <FileText size={16} /> },
    { id: 'markdown', label: 'Export as Markdown', icon: <FileCode size={16} /> },
    { id: 'txt', label: 'Export as Text', icon: <FileType size={16} /> },
    { id: 'json', label: 'Export as JSON', icon: <FileJson size={16} /> },
    { id: 'html', label: 'Export as HTML', icon: <File size={16} /> },
  ];

  // Click outside listener could be added here for robustness, 
  // but for now we rely on the parent or simple backdrop.

  return (
    <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden z-50 animate-enter origin-top-right p-1">
      <div className="flex flex-col gap-0.5">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => {
              onExport(option.id);
              onClose();
            }}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-left"
          >
            <span className="text-zinc-400 dark:text-zinc-500">{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};