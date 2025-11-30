import React, { useState, useEffect } from 'react';
import { usePRD } from './hooks/usePRD';
import { Header } from './components/Header';
import { ApiKeyBanner } from './components/ApiKeyBanner';
import { ConfigView } from './components/views/ConfigView';
import { EditView } from './components/views/EditView';
import { PreviewView } from './components/views/PreviewView';
import { PublicView } from './components/PublicView';
import { LandingPage } from './components/LandingPage';
import { PublishModal } from './components/PublishModal';
import { SettingsModal } from './components/SettingsModal';
import { MobileNav } from './components/MobileNav';
import { Settings2, FileText, Eye, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const {
    view,
    setView,
    isLoading,
    prd,
    scrolled,
    isDark,
    toggleTheme,
    settings,
    isSettingsOpen,
    setIsSettingsOpen,
    handleUpdateSettings,
    handleSectionToggle,
    updateSectionContent,
    updateContext,
    getGenerationContext,
    handleGenerateDescription,
    handleGenerateSection,
    handleGenerateAll,
    initiatePublish,
    confirmPublish,
    isPublishModalOpen,
    setIsPublishModalOpen,
    loadingStates,
    // Actions
    handlePublicComment,
    handlePublicUpvote,
    handleStatusChange,
    handleImportPRD,
    handleImportById
  } = usePRD();

  const [showApiKeyBanner, setShowApiKeyBanner] = useState(false);

  useEffect(() => {
    const bannerDismissed = localStorage.getItem('apiKeyBannerDismissed');
    if (!settings.geminiApiKey && !bannerDismissed) {
      setShowApiKeyBanner(true);
    } else {
      setShowApiKeyBanner(false);
    }
  }, [settings.geminiApiKey]);

  const handleDismissBanner = () => {
    localStorage.setItem('apiKeyBannerDismissed', 'true');
    setShowApiKeyBanner(false);
  };

  const navSteps = [
    { id: 'config', label: 'Structure', icon: <Settings2 size={16} /> },
    { id: 'edit', label: 'Write', icon: <FileText size={16} /> },
    { id: 'preview', label: 'Preview', icon: <Eye size={16} /> },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#09090b]">
        <div className="flex flex-col items-center gap-4 animate-enter">
          <Loader2 size={32} className="text-zinc-400 animate-spin" />
          <span className="text-sm font-medium text-zinc-500">Loading GZPRD...</span>
        </div>
      </div>
    );
  }

  if (view === 'landing') {
    return (
      <LandingPage
        onStart={() => setView('config')}
        onImport={handleImportPRD}
        onImportById={handleImportById}
      />
    );
  }

  if (view === 'public') {
    return (
      <PublicView 
        prd={prd} 
        onBack={() => setView('edit')} 
        onComment={handlePublicComment}
        onUpvote={handlePublicUpvote}
        onStatusChange={handleStatusChange}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 font-sans transition-colors duration-300 selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-900">

      <Header
        scrolled={scrolled}
        view={view}
        setView={setView}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onPublish={initiatePublish}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasApiKey={!!settings.geminiApiKey}
      />

      {showApiKeyBanner && (
        <ApiKeyBanner
          onDismiss={handleDismissBanner}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      <MobileNav view={view} onViewChange={setView} steps={navSteps} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        
        {view === 'config' && (
          <ConfigView 
            prd={prd} 
            onSectionToggle={handleSectionToggle} 
            onNext={() => setView('edit')} 
          />
        )}

        {view === 'edit' && (
          <EditView 
            prd={prd}
            context={getGenerationContext()}
            onUpdateContext={updateContext}
            onUpdateSection={updateSectionContent}
            onGenerateDescription={handleGenerateDescription}
            onGenerateSection={handleGenerateSection}
            onGenerateAll={handleGenerateAll}
            onBack={() => setView('config')}
            onPreview={() => setView('preview')}
            loadingStates={loadingStates}
          />
        )}

        {view === 'preview' && (
          <PreviewView 
            prd={prd}
            onBack={() => setView('edit')}
            onPublish={initiatePublish}
          />
        )}

      </main>

      <PublishModal 
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onConfirm={confirmPublish}
        initialSettings={prd.publicSettings}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleUpdateSettings}
      />
    </div>
  );
};

export default App;