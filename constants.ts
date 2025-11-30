import { PRDSection } from './types';

export const DEFAULT_SECTIONS: PRDSection[] = [
  {
    id: 'executive_summary',
    title: 'Executive Summary',
    description: 'A high-level overview of the product vision and business value.',
    content: '',
    isEnabled: true,
    placeholder: 'Summarize the entire PRD in one paragraph...',
  },
  {
    id: 'problem_statement',
    title: 'Problem Statement',
    description: 'The specific user problem or gap in the market this product addresses.',
    content: '',
    isEnabled: true,
    placeholder: 'What pain point are we solving?',
  },
  {
    id: 'goals_objectives',
    title: 'Goals & Objectives',
    description: 'Measurable business and product goals.',
    content: '',
    isEnabled: true,
    placeholder: 'List key objectives (e.g., Increase user retention by 20%)...',
  },
  {
    id: 'target_audience',
    title: 'Target Audience',
    description: 'Who is this product for? User personas and segments.',
    content: '',
    isEnabled: true,
    placeholder: 'Primary and secondary user personas...',
  },
  {
    id: 'user_stories',
    title: 'User Stories',
    description: 'Specific scenarios from the user\'s perspective.',
    content: '',
    isEnabled: true,
    placeholder: 'As a [user], I want to [action], so that [benefit]...',
  },
  {
    id: 'features_requirements',
    title: 'Features & Requirements',
    description: 'Detailed functional requirements.',
    content: '',
    isEnabled: true,
    placeholder: 'List specific features and functionality...',
  },
  {
    id: 'technical_requirements',
    title: 'Technical Requirements',
    description: 'Tech stack, constraints, and architecture notes.',
    content: '',
    isEnabled: false,
    placeholder: 'API requirements, database schema, performance constraints...',
  },
  {
    id: 'design_requirements',
    title: 'Design Requirements',
    description: 'UI/UX guidelines and constraints.',
    content: '',
    isEnabled: false,
    placeholder: 'Mobile-first, brand colors, accessibility standards...',
  },
  {
    id: 'timeline_milestones',
    title: 'Timeline & Milestones',
    description: 'Key dates and delivery phases.',
    content: '',
    isEnabled: false,
    placeholder: 'Phase 1 launch date, beta testing window...',
  },
  {
    id: 'success_metrics',
    title: 'Success Metrics',
    description: 'KPIs to measure product success.',
    content: '',
    isEnabled: true,
    placeholder: 'DAU/MAU, conversion rates, NPS score...',
  },
  {
    id: 'risks',
    title: 'Risk Assessment',
    description: 'Potential pitfalls and mitigation strategies.',
    content: '',
    isEnabled: false,
    placeholder: 'Technical risks, market risks, regulatory concerns...',
  },
];

export const MOCK_COMMENTS = [
  {
    id: 'c1',
    author: 'Sarah Chen',
    avatar: 'https://picsum.photos/seed/sarah/64/64',
    text: 'The user stories section is very clear. Have we considered edge cases for offline mode?',
    date: '2 hours ago'
  },
  {
    id: 'c2',
    author: 'Marcus Rodriguez',
    avatar: 'https://picsum.photos/seed/marcus/64/64',
    text: 'Great start. I think we need to expand the Success Metrics to include retention specific to the new feature set.',
    date: '5 hours ago'
  }
];

export const DEFAULT_PUBLIC_SETTINGS = {
  allowComments: true,
  allowUpvotes: true,
  enableApprovalFlow: false,
};