# FlashTL;DR Extension - Data Model Specification

## Overview

This document defines the complete data model for the FlashTL;DR extension, including storage schemas, data relationships, migration strategies, and data lifecycle management.

## Storage Architecture

### Chrome Extension Storage Types

#### 1. Sync Storage (chrome.storage.sync)
**Purpose**: User settings that sync across devices
**Capacity**: 100KB total, 8KB per item
**Usage**: User preferences, API keys, configuration

```typescript
interface SyncStorageSchema {
  // User settings (primary)
  user_settings: UserSettings;
  
  // API configuration
  api_config: APIConfiguration;
  
  // Feature flags
  feature_flags: Record<string, boolean>;
  
  // Last sync timestamp
  last_sync: number;
}
```

#### 2. Local Storage (chrome.storage.local)
**Purpose**: Large data that doesn't need to sync
**Capacity**: Unlimited (subject to disk space)
**Usage**: Summary history, cached data, temporary files

```typescript
interface LocalStorageSchema {
  // Summary history
  summaries: Record<string, StoredSummary>;
  
  // Summary index for efficient querying
  summary_index: SummaryIndex;
  
  // Cached content extractions
  content_cache: Record<string, CachedContent>;
  
  // Performance metrics
  performance_metrics: PerformanceData[];
  
  // Error logs
  error_logs: ErrorLog[];
}
```

## Core Data Models

### 1. User Settings Model

```typescript
interface UserSettings {
  version: string; // Schema version for migrations
  
  // API Configuration
  api: {
    provider: 'openai' | 'custom';
    apiKey: string; // Encrypted
    endpoint?: string;
    model: string;
    timeout: number;
  };
  
  // Summarization Preferences
  summarization: {
    defaultTone: 'neutral' | 'friendly' | 'professional';
    defaultLength: 'short' | 'medium' | 'detailed';
    maxBullets: number;
    maxActions: number;
    includeActions: boolean;
  };
  
  // Language Settings
  language: {
    autoDetect: boolean;
    preferredLanguage?: string;
    fallbackLanguage: string;
  };
  
  // UI Preferences
  ui: {
    theme: 'auto' | 'light' | 'dark';
    showKeyboardHints: boolean;
    overlayPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    animationsEnabled: boolean;
  };
  
  // Privacy Settings
  privacy: {
    historyEnabled: boolean;
    maxHistoryItems: number;
    autoDeleteAfterDays?: number;
    shareUsageStats: boolean;
  };
  
  // Advanced Settings
  advanced: {
    debugMode: boolean;
    maxContentLength: number;
    extractionTimeout: number;
    customPrompts?: Record<string, string>;
  };
  
  // Metadata
  createdAt: number;
  updatedAt: number;
}
```

### 2. Summary Storage Model

```typescript
interface StoredSummary {
  // Primary Key
  id: string; // UUID v4
  
  // Content Identification
  url: string;
  urlHash: string; // SHA-256 hash for indexing
  title: string;
  domain: string;
  
  // Content Metadata
  content: {
    wordCount: number;
    readingTime: number;
    language: string;
    extractionMethod: 'semantic' | 'density' | 'fallback';
    confidence: number;
  };
  
  // Summary Data
  summary: {
    tldr: string;
    bullets: string[];
    actions: string[];
    language: string;
    processingTime: number;
    tokenUsage?: TokenUsage;
  };
  
  // Generation Context
  context: {
    options: SummaryOptions;
    apiProvider: string;
    model: string;
    promptVersion: string;
  };
  
  // Timestamps
  createdAt: number;
  updatedAt: number;
  
  // User Interaction
  interaction: {
    viewed: boolean;
    copied: boolean;
    exported: boolean;
    rating?: 'thumbs_up' | 'thumbs_down';
  };
  
  // Metadata
  version: string; // Schema version
  tags?: string[];
}
```

### 3. Summary Index Model

```typescript
interface SummaryIndex {
  // By URL hash for quick lookup
  byUrl: Record<string, string[]>; // urlHash -> summaryIds
  
  // By domain for domain-based queries
  byDomain: Record<string, string[]>; // domain -> summaryIds
  
  // By language for language filtering
  byLanguage: Record<string, string[]>; // language -> summaryIds
  
  // By date for temporal queries
  byDate: Record<string, string[]>; // YYYY-MM-DD -> summaryIds
  
  // By tags for categorization
  byTags: Record<string, string[]>; // tag -> summaryIds
  
  // Chronological order (most recent first)
  chronological: string[]; // summaryIds in order
  
  // Statistics
  stats: {
    totalSummaries: number;
    totalDomains: number;
    totalLanguages: number;
    oldestSummary: number;
    newestSummary: number;
  };
  
  // Index metadata
  version: string;
  lastUpdated: number;
}
```

### 4. Cached Content Model

