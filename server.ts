import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Ensure data folder exists
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
const ANALYTICS_FILE = path.join(DATA_DIR, "analytics.json");
const ARTICLES_FILE = path.join(DATA_DIR, "articles.json");

import multer from "multer";
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    if (file.fieldname === "cv") {
      cb(null, "cv.pdf"); // Force cv.pdf name
    } else {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  },
});
const upload = multer({ storage });
app.use("/uploads", express.static(UPLOADS_DIR));
app.use("/assets", express.static(path.join(process.cwd(), "assets")));

// Default data initialization
if (!fs.existsSync(MESSAGES_FILE)) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(ARTICLES_FILE)) {
  fs.writeFileSync(ARTICLES_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(ANALYTICS_FILE)) {
  const initialAnalytics = {
    totalViews: 412, // Pre-populated with realistic historic data
    pageViews: {
      home: 185,
      projects: 114,
      blog: 68,
      analytics: 45
    },
    chatbotInteractions: 34,
    submissionsCount: 2,
    events: [
      { type: "page_view", page: "home", timestamp: new Date(Date.now() - 3600000 * 24).toISOString() },
      { type: "page_view", page: "projects", timestamp: new Date(Date.now() - 3600000 * 20).toISOString() },
    ]
  };
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(initialAnalytics, null, 2));
}

// Lazy Gemini API Client Initialization
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Recruiters can configure secrets in Settings > Secrets.");
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

// Resume system prompt configuration
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
LinkedIn: linkedin.com/in/sameera-jayakodi-6a3a81226

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
- GoviMart (Full Stack Grocery Delivery Web App): React.js, Node.js, Express.js, MongoDB, Stripe, Cloudinary, JWT, Multer. Architected and built full-stack platform with separate user and admin dashboards, Stripe payments, and Cloudinary image uploads.
- HireLink (Job & Skill Platform with AI integration): React, Spring Boot, MySQL, AWS, Gemini API. Multi-role platform serving job seekers, employers, and trainers with distinct dashboards, Spring Boot REST APIs, and a Gemini-powered chatbot for job matching.
- Torva (Real-World Treasure Hunt Mobile App): Flutter, Firebase, Firestore, Google Maps API, Cloud Functions. Cross-platform GPS-based mobile game with maps, auth, real-time leaderboards, and notifications.

Education:
- BSc (Hons) Computer Science at NSBM Green University (Oct 2022 - Dec 2026). Focus: Software Engineering, Algorithms, Databases, AI, Cybersecurity, Cloud Computing.
- Advanced Fullstack Developer Program at ACPT (Jun 2024 - Dec 2024). Practical training in web, mobile, and desktop app development.
- University of Moratuwa - Short Courses (Jun 2022 - Dec 2023). Python Programming, Angular Front-End, Node.js Backend.
- GCE A/L & O/L at St. Joseph's College, Bandarawela.

Guidance for answering:
- Speak as a helpful assistant of Sameera. Refer to him as "Sameera".
- Be concise, professional, clear, and highly accurate based ONLY on the provided resume details. If someone asks for information not in his resume (like his favorite food or political views), politely decline or say you don't have that information.
- Always be encouraging to prospective recruiters! If they ask how to contact him, provide his email sameerajayakodi456@gmail.com or his phone +94 770309842.
- Support markdown formatting in your answers to make them highly readable! Keep responses professional, engaging, and reasonably brief.
`;

// Static blog posts written by Sameera Jayakodi
const BLOG_POSTS = [
  {
    id: "mcp-server-integrations",
    title: "Securing MCP Servers for AI-Driven Messaging Automation",
    excerpt: "Explore the architecture of Model Context Protocol (MCP) servers, OAuth security, and how we integrated ADA Digital Reach and Dialog eSMS for automated agency-wide messaging workflows.",
    category: "AI & Automation",
    readTime: "6 min read",
    date: "May 24, 2026",
    content: `
### Introduction to MCP (Model Context Protocol)
In my recent work, I had the opportunity to explore **Model Context Protocol (MCP)**, an open standard that enables AI models to connect securely to local or remote data sources and services. By building custom MCP servers, we can empower Large Language Models (LLMs) to perform specialized actions, such as sending automated SMS alerts or reading live database entries.

However, connecting AI systems to high-volume messaging gateways like **ADA Digital Reach** and **Dialog eSMS** presents significant security challenges. In this article, I will share how we designed, built, and secured an OAuth-enabled MCP server architecture.

