import React from "react";
import { Github, Linkedin, Mail, Phone, MapPin, ArrowRight, Sparkles, MessageSquare, Download } from "lucide-react";

interface HeroProps {
  onOpenChat: () => void;
  setActiveSection: (sec: string) => void;
}

export default function Hero({ onOpenChat, setActiveSection }: HeroProps) {
  const handleScrollToProjects = () => {
    setActiveSection("projects");
    setTimeout(() => {
      const element = document.getElementById("projects");
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 10);
    fetch("/api/system-stats/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "btn_click", element: "hero_view_projects" }),
    }).catch((e) => console.error(e));
  };

  const handleContactClick = () => {
    const contactForm = document.getElementById("contact");
    if (contactForm) {
      const y = contactForm.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    fetch("/api/system-stats/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "btn_click", element: "hero_get_in_touch" }),
    }).catch((e) => console.error(e));
  };

  return (
    <section className="relative overflow-hidden bg-white py-16 dark:bg-sophisticated-bg sm:py-24">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-zinc-500/5 blur-3xl dark:bg-white/5"></div>
      <div className="absolute bottom-10 right-1/4 -z-10 h-96 w-96 rounded-full bg-zinc-500/5 blur-3xl dark:bg-white/5"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Main Info */}
          <div className="space-y-6 lg:col-span-7">
            {/* Tagline */}
            <div className="inline-flex items-center space-x-2 border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-widest text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-500"></span>
              </span>
              <span>Available for Full-Time Roles & Projects</span>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="font-serif text-4xl font-normal tracking-tight text-neutral-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
                Architecting <br />Digital Systems.
              </h1>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-sophisticated-muted">
                Sameera Jayakodi — Associate Software Engineer
              </p>
            </div>

            {/* Location & Quick Contact */}
            <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-zinc-400">
              <div className="flex items-center space-x-1.5">
                <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                <span>Homagama, Sri Lanka</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Mail className="h-3.5 w-3.5 text-neutral-400" />
                <a href="mailto:sameerajayakodi456@gmail.com" className="hover:text-neutral-900 dark:hover:text-white transition">
                  sameerajayakodi456@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-1.5">
                <Phone className="h-3.5 w-3.5 text-neutral-400" />
                <a href="tel:+94770309842" className="hover:text-neutral-900 dark:hover:text-white transition">
                  +94 770 309 842
                </a>
              </div>
            </div>

            {/* Description */}
            <p className="max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-zinc-300 font-light">
              Full-Stack Software Engineer with a passion for delivering production web and mobile applications end-to-end. Shipped systems spanning fleet management, HR, compliance, and e-learning using <strong className="font-semibold text-neutral-900 dark:text-white">React, Node.js, Spring Boot</strong>, and cloud environments. Specialized in AI workflow automation, n8n chatbot flows, and custom secured MCP server architectures.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col gap-3 sm:flex-row pt-2">
              <button
                onClick={handleScrollToProjects}
                className="group inline-flex items-center justify-center space-x-2 rounded-lg border border-neutral-950 bg-neutral-950 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:bg-neutral-800 transition dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
              >
                <span>My Work</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={onOpenChat}
                className="inline-flex items-center justify-center space-x-2 rounded-lg border border-neutral-200 bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-700 shadow-sm hover:bg-neutral-50 transition dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
              >
                <MessageSquare className="h-4 w-4 text-zinc-400 dark:text-zinc-300" />
                <span>AI Resume Bot</span>
              </button>

              <button
                onClick={() => {
                  import("../pdfGenerator").then((mod) => mod.generateResumePDF());
                  fetch("/api/system-stats/event", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "btn_click", element: "hero_download_cv" }),
                  }).catch((e) => console.error("Tracking error:", e));
                }}
                className="inline-flex cursor-pointer items-center justify-center space-x-2 rounded-lg border border-neutral-200 bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-700 shadow-sm hover:bg-neutral-50 transition dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
              >
                <Download className="h-4 w-4 text-zinc-400 dark:text-zinc-300" />
                <span>Download Resume</span>
              </button>

              <button
                onClick={handleContactClick}
                className="inline-flex items-center justify-center space-x-2 rounded-lg px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 transition dark:text-zinc-400 dark:hover:text-white"
              >
                <span>Get In Touch</span>
              </button>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4 pt-4 border-t border-neutral-100 dark:border-white/10">
              <a
                href="https://github.com/sameerajayakodi"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-white/5 dark:hover:text-white transition"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/sameera-jayakodi"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-white/5 dark:hover:text-white transition"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Interactive Graphic / Bento Card */}
          <div className="relative lg:col-span-5">
            <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50/50 p-6 shadow-xl dark:border-white/10 dark:bg-white/1">
              {/* Decorative dots */}
              <div className="absolute top-3.5 left-4 flex space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                <span className="h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                <span className="h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
              </div>
              <div className="absolute top-3 right-4 text-[10px] font-mono text-neutral-400 dark:text-zinc-500 uppercase tracking-widest">
                sameera.ts
              </div>

              {/* Code Snippet */}
              <div className="mt-6 font-mono text-[11px] text-neutral-500 dark:text-zinc-400 space-y-3 leading-relaxed">
                <p><span className="text-zinc-600 dark:text-zinc-500">const</span> engineer = &#123;</p>
                <p className="pl-4"><span className="text-zinc-800 dark:text-zinc-300">name</span>: <span className="text-zinc-900 dark:text-white">"Sameera Jayakodi"</span>,</p>
                <p className="pl-4"><span className="text-zinc-800 dark:text-zinc-300">role</span>: <span className="text-zinc-900 dark:text-white">"Associate Software Engineer"</span>,</p>
                <p className="pl-4"><span className="text-zinc-800 dark:text-zinc-300">specialties</span>: [</p>
                <p className="pl-8"><span className="text-zinc-900 dark:text-white">"Full-Stack Web"</span>, <span className="text-zinc-900 dark:text-white">"Mobile Apps"</span>,</p>
                <p className="pl-8"><span className="text-zinc-900 dark:text-white">"AI Workflows"</span>, <span className="text-zinc-900 dark:text-white">"MCP Servers"</span></p>
                <p className="pl-4">],</p>
                <p className="pl-4"><span className="text-zinc-800 dark:text-zinc-300">stack</span>: &#123;</p>
                <p className="pl-8"><span className="text-zinc-800 dark:text-zinc-400">frontend</span>: [<span className="text-zinc-900 dark:text-white">"React"</span>, <span className="text-zinc-900 dark:text-white">"Flutter"</span>],</p>
                <p className="pl-8"><span className="text-zinc-800 dark:text-zinc-400">backend</span>: [<span className="text-zinc-900 dark:text-white">"Node.js"</span>, <span className="text-zinc-900 dark:text-white">"Spring Boot"</span>],</p>
                <p className="pl-8"><span className="text-zinc-800 dark:text-zinc-400">databases</span>: [<span className="text-zinc-900 dark:text-white">"MongoDB"</span>, <span className="text-zinc-900 dark:text-white">"Postgres"</span>]</p>
                <p className="pl-4">&#125;,</p>
                <p className="pl-4"><span className="text-zinc-800 dark:text-zinc-300">motto</span>: <span className="text-zinc-900 dark:text-white">"Clean architecture meets AI-driven automation"</span></p>
                <p>&#125;;</p>
              </div>

              {/* Stack Mini Icons Visualizer */}
              <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-neutral-100 dark:border-white/10">
                <span className="border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">React.js</span>
                <span className="border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">Spring Boot</span>
                <span className="border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">Node.js</span>
                <span className="border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">Flutter</span>
                <span className="border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">n8n</span>
                <span className="border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">Docker</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
