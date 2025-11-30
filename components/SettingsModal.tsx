import React, { useState, useEffect } from 'react';
import { X, Save, Bot, Webhook, Mail, Key, Cpu, Settings2, Zap, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { AppSettings } from '../types';
import { testWebhookConnection } from '../utils/webhook';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings: initialSettings,
  onSave
}) => {
  const [formData, setFormData] = useState<AppSettings>(initialSettings);
  
  // Webhook Test State
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Sync state when opening
  useEffect(() => {
    if (isOpen) {
        setFormData(initialSettings);
        setTestStatus('idle');
    }
  }, [isOpen, initialSettings]);

  const handleTestWebhook = async () => {
    if (!formData.webhookUrl) return;
    
    setTestStatus('loading');
    // Minimal artificial delay to let the user see the loading state if the request is too fast
    const minDelay = new Promise(resolve => setTimeout(resolve, 600));
    
    const [success] = await Promise.all([
        testWebhookConnection(formData.webhookUrl),
        minDelay
    ]);

    setTestStatus(success ? 'success' : 'error');

    // Reset to idle after a few seconds
    setTimeout(() => {
        setTestStatus('idle');
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
       <div 
         className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity" 
         onClick={onClose} 
       />
       <div className="relative bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[90vh] animate-enter">
          
          {/* Header */}
          <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Settings2 size={24} className="text-zinc-900 dark:text-white" /> 
                Configuration
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Manage your AI model, integrations, and preferences.
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 -mr-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X size={20} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 px-8 py-8 space-y-10">
             
             {/* AI Section */}
             <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                <div className="md:col-span-4">
                   <div className="flex items-center gap-2 mb-2">
                      <Bot size={18} className="text-indigo-600 dark:text-indigo-400" />
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white">AI Engine</h3>
                   </div>
                   <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Configure the Gemini model used for generation and your API credentials.
                   </p>
                </div>

                <div className="md:col-span-8 space-y-5">
                   <div className="space-y-2">
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Gemini Model</label>
                      <div className="relative">
                          <Cpu size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                          <select
                            value={formData.geminiModel}
                            onChange={e => setFormData({...formData, geminiModel: e.target.value})}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent appearance-none cursor-pointer shadow-sm hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors"
                          >
                            <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fast & Efficient)</option>
                            <option value="gemini-3-pro-preview">Gemini 3.0 Pro (Complex Reasoning)</option>
                          </select>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">API Key</label>
                      <div className="relative">
                          <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                          <input
                            type="password"
                            value={formData.geminiApiKey}
                            onChange={e => setFormData({...formData, geminiApiKey: e.target.value})}
                            placeholder="Enter your Google GenAI API Key"
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent placeholder:text-zinc-400 shadow-sm transition-all"
                          />
                      </div>
                      <p className="text-[10px] text-zinc-400">Leave empty to use the system default key (if configured).</p>
                   </div>
                </div>
             </div>

             <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full" />

             {/* Webhook Section */}
             <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                <div className="md:col-span-4">
                   <div className="flex items-center gap-2 mb-2">
                      <Webhook size={18} className="text-pink-600 dark:text-pink-400" />
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Webhooks</h3>
                   </div>
                   <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Send a JSON payload to an external URL when the PRD approval status changes.
                   </p>
                </div>
                <div className="md:col-span-8 space-y-3">
                   <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Endpoint URL</label>
                   <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="url"
                                value={formData.webhookUrl}
                                onChange={e => {
                                    setFormData({...formData, webhookUrl: e.target.value});
                                    setTestStatus('idle');
                                }}
                                placeholder="https://api.yourdomain.com/webhooks/prd-approval"
                                className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent placeholder:text-zinc-400 shadow-sm transition-all"
                            />
                        </div>
                        <Button 
                            type="button"
                            variant="secondary"
                            onClick={handleTestWebhook}
                            disabled={!formData.webhookUrl || testStatus === 'loading'}
                            className={`
                                min-w-[100px] transition-all duration-300
                                ${testStatus === 'success' ? 'border-green-300 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800' : ''}
                                ${testStatus === 'error' ? 'border-red-300 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800' : ''}
                            `}
                        >
                            {testStatus === 'loading' && <Loader2 size={16} className="animate-spin" />}
                            {testStatus === 'success' && (
                                <div className="flex items-center gap-1.5 animate-enter">
                                    <CheckCircle2 size={16} />
                                    <span>200 OK</span>
                                </div>
                            )}
                            {testStatus === 'error' && (
                                <div className="flex items-center gap-1.5 animate-enter">
                                    <AlertCircle size={16} />
                                    <span>Failed</span>
                                </div>
                            )}
                            {testStatus === 'idle' && (
                                <div className="flex items-center gap-2">
                                    <Zap size={16} />
                                    <span>Test</span>
                                </div>
                            )}
                        </Button>
                   </div>
                </div>
             </div>

             <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full" />

             {/* Email Section */}
             <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                <div className="md:col-span-4">
                   <div className="flex items-center gap-2 mb-2">
                      <Mail size={18} className="text-blue-600 dark:text-blue-400" />
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Notifications</h3>
                   </div>
                   <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Where should we send confirmation emails and export links?
                   </p>
                </div>
                <div className="md:col-span-8 space-y-3">
                   <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Email Address</label>
                   <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="you@company.com"
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent placeholder:text-zinc-400 shadow-sm transition-all"
                      />
                </div>
             </div>
          </div>

          <div className="px-8 py-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-b-2xl">
             <Button variant="ghost" onClick={onClose}>Cancel</Button>
             <Button variant="primary" onClick={() => onSave(formData)} leftIcon={<Save size={16} />}>Save Changes</Button>
          </div>
       </div>
    </div>
  );
}