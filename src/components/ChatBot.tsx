import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Sparkles, User, Bot, RefreshCw, Zap, Code, GraduationCap, Mail } from "lucide-react";
import { ChatMessage } from "../types";

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Renders inline markdown: **bold**, `code`, and strip leading `- ` for bullet content */
function renderInlineMarkdown(text: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  // Split by bold and code patterns
  const pattern = /(\*\*.*?\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    // Push text before the match
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }
    const segment = match[0];
    if (segment.startsWith("**") && segment.endsWith("**")) {
      tokens.push(
        <strong key={match.index} className="font-semibold text-neutral-900 dark:text-neutral-50">
          {segment.slice(2, -2)}
        </strong>
      );
    } else if (segment.startsWith("`") && segment.endsWith("`")) {
      tokens.push(
        <code
          key={match.index}
          className="rounded bg-emerald-50 px-1 py-0.5 text-[10px] font-mono text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          {segment.slice(1, -1)}
        </code>
      );
    }
    lastIndex = match.index + segment.length;
  }
  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }
  return tokens;
}

/** Renders a full message text block with markdown support: headings, bullets, bold, code */
function MessageContent({ text, role }: { text: string; role: "user" | "model" }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1">
      {lines.map((line, k) => {
        // Heading ### support
        if (line.trim().startsWith("### ")) {
          return (
            <h4
              key={k}
              className="pt-1.5 pb-0.5 text-[11px] font-bold tracking-wide text-neutral-800 dark:text-neutral-100"
            >
              {renderInlineMarkdown(line.trim().slice(4))}
            </h4>
          );
        }
        // Bullet points
        if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
          const bulletContent = line.trim().slice(2);
          return (
            <div key={k} className="flex items-start gap-1.5 pl-1 py-0.5">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
              <span>{renderInlineMarkdown(bulletContent)}</span>
            </div>
          );
        }
        // Numbered lists
        if (/^\d+\.\s/.test(line.trim())) {
          const numMatch = line.trim().match(/^(\d+)\.\s(.*)/);
          if (numMatch) {
            return (
              <div key={k} className="flex items-start gap-1.5 pl-1 py-0.5">
                <span className="mt-0.5 shrink-0 text-[9px] font-bold text-emerald-500 min-w-[14px]">
                  {numMatch[1]}.
                </span>
                <span>{renderInlineMarkdown(numMatch[2])}</span>
              </div>
            );
          }
        }
        // Empty lines as spacers
        if (line.trim() === "") {
          return <div key={k} className="h-1" />;
        }
        // Regular paragraph
        return <p key={k}>{renderInlineMarkdown(line)}</p>;
      })}
    </div>
  );
}

const SUGGESTED_QUESTIONS = [
  { icon: <Zap className="h-3 w-3" />, text: "What databases does Sameera know?" },
  { icon: <Code className="h-3 w-3" />, text: "Tell me about GoviMart e-commerce app" },
  { icon: <GraduationCap className="h-3 w-3" />, text: "Explain Sameera's n8n and AI experience" },
  { icon: <Mail className="h-3 w-3" />, text: "How can I hire or contact Sameera?" },
];

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "model",
  text: "Hello! I'm Sameera's custom **AI Portfolio Assistant**. 🤖 I have his full resume loaded in my context.\n\nYou can ask me about his:\n- **Technical Skills & Stack**\n- **Production Projects** (GoviMart, HireLink, Torva, MCP integrations)\n- **Education & Work Experience**\n\nHow can I help you in your recruiting or evaluation process today?",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

