const fs = require('fs');
let content = fs.readFileSync('src/components/Projects.tsx', 'utf8');

// replace the Chatbot Builder tab text
content = content.replace('Chatbot Builder (Interactive!)', 'System Architectures');

// remove lines 97 to 236
const lines = content.split('\n');
const trackEventIdx = lines.findIndex(l => l.includes('const trackEvent = '));
const newLines1 = lines.slice(0, 96).concat(lines.slice(trackEventIdx));

// find where the architecture section starts
const archStartIdx = newLines1.findIndex(l => l.includes('{/* Interactive Drag/Click Chatbot Builder Prototype */}'));
if (archStartIdx === -1) console.log('archStartIdx not found');

// replace everything from archStartIdx to the end with our new content
const newLines2 = newLines1.slice(0, archStartIdx);

const newArchContent = `
      {/* System Architectures Tab */}
      {activeTab === "architecture" && (
        <div className="space-y-12">
          {/* Architecture 1: Lead Gen Flow */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/1 space-y-6">
            <div>
              <h3 className="font-serif text-xl font-normal text-neutral-900 dark:text-white">
                Zero-Latency WhatsApp Lead Capture Architecture
              </h3>
              <p className="mt-1 text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-zinc-500">
                n8n Automation + Gemini AI + MongoDB
              </p>
            </div>
            
            <div className="relative rounded-lg border border-neutral-100 bg-neutral-50/50 p-8 dark:border-white/5 dark:bg-white/2">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-2">
                {/* User Step */}
                <div className="flex flex-col items-center space-y-3 w-32">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Input</p>
                    <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">WhatsApp Msg</p>
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight className="hidden md:block h-5 w-5 text-neutral-300 dark:text-neutral-600" />
                <div className="block md:hidden w-[2px] h-6 bg-neutral-200 dark:bg-neutral-800"></div>

                {/* Automation Engine Step */}
                <div className="flex flex-col items-center space-y-3 w-32">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Webhook</p>
                    <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">n8n Workflow</p>
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight className="hidden md:block h-5 w-5 text-neutral-300 dark:text-neutral-600" />
                <div className="block md:hidden w-[2px] h-6 bg-neutral-200 dark:bg-neutral-800"></div>

                {/* Processing Step */}
                <div className="flex flex-col items-center space-y-3 w-32">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Extraction</p>
                    <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Gemini LLM</p>
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight className="hidden md:block h-5 w-5 text-neutral-300 dark:text-neutral-600" />
                <div className="block md:hidden w-[2px] h-6 bg-neutral-200 dark:bg-neutral-800"></div>

                {/* Database Step */}
                <div className="flex flex-col items-center space-y-3 w-32">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Storage</p>
                    <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">MongoDB CRM</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-sm font-light leading-relaxed text-neutral-600 dark:text-zinc-400">
              <p>
                In this architecture, I established an end-to-end webhook pipeline. When a lead sends a WhatsApp message, the webhook immediately activates an <strong className="font-semibold text-neutral-800 dark:text-neutral-200">n8n workflow</strong>. The unstructured text is then passed to the <strong className="font-semibold text-neutral-800 dark:text-neutral-200">Gemini API</strong>, which uses few-shot prompting to extract structured JSON (name, budget, intent). 
              </p>
              <p className="mt-2">
                The validated JSON is immediately piped into <strong className="font-semibold text-neutral-800 dark:text-neutral-200">MongoDB</strong>, and an automated, contextual reply is generated and dispatched via the WhatsApp Business API.
              </p>
            </div>
          </div>
          
          {/* Architecture 2: GoviMart */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/1 space-y-6">
            <div>
              <h3 className="font-serif text-xl font-normal text-neutral-900 dark:text-white">
                GoviMart Platform Infrastructure
              </h3>
              <p className="mt-1 text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-zinc-500">
                React + Node.js + Express + Stripe + Cloudinary
              </p>
            </div>
            
            <div className="relative rounded-lg border border-neutral-100 bg-neutral-50/50 p-8 dark:border-white/5 dark:bg-white/2 overflow-hidden">
              <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 relative z-10">
                
                {/* Client Layer */}
                <div className="flex-1 rounded border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
                  <h4 className="text-center text-[10px] font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">Client Layer</h4>
                  <div className="space-y-3">
                    <div className="rounded bg-white p-3 text-center text-xs font-medium text-neutral-700 shadow-sm dark:bg-neutral-900 dark:text-neutral-300 dark:border dark:border-white/10">User App (React)</div>
                    <div className="rounded bg-white p-3 text-center text-xs font-medium text-neutral-700 shadow-sm dark:bg-neutral-900 dark:text-neutral-300 dark:border dark:border-white/10">Admin Dashboard (React)</div>
                  </div>
                </div>

                {/* API Gateway */}
                <div className="flex flex-col items-center justify-center shrink-0">
                  <ArrowRight className="hidden md:block h-5 w-5 text-neutral-300 dark:text-neutral-600" />
                  <div className="block md:hidden w-[2px] h-6 bg-neutral-200 dark:bg-neutral-800"></div>
                </div>

                {/* Application Layer */}
                <div className="flex-1 rounded border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                  <h4 className="text-center text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">API Layer</h4>
                  <div className="space-y-3">
                    <div className="rounded bg-white p-3 text-center text-xs font-medium text-neutral-700 shadow-sm dark:bg-neutral-900 dark:text-neutral-300 dark:border dark:border-white/10">Express Gateway</div>
                    <div className="rounded bg-white p-3 text-center text-xs font-medium text-neutral-700 shadow-sm dark:bg-neutral-900 dark:text-neutral-300 dark:border dark:border-white/10">JWT Auth Controller</div>
                  </div>
                </div>

                {/* Database/External Services */}
                <div className="flex flex-col items-center justify-center shrink-0">
                  <ArrowRight className="hidden md:block h-5 w-5 text-neutral-300 dark:text-neutral-600" />
                  <div className="block md:hidden w-[2px] h-6 bg-neutral-200 dark:bg-neutral-800"></div>
                </div>

                <div className="flex-1 rounded border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-900/30 dark:bg-purple-900/10">
                  <h4 className="text-center text-[10px] font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-4">Storage & 3rd Party</h4>
                  <div className="space-y-3">
                    <div className="rounded bg-white p-3 text-center text-xs font-medium text-neutral-700 shadow-sm dark:bg-neutral-900 dark:text-neutral-300 dark:border dark:border-white/10">MongoDB (NoSQL)</div>
                    <div className="rounded bg-white p-3 text-center text-xs font-medium text-neutral-700 shadow-sm dark:bg-neutral-900 dark:text-neutral-300 dark:border dark:border-white/10">Stripe & Cloudinary</div>
                  </div>
                </div>

              </div>
            </div>
            
            <div className="text-sm font-light leading-relaxed text-neutral-600 dark:text-zinc-400">
              <p>
                GoviMart relies on a distinct separation of concerns, isolating the core e-commerce client from the administrative backend interfaces. A monolithic <strong className="font-semibold text-neutral-800 dark:text-neutral-200">Node/Express</strong> API routes traffic using stateless JWTs to authenticate endpoints.
              </p>
              <p className="mt-2">
                Images are uploaded as multipart streams via Multer, directly offloaded to <strong className="font-semibold text-neutral-800 dark:text-neutral-200">Cloudinary</strong> for global CDN delivery, reducing storage loads on the primary database, <strong className="font-semibold text-neutral-800 dark:text-neutral-200">MongoDB</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;

newLines2.push(newArchContent);

fs.writeFileSync('src/components/Projects.tsx', newLines2.join('\n'));
