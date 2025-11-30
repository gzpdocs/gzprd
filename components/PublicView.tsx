import React, { useState } from 'react';
import { PRD, ApprovalStatus } from '../types';
import { PRDPreview } from './PRDPreview';
import { ThumbsUp, MessageSquare, Share2, ArrowLeft, ShieldCheck, Check } from 'lucide-react';
import { Button } from './Button';
import { ApprovalControl } from './ApprovalControl';

interface PublicViewProps {
  prd: PRD;
  onBack: () => void;
  onComment: (text: string) => Promise<void>;
  onUpvote: () => Promise<void>;
  onStatusChange: (status: ApprovalStatus, details?: { title: string; comment: string; approverName: string; approverEmail: string }) => Promise<void>;
}

export const PublicView: React.FC<PublicViewProps> = ({ 
  prd, 
  onBack, 
  onComment, 
  onUpvote, 
  onStatusChange 
}) => {
  const [newComment, setNewComment] = useState('');
  const [hasUpvoted, setHasUpvoted] = useState(false); // Local tracking for UI feedback
  const [isCopied, setIsCopied] = useState(false);

  // Safeguard: Ensure publicSettings exists
  const settings = prd.publicSettings || { allowComments: true, allowUpvotes: true, enableApprovalFlow: false };
  const { allowComments, allowUpvotes, enableApprovalFlow } = settings;

  const handleUpvoteClick = async () => {
    if (hasUpvoted) return; // Prevent spamming for this demo
    setHasUpvoted(true);
    await onUpvote();
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    await onComment(newComment);
    setNewComment('');
  };

  const handleShare = () => {
    // Ensure we are sharing the public link
    const url = window.location.href.includes('view=public') 
      ? window.location.href 
      : `${window.location.origin}${window.location.pathname}?id=${prd.id}&view=public`;
      
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Public Navbar */}
      <nav className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack} leftIcon={<ArrowLeft size={16}/>}>
                  Editor
              </Button>
              {prd.approvalStatus === 'approved' && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500 text-white shadow-sm animate-enter">
                  <ShieldCheck size={12} fill="currentColor" strokeWidth={2.5} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Approved</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
                 <Button 
                   variant="outline" 
                   size="sm" 
                   onClick={handleShare}
                   leftIcon={isCopied ? <Check size={14} className="text-green-500" /> : <Share2 size={14}/>}
                 >
                   {isCopied ? 'Copied Link' : 'Share'}
                 </Button>
            </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
          
        {/* Main Content */}
        <div className="w-full">
          <PRDPreview prd={prd} />
        </div>

        {/* Interaction Panel (Bottom) */}
        {(allowComments || allowUpvotes || enableApprovalFlow) && (
          <div className="w-full max-w-2xl mx-auto space-y-8 animate-enter pb-16">
            
            {/* Approval Control */}
            {enableApprovalFlow && (
              <ApprovalControl 
                prdId={prd.id}
                prdTitle={prd.productName}
                currentStatus={prd.approvalStatus || 'pending'}
                onStatusChange={onStatusChange}
              />
            )}

            {(allowComments || allowUpvotes) && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
                  
                  {/* Upvotes */}
                  {allowUpvotes && (
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Community</span>
                            <span className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{prd.upvotes || 0} Upvotes</span>
                        </div>
                        <button 
                        onClick={handleUpvoteClick}
                        disabled={hasUpvoted}
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center transition-all
                          ${hasUpvoted 
                            ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 shadow-md transform scale-105 cursor-default' 
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'}
                        `}
                        >
                            <ThumbsUp size={20} fill={hasUpvoted ? "currentColor" : "none"} />
                        </button>
                    </div>
                  )}
                  
                  {/* Divider if both are present */}
                  {allowUpvotes && allowComments && (
                    <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full my-8"></div>
                  )}

                  {/* Comments */}
                  {allowComments && (
                    <>
                      <div className="mb-6 flex items-center gap-2">
                          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Discussion ({prd.comments?.length || 0})</h3>
                      </div>

                      <div className="space-y-6 mb-8">
                          {prd.comments && prd.comments.length > 0 ? prd.comments.map(comment => (
                              <div key={comment.id} className="flex gap-4 animate-enter">
                                  <img src={comment.avatar} alt={comment.author} className="w-10 h-10 rounded-full flex-shrink-0 bg-zinc-200 dark:bg-zinc-800" />
                                  <div className="space-y-1.5 w-full">
                                      <div className="flex justify-between items-baseline">
                                          <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{comment.author}</span>
                                          <span className="text-xs text-zinc-400 dark:text-zinc-500">{comment.date}</span>
                                      </div>
                                      <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">{comment.text}</p>
                                  </div>
                              </div>
                          )) : (
                            <p className="text-sm text-zinc-400 italic">No comments yet. Be the first!</p>
                          )}
                      </div>

                      <form onSubmit={handleCommentSubmit} className="relative">
                          <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="w-full border border-zinc-200 dark:border-zinc-700 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white transition-all placeholder:text-zinc-400 text-sm"
                          />
                      </form>
                    </>
                  )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};