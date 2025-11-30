import React, { useState } from 'react';
import { Check, X, ShieldCheck, ShieldAlert, Loader2, ChevronDown, ChevronUp, User, Mail } from 'lucide-react';
import { ApprovalStatus } from '../types';

interface ApprovalControlProps {
  prdId: string;
  prdTitle: string;
  currentStatus: ApprovalStatus;
  onStatusChange: (status: ApprovalStatus, details?: { title: string; comment: string; approverName: string; approverEmail: string }) => Promise<void>;
}

export const ApprovalControl: React.FC<ApprovalControlProps> = ({ 
  prdId, 
  prdTitle, 
  currentStatus, 
  onStatusChange 
}) => {
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [comment, setComment] = useState('');
  const [approverName, setApproverName] = useState('');
  const [approverEmail, setApproverEmail] = useState('');
  
  const [showDetails, setShowDetails] = useState(false);

  const handleAction = async (status: 'approved' | 'rejected' | 'pending') => {
    setLoading(true);
    try {
      // Pass details up to the parent/service layer
      await onStatusChange(status, {
        title: prdTitle,
        comment,
        approverName,
        approverEmail
      });

      // Reset form
      setComment(''); 
      setApproverName('');
      setApproverEmail('');
      setShowDetails(false);
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus === 'approved') {
    return (
      <div className="bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-200 dark:border-green-900/30 p-6 animate-enter">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-1">
            <ShieldCheck size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-800 dark:text-green-100">Approved</h3>
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">This PRD has been officially approved.</p>
          </div>
          <button 
            onClick={() => handleAction('pending')}
            className="text-xs text-green-600/60 hover:text-green-600 underline mt-2"
          >
            Reset Status
          </button>
        </div>
      </div>
    );
  }

  if (currentStatus === 'rejected') {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-900/30 p-6 animate-enter">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-1">
            <ShieldAlert size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-800 dark:text-red-100">Changes Requested</h3>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">This PRD has been marked for revision.</p>
          </div>
          <button 
            onClick={() => handleAction('pending')}
            className="text-xs text-red-600/60 hover:text-red-600 underline mt-2"
          >
            Reset Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <ShieldCheck size={20} className="text-zinc-900 dark:text-zinc-100" />
        <h3 className="text-base font-bold text-zinc-900 dark:text-white">Review & Approval</h3>
      </div>
      
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
        Please review the requirements document. You can approve the PRD or request changes below.
      </p>

      {/* Accordion Trigger */}
      <button 
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 mb-5 transition-colors group select-none"
      >
        <div className={`p-1 rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700`}>
           {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </div>
        <span>{showDetails ? 'Hide Details' : 'Add Details & Feedback (Optional)'}</span>
      </button>

      {/* Accordion Content */}
      {showDetails && (
        <div className="mb-6 animate-enter space-y-3">
          
          {/* Row 1: Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors pointer-events-none">
                <User size={14} />
              </div>
              <input
                type="text"
                value={approverName}
                onChange={(e) => setApproverName(e.target.value)}
                placeholder="Approver Name"
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent transition-all placeholder:text-zinc-400 shadow-sm"
                disabled={loading}
              />
            </div>

            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors pointer-events-none">
                <Mail size={14} />
              </div>
              <input
                type="email"
                value={approverEmail}
                onChange={(e) => setApproverEmail(e.target.value)}
                placeholder="Approver Email"
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent transition-all placeholder:text-zinc-400 shadow-sm"
                disabled={loading}
              />
            </div>
          </div>

          {/* Row 2: Comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add notes, reasoning, or specific feedback..."
            className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent transition-all resize-none placeholder:text-zinc-400 shadow-sm"
            rows={3}
            disabled={loading}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleAction('rejected')}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-900/30 font-semibold text-sm transition-all disabled:opacity-50 shadow-sm"
        >
          <X size={16} />
          Reject
        </button>
        
        <button
          onClick={() => handleAction('approved')}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} strokeWidth={3} />}
          {loading ? 'Sending...' : 'Approve'}
        </button>
      </div>
    </div>
  );
}