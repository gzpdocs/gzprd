export interface PRDSection {
  id: string;
  title: string;
  description: string; // Helper text for the user
  content: string;
  isEnabled: boolean;
  placeholder: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  date: string;
}

export interface PublicSettings {
  allowComments: boolean;
  allowUpvotes: boolean;
  enableApprovalFlow: boolean;
}

export interface AppSettings {
  geminiModel: string;
  geminiApiKey: string;
  webhookUrl: string;
  email: string;
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface PRD {
  id: string;
  title: string;
  productName: string;
  shortDescription: string;
  sections: PRDSection[];
  isPublic: boolean;
  publicSettings: PublicSettings;
  upvotes: number;
  comments: Comment[];
  lastUpdated: string;
  status: 'draft' | 'published';
  approvalStatus: ApprovalStatus;
  createdAt?: string;
  createdBy?: string;
}

export interface DBComment {
  id: string;
  prd_id: string;
  author: string;
  avatar: string;
  text: string;
  created_at: string;
}

export type ViewState = 'landing' | 'config' | 'edit' | 'preview' | 'public';

export interface GenerationContext {
  productName: string;
  shortDescription: string;
  existingSections: Record<string, string>;
}