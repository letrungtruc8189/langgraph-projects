# FlashTL;DR Extension - API Contracts & Data Models

## Overview

This document defines the API contracts, data models, and interfaces used throughout the FlashTL;DR extension. These contracts ensure type safety, consistent data flow, and maintainable code architecture.

## Core Data Models

### ExtractedContent Interface
```typescript
interface ExtractedContent {
  /** Main content text extracted from the webpage */
  text: string;
  
  /** Page title */
  title: string;
  
  /** Page URL */
  url: string;
  
  /** Detected or specified language code (ISO 639-1) */
  language: string;
  
  /** Word count of extracted content */
  wordCount: number;
  
  /** Estimated reading time in minutes */
  readingTime: number;
  
  /** Extraction method used */
  extractionMethod: 'semantic' | 'density' | 'fallback';
  
  /** Confidence score of extraction (0-1) */
  confidence: number;
  
  /** Timestamp when content was extracted */
  extractedAt: number;
}
```

### SummaryOptions Interface
```typescript
interface SummaryOptions {
  /** Tone of the summary */
  tone: 'neutral' | 'friendly' | 'professional';
  
  /** Length preference for the summary */
  length: 'short' | 'medium' | 'detailed';
  
  /** Target language for the summary (auto-detected if not specified) */
  language?: string;
  
  /** Maximum number of bullet points */
  maxBullets?: number;
  
  /** Maximum number of action items */
  maxActions?: number;
  
  /** Whether to include action items */
  includeActions?: boolean;
}
```

### SummaryResult Interface
```typescript
interface SummaryResult {
  /** Brief 2-3 sentence summary */
  tldr: string;
  
  /** Key points as bullet list */
  bullets: string[];
  
  /** Actionable items (optional) */
  actions: string[];
  
  /** Language of the generated summary */
  language: string;
  
  /** Options used to generate this summary */
  options: SummaryOptions;
  
  /** Timestamp when summary was generated */
  generatedAt: number;
  
  /** Processing time in milliseconds */
  processingTime: number;
  
  /** Token usage information */
  tokenUsage?: {
    prompt: number;
    completion: number;
    total: number;
  };
}
```

### StoredSummary Interface
```typescript
interface StoredSummary {
  /** Unique identifier for the summary */
  id: string;
  
  /** Original page URL */
  url: string;
  
  /** Page title */
  title: string;
  
  /** Timestamp when summary was created */
  timestamp: number;
  
  /** Detected content language */
  language: string;
  
  /** The generated summary */
  summary: SummaryResult;
  
  /** Settings used for generation */
  settings: SummaryOptions;
  
  /** Original content metadata */
  metadata: {
    wordCount: number;
    readingTime: number;
    extractionMethod: string;
  };
}
```

## Settings & Configuration Models

### UserSettings Interface
```typescript
interface UserSettings {
  /** OpenAI API key (encrypted) */
  apiKey: string;
  
  /** Default tone preference */
  defaultTone: 'neutral' | 'friendly' | 'professional';
  
  /** Default length preference */
  defaultLength: 'short' | 'medium' | 'detailed';
  
  /** Whether to auto-detect language */
  autoDetectLanguage: boolean;
  
  /** Whether to save summaries to history */
  historyEnabled: boolean;
  
  /** Maximum number of summaries to keep in history */
  maxHistoryItems: number;
  
  /** Preferred language override */
  preferredLanguage?: string;
  
  /** Whether to show keyboard shortcut hints */
  showKeyboardHints: boolean;
  
  /** Theme preference */
  theme: 'auto' | 'light' | 'dark';
  
  /** Advanced settings */
  advanced: {
    /** Custom API endpoint (for compatible services) */
    customEndpoint?: string;
    
    /** Request timeout in milliseconds */
    requestTimeout: number;
    
    /** Maximum content length to process */
    maxContentLength: number;
    
    /** Enable debug logging */
    debugMode: boolean;
  };
}
```

