export interface ExtractedContent {
  title: string;
  content: string;
  byline?: string;
  siteName?: string;
  url: string;
  wordCount: number;
  readingTime: number;
  language: string;
}

export interface SummaryResult {
  tldr: string;
  bullets: string[];
  actions: string[];
  qa: Array<{ question: string; answer: string }>;
  language: string;
  confidence: number;
}

export interface UserSettings {
  apiKey: string;
  tone: 'neutral' | 'friendly' | 'professional';
  length: 'short' | 'medium' | 'detailed';
  autoDetectLanguage: boolean;
  showOverlay: boolean;
}

export interface UsageData {
  dailyCount: number;
  lastResetDate: string;
  totalCount: number;
  isPro: boolean;
}

export interface SummaryHistory {
  id: string;
  url: string;
  title: string;
  summary: SummaryResult;
  timestamp: number;
  wordCount: number;
  readingTime: number;
}
