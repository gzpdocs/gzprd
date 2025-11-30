import React, { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { Button } from './Button';
import { PRD } from '../types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (prd: PRD) => void;
  onImportById: (id: string) => Promise<void>;
}

type ImportMode = 'id' | 'file';

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  onImportById
}) => {
  const [mode, setMode] = useState<ImportMode>('id');
  const [prdId, setPrdId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleImportById = async () => {
    if (!prdId.trim()) {
      setError('Please enter a PRD ID');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onImportById(prdId.trim());
      onClose();
      setPrdId('');
    } catch (err: any) {
      setError(err.message || 'Failed to import PRD. Please check the ID and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      setError('Please upload a valid JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const importedPRD = JSON.parse(content) as PRD;

        if (!importedPRD.productName || !importedPRD.sections) {
          throw new Error('Invalid PRD format');
        }

        onImport(importedPRD);
        onClose();
        setPrdId('');
        setError('');
      } catch (err) {
        setError('Invalid JSON file. Please check the file format and try again.');
      }
    };
    reader.readAsText(file);
  };

  const handleClose = () => {
    onClose();
    setPrdId('');
    setError('');
    setMode('id');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-enter">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-lg w-full border border-zinc-200 dark:border-zinc-800 animate-enter">

        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Import PRD</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">

          <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
            <button
              onClick={() => setMode('id')}
              className={`
                flex-1 py-2.5 rounded-full text-sm font-semibold transition-all
                ${mode === 'id'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'}
              `}
            >
              Import by ID
            </button>
            <button
              onClick={() => setMode('file')}
              className={`
                flex-1 py-2.5 rounded-full text-sm font-semibold transition-all
                ${mode === 'file'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'}
              `}
            >
              Upload JSON
            </button>
          </div>

          {mode === 'id' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                  PRD ID
                </label>
                <input
                  type="text"
                  value={prdId}
                  onChange={(e) => {
                    setPrdId(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter the PRD ID"
                  className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  disabled={isLoading}
                />
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  Enter the ID from a published PRD to load it into your workspace
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <Button
                onClick={handleImportById}
                disabled={isLoading || !prdId.trim()}
                variant="primary"
                size="lg"
                className="w-full"
                leftIcon={<FileText size={18} />}
              >
                {isLoading ? 'Importing...' : 'Import PRD'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                  JSON File
                </label>
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-zinc-400 dark:text-zinc-500" />
                    <p className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Click to upload
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      JSON file exported from GZPRD
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="application/json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Upload a PRD JSON file previously exported from GZPRD. The file will be validated before importing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
