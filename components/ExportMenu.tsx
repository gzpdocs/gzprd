import React from 'react';
import { FileText, FileJson, FileCode, FileType, File } from 'lucide-react';
import { BottomSheet } from './ui/BottomSheet';

interface ExportMenuProps {
  isOpen: boolean;
  onExport: (format: string) => void;
  onClose: () => void;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ isOpen, onExport, onClose }) => {
  const options = [
    { id: 'pdf', label: 'Export as PDF', icon: <FileText size={16} /> },
    { id: 'markdown', label: 'Export as Markdown', icon: <FileCode size={16} /> },
    { id: 'txt', label: 'Export as Text', icon: <FileType size={16} /> },
    { id: 'json', label: 'Export as JSON', icon: <FileJson size={16} /> },
    { id: 'html', label: 'Export as HTML', icon: <File size={16} /> },
  ];

  const handleExport = (format: string) => {
    onExport(format);
    onClose();
  };

  const MenuContent = (
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => handleExport(option.id)}
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-left"
        >
          <span className="text-zinc-400 dark:text-zinc-500">{option.icon}</span>
          {option.label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop Dropdown Menu */}
      {isOpen && (
        <div className="hidden sm:block absolute top-full left-0 sm:right-0 sm:left-auto mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden z-50 animate-enter origin-top-right p-1">
          {MenuContent}
        </div>
      )}

      {/* Mobile Bottom Sheet */}
      <div className="sm:hidden">
        <BottomSheet
          isOpen={isOpen}
          onClose={onClose}
          title="Export Format"
        >
          {MenuContent}
        </BottomSheet>
      </div>
    </>
  );
};