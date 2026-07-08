import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import multer from "multer";

const app = express();

app.use(express.json());

// Use /tmp for writable storage on Vercel (serverless is read-only except /tmp)
const DATA_DIR = path.join("/tmp", "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
const ANALYTICS_FILE = path.join(DATA_DIR, "analytics.json");
const ARTICLES_FILE = path.join(DATA_DIR, "articles.json");

const UPLOADS_DIR = path.join("/tmp", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    if (file.fieldname === "cv") {
      cb(null, "cv.pdf");
    } else {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  },
});
const upload = multer({ storage });
app.use("/uploads", express.static(UPLOADS_DIR));

// Seed default data files if they don't exist (serverless cold start)
if (!fs.existsSync(MESSAGES_FILE)) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(ARTICLES_FILE)) {
  fs.writeFileSync(ARTICLES_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(ANALYTICS_FILE)) {
  const initialAnalytics = {
    totalViews: 412,
    pageViews: {
      home: 185,
      projects: 114,
      blog: 68,
      analytics: 45,
    },
    chatbotInteractions: 34,
    submissionsCount: 2,
    events: [
      { type: "page_view", page: "home", timestamp: new Date(Date.now() - 3600000 * 24).toISOString() },
      { type: "page_view", page: "projects", timestamp: new Date(Date.now() - 3600000 * 20).toISOString() },
    ],
  };
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(initialAnalytics, null, 2));
}

// Lazy Gemini API Client Initialization
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// Resume system prompt
const RESUME_SYSTEM_INSTRUCTION = `
You are Sameera's AI Portfolio Assistant, an interactive chatbot on Sameera Jayakodi's professional portfolio website.
Your job is to answer questions from recruiters, hiring managers, and visitors about Sameera's professional background, experience, skills, and projects in a warm, helpful, professional, and slightly enthusiastic tone.
You represent Sameera, so you speak as his loyal, informative AI delegate.

Here is Sameera's core resume profile data:
Name: Sameera Jayakodi
Role: Associate Software Engineer
Email: sameerajayakodi456@gmail.com
Phone: +94 770309842
Location: Homagama, Sri Lanka
GitHub: github.com/sameerajayakodi
LinkedIn: linkedin.com/sameera-jayakodi

Core Bio:
Full-Stack Software Engineer with 1 year of hands-on experience delivering production web and mobile applications end-to-end from requirement gathering and system design through development, deployment, and support. Built and shipped five+ systems spanning fleet management, compliance, e-learning, HR, and bidding domains using React, Node.js, Spring Boot, and both relational and NoSQL databases. Extended into AI/automation with secured MCP server integrations, an AI-driven WhatsApp CRM, and a no-code chatbot flow builder. Comfortable with AWS, Docker, and Linux-based deployment. Thrives in agile teams and client-facing delivery.

Experience:
1. Adeona Technologies (Pvt) Ltd (Aug 2025 - Present)
   - Software Engineer (Trainee) [Feb 2026 - Present]
   - Full-Stack Developer Intern [Aug 2025 - Feb 2026]
   Contributions:
   - Delivered full-stack features across five production systems (fleet management, compliance, e-learning, HR, bidding) supporting teams of 15-20 users each, from requirement gathering through deployment and support.
   - Implemented secure authentication and role-based access control across 4 user roles, plus PDPA-aligned data handling for HR platforms covering 100+ employee records.
   - Built 30+ REST API endpoints across React/Node.js and Spring Boot, working with MySQL, SQL Server, and MongoDB; containerized with Docker and deployed to AWS EC2/S3 within a 6-person agile team on 2-week sprints.
   - Collaborated with QA, design, and product stakeholders through sprint ceremonies; explored AI/ML tooling (OpenCV, n8n, MCP servers) for internal automation proof-of-concepts.

Key Projects Delivered:
- Vehicle Management System: Real-time GPS tracking with live status updates across the stack.
- AdGree - Consent Management Platform: PDPA-aligned, audit-ready consent collection and storage.
- Adeona HR Management System: End-to-end leave, timesheet, and attendance modules.
- AI WhatsApp CRM - Lead Management: WhatsApp bot integration via n8n with automated lead capture and follow-up.
- MCP Server Integrations - ADA Digital Reach & Dialog eSMS: OAuth-secured servers for AI-driven messaging automation.
- No-Code Chatbot Flow Builder: Drag-and-drop tool for non-technical users to build Meta chatbot flows.
- GoviMart (Full Stack Grocery Delivery Web App): React.js, Node.js, Express.js, MongoDB, Stripe, Cloudinary, JWT, Multer.
- HireLink (Job & Skill Platform with AI integration): React, Spring Boot, MySQL, AWS, Gemini API.
- Torva (Real-World Treasure Hunt Mobile App): Flutter, Firebase, Firestore, Google Maps API, Cloud Functions.

Education:
- BSc (Hons) Computer Science at NSBM Green University (Oct 2022 - Dec 2026).
- Advanced Fullstack Developer Program at ACPT (Jun 2024 - Dec 2024).
- University of Moratuwa - Short Courses (Jun 2022 - Dec 2023).
- GCE A/L & O/L at St. Joseph's College, Bandarawela.

Guidance for answering:
- Speak as a helpful assistant of Sameera. Refer to him as "Sameera".
- Be concise, professional, clear, and highly accurate based ONLY on the provided resume details.
- Always be encouraging to prospective recruiters! Provide his email sameerajayakodi456@gmail.com or phone +94 770309842.
- Support markdown formatting in your answers.
`;