### APIConfiguration Interface
```typescript
interface APIConfiguration {
  /** API provider name */
  provider: 'openai' | 'custom';
  
  /** API endpoint URL */
  endpoint: string;
  
  /** API key */
  apiKey: string;
  
  /** Model to use for summarization */
  model: string;
  
  /** Request timeout */
  timeout: number;
  
  /** Maximum tokens for completion */
  maxTokens: number;
  
  /** Temperature for response generation */
  temperature: number;
}
```

## Message Passing Contracts

### Extension Message Types
```typescript
type ExtensionMessage = 
  | SummarizePageMessage
  | GetSettingsMessage
  | UpdateSettingsMessage
  | GetHistoryMessage
  | ClearHistoryMessage
  | TestAPIMessage
  | ShowOverlayMessage
  | HideOverlayMessage;

interface BaseMessage {
  type: string;
  id: string;
  timestamp: number;
}
```

### Specific Message Contracts
```typescript
interface SummarizePageMessage extends BaseMessage {
  type: 'SUMMARIZE_PAGE';
  payload: {
    options?: Partial<SummaryOptions>;
    forceRefresh?: boolean;
  };
}

interface SummarizePageResponse {
  success: boolean;
  data?: SummaryResult;
  error?: ExtensionError;
}

interface GetSettingsMessage extends BaseMessage {
  type: 'GET_SETTINGS';
}

interface GetSettingsResponse {
  success: boolean;
  data?: UserSettings;
  error?: ExtensionError;
}

interface UpdateSettingsMessage extends BaseMessage {
  type: 'UPDATE_SETTINGS';
  payload: Partial<UserSettings>;
}

interface UpdateSettingsResponse {
  success: boolean;
  error?: ExtensionError;
}

interface TestAPIMessage extends BaseMessage {
  type: 'TEST_API';
  payload: {
    apiKey: string;
    endpoint?: string;
  };
}

interface TestAPIResponse {
  success: boolean;
  data?: {
    valid: boolean;
    model?: string;
    usage?: any;
  };
  error?: ExtensionError;
}
```

## Error Handling Contracts

### ExtensionError Interface
```typescript
interface ExtensionError {
  /** Error code for programmatic handling */
  code: ErrorCode;
  
  /** Human-readable error message */
  message: string;
  
  /** Additional error details */
  details?: Record<string, any>;
  
  /** Timestamp when error occurred */
  timestamp: number;
  
  /** Stack trace (in development mode) */
  stack?: string;
}

enum ErrorCode {
  // Content extraction errors
  CONTENT_EXTRACTION_FAILED = 'CONTENT_EXTRACTION_FAILED',
  INSUFFICIENT_CONTENT = 'INSUFFICIENT_CONTENT',
  BLOCKED_CONTENT = 'BLOCKED_CONTENT',
  
  // API errors
  API_KEY_MISSING = 'API_KEY_MISSING',
  API_KEY_INVALID = 'API_KEY_INVALID',
  API_RATE_LIMITED = 'API_RATE_LIMITED',
  API_REQUEST_FAILED = 'API_REQUEST_FAILED',
  API_TIMEOUT = 'API_TIMEOUT',
  
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  OFFLINE = 'OFFLINE',
  
  // Storage errors
  STORAGE_ERROR = 'STORAGE_ERROR',
  STORAGE_QUOTA_EXCEEDED = 'STORAGE_QUOTA_EXCEEDED',
  
  // UI errors
  OVERLAY_INJECTION_FAILED = 'OVERLAY_INJECTION_FAILED',
  POPUP_COMMUNICATION_FAILED = 'POPUP_COMMUNICATION_FAILED',
  
  // General errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}
```

## Language Detection Contracts

### LanguageDetectionResult Interface
```typescript
interface LanguageDetectionResult {
  /** Detected language code (ISO 639-1) */
  language: string;
  
  /** Confidence score (0-1) */
  confidence: number;
  
  /** Detection method used */
  method: 'html' | 'url' | 'content' | 'fallback';
  
  /** Additional metadata */
  metadata?: {
    htmlLang?: string;
    urlPattern?: string;
    contentSample?: string;
  };
}

interface LanguageDetector {
  /** Detect language from multiple sources */
  detectLanguage(
    content: string, 
    url: string, 
    htmlLang?: string
  ): LanguageDetectionResult;
  
  /** Get supported languages */
  getSupportedLanguages(): string[];
  
  /** Check if language is supported */
  isLanguageSupported(language: string): boolean;
}
```