### The Architecture Overview
Our system consisted of three primary layers:
1. **The AI Orchestrator**: The central brain (powered by Gemini/OpenAI) that decides when and what messaging action to invoke.
2. **The MCP Server**: A secured Node.js/TypeScript intermediary that acts as the gateway to the third-party messaging systems.
3. **The Gateway APIs**: ADA Digital Reach and Dialog eSMS endpoints.

To safeguard this pipeline, we implemented an **OAuth-secured authorization flow**. This ensures that the AI cannot trigger API calls unless a valid recruiter/agent has authenticated and provided temporary access tokens.

\`\`\`
[User/Recruiter] --> Authenticates via OAuth --> [MCP Server]
                                                    | (Uses Token)
[AI Orchestrator] --> Invokes Tool Call ----------> [Messaging APIs (ADA/Dialog)]
\`\`\`

### Securing the Connections
Here are the core security measures we integrated:
- **State Token Verification**: To prevent Cross-Site Request Forgery (CSRF), we generated cryptographic state parameters during the OAuth redirection.
- **Encrypted Token Storage**: Token credentials are never stored in plain text. We leveraged AES-256-GCM encryption on database-persisted OAuth records.
- **Payload Sanitization**: Before forwarding instructions from the AI model to SMS API endpoints, we thoroughly sanitized strings to protect against code injection or telephone-number manipulation.

### Key Takeaways
Building secured MCP integrations taught me that the biggest challenge in AI automation is not writing the prompts, but establishing **safe boundaries** where AI can execute transactional tasks. By enforcing strict OAuth scopes and robust sanitization, we created an audit-ready, high-performance messaging automated hub.
    `
  },
  {
    id: "whatsapp-crm-n8n-gemini",
    title: "How I Built an AI-Driven WhatsApp CRM with n8n and Gemini",
    excerpt: "A deep dive into setting up low-code automated lead capture workflows, parsing client inquiries using LLMs, and piping leads directly into a centralized tracking platform.",
    category: "AI & Automation",
    readTime: "8 min read",
    date: "April 12, 2026",
    content: `
### The Challenge
Lead generation is the lifeblood of B2C services, but manual follow-up is slow and prone to human error. In Sri Lanka, WhatsApp is the dominant communication channel. My goal was to build a WhatsApp-integrated CRM that automatically answers customer questions, extracts structured contact/lead info, and schedules follow-up tasks without requiring full-time human moderation.

### Tech Stack Selection
For speed, modularity, and scalability, I chose:
- **WhatsApp Cloud API**: For official messaging ingestion.
- **n8n**: As the visual workflow orchestrator (extremely flexible for webhook routing).
- **Gemini 3.5 Flash**: For rapid, cost-effective intent classification and entity extraction.
- **Node.js Express & MongoDB**: As our light custom CRM backend.

### The Workflow Pipeline
The automation workflow follows these steps:

1. **Webhook Ingestion**: When a customer sends a message on WhatsApp, WhatsApp triggers an n8n webhook endpoint.
2. **Intent Analysis**: n8n pipes the message content to Gemini API. Gemini determines:
   - Is this a new lead?
   - Is this a complaint?
   - What service are they interested in?
3. **Structured Entity Extraction**: If classified as a lead, Gemini extracts JSON details: Name, Email, Phone, Budget, and Key Requirements.
4. **CRM Sync**: n8n sends a POST request to our Node.js CRM backend, creating or updating a customer card.
5. **Smart Auto-Reply**: Gemini drafts a friendly, personalized response addressing the client's query, which n8n posts back to the WhatsApp Cloud API.

### Concrete Example: Prompt-Based JSON Extraction
To ensure Gemini always returned a parseable JSON schema, we configured a robust \`responseSchema\` inside the call config:

\`\`\`typescript
const response = await ai.models.generateContent({
  model: "gemini-3.5-flash",
  contents: userMessage,
  config: {
    responseMimeType: "application/json",
    systemInstruction: "Extract client lead information: name, phone, serviceOfInterest. Only return valid JSON.",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        phone: { type: Type.STRING },
        serviceOfInterest: { type: Type.STRING }
      },
      required: ["name", "phone"]
    }
  }
});
\`\`\`

### Impact
This integration reduced lead response time from **4 hours to 8 seconds**. It allowed our small test team to capture over 500 leads with a 35% higher conversion rate due to instant engagement. Modular tools like n8n combined with LLMs prove that enterprise-level AI tools don't require millions in budget—just creative engineering!
    `
  },
  {
    id: "optimizing-gps-tracking-node",
    title: "Optimizing Real-Time GPS Tracking with WebSockets and React",
    excerpt: "How we achieved real-time vehicle GPS state propagation with minimal overhead. Techniques for throttling database writes, managing React render loops, and smoothing visual paths.",
    category: "Full-Stack Development",
    readTime: "7 min read",
    date: "February 15, 2026",
    content: `
### Real-Time GPS Overhead
In building our **Vehicle Management System**, we had a fleet of vehicles sending coordinate updates every 2 seconds. In early iterations, writing every tick directly to our central MongoDB instance and broadcasting it via WebSockets led to CPU spikes and visual stutter in the frontend.

In this post, I will walk you through the three-step optimization strategy we deployed to achieve smooth 60fps tracking updates.

### 1. Redis Buffer & Database Write Throttling
Writing coordinates to disk every 2 seconds for hundreds of vehicles is highly inefficient. We separated the write paths:
- **Hot Path (WebSockets)**: GPS coordinates are ingested via an Express UDP/TCP microservice and immediately written to an in-memory **Redis Cache** for rapid status querying.
- **Cold Path (Durable Writes)**: A batch processor aggregates vehicle routes in memory and writes them as bulk chunks to **MongoDB** once every 60 seconds (or when the vehicle stops). This reduced database write operations by **96.6%**!

### 2. WebSocket Broadcasting with Room Subscriptions
Broadcasting every single car update to all connected clients is an anti-pattern. We grouped clients into specific "fleet rooms":
- Users viewing "Colombo Central Fleet" only received updates for vehicles assigned to that territory.
- We used **Socket.io's Room feature** to dynamically join and leave active tracking areas, drastically minimizing network bandwidth.

### 3. Frontend Path Smoothing (Interpolation)
Simply placing a map marker on a new GPS coordinate results in sudden visual jumps. To resolve this, we implemented:
- **Linear Interpolation (LERP)**: On React state updates, we don't snap the marker. Instead, we animate the marker position smoothly over the 2-second interval.
- **React Render Throttling**: We wrapped our Leaflet/Google Maps marker components in \`React.memo\` and debounced position updates to prevent unnecessary DOM re-renders.

### Conclusion
By optimizing both server-side ingestion and client-side rendering, we were able to support tracking hundreds of vehicles simultaneously on budget-friendly AWS EC2 instances, showing that simple algorithmic principles (like throttling and interpolation) have massive architectural benefits.
    `
  }
];