// Static blog posts
const BLOG_POSTS = [
  {
    id: "mcp-server-integrations",
    title: "Securing MCP Servers for AI-Driven Messaging Automation",
    excerpt: "Explore the architecture of Model Context Protocol (MCP) servers, OAuth security, and how we integrated ADA Digital Reach and Dialog eSMS for automated agency-wide messaging workflows.",
    category: "AI & Automation",
    readTime: "6 min read",
    date: "May 24, 2026",
    content: `### Introduction to MCP (Model Context Protocol)\nIn my recent work, I had the opportunity to explore **Model Context Protocol (MCP)**, an open standard that enables AI models to connect securely to local or remote data sources and services.\n\n### The Architecture Overview\nOur system consisted of three primary layers:\n1. **The AI Orchestrator**: The central brain (powered by Gemini/OpenAI).\n2. **The MCP Server**: A secured Node.js/TypeScript intermediary.\n3. **The Gateway APIs**: ADA Digital Reach and Dialog eSMS endpoints.\n\n### Key Takeaways\nBuilding secured MCP integrations taught me that the biggest challenge in AI automation is not writing the prompts, but establishing **safe boundaries** where AI can execute transactional tasks.`,
  },
  {
    id: "whatsapp-crm-n8n-gemini",
    title: "How I Built an AI-Driven WhatsApp CRM with n8n and Gemini",
    excerpt: "A deep dive into setting up low-code automated lead capture workflows, parsing client inquiries using LLMs, and piping leads directly into a centralized tracking platform.",
    category: "AI & Automation",
    readTime: "8 min read",
    date: "April 12, 2026",
    content: `### The Challenge\nLead generation is the lifeblood of B2C services. My goal was to build a WhatsApp-integrated CRM that automatically answers customer questions and extracts structured lead info.\n\n### Tech Stack Selection\n- **WhatsApp Cloud API**: For official messaging ingestion.\n- **n8n**: As the visual workflow orchestrator.\n- **Gemini 3.5 Flash**: For rapid intent classification.\n- **Node.js Express & MongoDB**: As our light custom CRM backend.\n\n### Impact\nThis integration reduced lead response time from **4 hours to 8 seconds** with a 35% higher conversion rate.`,
  },
  {
    id: "optimizing-gps-tracking-node",
    title: "Optimizing Real-Time GPS Tracking with WebSockets and React",
    excerpt: "How we achieved real-time vehicle GPS state propagation with minimal overhead.",
    category: "Full-Stack Development",
    readTime: "7 min read",
    date: "February 15, 2026",
    content: `### Real-Time GPS Overhead\nIn building our **Vehicle Management System**, we had a fleet of vehicles sending coordinate updates every 2 seconds.\n\n### 1. Redis Buffer & Database Write Throttling\nWe separated write paths into hot (WebSockets/Redis) and cold (MongoDB batch) paths, reducing database writes by **96.6%**.\n\n### 2. WebSocket Broadcasting with Room Subscriptions\nUsing **Socket.io's Room feature** to dynamically join and leave active tracking areas.\n\n### 3. Frontend Path Smoothing\nUsing **Linear Interpolation (LERP)** and **React.memo** for smooth 60fps marker animations.`,
  },
];

