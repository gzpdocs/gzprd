import React from 'react';
import { AlertCircle, X, Settings } from 'lucide-react';
import { Button } from './Button';

interface ApiKeyBannerProps {
  onDismiss: () => void;
  onOpenSettings: () => void;
}

export const ApiKeyBanner: React.FC<ApiKeyBannerProps> = ({ onDismiss, onOpenSettings }) => {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-b border-amber-200 dark:border-amber-800/50 animate-enter">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
            <AlertCircle size={20} className="text-amber-600 dark:text-amber-400" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-100 mb-1">
              API Key Required for AI Features
            </h3>
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed mb-3">
              To use AI-powered content generation, you need to configure your Gemini API key.
              Get a free API key from Google AI Studio and add it in Settings.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={onOpenSettings}
                leftIcon={<Settings size={14} />}
                className="bg-amber-600 dark:bg-amber-700 text-white border-amber-600 dark:border-amber-700 hover:bg-amber-700 dark:hover:bg-amber-600"
              >
                Configure API Key
              </Button>

              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 underline"
              >
                Get Free API Key →
              </a>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1.5 text-amber-600 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-lg transition-colors"
            aria-label="Dismiss banner"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
