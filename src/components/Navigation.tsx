import React, { useState } from "react";
import { Moon, Sun, Menu, X, Download, BarChart2, MessageSquare } from "lucide-react";

interface NavigationProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  onOpenChat: () => void;
}

export default function Navigation({
  darkMode,
  setDarkMode,
  activeSection,
  setActiveSection,
  onOpenChat,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "about", label: "About & Skills" },
    { id: "projects", label: "Projects" },
    { id: "blog", label: "Articles" },
    { id: "analytics", label: "Live Stats" },
  ];

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);

    // Scroll to the active section
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 10);

    // Track analytics event on the server
    fetch("/api/system-stats/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "page_view",
        page: sectionId,
      }),
    }).catch((e) => console.error("Tracking error:", e));
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-white/10 dark:bg-sophisticated-bg/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick("about")}
          className="group flex cursor-pointer items-center space-x-2"
        >
          <span className="font-serif text-xl font-bold italic tracking-tight text-neutral-900 dark:text-white">
            sameera.dev
          </span>
          <span className="hidden text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-sophisticated-muted sm:inline-block">
            / portfolios
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center space-x-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-3.5 py-2 text-[11px] uppercase tracking-[0.15em] font-medium transition-all duration-200 ${
                activeSection === item.id
                  ? "text-neutral-900 border-b-2 border-neutral-900 dark:text-white dark:border-white"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right Side Controls */}
        <div className="hidden items-center space-x-3 md:flex">
          {/* AI Chat CTA */}
          <button
            onClick={onOpenChat}
            className="flex items-center space-x-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] font-semibold text-neutral-700 hover:bg-neutral-100 transition dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
          >
            <MessageSquare className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-300" />
            <span>AI Assistant</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5 transition-colors"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Download Resume Button */}
          <button
            onClick={() => {
              import("../pdfGenerator").then((mod) => mod.generateResumePDF());
              fetch("/api/system-stats/event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "btn_click", element: "download_cv" }),
              }).catch((e) => console.error("Tracking error:", e));
            }}
            className="flex cursor-pointer items-center space-x-1.5 rounded-lg border border-neutral-950 bg-neutral-950 px-4 py-2 text-[11px] uppercase tracking-[0.1em] font-semibold text-white shadow-sm hover:bg-neutral-800 transition dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download CV</span>
          </button>
        </div>

        {/* Mobile menu and controls */}
        <div className="flex items-center space-x-2 md:hidden">
          {/* Theme toggle mobile */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-lg p-2 text-neutral-500 dark:text-neutral-400 transition"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* AI Chat mobile CTA */}
          <button
            onClick={onOpenChat}
            className="rounded-lg p-2 text-neutral-500 dark:text-neutral-400 transition"
          >
            <MessageSquare className="h-4 w-4" />
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5 transition"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-neutral-100 bg-white px-4 py-3 shadow-lg transition-colors duration-300 dark:border-white/10 dark:bg-sophisticated-bg md:hidden">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs uppercase tracking-wider font-semibold transition ${
                  activeSection === item.id
                    ? "bg-neutral-100 text-neutral-900 dark:bg-white/5 dark:text-white"
                    : "text-neutral-600 dark:text-zinc-400"
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}

            {/* Mobile CTAs */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-100 dark:border-white/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenChat();
                }}
                className="flex items-center justify-center space-x-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[11px] uppercase tracking-wider font-semibold text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>AI Agent</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  import("../pdfGenerator").then((mod) => mod.generateResumePDF());
                  fetch("/api/system-stats/event", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "btn_click", element: "download_cv_mobile" }),
                  }).catch((e) => console.error("Tracking error:", e));
                }}
                className="flex cursor-pointer items-center justify-center space-x-1.5 rounded-lg bg-neutral-950 text-white px-3 py-2.5 text-[11px] uppercase tracking-wider font-semibold dark:bg-white dark:text-neutral-950"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Get CV</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
