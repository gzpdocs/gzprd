import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = ''
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className={`
        fixed bottom-0 left-0 right-0 z-50
        bg-white dark:bg-zinc-900
        rounded-t-2xl
        shadow-xl
        max-h-[85vh]
        overflow-y-auto
        animate-in
        slide-in-from-bottom-4
        duration-300
        ${className}
      `}>
        {/* Handle Bar */}
        <div className="sticky top-0 bg-white dark:bg-zinc-900 rounded-t-2xl px-4 pt-3 pb-1 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex-1 flex justify-center">
            <div className="h-1 w-10 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
          </div>
          {title && (
            <h2 className="absolute left-4 text-lg font-semibold text-zinc-900 dark:text-white">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </>
  );
};
