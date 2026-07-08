import React, { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import AboutAndSkills from "./components/AboutAndSkills";
import Projects from "./components/Projects";
import Blog from "./components/Blog";
import ContactForm from "./components/ContactForm";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import ChatBot from "./components/ChatBot";
import AdminDashboard from "./components/AdminDashboard";
import { MessageSquare, ArrowUp, Sparkles } from "lucide-react";

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("theme");
      if (savedMode) return savedMode === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const [activeSection, setActiveSection] = useState<string>("about");

  useEffect(() => {
    let title = "Sameera Jayakodi | Portfolio";
    let description = "Sameera Jayakodi is an Associate Software Engineer specializing in React, Node.js, Spring Boot, and Full-Stack Development.";

    switch (activeSection) {
      case "about":
        title = "About | Sameera Jayakodi";
        description = "Learn more about Sameera Jayakodi, an Associate Software Engineer based in Sri Lanka, skilled in modern web and mobile development.";
        break;
      case "projects":
        title = "Projects | Sameera Jayakodi";
        description = "Explore the full-stack web and mobile applications developed by Sameera, including real-world tools, e-learning platforms, and AI integrations.";
        break;
      case "blog":
        title = "Blog | Sameera Jayakodi";
        description = "Technical articles and insights on software architecture, automation, and full-stack performance solutions written by Sameera Jayakodi.";
        break;
      case "analytics":
        title = "Analytics Dashboard | Sameera Jayakodi";
        description = "Live portfolio tracking and interactions dashboard for Sameera's portfolio website.";
        break;
    }

    document.title = title;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      metaDescription.setAttribute("content", description);
      document.head.appendChild(metaDescription);
    }
  }, [activeSection]);

  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        setIsChatOpen(true);
      } else if (e.key === "Escape") {
        setIsChatOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (window.location.pathname === "/admin") {
    return <AdminDashboard darkMode={darkMode} setDarkMode={setDarkMode} />;
  }

  // Initial event tracker on first boot
  useEffect(() => {
    // Record home page entry view on server
    fetch("/api/system-stats/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "page_view",
        page: "home",
      }),
    }).catch((err) => console.error("Initial analytics load failed:", err));

    // Listen to scroll events to show/hide go-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);

    // Intersection Observer to update active navigation item
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Timeout allows DOM to mount first
    setTimeout(() => {
      const sections = ['about', 'projects', 'blog', 'analytics'].map(id => document.getElementById(id)).filter(Boolean);
      sections.forEach(section => observer.observe(section as Element));
    }, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="min-h-screen bg-neutral-50 text-neutral-900 transition-colors duration-300 dark:bg-neutral-950 dark:text-neutral-50 flex flex-col font-sans">
        {/* Navigation bar */}
        <Navigation
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onOpenChat={() => setIsChatOpen(true)}
        />

        {/* Hero Banner Section (Main introduction) */}
        <Hero
          onOpenChat={() => setIsChatOpen(true)}
          setActiveSection={setActiveSection}
        />

        {/* Main Content Area */}
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-grow w-full space-y-32">

          <div className="space-y-32 animate-fadeIn">
            <div id="about">
              <AboutAndSkills />
            </div>
            <div id="projects">
              <Projects />
            </div>
            <div id="blog">
              <Blog />
            </div>
            <div id="analytics">
              <AnalyticsDashboard />
            </div>
          </div>

          {/* Contact form (Sticky at footer area of all pages) */}
          <div id="contact" className="pt-10 border-t border-neutral-200 dark:border-neutral-900">
            <ContactForm />
          </div>
        </main>

        {/* Footer Area */}
        <footer className="border-t border-neutral-200 bg-white py-8 transition-colors dark:border-neutral-900 dark:bg-neutral-950 text-xs text-neutral-500 text-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3">
            <div className="flex justify-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Sameera Jayakodi Portfolio Node</span>
            </div>
            <p>© 2026 Sameera Jayakodi. All rights reserved.</p>
            <p className="text-[10px] text-neutral-400">
              Powered by Node Express Full-Stack, React 19, and Gemini 3.5 AI.
            </p>
          </div>
        </footer>

        {/* ChatBot Floating Panel widget */}
        <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

        {/* Floater Shortcuts on Bottom-Right */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-2">
          {/* Back to top button */}
          {showScrollTop && (
            <button
              onClick={handleScrollToTop}
              className="rounded-full bg-emerald-600 p-3 text-white shadow-lg hover:bg-emerald-500 transition hover:scale-105"
              title="Scroll to Top"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          )}

          {/* Chat shortcut button when Chat widget is hidden */}
          {!isChatOpen && (
            <div className="group relative">
              {/* Tooltip */}
              <div className="pointer-events-none absolute bottom-full right-0 mb-3 whitespace-nowrap rounded-lg bg-neutral-900 px-3 py-1.5 text-[11px] font-medium text-white shadow-xl opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1 dark:bg-neutral-100 dark:text-neutral-900">
                Ask AI about Sameera
                <span className="absolute -bottom-1 right-5 h-2 w-2 rotate-45 bg-neutral-900 dark:bg-neutral-100" />
              </div>

              {/* Pulsing ring */}
              <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-pulseRing dark:bg-emerald-400/20" />

              <button
                onClick={() => {
                  setIsChatOpen(true);
                  fetch("/api/system-stats/event", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "btn_click", element: "float_chat_btn" }),
                  }).catch((e) => console.error(e));
                }}
                className="relative rounded-full bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-4 text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-110 hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-400 dark:from-emerald-500 dark:via-emerald-600 dark:to-teal-600 flex items-center space-x-2 font-semibold text-xs animate-scaleUp"
                aria-label="Open AI assistant chat"
              >
                <MessageSquare className="h-5 w-5" />

              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
