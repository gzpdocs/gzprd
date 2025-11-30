import { PRD, Comment, DBComment, ApprovalStatus, AppSettings } from '../types';
import { triggerApprovalWebhook } from '../utils/webhook';
import { supabase } from '../lib/supabase';

const SETTINGS_KEY = 'propel_settings';

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
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
      console.warn("localStorage write failed", e);
    }
  }
};

const mapDBCommentToComment = (dbComment: DBComment): Comment => ({
  id: dbComment.id,
  author: dbComment.author,
  avatar: dbComment.avatar,
  text: dbComment.text,
  date: new Date(dbComment.created_at).toLocaleDateString()
});

const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

const transformPRDToDb = (prd: PRD) => {
  return {
    id: prd.id,
    title: prd.title,
    product_name: prd.productName,
    short_description: prd.shortDescription,
    sections: prd.sections,
    is_public: prd.isPublic,
    public_settings: prd.publicSettings,
    upvotes: prd.upvotes,
    status: prd.status,
    approval_status: prd.approvalStatus,
    last_updated: prd.lastUpdated,
    created_by: prd.createdBy || 'anonymous'
  };
};

const transformDbToPRD = (dbRecord: any, comments: Comment[]): PRD => {
  return {
    id: dbRecord.id,
    title: dbRecord.title,
    productName: dbRecord.product_name,
    shortDescription: dbRecord.short_description,
    sections: dbRecord.sections,
    isPublic: dbRecord.is_public,
    publicSettings: dbRecord.public_settings,
    upvotes: dbRecord.upvotes,
    comments: comments,
    lastUpdated: dbRecord.last_updated,
    status: dbRecord.status,
    approvalStatus: dbRecord.approval_status,
    createdAt: dbRecord.created_at,
    createdBy: dbRecord.created_by
  };
};

export const dataService = {
  fetchPRD: async (id: string): Promise<PRD | null> => {
    try {
      const { data: prdData, error: prdError } = await supabase
        .from('prds')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (prdError) {
        console.error('Error fetching PRD:', prdError);
        return null;
      }

      if (!prdData) return null;

      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('prd_id', id)
        .order('created_at', { ascending: false });

      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
      }

      const comments = (commentsData || []).map(mapDBCommentToComment);

      return transformDbToPRD(prdData, comments);
    } catch (e) {
      console.error('Failed to fetch PRD:', e);
      return null;
    }
  },

  savePRD: async (prd: PRD): Promise<PRD> => {
    try {
      const dbPrd = transformPRDToDb(prd);

      const { error } = await supabase
        .from('prds')
        .upsert(dbPrd, { onConflict: 'id' });

      if (error) {
        console.error('Error saving PRD:', error);
        throw error;
      }

      return prd;
    } catch (e) {
      console.error('Failed to save PRD:', e);
      throw e;
    }
  },

  addComment: async (prdId: string, comment: Comment): Promise<Comment[]> => {
    try {
      const dbComment = {
        id: comment.id,
        prd_id: prdId,
        author: comment.author,
        avatar: comment.avatar,
        text: comment.text
      };

      const { error } = await supabase
        .from('comments')
        .insert(dbComment);

      if (error) {
        console.error('Error adding comment:', error);
        throw error;
      }

      const { data: commentsData, error: fetchError } = await supabase
        .from('comments')
        .select('*')
        .eq('prd_id', prdId)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching comments:', fetchError);
        throw fetchError;
      }

      return (commentsData || []).map(mapDBCommentToComment);
    } catch (e) {
      console.error('Failed to add comment:', e);
      throw e;
    }
  },

  toggleUpvote: async (prdId: string, increment: boolean): Promise<number> => {
    try {
      const { data: currentPrd, error: fetchError } = await supabase
        .from('prds')
        .select('upvotes')
        .eq('id', prdId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching PRD for upvote:', fetchError);
        throw fetchError;
      }

      if (!currentPrd) throw new Error('PRD not found');

      const newUpvotes = increment
        ? (currentPrd.upvotes || 0) + 1
        : Math.max(0, (currentPrd.upvotes || 0) - 1);

      const { error: updateError } = await supabase
        .from('prds')
        .update({ upvotes: newUpvotes })
        .eq('id', prdId);

      if (updateError) {
        console.error('Error updating upvotes:', updateError);
        throw updateError;
      }

      return newUpvotes;
    } catch (e) {
      console.error('Failed to toggle upvote:', e);
      throw e;
    }
  },

  updateStatus: async (
    prdId: string,
    status: ApprovalStatus,
    webhookUrl?: string,
    details?: { title: string; comment?: string; approverName?: string; approverEmail?: string }
  ): Promise<void> => {
    try {
      const { error } = await supabase
        .from('prds')
        .update({ approval_status: status })
        .eq('id', prdId);

      if (error) {
        console.error('Error updating status:', error);
        throw error;
      }

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
    } catch (e) {
      console.error('Failed to update status:', e);
      throw e;
    }
  },

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

  saveSettings: (settings: AppSettings): void => {
    safeStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
};
