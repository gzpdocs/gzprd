import React from 'react';
import ReactMarkdown from 'react-markdown';
import { PRD } from '../types';

interface PRDPreviewProps {
  prd: PRD;
}

export const PRDPreview: React.FC<PRDPreviewProps> = ({ prd }) => {
  const enabledSections = prd.sections.filter(s => s.isEnabled);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl md:rounded-2xl border-y md:border border-zinc-200 dark:border-zinc-800 shadow-sm min-h-[80vh] overflow-hidden transition-colors duration-300">
      
      {/* Document Header */}
      <div className="bg-zinc-50/50 dark:bg-zinc-950/30 border-b border-zinc-100 dark:border-zinc-800 p-6 md:p-16 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-6">
            Product Requirements Document
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-6 tracking-tight leading-tight">
          {prd.productName || 'Untitled Product'}
        </h1>
        {prd.shortDescription && (
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto font-light">
            {prd.shortDescription}
          </p>
        )}
        <div className="mt-8 flex justify-center items-center gap-6 text-xs text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wider">
             <span>Version {prd.version}</span>
             <span>•</span>
             <span>{new Date(prd.lastUpdated).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Document Body */}
      <div className="p-6 md:p-16 max-w-3xl mx-auto space-y-12 md:space-y-16">
        {enabledSections.map((section, index) => (
          <section key={section.id} className="group">
            <div className="flex items-center gap-4 mb-4 md:mb-6">
                <span className="text-zinc-200 dark:text-zinc-800 font-bold text-3xl md:text-4xl select-none group-hover:text-zinc-300 dark:group-hover:text-zinc-700 transition-colors">
                    {String(index + 1).padStart(2, '0')}
                </span>
                <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {section.title}
                </h2>
            </div>
            
            <div className="pl-0 md:pl-12 prose prose-zinc dark:prose-invert prose-sm sm:prose-base max-w-none text-zinc-600 dark:text-zinc-300 leading-7">
              {section.content ? (
                <ReactMarkdown
                  components={{
                    h3: ({node, ...props}) => <h3 className="text-zinc-900 dark:text-zinc-100 font-semibold mt-6 mb-3 text-base" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1 my-4 marker:text-zinc-300 dark:marker:text-zinc-600" {...props} />,
                    li: ({node, ...props}) => <li className="pl-1" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 text-zinc-600 dark:text-zinc-300" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-zinc-900 dark:text-zinc-100" {...props} />,
                    code: ({node, ...props}) => <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-sm" {...props} />
                  }}
                >
                    {section.content}
                </ReactMarkdown>
              ) : (
                <p className="text-zinc-300 dark:text-zinc-600 italic font-light">Content pending...</p>
              )}
            </div>
          </section>
        ))}
      </div>
      
      {/* Document Footer */}
      <div className="bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-100 dark:border-zinc-800 p-8 text-center">
          <p className="text-zinc-400 dark:text-zinc-600 text-xs font-medium uppercase tracking-widest">
            Generated with GZPRD
          </p>
      </div>
    </div>
  );
};