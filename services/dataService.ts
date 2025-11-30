import { PRD, Comment, ApprovalStatus, AppSettings } from '../types';
import { triggerApprovalWebhook } from '../utils/webhook';

// key for local storage simulation
const STORAGE_KEY_PREFIX = 'propel_prd_';
const SETTINGS_KEY = 'propel_settings';

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Safe local storage wrapper
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      // Direct property access can throw SecurityError in some browsers if cookies/storage disabled
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    } catch (e) {
      console.warn("localStorage access denied or failed", e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn("localStorage write failed (quota exceeded or denied)", e);
      // We purposefully don't re-throw here to prevent crashing the app on auto-save
      // in restricted environments.
    }
  }
};

export const dataService = {
  /**
   * Fetch a PRD by ID.
   * In a real backend, this would be GET /api/prds/:id
   */
  fetchPRD: async (id: string): Promise<PRD | null> => {
    await delay(600); // Simulate network load
    try {
      const data = safeStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      // Basic validation to ensure it's an object
      if (typeof parsed !== 'object' || parsed === null) return null;
      
      return parsed as PRD;
    } catch (e) {
      console.error("Failed to parse PRD data", e);
      return null;
    }
  },

  /**
   * Save or Update a PRD.
   * In a real backend, this would be POST/PUT /api/prds
   */
  savePRD: async (prd: PRD): Promise<PRD> => {
    // We don't necessarily want to await this in the UI for auto-saves,
    // but the interface should be async.
    try {
      safeStorage.setItem(`${STORAGE_KEY_PREFIX}${prd.id}`, JSON.stringify(prd));
      return prd;
    } catch (e) {
      console.error("Failed to save PRD", e);
      throw e;
    }
  },

  /**
   * Add a comment to a PRD.
   * In a real backend, this would be POST /api/prds/:id/comments
   */
  addComment: async (prdId: string, comment: Comment): Promise<Comment[]> => {
    await delay(300);
    const prd = await dataService.fetchPRD(prdId);
    if (!prd) throw new Error('PRD not found');
    
    // Ensure comments array exists and is an array
    const existingComments = Array.isArray(prd.comments) ? prd.comments : [];
    const newComments = [comment, ...existingComments];
    
    const updatedPRD = { ...prd, comments: newComments };
    await dataService.savePRD(updatedPRD);
    
    return newComments;
  },

  /**
   * Toggle upvote.
   * In a real backend, this would be POST /api/prds/:id/upvote
   */
  toggleUpvote: async (prdId: string, increment: boolean): Promise<number> => {
    await delay(200);
    const prd = await dataService.fetchPRD(prdId);
    if (!prd) throw new Error('PRD not found');

    const newUpvotes = increment ? (prd.upvotes || 0) + 1 : Math.max(0, (prd.upvotes || 0) - 1);
    const updatedPRD = { ...prd, upvotes: newUpvotes };
    await dataService.savePRD(updatedPRD);

    return newUpvotes;
  },

  /**
   * Update Approval Status
   */
  updateStatus: async (
    prdId: string, 
    status: ApprovalStatus, 
    webhookUrl?: string,
    details?: { title: string; comment?: string; approverName?: string; approverEmail?: string }
  ): Promise<void> => {
    await delay(500);
    const prd = await dataService.fetchPRD(prdId);
    if (!prd) throw new Error('PRD not found');

    const updatedPRD = { ...prd, approvalStatus: status };
    await dataService.savePRD(updatedPRD);

    // Trigger webhook if details provided
    if (details) {
      await triggerApprovalWebhook(
        prdId, 
        status, 
        details.title, 
        webhookUrl,
        details.comment, 
        details.approverName, 
        details.approverEmail
      );
    }
  },

  /**
   * Get App Settings
   */
  getSettings: (): AppSettings => {
    const data = safeStorage.getItem(SETTINGS_KEY);
    if (!data) return {
      geminiModel: 'gemini-2.5-flash',
      geminiApiKey: '',
      webhookUrl: '',
      email: ''
    };
    return JSON.parse(data);
  },

  /**
   * Save App Settings
   */
  saveSettings: (settings: AppSettings): void => {
    safeStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
};