export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  role: string;
  duration: string;
  highlights: string[];
  demoUrl?: string;
  githubUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  content: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  pageViews: Record<string, number>;
  chatbotInteractions: number;
  submissionsCount: number;
  recentEvents: Array<{
    type: string;
    page?: string;
    element?: string;
    query?: string;
    sender?: string;
    timestamp: string;
  }>;
  messages: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    timestamp: string;
  }>;
}

// Flow Builder Types
export type BlockType = "trigger" | "ai_prompt" | "send_message" | "condition";

export interface FlowBlock {
  id: string;
  type: BlockType;
  title: string;
  config: {
    text?: string;
    prompt?: string;
    variable?: string;
    conditionValue?: string;
  };
  position: { x: number; y: number };
}

export interface FlowConnection {
  fromId: string;
  toId: string;
}
