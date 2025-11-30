import React, { useState } from 'react';
import { X, MessageSquare, ThumbsUp, ShieldCheck, Check } from 'lucide-react';
import { Button } from './Button';
import { PublicSettings } from '../types';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (settings: PublicSettings) => void;
  initialSettings: PublicSettings;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialSettings
}) => {
  const [settings, setSettings] = useState<PublicSettings>(initialSettings);

  if (!isOpen) return null;

  const toggleSetting = (key: keyof PublicSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 animate-enter">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Publish Settings</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          Configure how your PRD appears to the public. You can change these settings later.
        </p>

        <div className="space-y-3 mb-8">
          {/* Setting: Comments */}
          <div 
            onClick={() => toggleSetting('allowComments')}
            className={`
              flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all
              ${settings.allowComments 
                ? 'border-zinc-900 bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700' 
                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'}
            `}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${settings.allowComments ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800'}`}>
                <MessageSquare size={16} />
              </div>
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Allow Comments</div>
            </div>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${settings.allowComments ? 'bg-zinc-900 border-zinc-900 dark:bg-zinc-50 dark:border-zinc-50' : 'border-zinc-300 dark:border-zinc-700'}`}>
              {settings.allowComments && <Check size={12} className="text-white dark:text-zinc-900" strokeWidth={4} />}
            </div>
          </div>

          {/* Setting: Upvotes */}
          <div 
            onClick={() => toggleSetting('allowUpvotes')}
            className={`
              flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all
              ${settings.allowUpvotes 
                ? 'border-zinc-900 bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700' 
                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'}
            `}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${settings.allowUpvotes ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800'}`}>
                <ThumbsUp size={16} />
              </div>
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Enable Upvotes</div>
            </div>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${settings.allowUpvotes ? 'bg-zinc-900 border-zinc-900 dark:bg-zinc-50 dark:border-zinc-50' : 'border-zinc-300 dark:border-zinc-700'}`}>
              {settings.allowUpvotes && <Check size={12} className="text-white dark:text-zinc-900" strokeWidth={4} />}
            </div>
          </div>

          {/* Setting: Approval Flow */}
          <div 
            onClick={() => toggleSetting('enableApprovalFlow')}
            className={`
              flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all
              ${settings.enableApprovalFlow 
                ? 'border-zinc-900 bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700' 
                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'}
            `}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${settings.enableApprovalFlow ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800'}`}>
                <ShieldCheck size={16} />
              </div>
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Enable Client Approval Flow</div>
            </div>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${settings.enableApprovalFlow ? 'bg-zinc-900 border-zinc-900 dark:bg-zinc-50 dark:border-zinc-50' : 'border-zinc-300 dark:border-zinc-700'}`}>
              {settings.enableApprovalFlow && <Check size={12} className="text-white dark:text-zinc-900" strokeWidth={4} />}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onConfirm(settings)} className="flex-1">
            Confirm & Publish
          </Button>
        </div>
      </div>
    </div>
  );
};