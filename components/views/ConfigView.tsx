import React from 'react';
import { PRD } from '../../types';
import { SectionSelector } from '../SectionSelector';
import { Button } from '../Button';
import { ChevronRight } from 'lucide-react';

interface ConfigViewProps {
  prd: PRD;
  onSectionToggle: (id: string) => void;
  onNext: () => void;
}

export const ConfigView: React.FC<ConfigViewProps> = ({ prd, onSectionToggle, onNext }) => {
  return (
    <div className="animate-enter space-y-10 md:space-y-16 max-w-4xl mx-auto">
      <div className="text-center space-y-4 mb-10 md:mb-16">
        <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
          What's in your PRD?
        </h1>
        <p className="text-base md:text-xl text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed font-light">
          Select the sections you need. Propel will help you fill them out with intelligent suggestions.
        </p>
      </div>
      
      <SectionSelector 
        sections={prd.sections} 
        onToggle={onSectionToggle}
      />
      
      <div className="flex justify-center pt-10">
        <Button 
          size="lg" 
          rightIcon={<ChevronRight size={18} />}
          onClick={onNext}
          className="shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50"
        >
          Start Writing
        </Button>
      </div>
    </div>
  );
};