## AI Provider Contracts

### AIProvider Interface
```typescript
interface AIProvider {
  /** Provider name */
  name: string;
  
  /** Generate summary from extracted content */
  summarize(
    content: ExtractedContent, 
    options: SummaryOptions
  ): Promise<SummaryResult>;
  
  /** Test API connection and credentials */
  testConnection(config: APIConfiguration): Promise<boolean>;
  
  /** Get available models */
  getAvailableModels?(config: APIConfiguration): Promise<string[]>;
  
  /** Get usage statistics */
  getUsageStats?(config: APIConfiguration): Promise<UsageStats>;
}

interface UsageStats {
  /** Current billing period usage */
  currentUsage: {
    requests: number;
    tokens: number;
    cost: number;
  };
  
  /** Usage limits */
  limits: {
    requestsPerMinute: number;
    tokensPerMonth: number;
    costPerMonth: number;
  };
  
  /** Remaining quota */
  remaining: {
    requests: number;
    tokens: number;
    cost: number;
  };
}
```

### OpenAI Specific Contracts
```typescript
interface OpenAIRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature: number;
  max_tokens: number;
  response_format?: {
    type: 'json_object';
  };
}

interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
```

## Storage Contracts

### StorageManager Interface
```typescript
interface StorageManager {
  /** Save a summary to history */
  saveSummary(summary: StoredSummary): Promise<void>;
  
  /** Get summaries with optional filtering */
  getSummaries(options?: {
    limit?: number;
    offset?: number;
    url?: string;
    language?: string;
    dateRange?: {
      start: number;
      end: number;
    };
  }): Promise<StoredSummary[]>;
  
  /** Get user settings */
  getSettings(): Promise<UserSettings>;
  
  /** Update user settings */
  updateSettings(settings: Partial<UserSettings>): Promise<void>;
  
  /** Clear all history */
  clearHistory(): Promise<void>;
  
  /** Export history as JSON */
  exportHistory(): Promise<string>;
  
  /** Import history from JSON */
  importHistory(data: string): Promise<void>;
  
  /** Get storage usage statistics */
  getStorageStats(): Promise<StorageStats>;
}

interface StorageStats {
  /** Total number of summaries */
  totalSummaries: number;
  
  /** Storage space used (bytes) */
  bytesUsed: number;
  
  /** Available storage space (bytes) */
  bytesAvailable: number;
  
  /** Oldest summary timestamp */
  oldestSummary?: number;
  
  /** Most recent summary timestamp */
  newestSummary?: number;
}
```

## Content Extraction Contracts

### ContentExtractor Interface
```typescript
interface ContentExtractor {
  /** Extract content from current page */
  extractContent(document?: Document): Promise<ExtractedContent>;
  
  /** Check if page has extractable content */
  hasExtractableContent(document?: Document): boolean;
  
  /** Get extraction confidence score */
  getExtractionConfidence(element: HTMLElement): number;
}

interface ExtractionStrategy {
  /** Strategy name */
  name: string;
  
  /** Priority (higher = tried first) */
  priority: number;
  
  /** Extract content using this strategy */
  extract(document: Document): HTMLElement | null;
  
  /** Check if strategy applies to current page */
  applies(document: Document): boolean;
}
```

## UI Component Contracts

