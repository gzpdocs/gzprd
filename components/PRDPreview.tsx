import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { PRD } from '../types';
import { List } from 'lucide-react';

interface PRDPreviewProps {
  prd: PRD;
}

export const PRDPreview: React.FC<PRDPreviewProps> = ({ prd }) => {
  const enabledSections = prd.sections.filter(s => s.isEnabled);
  const [isTableOfContentsOpen, setIsTableOfContentsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = enabledSections.map(section =>
        document.getElementById(`section-${section.id}`)
      );

      const currentSection = sectionElements.find(el => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 150 && rect.bottom >= 150;
      });

      if (currentSection) {
        setActiveSection(currentSection.id.replace('section-', ''));
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enabledSections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
      setIsTableOfContentsOpen(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl md:rounded-2xl border-y md:border border-zinc-200 dark:border-zinc-800 shadow-sm min-h-[80vh] overflow-hidden transition-colors duration-300 relative">

      {/* Table of Contents - Floating Right */}
      <div
        className="fixed right-6 top-1/2 -translate-y-1/2 z-20 hidden lg:block max-h-[calc(100vh-3rem)] my-6"
        onMouseEnter={() => setIsTableOfContentsOpen(true)}
        onMouseLeave={() => setIsTableOfContentsOpen(false)}
      >
        <div className="relative h-full flex items-center">
          {/* Collapsed State - Lines */}
          <div className={`
            bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-3
            transition-opacity duration-200
            ${isTableOfContentsOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          `}>
            <div className="flex flex-col gap-1.5">
              {enabledSections.map((section) => (
                <div
                  key={section.id}
                  className={`h-1 rounded-full transition-all ${
                    activeSection === section.id
                      ? 'bg-zinc-900 dark:bg-zinc-100 w-6'
                      : 'bg-zinc-300 dark:bg-zinc-700 w-4'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Expanded State - Full Menu */}
          <div className={`
            absolute right-0 top-1/2 -translate-y-1/2
            bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800
            transition-opacity duration-200 w-72
            max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col
            ${isTableOfContentsOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}>
            <div className="p-4 flex-shrink-0">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <List size={16} className="text-zinc-500 dark:text-zinc-400" />
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Contents
                </span>
              </div>
            </div>
            <div className="overflow-y-auto px-4 pb-4 space-y-1">
              {enabledSections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg text-sm transition-all
                    ${activeSection === section.id
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 font-medium'
                    }
                  `}
                >
                  <span className="text-zinc-400 dark:text-zinc-600 mr-2">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {section.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

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
          <section key={section.id} id={`section-${section.id}`} className="group scroll-mt-24">
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