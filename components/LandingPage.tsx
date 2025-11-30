import React, { useState } from 'react';
import { Button } from './Button';
import { ImportModal } from './ImportModal';
import { PRD } from '../types';
import {
  Rocket,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Webhook,
  Share2,
  CheckCircle2,
  Terminal,
  Key,
  UserRoundX
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onImport: (prd: PRD) => void;
  onImportById: (id: string) => Promise<void>;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onImport, onImportById }) => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 flex flex-col font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-900">
       
       {/* --- Navbar --- */}
       <nav className="border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">GZPRD</span>
            </div>
            <div className="flex items-center gap-4">
               <button
                 onClick={() => setIsImportModalOpen(true)}
                 className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors hidden sm:flex px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
               >
                 Import
               </button>
               <Button size="sm" onClick={onStart}>Get Started</Button>
            </div>
          </div>
       </nav>

       <main className="flex-1 flex flex-col">
         
         {/* --- Hero Section --- */}
         <header className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 md:pt-32 md:pb-20 max-w-4xl mx-auto animate-enter">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-default">
              <Sparkles size={12} className="text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 tracking-wide uppercase">v1.0 Powered by Gemini</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1] mb-6">
              Write PRDs that <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 via-zinc-600 to-zinc-900 dark:from-white dark:via-zinc-400 dark:to-white animate-gradient">
                ship faster.
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed mb-10">
              AI-powered workspace for product teams. Draft specifications, collaborate with stakeholders, and automate approvals without leaving your workflow.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" onClick={onStart} rightIcon={<ChevronRight size={18}/>} className="h-14 px-8 text-lg w-full sm:w-auto shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50">
                 Start Writing
              </Button>
              <Button size="lg" variant="outline" onClick={onStart} className="h-14 px-8 text-lg w-full sm:w-auto bg-white dark:bg-zinc-900">
                 View Documentation
              </Button>
            </div>
         </header>

         {/* --- Visual Mockup (Abstract) --- */}
         <section className="px-6 mb-24 md:mb-32">
            <div className="max-w-5xl mx-auto relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-zinc-200 to-zinc-400 dark:from-zinc-800 dark:to-zinc-700 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                
                {/* UI Container */}
                <div className="relative bg-white dark:bg-[#0C0C0E] rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden aspect-[16/10] md:aspect-[21/9] flex flex-col">
                    {/* Fake Browser Header */}
                    <div className="h-10 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                        <div className="ml-4 h-5 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-md opacity-50"></div>
                    </div>
                    {/* Fake Content */}
                    <div className="flex-1 p-8 md:p-12 flex gap-8">
                        <div className="w-1/4 space-y-4 hidden md:block">
                            <div className="h-4 w-2/3 bg-zinc-100 dark:bg-zinc-800 rounded"></div>
                            <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded opacity-60"></div>
                            <div className="h-4 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded opacity-60"></div>
                            <div className="h-4 w-1/2 bg-zinc-100 dark:bg-zinc-800 rounded opacity-60"></div>
                        </div>
                        <div className="flex-1 space-y-6">
                            <div className="space-y-3">
                                <div className="h-8 w-1/3 bg-zinc-900 dark:bg-zinc-100 rounded-lg opacity-10 dark:opacity-20"></div>
                                <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded opacity-50"></div>
                            </div>
                            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 space-y-3">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center">
                                        <Sparkles size={12} fill="currentColor"/>
                                    </div>
                                    <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                                </div>
                                <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded opacity-60"></div>
                                <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded opacity-60"></div>
                                <div className="h-3 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded opacity-60"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </section>

         {/* --- Features Grid --- */}
         <section className="py-24 border-t border-zinc-200/50 dark:border-zinc-800/50">
            <div className="max-w-6xl mx-auto px-6">
               
               <div className="mb-16 md:text-center max-w-2xl mx-auto">
                  <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Everything you need to ship.</h2>
                  <p className="text-zinc-500 dark:text-zinc-400">From the first draft to the final approval, GZPRD provides the structure and intelligence your product team needs.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">


                 {/* Feature: Smart AI */}
                  <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                     <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-900 dark:text-white mb-6 border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <Sparkles size={24} />
                     </div>
                     <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Context-Aware AI</h3>
                     <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        Generate comprehensive PRD sections like Risks and Success Metrics instantly, tailored to your product description.
                     </p>
                  </div>
                 
                  {/* Feature: No Account (New) */}
                  <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                     <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-900 dark:text-white mb-6 border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <UserRoundX size={24} />
                     </div>
                     <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No Account Needed</h3>
                     <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        Start immediately. No sign-up walls or tracking. Your data is stored locally in your browser, ensuring privacy by default.
                     </p>
                  </div>

                  {/* Feature: BYOK (New) */}
                  <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                     <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-900 dark:text-white mb-6 border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <Key size={24} />
                     </div>
                     <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Bring Your Own Key</h3>
                     <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        Connect your own Gemini API key. You pay Google directly, avoiding vendor markup and retaining full control over limits.
                     </p>
                  </div>

                  

                  {/* Feature 4: Approval */}
                  <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                     <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-900 dark:text-white mb-6 border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <ShieldCheck size={24} />
                     </div>
                     <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Approval Workflows</h3>
                     <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        Formalize the process. Stakeholders can review, comment, and officially approve PRDs with a tracked audit trail.
                     </p>
                  </div>

                  {/* Feature 5: Webhooks (Featured - Last) */}
                  <div className="p-8 rounded-3xl bg-white dark:bg-[#0F0F12] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white md:col-span-2 relative overflow-hidden group flex flex-col md:flex-row gap-8 items-start">
                     
                     {/* Left: Content */}
                     <div className="relative z-10 flex-1 flex flex-col h-full justify-between">
                        <div>
                           <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-900 dark:text-white mb-6 shadow-lg border border-zinc-200 dark:border-zinc-700">
                              <Webhook size={24} />
                           </div>
                           <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">Powerful Webhook Integrations</h3>
                           <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                              Connect your PRDs to your engineering stack. Automatically trigger CI/CD pipelines, create Jira epics, or notify Slack channels when a PRD status changes to "Approved".
                           </p>
                        </div>
                        <div className="flex items-center gap-3 mt-8">
                           <div className="px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 text-xs font-mono backdrop-blur-md border border-zinc-200 dark:border-white/10">POST /api/webhooks</div>
                           <div className="px-3 py-1.5 rounded-md bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold flex items-center gap-1.5 border border-green-200 dark:border-green-500/20">
                              <CheckCircle2 size={12} />
                              <span>200 OK</span>
                           </div>
                        </div>
                     </div>

                     {/* Right: Code Snippet Visual */}
                     <div className="relative z-10 w-full md:w-80 flex-shrink-0">
                         <div className="rounded-xl overflow-hidden bg-zinc-50 dark:bg-[#000000] border border-zinc-200 dark:border-zinc-800 shadow-2xl">
                             {/* Mac-style Window Header */}
                             <div className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/50">
                                 <div className="w-2.5 h-2.5 rounded-full bg-red-400 dark:bg-red-500/50"></div>
                                 <div className="w-2.5 h-2.5 rounded-full bg-amber-400 dark:bg-amber-500/50"></div>
                                 <div className="w-2.5 h-2.5 rounded-full bg-green-400 dark:bg-green-500/50"></div>
                             </div>
                             {/* Code Area */}
                             <div className="p-4 font-mono text-[10px] sm:text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                                 <div className="flex items-center gap-2 mb-2 text-zinc-400 dark:text-zinc-500 select-none">
                                     <Terminal size={12} />
                                     <span>payload.json</span>
                                 </div>
                                 <div><span className="text-purple-600 dark:text-purple-400">{"{"}</span></div>
                                 <div className="pl-4">
                                     <span className="text-blue-600 dark:text-blue-400">"event"</span>: <span className="text-green-600 dark:text-green-400">"prd_approved"</span>,
                                 </div>
                                 <div className="pl-4">
                                     <span className="text-blue-600 dark:text-blue-400">"prd_id"</span>: <span className="text-green-600 dark:text-green-400">"gzprd_123"</span>,
                                 </div>
                                 <div className="pl-4">
                                     <span className="text-blue-600 dark:text-blue-400">"title"</span>: <span className="text-green-600 dark:text-green-400">"Q4 Roadmap"</span>,
                                 </div>
                                 <div className="pl-4">
                                     <span className="text-blue-600 dark:text-blue-400">"approver"</span>: <span className="text-purple-600 dark:text-purple-400">{"{"}</span>
                                 </div>
                                 <div className="pl-8">
                                     <span className="text-blue-600 dark:text-blue-400">"email"</span>: <span className="text-green-600 dark:text-green-400">"alice@co.com"</span>
                                 </div>
                                 <div className="pl-4">
                                     <span className="text-purple-600 dark:text-purple-400">{"}"}</span>
                                 </div>
                                 <div><span className="text-purple-600 dark:text-purple-400">{"}"}</span></div>
                             </div>
                         </div>
                     </div>

                     {/* Decorative Gradients - Only visible in dark mode */}
                     <div className="absolute right-0 top-0 w-2/3 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none mix-blend-screen opacity-0 dark:opacity-100"></div>
                     <div className="absolute bottom-0 right-10 w-40 h-40 bg-purple-500/10 blur-[60px] pointer-events-none rounded-full opacity-0 dark:opacity-100"></div>
                  </div>

               </div>
            </div>
         </section>

         {/* --- Bottom CTA --- */}
         <section className="py-24 px-6 text-center">
            <div className="max-w-2xl mx-auto space-y-8">
               <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  Ready to streamline your PRDs?
               </h2>
               <p className="text-zinc-500 dark:text-zinc-400 text-lg">
                  Join thousands of Product Managers building the future with AI assistance. No credit card required.
               </p>
               <div className="flex justify-center">
                  <Button size="lg" onClick={onStart} className="h-14 px-10 text-lg shadow-xl shadow-zinc-900/10 dark:shadow-black/50">
                     Create New PRD
                  </Button>
               </div>
            </div>
         </section>

       </main>

       {/* --- Footer --- */}
       <footer className="py-12 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                 <span className="font-bold text-zinc-900 dark:text-white tracking-tight">GZPRD</span>
              </div>
              <p className="text-zinc-400 dark:text-zinc-600 text-sm">
                 © {new Date().getFullYear()} GZPRD. Built with Bolt.new.
              </p>
          </div>
       </footer>

       <ImportModal
         isOpen={isImportModalOpen}
         onClose={() => setIsImportModalOpen(false)}
         onImport={onImport}
         onImportById={onImportById}
       />
    </div>
  );
};
