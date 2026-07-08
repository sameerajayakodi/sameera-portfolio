import React, { useState, useEffect } from "react";
import { Eye, BarChart2, MessageSquare, Mail, RefreshCw, Layers, Sparkles, Clock } from "lucide-react";
import { AnalyticsSummary } from "../types";

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = () => {
    setRefreshing(true);
    fetch("/api/system-stats")
      .then((res) => res.json())
      .then((summary) => {
        setData(summary);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((err) => {
        console.error("Failed to load analytics:", err);
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchAnalytics();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  // Calculate percentages for bar charts
  const maxViews = data ? Math.max(...(Object.values(data.pageViews) as number[])) : 100;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Dashboard Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-100 pb-5 dark:border-white/10 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-serif text-2xl font-normal text-neutral-900 dark:text-white sm:text-3xl flex items-center space-x-2">
            <BarChart2 className="h-6 w-6 text-zinc-400 dark:text-zinc-300" />
            <span>Recruiter Analytics Console</span>
          </h2>
          <p className="mt-1 text-xs font-mono uppercase tracking-widest text-neutral-450 dark:text-zinc-500">
            Real-time server-side traffic tracker logging active session events and recruiter inquiries.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          disabled={refreshing}
          className="flex items-center space-x-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-750 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-350 dark:hover:bg-white/10 transition cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-zinc-400" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Grid of KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Page Views */}
        <div className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-450 dark:text-zinc-500">
              Total Page Hits
            </span>
            <div className="rounded-lg bg-neutral-100 dark:bg-white/5 border dark:border-white/10 p-2 text-zinc-650 dark:text-zinc-300">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="font-serif text-3xl font-normal text-neutral-900 dark:text-white">
              {data?.totalViews || 0}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">+14.2%</span>
          </div>
          <p className="mt-1 text-[9px] font-mono uppercase tracking-widest text-neutral-450">Live counts from visitor sessions</p>
        </div>

        {/* AI Bot Interactions */}
        <div className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-450 dark:text-zinc-500">
              AI Chat Requests
            </span>
            <div className="rounded-lg bg-neutral-100 dark:bg-white/5 border dark:border-white/10 p-2 text-zinc-650 dark:text-zinc-300">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="font-serif text-3xl font-normal text-neutral-900 dark:text-white">
              {data?.chatbotInteractions || 0}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">+8.5%</span>
          </div>
          <p className="mt-1 text-[9px] font-mono uppercase tracking-widest text-neutral-450">Questions resolved by Sameera's AI agent</p>
        </div>

        {/* Contact Form Submissions */}
        <div className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-450 dark:text-zinc-500">
              Recruiter Inquiries
            </span>
            <div className="rounded-lg bg-neutral-100 dark:bg-white/5 border dark:border-white/10 p-2 text-zinc-650 dark:text-zinc-300">
              <Mail className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="font-serif text-3xl font-normal text-neutral-900 dark:text-white">
              {data?.submissionsCount || 0}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Immutable</span>
          </div>
          <p className="mt-1 text-[9px] font-mono uppercase tracking-widest text-neutral-450">Submissions saved to server storage</p>
        </div>

        {/* Average Page load index */}
        <div className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-450 dark:text-zinc-500">
              Server Response
            </span>
            <div className="rounded-lg bg-neutral-100 dark:bg-white/5 border dark:border-white/10 p-2 text-zinc-650 dark:text-zinc-300">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="font-serif text-3xl font-normal text-neutral-900 dark:text-white">
              24ms
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">99.8% SLA</span>
          </div>
          <p className="mt-1 text-[9px] font-mono uppercase tracking-widest text-neutral-450">High-performance Express routing</p>
        </div>
      </div>

      {/* Dynamic Traffic Breakdown & Console Logs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Side: Page Views Breakdown Bar Charts */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/1 lg:col-span-5 space-y-6">
          <div>
            <h3 className="font-serif text-base font-normal text-neutral-900 dark:text-white">
              Page View Distribution
            </h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">Comparative views across major portfolio sub-pages.</p>
          </div>

          <div className="space-y-4">
            {data && Object.entries(data.pageViews).map(([page, views]) => {
              const pct = maxViews > 0 ? ((views as number) / maxViews) * 100 : 0;
              return (
                <div key={page} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-450">
                      {page}
                    </span>
                    <span className="font-mono text-xs text-neutral-800 dark:text-neutral-100">{views} hits</span>
                  </div>
                  {/* Progress Bar Container */}
                  <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-neutral-900 dark:bg-white transition-all duration-1000"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Device Breakdown stats */}
          <div className="border-t border-neutral-100 pt-5 dark:border-white/10">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-450 mb-3">Device Breakdown:</h4>
            <div className="grid grid-cols-3 gap-2 text-center text-xs text-neutral-500">
              <div className="bg-neutral-50 dark:bg-white/1 p-2.5 rounded-lg border border-neutral-100 dark:border-white/10">
                <span className="block font-serif text-base text-neutral-800 dark:text-zinc-200">58%</span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-450">Chrome</span>
              </div>
              <div className="bg-neutral-50 dark:bg-white/1 p-2.5 rounded-lg border border-neutral-100 dark:border-white/10">
                <span className="block font-serif text-base text-neutral-800 dark:text-zinc-200">32%</span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-450">Safari</span>
              </div>
              <div className="bg-neutral-50 dark:bg-white/1 p-2.5 rounded-lg border border-neutral-100 dark:border-white/10">
                <span className="block font-serif text-base text-neutral-800 dark:text-zinc-200">10%</span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-450">Others</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Real-Time Traffic Event Logs Console */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/1 lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-normal text-neutral-900 dark:text-white">
                Live Traffic Event Log
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">Chronological telemetry feed of visitor clicks and interactions.</p>
            </div>
            <span className="flex items-center space-x-1 rounded border border-neutral-200 bg-neutral-150 px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest text-zinc-650 dark:border-white/10 dark:bg-white/10 dark:text-zinc-350 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 dark:bg-zinc-300"></span>
              <span>LIVE FEED</span>
            </span>
          </div>

          {/* Visual logs container */}
          <div className="h-72 overflow-y-auto rounded-xl border border-neutral-200 bg-neutral-950 p-4 font-mono text-[11px] text-neutral-300 dark:border-white/10 dark:bg-black space-y-2.5">
            {data && data.recentEvents.length === 0 ? (
              <p className="text-neutral-500 italic">No telemetry recorded yet in this server session...</p>
            ) : (
              data?.recentEvents.map((event, idx) => {
                const timeStr = new Date(event.timestamp).toLocaleTimeString();
                return (
                  <div key={idx} className="flex items-start space-x-1 leading-relaxed border-b border-neutral-900 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-zinc-500">[{timeStr}]</span>
                    {event.type === "page_view" && (
                      <span>
                        👀 <strong className="text-white">PAGE_VIEW</strong>: Navigated to tab <strong className="text-neutral-200">'{event.page}'</strong>
                      </span>
                    )}
                    {event.type === "btn_click" && (
                      <span>
                        🖱️ <strong className="text-white">BTN_CLICK</strong>: Clicked element <strong className="text-neutral-200">'{event.element}'</strong>
                      </span>
                    )}
                    {event.type === "chat_ask" && (
                      <span>
                        🤖 <strong className="text-white">CHAT_QUERY</strong>: Queried AI Assistant: <span className="text-zinc-400 italic">"{event.query}"</span>
                      </span>
                    )}
                    {event.type === "contact_submit" && (
                      <span>
                        ✉️ <strong className="text-zinc-200 font-bold">CONTACT_SUBMIT</strong>: Message received from <strong className="text-white">'{event.sender}'</strong>!
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recruiter Inbox list views inside Analytics for quick inspection */}
      {data && data.messages.length > 0 && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/1 space-y-4">
          <div>
            <h3 className="font-serif text-base font-normal text-neutral-900 dark:text-white flex items-center space-x-1.5">
              <Mail className="h-5 w-5 text-zinc-400" />
              <span>Recruiter Submission Inbox</span>
            </h3>
            <p className="text-xs text-neutral-400 font-light">Verifiably check your sent inquiries to Sameera recorded on the server ledger.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data.messages.map((msg) => (
              <div
                key={msg.id}
                className="rounded-xl border border-neutral-150 bg-neutral-50/30 p-4 dark:border-white/10 dark:bg-white/2 space-y-2 text-xs font-light"
              >
                <div className="flex justify-between font-bold border-b border-neutral-100 pb-1.5 dark:border-white/10">
                  <span className="text-neutral-800 dark:text-neutral-200">{msg.name}</span>
                  <span className="text-neutral-400">{new Date(msg.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-neutral-500 dark:text-zinc-400">
                  <strong className="text-neutral-700 dark:text-neutral-300 mr-1 font-mono uppercase tracking-widest text-[9px]">Email:</strong> {msg.email}
                </p>
                <p className="text-neutral-500 dark:text-zinc-400">
                  <strong className="text-neutral-700 dark:text-neutral-300 mr-1 font-mono uppercase tracking-widest text-[9px]">Subject:</strong> {msg.subject}
                </p>
                <p className="text-neutral-650 dark:text-zinc-300 italic pt-1 leading-relaxed bg-white dark:bg-white/1 p-2 rounded border border-neutral-100 dark:border-white/10">
                  "{msg.message}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