export default function ChatBot({ isOpen, onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input after panel opens
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [messages, isOpen, isTyping, scrollToBottom]);

  const handleSend = useCallback(
    (textToSend: string) => {
      if (!textToSend.trim() || isTyping) return;

      const userMsg: ChatMessage = {
        id: "msg_" + Date.now(),
        role: "user",
        text: textToSend,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      const historyPayload = messages.slice(1).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("API call failed");
          return res.json();
        })
        .then((data) => {
          const modelMsg: ChatMessage = {
            id: "reply_" + Date.now(),
            role: "model",
            text:
              data.text ||
              "I apologize, I didn't receive a valid answer. Let me know if I can answer anything else!",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setMessages((prev) => [...prev, modelMsg]);
          setIsTyping(false);
        })
        .catch((err) => {
          console.error("AI Assistant Error:", err);
          const errorMsg: ChatMessage = {
            id: "err_" + Date.now(),
            role: "model",
            text: "⚠️ **Connection Notice:** It looks like there was a momentary glitch connecting to Sameera's AI node. Please try again!\n\n*(Check if your internet is stable, or ensure a valid GEMINI_API_KEY is configured inside Settings > Secrets in AI Studio!)*",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setMessages((prev) => [...prev, errorMsg]);
          setIsTyping(false);
        });
    },
    [isTyping, messages]
  );

  const handleReset = useCallback(() => {
    setMessages([
      {
        ...WELCOME_MESSAGE,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, []);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 250);
  }, [onClose]);

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-3xl border shadow-2xl
        w-full max-w-[420px] h-[600px]
        border-neutral-200/60 bg-white/95 backdrop-blur-xl
        dark:border-neutral-800/60 dark:bg-neutral-950/95
        ${isClosing ? "animate-chatClose" : "animate-chatOpen"}
      `}
      id="ai-assistant-panel"
    >
      {/* ── Header ── */}
      <div className="relative flex items-center justify-between px-5 py-4 text-white overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 dark:from-emerald-800 dark:via-emerald-700 dark:to-teal-700">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 chat-header-shimmer animate-shimmer pointer-events-none" />

        <div className="relative flex items-center gap-3">
          <div className="rounded-xl bg-white/15 p-2 backdrop-blur-sm">
            <Sparkles className="h-5 w-5 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold leading-tight tracking-tight">AI Assistant</h2>
              {/* Online dot */}
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-200 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-100" />
              </span>
            </div>
            <p className="text-[10px] font-medium text-emerald-100/80 tracking-wide">
              Sameera's Portfolio Delegate
            </p>
          </div>
        </div>

        <div className="relative flex items-center gap-1">
          <button
            onClick={handleReset}
            className="rounded-lg p-2 text-emerald-100 hover:bg-white/15 hover:text-white transition-all duration-200"
            title="Reset Chat history"
            aria-label="Reset chat"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-emerald-100 hover:bg-white/15 hover:text-white transition-all duration-200"
            title="Close Assistant"
            aria-label="Close assistant"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="chat-scrollbar flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-neutral-50/80 to-white dark:from-neutral-900/30 dark:to-neutral-950/50">
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className="animate-slideInMessage"
            style={{ animationDelay: index === 0 ? "0ms" : `${Math.min(index * 50, 200)}ms` }}
          >
            <div
              className={`flex items-start gap-2.5 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`shrink-0 rounded-xl p-1.5 shadow-sm ${
                  msg.role === "user"
                    ? "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                    : "bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 dark:from-emerald-950/50 dark:to-teal-950/50 dark:text-emerald-400"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="h-3.5 w-3.5" />
                ) : (
                  <Bot className="h-3.5 w-3.5" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "rounded-tr-sm bg-gradient-to-br from-emerald-600 to-emerald-500 text-white dark:from-emerald-600 dark:to-teal-600"
                    : "rounded-tl-sm border-l-2 border-emerald-400/40 bg-white text-neutral-700 shadow-[0_1px_4px_rgba(0,0,0,0.04)] dark:bg-neutral-900/80 dark:text-neutral-300 dark:border-emerald-500/30 dark:shadow-[0_1px_4px_rgba(0,0,0,0.2)] dark:backdrop-blur-sm"
                }`}
              >
                <MessageContent text={msg.text} role={msg.role} />
                <span
                  className={`mt-1.5 block text-[9px] text-right ${
                    msg.role === "user" ? "text-emerald-200/70" : "text-neutral-400/70"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="animate-slideInMessage">
            <div className="flex items-start gap-2.5">
              <div className="shrink-0 rounded-xl p-1.5 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 shadow-sm dark:from-emerald-950/50 dark:to-teal-950/50 dark:text-emerald-400">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div className="animate-pulseGlow rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm dark:bg-neutral-900/80 dark:backdrop-blur-sm dark:border dark:border-neutral-800/50">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
                    Thinking
                  </span>
                  <div className="flex items-center gap-0.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-neutral-100/80 bg-white/90 px-4 py-3 backdrop-blur-sm dark:border-neutral-800/50 dark:bg-neutral-950/90">
        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q.text)}
                className="animate-chipSlideIn flex items-center gap-1 rounded-full border border-neutral-200/80 bg-neutral-50/80 px-2.5 py-1.5 text-[10px] font-medium text-neutral-600 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50/60 hover:text-emerald-700 hover:shadow-sm hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
                style={{ animationDelay: `${i * 80 + 200}ms` }}
              >
                <span className="text-emerald-500 dark:text-emerald-400">{q.icon}</span>
                {q.text}
              </button>
            ))}
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Sameera's skills..."
              disabled={isTyping}
              className="w-full rounded-xl border border-neutral-200/80 bg-neutral-50/60 px-4 py-2.5 text-xs placeholder:text-neutral-400 transition-all duration-200
                focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10
                dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-200 dark:placeholder:text-neutral-600
                dark:focus:border-emerald-600 dark:focus:bg-neutral-900 dark:focus:ring-emerald-500/10
                disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Chat message input"
            />
            {/* Character count */}
            {input.length > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-neutral-300 dark:text-neutral-600 tabular-nums">
                {input.length}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="group shrink-0 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 p-2.5 text-white shadow-sm transition-all duration-200 hover:shadow-md hover:from-emerald-500 hover:to-teal-400 disabled:opacity-30 disabled:cursor-not-allowed dark:from-emerald-600 dark:to-teal-600"
            aria-label="Send message"
          >
            <Send className="h-4 w-4 transition-transform duration-200 group-hover:rotate-[-12deg] group-hover:scale-110" />
          </button>
        </form>

        {/* Keyboard shortcut hint */}
        <p className="mt-1.5 text-center text-[8px] text-neutral-300 dark:text-neutral-700">
          Press <kbd className="rounded border border-neutral-200 px-1 py-0.5 font-mono dark:border-neutral-800">Enter</kbd> to send · <kbd className="rounded border border-neutral-200 px-1 py-0.5 font-mono dark:border-neutral-800">Esc</kbd> to close
        </p>
      </div>
    </div>
  );
}