```typescript
interface CachedContent {
  // Cache Key (URL hash)
  key: string;
  
  // Original URL
  url: string;
  
  // Extracted Content
  content: {
    text: string;
    title: string;
    language: string;
    wordCount: number;
    readingTime: number;
    extractionMethod: string;
    confidence: number;
  };
  
  // Cache Metadata
  metadata: {
    extractedAt: number;
    expiresAt: number;
    hitCount: number;
    lastAccessed: number;
  };
  
  // Content Hash for change detection
  contentHash: string;
  
  // Schema version
  version: string;
}
```

## Data Relationships

### Entity Relationship Diagram

```
UserSettings (1) ←→ (∞) StoredSummary
    ↓
APIConfiguration

StoredSummary (∞) ←→ (1) SummaryIndex
    ↓
SummaryMetadata

CachedContent (∞) ←→ (1) StoredSummary
    ↓
ContentMetadata
```

### Relationship Rules

1. **UserSettings ↔ StoredSummary**
   - One user settings per extension instance
   - Multiple summaries per user
   - Settings influence summary generation

2. **StoredSummary ↔ SummaryIndex**
   - Each summary must be indexed
   - Index provides efficient querying
   - Automatic index updates on CRUD operations

3. **CachedContent ↔ StoredSummary**
   - Optional relationship
   - Cache improves performance for repeated visits
   - Cache expiration based on content changes

## Data Lifecycle Management

### 1. Creation Flow

```typescript
async function createSummary(
  extractedContent: ExtractedContent,
  summaryResult: SummaryResult,
  options: SummaryOptions
): Promise<StoredSummary> {
  // 1. Generate unique ID
  const id = generateUUID();
  
  // 2. Create summary object
  const summary: StoredSummary = {
    id,
    url: extractedContent.url,
    urlHash: hashURL(extractedContent.url),
    title: extractedContent.title,
    domain: getDomain(extractedContent.url),
    content: {
      wordCount: extractedContent.wordCount,
      readingTime: extractedContent.readingTime,
      language: extractedContent.language,
      extractionMethod: extractedContent.extractionMethod,
      confidence: extractedContent.confidence
    },
    summary: summaryResult,
    context: {
      options,
      apiProvider: getCurrentProvider(),
      model: getCurrentModel(),
      promptVersion: getPromptVersion()
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    interaction: {
      viewed: false,
      copied: false,
      exported: false
    },
    version: CURRENT_SCHEMA_VERSION
  };
  
  // 3. Store summary
  await storeSummary(summary);
  
  // 4. Update index
  await updateSummaryIndex(summary);
  
  // 5. Cache content if enabled
  await cacheContent(extractedContent);
  
  return summary;
}
```

### 2. Update Flow

```typescript
async function updateSummary(
  id: string, 
  updates: Partial<StoredSummary>
): Promise<void> {
  // 1. Get existing summary
  const existing = await getSummary(id);
  if (!existing) throw new Error('Summary not found');
  
  // 2. Merge updates
  const updated = {
    ...existing,
    ...updates,
    updatedAt: Date.now()
  };
  
  // 3. Store updated summary
  await storeSummary(updated);
  
  // 4. Update index if necessary
  if (updates.url || updates.domain || updates.content?.language) {
    await updateSummaryIndex(updated, existing);
  }
}
```

### 3. Deletion Flow

```typescript
async function deleteSummary(id: string): Promise<void> {
  // 1. Get summary for index cleanup
  const summary = await getSummary(id);
  if (!summary) return;
  
  // 2. Remove from storage
  await removeSummary(id);
  
  // 3. Update index
  await removeFromSummaryIndex(summary);
  
  // 4. Clean up related cache
  await cleanupRelatedCache(summary.urlHash);
}
```

## Data Migration Strategy

### Schema Versioning

```typescript
const SCHEMA_VERSIONS = {
  '1.0.0': 'Initial schema',
  '1.1.0': 'Added language detection',
  '1.2.0': 'Added performance metrics',
  '1.3.0': 'Added user interaction tracking'
} as const;

type SchemaVersion = keyof typeof SCHEMA_VERSIONS;
const CURRENT_SCHEMA_VERSION: SchemaVersion = '1.3.0';
```

### Migration Framework

```typescript
interface Migration {
  from: SchemaVersion;
  to: SchemaVersion;
  migrate: (data: any) => Promise<any>;
  rollback?: (data: any) => Promise<any>;
}

const migrations: Migration[] = [
  {
    from: '1.0.0',
    to: '1.1.0',
    migrate: async (data) => {
      // Add language field to existing summaries
      if (data.summary && !data.summary.language) {
        data.summary.language = 'en'; // Default to English
      }
      return data;
    }
  },
  {
    from: '1.1.0',
    to: '1.2.0',
    migrate: async (data) => {
      // Add performance metrics
      if (data.summary && !data.summary.processingTime) {
        data.summary.processingTime = 0; // Unknown processing time
      }
      return data;
    }
  },
  {
    from: '1.2.0',
    to: '1.3.0',
    migrate: async (data) => {
      // Add interaction tracking
      if (!data.interaction) {
        data.interaction = {
          viewed: false,
          copied: false,
          exported: false
        };
      }
      return data;
    }
  }
];
```

### Migration Execution

