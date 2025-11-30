import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Wand2, RefreshCw, Eraser, Command, ArrowUp, X, Maximize2, Minimize2, Eye, PenLine } from 'lucide-react';
import { enhanceText } from '../services/geminiService';
import { GenerationContext } from '../types';

interface AIFieldProps {
  label: string;
  sectionId: string;
  value: string;
  placeholder?: string;
  context: GenerationContext;
  onChange: (val: string) => void;
  description?: string;
  isGenerating: boolean;
  onGenerate: () => void;
  // Focus Mode Props
  isZoomed: boolean;
  onToggleZoom: () => void;
}

export const AIField: React.FC<AIFieldProps> = ({
  label,
  sectionId,
  value,
  placeholder,
  context,
  onChange,
  description,
  isGenerating,
  onGenerate,
  isZoomed,
  onToggleZoom
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  
  // Enhancement State
  const [showEnhanceInput, setShowEnhanceInput] = useState(false);
  const [enhanceInstruction, setEnhanceInstruction] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea in normal mode
  useEffect(() => {
    if (!isZoomed && mode === 'write' && textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight for shrinking
      textareaRef.current.style.height = 'auto';
      // Set new height based on content, minimum 160px
      const newHeight = Math.max(180, textareaRef.current.scrollHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [value, isZoomed, mode]);

  // Lock body scroll when Zoomed
  useEffect(() => {
    if (isZoomed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isZoomed]);

  const handleEnhance = async () => {
    if (!enhanceInstruction.trim()) return;
    
    setIsEnhancing(true);
    setError(null);
    try {
        const enhancedContent = await enhanceText(value, enhanceInstruction);
        onChange(enhancedContent);
        setShowEnhanceInput(false);
        setEnhanceInstruction('');
        setMode('write'); // Switch back to write mode to see changes
    } catch (err) {
        setError("Failed to enhance content.");
    } finally {
        setIsEnhancing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleEnhance();
    }
    if (e.key === 'Escape') {
        if (showEnhanceInput) {
            setShowEnhanceInput(false);
        } else if (isZoomed) {
            onToggleZoom();
        }
    }
  };

  // Determine container classes based on Zoom state
  const containerClasses = isZoomed
    ? 'fixed inset-0 m-4 sm:inset-6 md:inset-10 z-[60] flex flex-col shadow-2xl ring-1 ring-zinc-900/10 dark:ring-white/10 animate-in zoom-in-95 fade-in duration-200'
    : `relative transition-all duration-300 ${isFocused || showEnhanceInput ? 'shadow-xl shadow-zinc-200/60 dark:shadow-black/50 ring-2 ring-zinc-900 dark:ring-zinc-100 border-transparent' : 'border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm'}`;

  const componentContent = (
    <div 
      className={`
        group bg-white dark:bg-zinc-900 rounded-2xl
        ${containerClasses}
      `}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between px-6 py-5 gap-4 border-b border-zinc-100 dark:border-zinc-800/50 min-h-[72px] flex-shrink-0">
        
        {/* Left: Label & Toggle */}
        <div className={`flex flex-col gap-3 flex-1 min-w-0 ${showEnhanceInput ? 'hidden sm:flex opacity-40' : ''}`}>
            <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-none truncate pr-2">{label}</h3>
                {description && !isZoomed && (
                    <p className="hidden sm:block text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed truncate mt-1.5">
                        {description}
                    </p>
                )}
            </div>

            {/* Write/Preview Toggle */}
            <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-full self-start w-auto border border-zinc-200 dark:border-zinc-800">
                <button
                    onClick={() => setMode('write')}
                    className={`
                        flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all
                        ${mode === 'write' 
                            ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-black/5' 
                            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'}
                    `}
                >
                    <PenLine size={14} />
                    Write
                </button>
                <button
                    onClick={() => setMode('preview')}
                    className={`
                        flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all
                        ${mode === 'preview' 
                            ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-black/5' 
                            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'}
                    `}
                >
                    <Eye size={14} />
                    Preview
                </button>
            </div>
        </div>
        
        {/* Right: Actions */}
        <div className={`flex-shrink-0 flex items-center justify-end gap-2 sm:gap-3 ${showEnhanceInput ? 'w-full sm:w-auto' : ''} pt-1`}>
            
            {showEnhanceInput ? (
                // Enhancement Input Mode
                <div className="flex items-center gap-2 w-full animate-enter">
                    <div className="relative flex-1 sm:w-80">
                        <input 
                            autoFocus
                            type="text"
                            value={enhanceInstruction}
                            onChange={(e) => setEnhanceInstruction(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="How should we improve this?"
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-full pl-5 pr-2 py-3 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent placeholder:text-zinc-400 shadow-sm"
                        />
                    </div>
                    <button 
                        onClick={handleEnhance}
                        disabled={isEnhancing || !enhanceInstruction.trim()}
                        className="p-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-full hover:opacity-90 disabled:opacity-50 transition-all flex-shrink-0 shadow-sm"
                    >
                        {isEnhancing ? <RefreshCw size={14} className="animate-spin" /> : <ArrowUp size={14} />}
                    </button>
                    <button 
                        onClick={() => setShowEnhanceInput(false)}
                        className="p-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex-shrink-0"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                // Default Action Buttons
                <div className="flex items-center gap-2 sm:gap-2.5">
                    {/* Zoom Toggle */}
                    <button
                        onClick={onToggleZoom}
                        className="p-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        title={isZoomed ? "Minimize" : "Focus Mode"}
                    >
                        {isZoomed ? <Minimize2 size={18} className="sm:w-4 sm:h-4" /> : <Maximize2 size={18} className="sm:w-4 sm:h-4" />}
                    </button>
                    
                    <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

                    {/* Clear Button */}
                    {value.length > 0 && !isGenerating && (
                        <button
                            onClick={() => onChange('')}
                            className={`${isZoomed ? 'flex' : 'hidden group-hover:flex'} p-3 text-zinc-300 hover:text-red-500 transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 items-center justify-center`}
                            title="Clear section"
                        >
                            <Eraser size={18} className="sm:w-4 sm:h-4" />
                        </button>
                    )}

                    {/* Enhance / Refine Button */}
                    {value.length > 0 && (
                        <button
                            onClick={() => setShowEnhanceInput(true)}
                            disabled={isGenerating || isEnhancing}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 shadow-sm"
                        >
                            <Wand2 size={14} className="sm:w-3.5 sm:h-3.5" />
                            <span className="hidden sm:inline">Refine</span>
                        </button>
                    )}

                    {/* Auto-Fill Button */}
                    <button
                        onClick={() => {
                            setMode('write'); 
                            onGenerate();
                        }}
                        disabled={isGenerating || isEnhancing}
                        className={`
                            flex items-center gap-2 px-5 py-2.5 rounded-full
                            text-xs font-bold uppercase tracking-wider transition-all
                            ${isGenerating 
                                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-wait' 
                                : 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-md'}
                        `}
                    >
                        {isGenerating ? (
                            <RefreshCw size={14} className="animate-spin sm:w-3.5 sm:h-3.5" />
                        ) : (
                            <Sparkles size={14} fill="currentColor" className="sm:w-3.5 sm:h-3.5" />
                        )}
                        <span className={isGenerating ? 'inline' : 'hidden sm:inline'}>{isGenerating ? 'Generating' : 'Auto-Fill'}</span>
                    </button>
                </div>
            )}
        </div>
      </div>

      <div className={`p-2 relative ${isZoomed ? 'flex-1 flex flex-col min-h-0' : ''}`}>
        
        {mode === 'write' ? (
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                if (error) setError(null);
              }}
              placeholder={placeholder}
              className={`
                block w-full rounded-b-xl bg-transparent px-6 sm:px-7 py-5 text-base leading-relaxed
                text-zinc-900 dark:text-zinc-100 font-mono sm:font-sans
                placeholder:text-zinc-400 dark:placeholder:text-zinc-600
                focus:outline-none 
                ${isZoomed 
                    ? 'flex-1 resize-none text-lg p-8 overflow-y-auto' 
                    : 'resize-none overflow-hidden min-h-[180px]'}
              `}
            />
        ) : (
            <div className={`
                w-full px-6 sm:px-7 py-5 
                ${isZoomed ? 'flex-1 overflow-y-auto p-8' : 'min-h-[180px]'}
            `}>
                {value ? (
                    <div className="prose prose-zinc dark:prose-invert prose-sm sm:prose-base max-w-none leading-relaxed">
                        <ReactMarkdown
                          components={{
                            h3: ({node, ...props}) => <h3 className="text-zinc-900 dark:text-zinc-100 font-semibold mt-4 mb-2 text-base" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1 my-2 marker:text-zinc-300 dark:marker:text-zinc-600" {...props} />,
                            li: ({node, ...props}) => <li className="pl-1" {...props} />,
                            p: ({node, ...props}) => <p className="mb-3 text-zinc-700 dark:text-zinc-300" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-semibold text-zinc-900 dark:text-zinc-100" {...props} />,
                            code: ({node, ...props}) => <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-sm text-zinc-800 dark:text-zinc-200" {...props} />
                          }}
                        >
                            {value}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 italic text-sm">
                        <Eye size={24} className="mb-2 opacity-50" />
                        <span>Nothing to preview yet.</span>
                    </div>
                )}
            </div>
        )}
      </div>
      
      {/* Helper Icon Overlay (Only in Write Mode) */}
      {mode === 'write' && value.length === 0 && !isFocused && !isGenerating && !showEnhanceInput && !isZoomed && (
         <div className="absolute top-[65%] left-1/2 -translate-x-1/2 pointer-events-none opacity-40 flex flex-col items-center gap-2">
             <Command size={28} className="text-zinc-200 dark:text-zinc-700" />
             <span className="text-xs font-medium text-zinc-300 dark:text-zinc-700 whitespace-nowrap">Write or Auto-Fill...</span>
         </div>
      )}

      {error && (
        <div className="px-6 pb-5">
            <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                <span>•</span> {error}
            </p>
        </div>
      )}
    </div>
  );

  if (isZoomed) {
    return createPortal(componentContent, document.body);
  }

  return componentContent;
};