### OverlayComponent Interface
```typescript
interface OverlayComponent {
  /** Render the overlay with summary data */
  render(summary: SummaryResult): void;
  
  /** Show the overlay */
  show(): void;
  
  /** Hide the overlay */
  hide(): void;
  
  /** Destroy the overlay and cleanup */
  destroy(): void;
  
  /** Update overlay content */
  update(summary: Partial<SummaryResult>): void;
  
  /** Set loading state */
  setLoading(loading: boolean): void;
  
  /** Show error message */
  showError(error: ExtensionError): void;
}

interface OverlayOptions {
  /** Position preference */
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  
  /** Animation settings */
  animation: {
    enabled: boolean;
    duration: number;
    easing: string;
  };
  
  /** Auto-hide settings */
  autoHide: {
    enabled: boolean;
    delay: number;
  };
  
  /** Theme */
  theme: 'light' | 'dark' | 'auto';
}
```

## Event System Contracts

### ExtensionEvent Interface
```typescript
interface ExtensionEvent<T = any> {
  /** Event type */
  type: string;
  
  /** Event payload */
  payload: T;
  
  /** Timestamp */
  timestamp: number;
  
  /** Source component */
  source: 'popup' | 'content' | 'background' | 'options';
  
  /** Target component (optional) */
  target?: 'popup' | 'content' | 'background' | 'options';
}

interface EventEmitter {
  /** Emit an event */
  emit<T>(type: string, payload: T): void;
  
  /** Listen for events */
  on<T>(type: string, handler: (event: ExtensionEvent<T>) => void): void;
  
  /** Remove event listener */
  off<T>(type: string, handler: (event: ExtensionEvent<T>) => void): void;
  
  /** Listen for event once */
  once<T>(type: string, handler: (event: ExtensionEvent<T>) => void): void;
}
```

## Validation Contracts

### Validator Interface
```typescript
interface Validator<T> {
  /** Validate data and return result */
  validate(data: unknown): ValidationResult<T>;
  
  /** Get validation schema */
  getSchema(): ValidationSchema;
}

interface ValidationResult<T> {
  /** Whether validation passed */
  valid: boolean;
  
  /** Validated and typed data (if valid) */
  data?: T;
  
  /** Validation errors (if invalid) */
  errors?: ValidationError[];
}

interface ValidationError {
  /** Field path */
  path: string;
  
  /** Error message */
  message: string;
  
  /** Error code */
  code: string;
  
  /** Expected value/type */
  expected?: any;
  
  /** Actual value */
  actual?: any;
}

interface ValidationSchema {
  /** Schema type */
  type: 'object' | 'array' | 'string' | 'number' | 'boolean';
  
  /** Required fields (for objects) */
  required?: string[];
  
  /** Property schemas (for objects) */
  properties?: Record<string, ValidationSchema>;
  
  /** Array item schema (for arrays) */
  items?: ValidationSchema;
  
  /** Minimum/maximum constraints */
  min?: number;
  max?: number;
  
  /** Pattern constraint (for strings) */
  pattern?: RegExp;
  
  /** Enum values */
  enum?: any[];
}
```

## Performance Monitoring Contracts

### PerformanceMetrics Interface
```typescript
interface PerformanceMetrics {
  /** Content extraction time */
  extractionTime: number;
  
  /** AI processing time */
  aiProcessingTime: number;
  
  /** Total operation time */
  totalTime: number;
  
  /** Memory usage */
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  
  /** Network metrics */
  network: {
    requestCount: number;
    totalBytes: number;
    averageLatency: number;
  };
}

interface PerformanceMonitor {
  /** Start timing an operation */
  startTimer(operation: string): string;
  
  /** End timing an operation */
  endTimer(timerId: string): number;
  
  /** Record a metric */
  recordMetric(name: string, value: number): void;
  
  /** Get performance report */
  getReport(): PerformanceReport;
}

interface PerformanceReport {
  /** Report timestamp */
  timestamp: number;
  
  /** Operation metrics */
  operations: Record<string, {
    count: number;
    totalTime: number;
    averageTime: number;
    minTime: number;
    maxTime: number;
  }>;
  
  /** Custom metrics */
  metrics: Record<string, number[]>;
  
  /** System information */
  system: {
    userAgent: string;
    memory: number;
    cores: number;
  };
}
```

---

*These contracts provide a comprehensive foundation for type-safe development and ensure consistent interfaces across all components of the FlashTL;DR extension.*