```typescript
async function migrateData(): Promise<void> {
  const settings = await getSettings();
  const currentVersion = settings.version || '1.0.0';
  
  if (currentVersion === CURRENT_SCHEMA_VERSION) {
    return; // No migration needed
  }
  
  // Get all data that needs migration
  const summaries = await getAllSummaries();
  
  // Apply migrations in sequence
  for (const summary of summaries) {
    let version = summary.version || '1.0.0';
    
    while (version !== CURRENT_SCHEMA_VERSION) {
      const migration = migrations.find(m => m.from === version);
      if (!migration) {
        throw new Error(`No migration path from ${version}`);
      }
      
      // Apply migration
      const migrated = await migration.migrate(summary);
      migrated.version = migration.to;
      
      // Store migrated data
      await storeSummary(migrated);
      
      version = migration.to;
    }
  }
  
  // Update settings version
  await updateSettings({ version: CURRENT_SCHEMA_VERSION });
}
```

## Data Validation

### Validation Schemas

```typescript
const summaryValidationSchema: ValidationSchema = {
  type: 'object',
  required: ['id', 'url', 'title', 'content', 'summary', 'createdAt'],
  properties: {
    id: { type: 'string', pattern: /^[0-9a-f-]{36}$/ },
    url: { type: 'string', min: 1, max: 2048 },
    title: { type: 'string', min: 1, max: 500 },
    content: {
      type: 'object',
      required: ['wordCount', 'language'],
      properties: {
        wordCount: { type: 'number', min: 0 },
        language: { type: 'string', pattern: /^[a-z]{2}$/ }
      }
    },
    summary: {
      type: 'object',
      required: ['tldr', 'bullets', 'actions'],
      properties: {
        tldr: { type: 'string', min: 1, max: 1000 },
        bullets: { 
          type: 'array', 
          items: { type: 'string', max: 500 },
          max: 20 
        },
        actions: { 
          type: 'array', 
          items: { type: 'string', max: 500 },
          max: 20 
        }
      }
    }
  }
};
```

## Performance Optimization

### Indexing Strategy

1. **Primary Indexes**
   - By ID (unique): O(1) lookup
   - By URL hash: O(1) duplicate detection
   - By domain: O(1) domain filtering

2. **Secondary Indexes**
   - By date: Range queries
   - By language: Language filtering
   - By tags: Category filtering

3. **Composite Indexes**
   - Domain + Date: Recent summaries by domain
   - Language + Date: Recent summaries by language

### Caching Strategy

```typescript
interface CacheConfig {
  // Content cache settings
  content: {
    maxSize: number; // Maximum cached items
    ttl: number; // Time to live in milliseconds
    maxAge: number; // Maximum age before refresh
  };
  
  // Index cache settings
  index: {
    refreshInterval: number; // Index refresh frequency
    maxMemoryUsage: number; // Maximum memory for index
  };
  
  // Query result cache
  queries: {
    maxResults: number; // Maximum cached query results
    ttl: number; // Query cache TTL
  };
}

const defaultCacheConfig: CacheConfig = {
  content: {
    maxSize: 100,
    ttl: 24 * 60 * 60 * 1000, // 24 hours
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  },
  index: {
    refreshInterval: 5 * 60 * 1000, // 5 minutes
    maxMemoryUsage: 10 * 1024 * 1024 // 10MB
  },
  queries: {
    maxResults: 50,
    ttl: 5 * 60 * 1000 // 5 minutes
  }
};
```

## Data Security & Privacy

### Encryption Strategy

```typescript
interface EncryptionConfig {
  // API key encryption
  apiKey: {
    algorithm: 'AES-256-GCM';
    keyDerivation: 'PBKDF2';
    iterations: 100000;
  };
  
  // Sensitive data encryption
  sensitiveData: {
    fields: ['apiKey', 'customEndpoint'];
    algorithm: 'AES-256-GCM';
  };
}
```

### Data Anonymization

```typescript
interface AnonymizationRules {
  // Remove personally identifiable information
  pii: {
    removeUrls: boolean;
    hashUrls: boolean;
    removeTitles: boolean;
  };
  
  // Content sanitization
  content: {
    removePersonalNames: boolean;
    removeEmails: boolean;
    removePhoneNumbers: boolean;
  };
}
```

## Backup & Recovery

### Export Format

```typescript
interface ExportData {
  version: string;
  exportedAt: number;
  settings: UserSettings;
  summaries: StoredSummary[];
  metadata: {
    totalSummaries: number;
    dateRange: {
      start: number;
      end: number;
    };
    languages: string[];
    domains: string[];
  };
}
```

### Import Validation

```typescript
async function validateImportData(data: any): Promise<ValidationResult<ExportData>> {
  // 1. Check format version compatibility
  // 2. Validate data structure
  // 3. Check for conflicts with existing data
  // 4. Verify data integrity
  // 5. Return validation result
}
```

---

*This data model specification provides a comprehensive foundation for robust data management, ensuring scalability, performance, and data integrity throughout the extension's lifecycle.*