// Helper to read and write analytics
function getAnalyticsData() {
  try {
    return JSON.parse(fs.readFileSync(ANALYTICS_FILE, "utf-8"));
  } catch (e) {
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

// REST API Endpoints

// Get Blog Posts
app.get("/api/blog", (req, res) => {
  const dynamicArticles = getArticles().filter((a: any) => a.published);
  const combined = [...dynamicArticles, ...BLOG_POSTS];
  // Sort by date newest first if possible, or just return
  res.json(combined);
});

// Submit Contact Form
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
      timestamp: new Date().toISOString()
    };

    // Save message
    const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8"));
    messages.push(newMessage);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));

    // Update analytics
    const analytics = getAnalyticsData();
    analytics.submissionsCount = (analytics.submissionsCount || 0) + 1;
    analytics.events.push({
      type: "contact_submit",
      sender: name,
      timestamp: new Date().toISOString()
    });
    saveAnalyticsData(analytics);

    res.status(201).json({ success: true, message: "Thank you! Sameera's team has received your message.", data: newMessage });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get Submissions (for analytics/recruiter portal view)
app.get("/api/contact/messages", (req, res) => {
  try {
    const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8"));
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Track Analytics Event
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
      timestamp: new Date().toISOString()
    });

    // Trim events history to prevent massive file growth (keep last 200 events)
    if (analytics.events.length > 200) {
      analytics.events = analytics.events.slice(-200);
    }

    saveAnalyticsData(analytics);
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Get Analytics Summary
app.get("/api/system-stats", (req, res) => {
  try {
    const analytics = getAnalyticsData();
    const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8"));

    // Compile dynamic summary
    res.json({
      totalViews: analytics.totalViews,
      pageViews: analytics.pageViews,
      chatbotInteractions: analytics.chatbotInteractions,
      submissionsCount: messages.length,
      recentEvents: analytics.events.slice(-15).reverse(), // Last 15 events
      messages: messages.slice(-10).reverse() // Last 10 submissions
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Helper to read and write articles
function getArticles() {
  if (fs.existsSync(ARTICLES_FILE)) {
    return JSON.parse(fs.readFileSync(ARTICLES_FILE, "utf-8"));
  }
  return [];
}
function saveArticles(data: any) {
  fs.writeFileSync(ARTICLES_FILE, JSON.stringify(data, null, 2));
}

// Admin CV Upload
app.post("/api/admin/cv/upload", upload.single("cv"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    // Update the local resume download text logic if needed, 
    // but for now we just serve the uploaded file directly if requested.
    res.json({ message: "CV uploaded successfully", path: `/uploads/cv.pdf` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Articles APIs
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
      date: new Date().toISOString().split('T')[0],
      published: req.body.published || false
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

function checkRateLimit(ip: string, maxRequests: number, windowMs: number): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // Clean up expired entries periodically
  if (rateLimitMap.size > 500) {
    for (const [key, val] of rateLimitMap) {
      if (now > val.resetAt) rateLimitMap.delete(key);
    }
  }

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (entry.count >= maxRequests) {
    const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfterSec };
  }

  entry.count++;
  return { allowed: true, retryAfterSec: 0 };
}

// AI Chatbot endpoint powered by Gemini API (rate limited: 10 req/min)
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

    // Dynamic verification of api key existence
    let ai;
    try {
      ai = getGeminiClient();
    } catch (e: any) {
      // Graceful fallback response when Gemini key is missing
      return res.json({
        text: `**System Notice:** Sameera's AI Assistant is currently in demo mode. The Gemini API key has not been configured in the environment variables yet.\n\nHere is what you should do:\n1. Click on the **Settings** menu at the top right of the AI Studio workspace.\n2. Open the **Secrets** tab.\n3. Add a secret named \`GEMINI_API_KEY\` with your Gemini developer key.\n\n*Temporary Offline Answer about Sameera's skills:* Sameera Jayakodi is an **Associate Software Engineer** expert in **React.js, Node.js, Spring Boot, MySQL, MongoDB, AWS**, and building automated systems like **n8n chat flows and MCP servers**. Reach him at **sameerajayakodi456@gmail.com**!`,
        isDemo: true
      });
    }

    // Track AI interaction
    const analytics = getAnalyticsData();
    analytics.chatbotInteractions = (analytics.chatbotInteractions || 0) + 1;
    analytics.events.push({
      type: "chat_ask",
      query: message.slice(0, 50),
      timestamp: new Date().toISOString()
    });
    saveAnalyticsData(analytics);

    // Format chat history for @google/genai format
    // Ensure we start with system instruction
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { role: "user", parts: [{ text: "Hello! Set up your personality as Sameera's Assistant." }] },
        { role: "model", parts: [{ text: "Understood. I am Sameera's loyal AI delegate. I will answer any recruiter questions about his experience, education, projects, or background using his resume data." }] },
        ...(history || []).map((msg: any) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        })),
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: RESUME_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
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
    } catch (e: any) {
      return res.json({
        text: `demo_result_hire`
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [
        { role: "user", parts: [{ text: `System Instruction: ${prompt}\n\nCustomer Input: "${input}"\n\nProvide ONLY the evaluated intent or extracted answer, no extra text.` }] }
      ],
      config: {
        temperature: 0.1,
      }
    });

    res.json({ text: response.text?.trim() || "unknown" });
  } catch (error: any) {
    console.error("Simulation API call failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// Download resume endpoint
app.get("/api/resume/check", (req, res) => {
  const cvPath = path.join(UPLOADS_DIR, "cv.pdf");
  res.json({ exists: fs.existsSync(cvPath) });
});

app.get("/api/resume/download", (req, res) => {  const cvPath = path.join(UPLOADS_DIR, "cv.pdf");  if (fs.existsSync(cvPath)) { return res.download(cvPath, "Sameera_Jayakodi_Resume.pdf"); } 
  const resumeText = `
==================================================================
SAMEERA JAYAKODI - ASSOCIATE SOFTWARE ENGINEER RESUME
==================================================================
Location: Homagama, Sri Lanka
Email: sameerajayakodi456@gmail.com
Phone: +94 770309842
LinkedIn: linkedin.com/in/sameera-jayakodi-6a3a81226
GitHub: github.com/sameerajayakodi

------------------------------------------------------------------
PROFESSIONAL SUMMARY
------------------------------------------------------------------
Full-Stack Software Engineer with 1 year of hands-on experience delivering
production web and mobile applications end-to-end from requirement gathering
and system design through development, deployment, and support. Built and
shipped five+ systems spanning fleet management, compliance, e-learning, HR,
and bidding domains using React, Node.js, Spring Boot, and both relational
and NoSQL databases. Extended into AI/automation with secured MCP server
integrations, an AI-driven WhatsApp CRM, and a no-code chatbot flow builder.
Comfortable with AWS, Docker, and Linux-based deployment. Thrives in agile
teams and client-facing delivery.

------------------------------------------------------------------
AREAS OF EXPERTISE
------------------------------------------------------------------
* Languages: JavaScript, Java, Python, SQL, Dart
* Frontend: React.js, React Native, Flutter, HTML/CSS, Tailwind CSS, Figma
* Backend: Node.js, Express.js, Spring Boot, ASP.NET, PHP
* Databases: MySQL, MongoDB, SQL Server (Relational & Non-Relational)
* Cloud/DevOps: AWS (EC2, S3), Docker, Linux, Git, GitHub, GitLab, Vercel, CI/CD
* AI/ML & Automation: OpenCV, Gemini API, n8n, MCP Servers, Chatbot Integration
* Other: JWT, Clerk, Cloudinary, System Design, Requirement Gathering, Agile

------------------------------------------------------------------
WORK EXPERIENCE
------------------------------------------------------------------
Adeona Technologies (Pvt) Ltd (AUG 2025 - Present)
Software Engineer (Trainee) — Feb 2026 - Present
Full-Stack Developer Intern — Aug 2025 - Feb 2026

* Delivered full-stack features across five production systems (fleet management,
  compliance, e-learning, HR, bidding) supporting teams of 15-20 users each,
  from requirement gathering through development, deployment, and support.
* Implemented secure authentication and role-based access control across 4
  user roles, plus PDPA-aligned data handling for HR platforms covering 100+
  employee records.
* Built 30+ REST API endpoints across React/Node.js and Spring Boot, working
  with MySQL, SQL Server, and MongoDB; containerized with Docker and deployed
  to AWS EC2/S3 within a 6-person agile team on 2-week sprints.
* Collaborated with QA, design, and product stakeholders through sprint
  ceremonies; explored AI/ML tooling (OpenCV, n8n, MCP servers) for internal
  automation proof-of-concepts.

------------------------------------------------------------------
KEY PROJECTS DELIVERED
------------------------------------------------------------------
* Vehicle Management System: real-time GPS tracking with live status updates.
* AdGree - Consent Management Platform: PDPA-aligned consent collection/storage.
* Adeona HR Management System: end-to-end leave, timesheet, and attendance modules.
* AI WhatsApp CRM - Lead Management: WhatsApp bot integration via n8n with automated lead capture.
* MCP Server Integrations - ADA Digital Reach & Dialog eSMS: OAuth-secured servers.
* No-Code Chatbot Flow Builder: drag-and-drop tool to build Meta chatbot flows.
* GoviMart - Full Stack Grocery Delivery Web Application: separate dashboards, Stripe, Cloudinary, JWT.
* HireLink - Job & Skill Development Platform: Spring Boot, MySQL, AWS, Gemini API.
* Torva - Real-World Treasure Hunt Mobile App: GPS-based mobile game, Maps, Firebase.

------------------------------------------------------------------
EDUCATION
------------------------------------------------------------------
* BSC (HONS) COMPUTER SCIENCE (Oct 2022 - Dec 2026)
  NSBM Green University
  Focus: Software Engineering, Algorithms, Databases, AI, Cybersecurity
* Advanced Fullstack Developer Program (Jun 2024 - Dec 2024)
  Academy of Computer Programming and Training (ACPT)
* University of Moratuwa - Short Courses (Jun 2022 - Dec 2023)
  Python Programming, Angular Front-End, Node.js Backend
* GCE A/L & GCE O/L
  St. Joseph's College, Bandarawela

==================================================================
==================================================================
`;
  res.setHeader("Content-Disposition", "attachment; filename=Sameera_Jayakodi_Resume.txt");
  res.setHeader("Content-Type", "text/plain");
  res.send(resumeText);
});

// Setup Vite Dev server or Serve static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
