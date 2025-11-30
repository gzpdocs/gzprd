import React from 'react';
import { PRDSection } from '../types';
import { 
  Check, 
  LayoutTemplate, 
  AlertCircle, 
  Target, 
  Users, 
  BookOpen, 
  ListChecks, 
  Database, 
  Palette, 
  Calendar, 
  BarChart2, 
  ShieldAlert,
  FileText
} from 'lucide-react';

interface SectionSelectorProps {
  sections: PRDSection[];
  onToggle: (id: string) => void;
}

const getSectionIcon = (id: string) => {
  switch (id) {
    case 'executive_summary': return <LayoutTemplate size={20} />;
    case 'problem_statement': return <AlertCircle size={20} />;
    case 'goals_objectives': return <Target size={20} />;
    case 'target_audience': return <Users size={20} />;
    case 'user_stories': return <BookOpen size={20} />;
    case 'features_requirements': return <ListChecks size={20} />;
    case 'technical_requirements': return <Database size={20} />;
    case 'design_requirements': return <Palette size={20} />;
    case 'timeline_milestones': return <Calendar size={20} />;
    case 'success_metrics': return <BarChart2 size={20} />;
    case 'risks': return <ShieldAlert size={20} />;
    default: return <FileText size={20} />;
  }
};

export const SectionSelector: React.FC<SectionSelectorProps> = ({ sections, onToggle }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
      {sections.map((section) => {
        const Icon = getSectionIcon(section.id);
        
        return (
          <div 
            key={section.id}
            onClick={() => onToggle(section.id)}
            className={`
              group relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ease-out
              flex flex-col min-h-[180px]
              ${section.isEnabled 
                ? 'bg-white dark:bg-zinc-900 ring-2 ring-zinc-900 dark:ring-zinc-100 shadow-xl shadow-zinc-200/50 dark:shadow-black/50 transform -translate-y-1' 
                : 'bg-white dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:shadow-md'}
            `}
          >
            <div className="flex items-start justify-between mb-5">
              {/* Icon Container */}
              <div className={`
                p-3 rounded-xl transition-colors duration-300
                ${section.isEnabled
                  ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                  : 'bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 group-hover:border-zinc-300'}
              `}>
                {getSectionIcon(section.id)}
              </div>

              {/* Check Indicator */}
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
                ${section.isEnabled 
                  ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 scale-100' 
                  : 'border-2 border-zinc-200 dark:border-zinc-700 text-transparent scale-90 group-hover:border-zinc-300'}
              `}>
                <Check size={14} strokeWidth={3} />
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <h3 className={`font-bold text-lg mb-2 transition-colors ${section.isEnabled ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-700 dark:text-zinc-400'}`}>
                {section.title}
              </h3>
              <p className={`text-sm leading-relaxed transition-colors ${section.isEnabled ? 'text-zinc-600 dark:text-zinc-300' : 'text-zinc-500 dark:text-zinc-500'}`}>
                {section.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};