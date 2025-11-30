import React, { useState } from 'react';
import { PRD, GenerationContext } from '../../types';
import { Sparkles, RefreshCw, Wand2, ArrowLeft, Layout } from 'lucide-react';
import { AIField } from '../AIField';
import { Button } from '../Button';

interface EditViewProps {
  prd: PRD;
  context: GenerationContext;
  onUpdateContext: (field: 'productName' | 'shortDescription', value: string) => void;
  onUpdateSection: (id: string, content: string) => void;
  onGenerateDescription: () => void;
  onGenerateSection: (id: string, title: string) => void;
  onGenerateAll: () => void;
  onBack: () => void;
  onPreview: () => void;
  loadingStates: {
    generatingSections: Record<string, boolean>;
    isGeneratingDescription: boolean;
    isGeneratingAll: boolean;
  };
}

export const EditView: React.FC<EditViewProps> = ({
  prd,
  context,
  onUpdateContext,
  onUpdateSection,
  onGenerateDescription,
  onGenerateSection,
  onGenerateAll,
  onBack,
  onPreview,
  loadingStates
}) => {
  const [focusedSectionId, setFocusedSectionId] = useState<string | null>(null);

  return (
    <div className="animate-enter flex flex-col gap-10 max-w-4xl mx-auto">
      {/* Focus Mode Backdrop */}
      {focusedSectionId && (
        <div 
          className="fixed inset-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm z-40 animate-in fade-in duration-300"
          onClick={() => setFocusedSectionId(null)}
        />
      )}

      {/* Context Section - Top Card */}
      <div className={`transition-opacity duration-300 ${focusedSectionId ? 'opacity-20 pointer-events-none' : ''}`}>
        <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-zinc-900 dark:text-white">
            <Sparkles size={18} className="text-zinc-900 dark:text-white" />
            <h2 className="font-semibold text-lg tracking-tight">Product Context</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Product Name</label>
              <input 
                type="text"
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-3 text-base font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent transition-all shadow-sm"
                placeholder="Name your product..."
                value={prd.productName}
                onChange={(e) => onUpdateContext('productName', e.target.value)}
              />
            </div>
            <div className="space-y-2.5 relative">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Description</label>
                <button 
                  onClick={onGenerateDescription}
                  disabled={loadingStates.isGeneratingDescription || !prd.productName}
                  className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30 transition-colors flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700"
                >
                  {loadingStates.isGeneratingDescription ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  Auto-Fill
                </button>
              </div>
              <textarea 
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent transition-all resize-none leading-relaxed shadow-sm"
                rows={3}
                placeholder="What does it do? Who is it for?"
                value={prd.shortDescription}
                onChange={(e) => onUpdateContext('shortDescription', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Editor Sections */}
      <div className="space-y-8 pb-24 relative">
        <div className={`flex items-center justify-between mb-4 transition-opacity duration-300 ${focusedSectionId ? 'opacity-20 pointer-events-none' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Content</h2>
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-500 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 self-start sm:self-auto">
              {prd.sections.filter(s => s.isEnabled).length} Sections
            </span>
          </div>
          
          <button
            onClick={onGenerateAll}
            disabled={loadingStates.isGeneratingAll || !prd.productName}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-full
              text-xs font-bold uppercase tracking-wider transition-all
              ${loadingStates.isGeneratingAll 
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-wait' 
                : 'bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white hover:border-zinc-400 dark:hover:border-zinc-700 shadow-sm hover:shadow'}
            `}
          >
            {loadingStates.isGeneratingAll ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Wand2 size={14} />
            )}
            <span>{loadingStates.isGeneratingAll ? 'Generating All...' : 'Generate All'}</span>
          </button>
        </div>
        
        {prd.sections.filter(s => s.isEnabled).map((section) => (
          <React.Fragment key={section.id}>
            <AIField 
              label={section.title}
              sectionId={section.id}
              value={section.content}
              placeholder={section.placeholder}
              description={section.description}
              context={context}
              onChange={(val) => onUpdateSection(section.id, val)}
              isGenerating={loadingStates.generatingSections[section.id] || false}
              onGenerate={() => onGenerateSection(section.id, section.title)}
              isZoomed={focusedSectionId === section.id}
              onToggleZoom={() => setFocusedSectionId(focusedSectionId === section.id ? null : section.id)}
            />
            {focusedSectionId === section.id && (
              <div className="h-[250px] w-full" aria-hidden="true" />
            )}
          </React.Fragment>
        ))}

        <div className={`flex justify-between items-center pt-10 border-t border-zinc-200 dark:border-zinc-800 mt-12 transition-opacity duration-300 ${focusedSectionId ? 'opacity-20 pointer-events-none' : ''}`}>
          <Button variant="ghost" onClick={onBack} leftIcon={<ArrowLeft size={16}/>}>
            Structure
          </Button>
          <Button onClick={onPreview} size="lg" rightIcon={<Layout size={16}/>} className="shadow-lg shadow-zinc-200/50 dark:shadow-zinc-900/50">
            Preview PRD
          </Button>
        </div>
      </div>
    </div>
  );
};