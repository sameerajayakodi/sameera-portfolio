import React, { useState } from "react";
import { FolderGit2, Calendar, ShieldCheck, ChevronRight, Play, Eye, Cpu, Zap, Plus, Trash2, ArrowRight, CheckCircle } from "lucide-react";

export default function Projects() {
  const [activeTab, setActiveTab] = useState<"highlights" | "architecture">("highlights");
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  // List of Sameera's Projects from resume
  const projects = [
    {
      id: "govimart",
      title: "GoviMart",
      subtitle: "Full Stack Grocery Delivery Web Application",
      tags: ["React.js", "Node.js", "Express.js", "MongoDB", "Stripe", "Cloudinary", "JWT", "Multer"],
      duration: "Aug 2025 - Dec 2025",
      role: "Lead Full-Stack Architect",
      description: "A comprehensive grocery e-commerce and delivery platform designed for high conversion and security.",
      highlights: [
        "Architected and built separate user checkout flow and administrator inventory management dashboards.",
        "Implemented secure JWT-based stateless session authentication and role-based route guards for clients and admins.",
        "Integrated Stripe for end-to-end checkout payment processing and Cloudinary/Multer for product image uploads."
      ]
    },
    {
      id: "hirelink",
      title: "HireLink",
      subtitle: "Job & Skill Development Platform with AI Integration",
      tags: ["React.js", "Spring Boot", "MySQL", "AWS EC2", "Gemini API", "Chatbot"],
      duration: "Jun 2024 - Dec 2024",
      role: "Backend & AI Engineer",
      description: "An innovative portal serving job seekers, trainers, and employers with intelligent resume parsing and job recommendations.",
      highlights: [
        "Designed a multi-role workspace serving job seekers, employers, and trainers with highly specialized tracking dashboards.",
        "Built 25+ Spring Boot REST APIs backed by highly normalized MySQL database structures.",
        "Integrated Gemini API to power an AI conversation bot that analyzes user profiles and guides job matching."
      ]
    },
    {
      id: "torva",
      title: "Torva",
      subtitle: "Real-World Treasure Hunt Mobile Application",
      tags: ["Flutter", "Firebase", "Firestore", "Google Maps API", "Cloud Functions", "GPS"],
      duration: "Jan 2025 - May 2025",
      role: "Mobile App Developer",
      description: "A gamified treasure-hunt mobile application relying on geolocation and real-time multiplayer coordination.",
      highlights: [
        "Developed a cross-platform mobile game using Flutter featuring GPS tracking and local treasure triggers.",
        "Integrated Google Maps SDK with custom SVG pins, polyline routes, and real-time navigation paths.",
        "Utilized Firebase Auth for seamless login and Firestore for synchronized real-time leaderboards."
      ]
    },
    {
      id: "vehicle-gps",
      title: "Vehicle Management System",
      subtitle: "Real-Time Fleet GPS Asset Tracker",
      tags: ["Node.js", "Socket.io", "MongoDB", "Redis", "Leaflet Maps"],
      duration: "Jan 2026",
      role: "Backend System Engineer",
      description: "High-performance IoT coordinate ingestion service delivering zero-latency asset tracking updates.",
      highlights: [
        "Constructed a high-throughput GPS telemetry consumer processing updates every 2 seconds for a fleet of vehicles.",
        "Throttled persistent database writes by keeping hot coordinates in Redis and flushing in batches to MongoDB.",
        "Broadcasted real-time vehicle coordinate vectors to React clients using WebSockets and room-level broadcasts."
      ]
    },
    {
      id: "adgree",
      title: "AdGree",
      subtitle: "Consent & Privacy Management Platform",
      tags: ["React.js", "Node.js", "MySQL", "PDPA Compliance", "Audit Trail"],
      duration: "Nov 2025",
      role: "Security & Compliance Developer",
      description: "Consent management ledger ensuring organizations collect, store, and audit user consent in full compliance.",
      highlights: [
        "Designed a PDPA-aligned (Personal Data Protection Act) user consent repository with an immutable audit ledger.",
        "Engineered secure, role-based controls protecting employee data records.",
        "Integrated simple analytics tracking consent grant and revocation frequencies."
      ]
    },
    {
      id: "whatsapp-crm",
      title: "AI WhatsApp CRM",
      subtitle: "Automated Conversational Lead Capture",
      tags: ["n8n", "Gemini API", "WhatsApp Cloud API", "Webhook", "MongoDB"],
      duration: "Mar 2026",
      role: "Workflow Automation Engineer",
      description: "Fully automated pipeline connecting official WhatsApp message callbacks to a lead tracking CRM.",
      highlights: [
        "Designed an automated lead-nurturing pipeline using n8n workflows triggering on official WhatsApp Webhooks.",
        "Leveraged Gemini API for structured JSON entity extraction parsing client name, budget, and requirements from unstructured chats.",
        "Piped captured leads directly into a MongoDB CRM, trigger auto-reply messages in under 10 seconds."
      ]
    }
  ];

  const trackEvent = (name: string, payload: string) => {
    fetch("/api/system-stats/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "btn_click",
        element: name,
        payload: { value: payload }
      })
    }).catch(e => console.error(e));
  };

  return (
    <div className="space-y-10">
      {/* Header and Mode Selection */}
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-100 pb-5 dark:border-white/10 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-serif text-2xl font-normal text-neutral-900 dark:text-white sm:text-3xl">
            Projects & Prototypes
          </h2>
          <p className="mt-1 text-xs font-mono uppercase tracking-widest text-neutral-450 dark:text-zinc-500">
            Discover Sameera's production-grade systems or interact with a live chatbot engine architecture.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex rounded-lg bg-neutral-100 p-1 dark:bg-white/5 border dark:border-white/10">
          <button
            onClick={() => setActiveTab("highlights")}
            className={`rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
              activeTab === "highlights"
                ? "bg-white text-neutral-900 shadow-sm dark:bg-white/10 dark:text-white"
                : "text-neutral-500 hover:text-neutral-800 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            Project Highlights
          </button>
          <button
            onClick={() => setActiveTab("architecture")}
            className={`rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
              activeTab === "architecture"
                ? "bg-white text-neutral-900 shadow-sm dark:bg-white/10 dark:text-white"
                : "text-neutral-500 hover:text-neutral-800 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            System Architectures
          </button>
        </div>
      </div>

      {/* Projects Highlights Grid Tab */}
      {activeTab === "highlights" && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm hover:border-neutral-900 dark:border-white/10 dark:bg-white/1 dark:hover:border-white/20 transition duration-300"
            >
              {/* Card Header */}
              <div className="border-b border-neutral-100 bg-neutral-50/30 p-5 dark:border-white/10 dark:bg-white/2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FolderGit2 className="h-4 w-4 text-zinc-400" />
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                      {project.duration}
                    </span>
                  </div>
                  <span className="rounded border border-neutral-200 bg-neutral-100 dark:bg-white/10 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-neutral-600 dark:text-zinc-300 dark:border-white/10">
                    {project.role}
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-lg font-normal text-neutral-900 dark:text-white">
                  {project.title}
                </h3>
                <p className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-zinc-500 mt-1">
                  {project.subtitle}
                </p>
              </div>

              {/* Card Content */}
              <div className="flex-1 p-5 space-y-4">
                <p className="text-sm text-neutral-600 dark:text-zinc-300 leading-relaxed font-light">
                  {project.description}
                </p>

                {/* Expanding details view */}
                {expandedProject === project.id ? (
                  <div className="space-y-3 pt-3 border-t border-neutral-100 dark:border-white/10 animate-fadeIn">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                      Key Core Contributions:
                    </h4>
                    <ul className="space-y-2 text-xs text-neutral-600 dark:text-zinc-400 font-light">
                      {project.highlights.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Actions */}
              <div className="border-t border-neutral-100 bg-neutral-50/20 p-4 dark:border-white/10">
                <button
                  onClick={() => {
                    const nextVal = expandedProject === project.id ? null : project.id;
                    setExpandedProject(nextVal);
                    if (nextVal) trackEvent("expand_project_details", project.id);
                  }}
                  className="flex w-full items-center justify-center space-x-1 rounded-lg border border-neutral-200 bg-white py-2 text-xs font-semibold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10 transition cursor-pointer"
                >
                  <span>{expandedProject === project.id ? "Hide Tech Details" : "View Core Contributions"}</span>
                  <ChevronRight className={`h-4 w-4 transform transition-transform duration-200 ${expandedProject === project.id ? "rotate-90" : ""}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}


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
