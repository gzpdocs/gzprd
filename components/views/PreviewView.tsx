
import React, { useState } from 'react';
import { PRD } from '../../types';
import { PRDPreview } from '../PRDPreview';
import { Button } from '../Button';
import { ArrowLeft, Rocket, Download } from 'lucide-react';
import { ExportMenu } from '../ExportMenu';
import { downloadFile, generateMarkdown, generateText, generateHTML } from '../../utils/export';

interface PreviewViewProps {
  prd: PRD;
  onBack: () => void;
  onPublish: () => void;
}

export const PreviewView: React.FC<PreviewViewProps> = ({ prd, onBack, onPublish }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExport = (format: string) => {
    const filename = (prd.productName || 'prd').toLowerCase().replace(/[^a-z0-9]+/g, '-');

    switch (format) {
      case 'json':
        downloadFile(JSON.stringify(prd, null, 2), `${filename}.json`, 'application/json');
        break;
      case 'markdown':
        downloadFile(generateMarkdown(prd), `${filename}.md`, 'text/markdown');
        break;
      case 'txt':
        downloadFile(generateText(prd), `${filename}.txt`, 'text/plain');
        break;
      case 'html':
        downloadFile(generateHTML(prd), `${filename}.html`, 'text/html');
        break;
      case 'pdf':
        window.print();
        break;
      default:
        console.warn(`Export format '${format}' not implemented yet.`);
    }
    setShowExportMenu(false);
  };

  return (
    <div className="animate-enter space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative z-40 print:hidden">
        <Button variant="ghost" onClick={onBack} leftIcon={<ArrowLeft size={16}/>}>
          Back to Editor
        </Button>
        
        <div className="flex gap-3 w-full sm:w-auto">
          {/* Export Button with Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowExportMenu(!showExportMenu)} 
              leftIcon={<Download size={16}/>}
            >
              Export
            </Button>
            {showExportMenu && (
              <div className="hidden sm:block fixed inset-0 z-40 cursor-default" onClick={() => setShowExportMenu(false)} />
            )}
            <ExportMenu isOpen={showExportMenu} onExport={handleExport} onClose={() => setShowExportMenu(false)} />
          </div>

          <Button variant="primary" className="flex-1 sm:flex-none" onClick={onPublish} leftIcon={<Rocket size={16}/>}>
            Publish
          </Button>
        </div>
      </div>

      <div className="print:p-0">
        <PRDPreview prd={prd} />
      </div>
    </div>
  );
};
