import { useState, useEffect, useCallback, useRef } from 'react';
import { PRD, ViewState, GenerationContext, PublicSettings, ApprovalStatus, AppSettings } from '../types';
import { DEFAULT_SECTIONS, DEFAULT_PUBLIC_SETTINGS } from '../constants';
import { generatePRDSection, generateProductDescription } from '../services/geminiService';
import { dataService } from '../services/dataService';

// Safe ID generator that falls back if crypto is unavailable
const generateId = () => {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
  } catch (e) {
    // Fallback below
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Safe localStorage accessor
const getStorageTheme = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem('theme');
    }
  } catch (e) {
    return null;
  }
  return null;
};

const setStorageTheme = (theme: string) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('theme', theme);
    }
  } catch (e) {
    // Ignore storage errors
  }
};

export const usePRD = () => {
  // Application State
  const [view, setView] = useState<ViewState>('landing');
  const [isLoading, setIsLoading] = useState(true);

  // Helper to create a fresh default state
  const createDefaultPRD = (): PRD => ({
    id: generateId(),
    title: 'New PRD',
    productName: '',
    shortDescription: '',
    sections: JSON.parse(JSON.stringify(DEFAULT_SECTIONS)), // Deep copy to avoid reference issues
    isPublic: false,
    publicSettings: { ...DEFAULT_PUBLIC_SETTINGS },
    upvotes: 0,
    comments: [],
    lastUpdated: new Date().toISOString(),
    status: 'draft',
    approvalStatus: 'pending',
  });

  const [prd, setPrd] = useState<PRD>(createDefaultPRD());
  const [settings, setSettings] = useState<AppSettings>({
    geminiModel: 'gemini-2.5-flash',
    geminiApiKey: '',
    webhookUrl: '',
    email: ''
  });

  // UI State
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Async Loading States
  const [generatingSections, setGeneratingSections] = useState<Record<string, boolean>>({});
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  // Debounce Ref for Auto-saving
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Initialization & Routing ---
  useEffect(() => {
    const init = async () => {
      // 1. Theme Check
      const storedTheme = getStorageTheme();
      if (document.documentElement.classList.contains('dark') || storedTheme === 'dark') {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      }

      // 2. Load Settings
      const savedSettings = dataService.getSettings();
      setSettings(savedSettings);

      // 3. Scroll Listener
      const handleScroll = () => setScrolled(window.scrollY > 20);
      window.addEventListener('scroll', handleScroll);

      // 4. Routing / Data Fetching
      const params = new URLSearchParams(window.location.search);
      const idFromUrl = params.get('id');
      const viewFromUrl = params.get('view') as ViewState;

      if (idFromUrl) {
        try {
          const fetchedPrd = await dataService.fetchPRD(idFromUrl);
          
          if (fetchedPrd) {
            // Safely merge fetched data with default structure to prevent missing field errors
            setPrd(prev => ({
              ...createDefaultPRD(), // Start with clean defaults
              ...fetchedPrd, // Overwrite with fetched data
              
              // Ensure critical nested objects exist even if missing in fetched data
              publicSettings: { 
                ...DEFAULT_PUBLIC_SETTINGS, 
                ...(fetchedPrd.publicSettings || {}) 
              },
              
              // Smart merge of sections:
              // Keep content and enabled state from fetch
              // Use Title, Description, Placeholder from Constants (schema source of truth)
              // This prevents UI crashes if saved data is missing new fields like 'placeholder'
              sections: DEFAULT_SECTIONS.map(def => {
                const saved = Array.isArray(fetchedPrd.sections) 
                  ? fetchedPrd.sections.find(s => s.id === def.id)
                  : null;
                // If saved exists, use its content/enabled state, but default static props
                return saved ? { ...def, content: saved.content, isEnabled: saved.isEnabled } : def;
              }),
                
              // Ensure arrays are initialized
              comments: Array.isArray(fetchedPrd.comments) ? fetchedPrd.comments : [],
              upvotes: typeof fetchedPrd.upvotes === 'number' ? fetchedPrd.upvotes : 0,
              approvalStatus: fetchedPrd.approvalStatus || 'pending'
            }));

            // Handle routing view
            if (viewFromUrl) {
              setView(viewFromUrl);
            } else {
              // Default to config view if ID is present but no view param
              setView('config');
            }
          } else {
             console.warn(`PRD with ID ${idFromUrl} not found. Starting new.`);
             // If ID exists but no data, we stay on landing or go to config? 
             // Let's go to config as if it's a new draft with that ID, or just ignore ID.
             setView('landing'); 
          }
        } catch (e) {
          console.error("Failed to fetch PRD from URL", e);
        }
      }

      setIsLoading(false);
      return () => window.removeEventListener('scroll', handleScroll);
    };

    init();
  }, []);

  // --- Auto-Save Logic ---
  useEffect(() => {
    if (isLoading || view === 'landing') return;

    // Clear existing timeout
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    // Debounce save (2 seconds)
    saveTimeoutRef.current = setTimeout(() => {
      // Only save if we have meaningful content or it's an existing PRD we loaded
      if (prd.productName || prd.sections.some(s => s.content)) {
        dataService.savePRD(prd).catch(err => console.error("Auto-save failed", err));
      }
    }, 2000);

    // Update URL if ID changes
    const params = new URLSearchParams(window.location.search);
    const currentUrlId = params.get('id');
    
    // Only update history if we are past the landing page
    if (!currentUrlId && prd.id) {
        const newUrl = `${window.location.pathname}?id=${prd.id}`;
        try {
            window.history.replaceState({}, '', newUrl);
        } catch (e) {
            console.warn("History API update failed", e);
        }
    }
  }, [prd, isLoading, view]);


  // --- Actions ---

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      setStorageTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setStorageTheme('light');
    }
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    dataService.saveSettings(newSettings);
    setIsSettingsOpen(false);
  };

  const handleSectionToggle = (id: string) => {
    setPrd(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === id ? { ...s, isEnabled: !s.isEnabled } : s
      )
    }));
  };

  const updateSectionContent = (id: string, content: string) => {
    setPrd(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString(),
      sections: prev.sections.map(s => 
        s.id === id ? { ...s, content } : s
      )
    }));
  };

  const updateContext = (field: 'productName' | 'shortDescription', value: string) => {
    setPrd(prev => ({ ...prev, [field]: value }));
  };

  // --- Public View Actions (Async) ---
  
  const handlePublicComment = async (text: string) => {
    const newComment = {
      id: generateId(),
      author: 'Guest User',
      avatar: `https://picsum.photos/seed/${Math.random()}/64/64`,
      text,
      date: new Date().toLocaleDateString()
    };
    
    setPrd(prev => ({ 
      ...prev, 
      comments: [newComment, ...(prev.comments || [])] 
    }));

    try {
      await dataService.addComment(prd.id, newComment);
    } catch (e) {
      console.error("Failed to save comment", e);
    }
  };

  const handlePublicUpvote = async () => {
    setPrd(prev => ({ ...prev, upvotes: (prev.upvotes || 0) + 1 }));

    try {
      await dataService.toggleUpvote(prd.id, true);
    } catch (e) {
      console.error("Failed to save upvote", e);
    }
  };

  const handleStatusChange = async (
    status: ApprovalStatus, 
    details?: { title: string; comment: string; approverName: string; approverEmail: string }
  ) => {
    setPrd(prev => ({ ...prev, approvalStatus: status }));
    
    try {
      await dataService.updateStatus(prd.id, status, settings.webhookUrl, {
        title: prd.productName,
        ...details
      });
    } catch (e) {
      console.error("Failed to update status", e);
    }
  }


  // --- AI Generation Logic ---

  const getGenerationContext = (): GenerationContext => {
    const existing: Record<string, string> = {};
    prd.sections.forEach(s => {
      if (s.isEnabled && s.content) existing[s.title] = s.content;
    });
    return {
      productName: prd.productName,
      shortDescription: prd.shortDescription,
      existingSections: existing,
    };
  };

  const handleGenerateDescription = async () => {
      if (!prd.productName.trim()) return;
      
      setIsGeneratingDescription(true);
      try {
          const desc = await generateProductDescription(
            prd.productName, 
            settings.geminiApiKey, 
            settings.geminiModel
          );
          setPrd(prev => ({ ...prev, shortDescription: desc }));
      } catch (error) {
          console.error(error);
      } finally {
          setIsGeneratingDescription(false);
      }
  };

  const handleGenerateSection = async (sectionId: string, sectionTitle: string) => {
    if (!prd.productName) return; 

    setGeneratingSections(prev => ({ ...prev, [sectionId]: true }));
    try {
        const content = await generatePRDSection(
          sectionTitle, 
          getGenerationContext(),
          settings.geminiApiKey,
          settings.geminiModel
        );
        updateSectionContent(sectionId, content);
    } catch (error) {
        console.error(`Failed to generate ${sectionTitle}`, error);
    } finally {
        setGeneratingSections(prev => ({ ...prev, [sectionId]: false }));
    }
  };

  const handleGenerateAll = async () => {
      if (!prd.productName) return;

      setIsGeneratingAll(true);
      const enabledSections = prd.sections.filter(s => s.isEnabled && !s.content);
      
      for (const section of enabledSections) {
          setGeneratingSections(prev => ({ ...prev, [section.id]: true }));
          try {
              const currentContext = getGenerationContext();
              const content = await generatePRDSection(
                section.title, 
                currentContext,
                settings.geminiApiKey,
                settings.geminiModel
              );
              
              setPrd(prev => ({
                  ...prev,
                  lastUpdated: new Date().toISOString(),
                  sections: prev.sections.map(s => 
                      s.id === section.id ? { ...s, content } : s
                  )
              }));
          } catch (error) {
              console.error(error);
          } finally {
              setGeneratingSections(prev => ({ ...prev, [section.id]: false }));
          }
      }
      setIsGeneratingAll(false);
  };

  const initiatePublish = () => {
      setIsPublishModalOpen(true);
  };

  const confirmPublish = async (publicSettings: PublicSettings) => {
      const updatedPRD = {
          ...prd, 
          isPublic: true, 
          status: 'published' as const,
          publicSettings: publicSettings
      };
      
      setPrd(updatedPRD);
      await dataService.savePRD(updatedPRD);
      
      setIsPublishModalOpen(false);
      setView('public');
      
      const newUrl = `${window.location.pathname}?id=${prd.id}&view=public`;
      try {
        window.history.pushState({}, '', newUrl);
      } catch (e) {
        console.warn('History API failed', e);
      }
  };

  return {
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
    handlePublicComment,
    handlePublicUpvote,
    handleStatusChange,
    loadingStates: {
      generatingSections,
      isGeneratingDescription,
      isGeneratingAll
    }
  };
};