// Helper functions
function getAnalyticsData() {
  try {
    return JSON.parse(fs.readFileSync(ANALYTICS_FILE, "utf-8"));
  } catch {
    return { totalViews: 0, pageViews: {}, chatbotInteractions: 0, submissionsCount: 0, events: [] };
  }
}

function saveAnalyticsData(data: any) {
  try {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Failed to save analytics", e);
  }
}

function getArticles() {
  if (fs.existsSync(ARTICLES_FILE)) {
    return JSON.parse(fs.readFileSync(ARTICLES_FILE, "utf-8"));
  }
  return [];
}

function saveArticles(data: any) {
  fs.writeFileSync(ARTICLES_FILE, JSON.stringify(data, null, 2));
}

// ── API Routes ──

app.get("/api/blog", (req, res) => {
  const dynamicArticles = getArticles().filter((a: any) => a.published);
  const combined = [...dynamicArticles, ...BLOG_POSTS];
  res.json(combined);
});

app.post("/api/contact", (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email and message are required fields." });
    }
    const newMessage = {
      id: "msg_" + Date.now(),
      name,
      email,
      subject: subject || "No Subject",
      message,
      timestamp: new Date().toISOString(),
    };
    const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8"));
    messages.push(newMessage);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));

    const analytics = getAnalyticsData();
    analytics.submissionsCount = (analytics.submissionsCount || 0) + 1;
    analytics.events.push({ type: "contact_submit", sender: name, timestamp: new Date().toISOString() });
    saveAnalyticsData(analytics);

    res.status(201).json({ success: true, message: "Thank you! Sameera's team has received your message.", data: newMessage });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/contact/messages", (req, res) => {
  try {
    const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8"));
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/system-stats/event", (req, res) => {
  try {
    const { type, page, element, payload } = req.body;
    const analytics = getAnalyticsData();
    analytics.totalViews = (analytics.totalViews || 0) + 1;
    if (type === "page_view" && page) {
      if (!analytics.pageViews) analytics.pageViews = {};
      analytics.pageViews[page] = (analytics.pageViews[page] || 0) + 1;
    }
    if (type === "chat_ask") {
      analytics.chatbotInteractions = (analytics.chatbotInteractions || 0) + 1;
    }
    analytics.events.push({
      type: type || "custom_event",
      page: page || "",
      element: element || "",
      payload: payload || {},
      timestamp: new Date().toISOString(),
    });
    if (analytics.events.length > 200) {
      analytics.events = analytics.events.slice(-200);
    }
    saveAnalyticsData(analytics);
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/system-stats", (req, res) => {
  try {
    const analytics = getAnalyticsData();
    const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8"));
    res.json({
      totalViews: analytics.totalViews,
      pageViews: analytics.pageViews,
      chatbotInteractions: analytics.chatbotInteractions,
      submissionsCount: messages.length,
      recentEvents: analytics.events.slice(-15).reverse(),
      messages: messages.slice(-10).reverse(),
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/admin/cv/upload", upload.single("cv"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    res.json({ message: "CV uploaded successfully", path: `/uploads/cv.pdf` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/articles", (req, res) => {
  res.json(getArticles());
});

app.post("/api/admin/articles", (req, res) => {
  try {
    const articles = getArticles();
    const newArticle = {
      id: Date.now().toString(),
      title: req.body.title,
      category: req.body.category || "General",
      readTime: req.body.readTime || "5 min read",
      excerpt: req.body.excerpt || "",
      content: req.body.content,
      date: new Date().toISOString().split("T")[0],
      published: req.body.published || false,
    };
    articles.push(newArticle);
    saveArticles(articles);
    res.json(newArticle);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/articles/:id", (req, res) => {
  try {
    const articles = getArticles();
    const index = articles.findIndex((a: any) => a.id === req.params.id);
    if (index !== -1) {
      articles[index] = { ...articles[index], ...req.body };
      saveArticles(articles);
      res.json(articles[index]);
    } else {
      res.status(404).json({ error: "Article not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/articles/:id", (req, res) => {
  try {
    let articles = getArticles();
    articles = articles.filter((a: any) => a.id !== req.params.id);
    saveArticles(articles);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ── Rate Limiter ──
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string, maxRequests: number, windowMs: number): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (rateLimitMap.size > 500) {
    for (const [k, val] of rateLimitMap) {
      if (now > val.resetAt) rateLimitMap.delete(k);
    }
  }

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (entry.count >= maxRequests) {
    const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfterSec };
  }

  entry.count++;
  return { allowed: true, retryAfterSec: 0 };
}

app.post("/api/chat", async (req, res) => {
  const clientIp = req.ip || req.socket.remoteAddress || "unknown";
  const { allowed, retryAfterSec } = checkRateLimit(`chat:${clientIp}`, 10, 60_000);
  if (!allowed) {
    return res.status(429).json({
      error: "rate_limit",
      message: `You're sending messages too quickly. Please wait ${retryAfterSec} seconds before trying again.`,
      retryAfterSec,
    });
  }
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    let ai;
    try {
      ai = getGeminiClient();
    } catch {
      return res.json({
        text: `**System Notice:** Sameera's AI Assistant is currently in demo mode. The Gemini API key has not been configured yet.\n\n*Temporary Offline Answer:* Sameera Jayakodi is an **Associate Software Engineer** expert in **React.js, Node.js, Spring Boot, MySQL, MongoDB, AWS**. Reach him at **sameerajayakodi456@gmail.com**!`,
        isDemo: true,
      });
    }

    const analytics = getAnalyticsData();
    analytics.chatbotInteractions = (analytics.chatbotInteractions || 0) + 1;
    analytics.events.push({ type: "chat_ask", query: message.slice(0, 50), timestamp: new Date().toISOString() });
    saveAnalyticsData(analytics);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: "Hello! Set up your personality as Sameera's Assistant." }] },
        { role: "model", parts: [{ text: "Understood. I am Sameera's loyal AI delegate." }] },
        ...(history || []).map((msg: any) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        })),
        { role: "user", parts: [{ text: message }] },
      ],
      config: {
        systemInstruction: RESUME_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API call failed:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/simulate-node", async (req, res) => {
  const clientIp = req.ip || req.socket.remoteAddress || "unknown";
  const { allowed, retryAfterSec } = checkRateLimit(`sim:${clientIp}`, 5, 60_000);
  if (!allowed) {
    return res.status(429).json({
      error: "rate_limit",
      message: `Rate limit exceeded. Please wait ${retryAfterSec} seconds.`,
      retryAfterSec,
    });
  }
  try {
    const { prompt, input } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    let ai;
    try {
      ai = getGeminiClient();
    } catch {
      return res.json({ text: `demo_result_hire` });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: `System Instruction: ${prompt}\n\nCustomer Input: "${input}"\n\nProvide ONLY the evaluated intent or extracted answer, no extra text.` }] },
      ],
      config: { temperature: 0.1 },
    });

    res.json({ text: response.text?.trim() || "unknown" });
  } catch (error: any) {
    console.error("Simulation API call failed:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/resume/check", (req, res) => {
  const cvPath = path.join(UPLOADS_DIR, "cv.pdf");
  res.json({ exists: fs.existsSync(cvPath) });
});

app.get("/api/resume/download", (req, res) => {
  const cvPath = path.join(UPLOADS_DIR, "cv.pdf");
  if (fs.existsSync(cvPath)) {
    return res.download(cvPath, "Sameera_Jayakodi_Resume.pdf");
  }
  const resumeText = `
==================================================================
SAMEERA JAYAKODI - ASSOCIATE SOFTWARE ENGINEER RESUME
==================================================================
Location: Homagama, Sri Lanka
Email: sameerajayakodi456@gmail.com
Phone: +94 770309842
LinkedIn: linkedin.com/sameera-jayakodi
GitHub: github.com/sameerajayakodi

PROFESSIONAL SUMMARY
Full-Stack Software Engineer with 1 year of hands-on experience delivering
production web and mobile applications end-to-end.

AREAS OF EXPERTISE
* Languages: JavaScript, Java, Python, SQL, Dart
* Frontend: React.js, React Native, Flutter, HTML/CSS, Tailwind CSS
* Backend: Node.js, Express.js, Spring Boot, ASP.NET, PHP
* Databases: MySQL, MongoDB, SQL Server
* Cloud/DevOps: AWS (EC2, S3), Docker, Linux, Git, CI/CD
* AI/ML: OpenCV, Gemini API, n8n, MCP Servers
==================================================================
`;
  res.setHeader("Content-Disposition", "attachment; filename=Sameera_Jayakodi_Resume.txt");
  res.setHeader("Content-Type", "text/plain");
  res.send(resumeText);
});

// Export for Vercel serverless
export default app;
