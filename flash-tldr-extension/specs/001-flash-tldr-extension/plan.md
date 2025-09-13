# FlashTL;DR Extension - Technical Implementation Plan

## Architecture Overview

### System Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser Extension                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   Popup     │  │   Options   │  │   Content   │  │ Background│ │
│  │     UI      │  │    Page     │  │   Script    │  │  Service  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                      Shared Libraries                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │ AI Client   │  │  Content    │  │  Storage    │  │  Types  │ │
│  │             │  │ Extractor   │  │  Manager    │  │         │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                     External Services                           │
│  ┌─────────────┐                                                │
│  │ OpenAI API  │                                                │
│  │   GPT-4o    │                                                │
│  └─────────────┘                                                │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

#### 1. Popup UI (`popup/`)
- **Purpose**: Main user interface and quick actions
- **Responsibilities**:
  - Display summarize button and status
  - Show quick settings (tone, length)
  - Navigate to options page
  - Display recent summaries
  - Handle user interactions

#### 2. Content Script (`content/`)
- **Purpose**: Page interaction and overlay rendering
- **Responsibilities**:
  - Extract content from current webpage
  - Inject summary overlay into page
  - Handle keyboard shortcuts
  - Communicate with popup and background
  - Manage overlay state and interactions

#### 3. Background Service Worker (`background/`)
- **Purpose**: Extension lifecycle and API coordination
- **Responsibilities**:
  - Handle extension installation and updates
  - Manage keyboard command registration
  - Coordinate between popup and content scripts
  - Handle extension icon and badge updates

#### 4. Options Page (`options/`)
- **Purpose**: Comprehensive settings management
- **Responsibilities**:
  - API key configuration and testing
  - Advanced settings management
  - History viewing and export
  - Privacy settings
  - Debug and diagnostic tools

## Technology Stack

### Core Technologies
- **Language**: TypeScript 5.0+
- **Build System**: Webpack 5.88+
- **Extension API**: Chrome Manifest V3
- **Styling**: CSS3 with CSS Variables
- **AI Service**: OpenAI GPT-4o/GPT-4o-mini

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier
- **Type Checking**: TypeScript strict mode
- **Testing**: Manual testing + Chrome extension testing

### Browser Compatibility
- **Primary**: Chrome 88+ (Manifest V3)
- **Secondary**: Edge 88+
- **Future**: Firefox (when MV3 support is stable)

## Data Flow Architecture

### 1. Content Extraction Flow
```
User Action (Alt+S or Click) 
    ↓
Content Script Activated
    ↓
DOM Content Extraction
    ↓
Language Detection
    ↓
Content Validation
    ↓
Send to Background/AI Client
```

### 2. AI Summarization Flow
```
Extracted Content + Settings
    ↓
AI Client (OpenAI API)
    ↓
Language-Specific Prompts
    ↓
Structured JSON Response
    ↓
Parse & Validate Response
    ↓
Display in Overlay
```

### 3. Settings & Storage Flow
```
User Configuration
    ↓
Storage Manager
    ↓
Chrome Sync Storage
    ↓
Cross-Device Synchronization
```

## Implementation Details

### Content Extraction Strategy

#### Multi-Strategy Approach
1. **Semantic HTML Strategy**
   ```typescript
   const semanticSelectors = [
     'article',
     'main',
     '[role="main"]',
     '.post-content',
     '.article-body',
     '.entry-content'
   ];
   ```

2. **Content Density Analysis**
   ```typescript
   interface ContentScore {
     element: HTMLElement;
     score: number;
     wordCount: number;
     linkDensity: number;
   }
   ```

3. **Fallback Extraction**
   ```typescript
   const fallbackStrategy = {
     minWordCount: 100,
     excludeSelectors: ['nav', 'header', 'footer', 'aside'],
     scoreFactors: {
       semantic: 2.0,
       content: 1.5,
       density: 1.0
     }
   };
   ```

#### Language Detection Implementation
```typescript
interface LanguageDetection {
  detectLanguage(content: string, url: string, htmlLang?: string): string;
  strategies: {
    htmlAttributes: (doc: Document) => string | null;
    urlPatterns: (url: string) => string | null;
    contentAnalysis: (text: string) => string | null;
  };
}
```

### AI Client Architecture

#### Provider Abstraction
```typescript
interface AIProvider {
  name: string;
  summarize(content: ExtractedContent, options: SummaryOptions): Promise<SummaryResult>;
  testConnection(apiKey: string): Promise<boolean>;
}

class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  // Implementation details
}
```

#### Language-Specific Prompts
```typescript
const promptTemplates = {
  vietnamese: {
    system: "Bạn là một chuyên gia tóm tắt nội dung chính xác...",
    user: "Tóm tắt nội dung này. Trả về JSON với các khóa..."
  },
  english: {
    system: "You are a precise content summarizer...",
    user: "Summarize this content. Return JSON with keys..."
  }
  // Additional languages...
};
```

### Storage Architecture

#### Data Models
```typescript
interface StoredSummary {
  id: string;
  url: string;
  title: string;
  timestamp: number;
  language: string;
  summary: SummaryResult;
  settings: SummaryOptions;
}

interface UserSettings {
  apiKey: string;
  defaultTone: 'neutral' | 'friendly' | 'professional';
  defaultLength: 'short' | 'medium' | 'detailed';
  autoDetectLanguage: boolean;
  historyEnabled: boolean;
}
```

#### Storage Manager Implementation
```typescript
class StorageManager {
  async saveSummary(summary: StoredSummary): Promise<void>;
  async getSummaries(limit?: number): Promise<StoredSummary[]>;
  async getSettings(): Promise<UserSettings>;
  async updateSettings(settings: Partial<UserSettings>): Promise<void>;
  async clearHistory(): Promise<void>;
  async exportHistory(): Promise<string>;
}
```

## UI/UX Implementation

### Overlay Component Architecture
```typescript
class SummaryOverlay {
  private shadowRoot: ShadowRoot;
  private container: HTMLElement;
  
  constructor() {
    this.createShadowDOM();
    this.injectStyles();
  }
  
  render(summary: SummaryResult): void;
  show(): void;
  hide(): void;
  destroy(): void;
}
```

### Responsive Design Strategy
- **Desktop**: Full overlay with all sections
- **Mobile**: Collapsible sections, touch-friendly buttons
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### CSS Architecture
```css
:root {
  --flash-tldr-primary: #2563eb;
  --flash-tldr-secondary: #64748b;
  --flash-tldr-success: #10b981;
  --flash-tldr-warning: #f59e0b;
  --flash-tldr-error: #ef4444;
  --flash-tldr-bg: #ffffff;
  --flash-tldr-text: #1f2937;
}

@media (prefers-color-scheme: dark) {
  :root {
    --flash-tldr-bg: #1f2937;
    --flash-tldr-text: #f9fafb;
  }
}
```

## Build & Deployment Pipeline

### Webpack Configuration
```javascript
module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: false, // CSP compliance
  entry: {
    popup: './src/popup/popup.ts',
    content: './src/content/content.ts',
    background: './src/background/background.ts',
    options: './src/options/options.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/popup/popup.html', to: 'popup.html' },
        { from: 'src/options/options.html', to: 'options.html' },
        { from: 'src/popup/popup.css', to: 'popup.css' },
        { from: 'src/options/options.css', to: 'options.css' },
        { from: 'src/content/content.css', to: 'content.css' }
      ]
    })
  ]
};
```

### Build Scripts
```json
{
  "scripts": {
    "icons": "python3 scripts/generate-icons.py",
    "build": "npm run icons && webpack --mode=production",
    "dev": "npm run icons && webpack --mode=development --watch",
    "pack": "npm run build && zip -r flash-tldr-extension.zip dist/",
    "test": "npm run build && node scripts/test-extension.js"
  }
}
```

## Security Implementation

### Content Security Policy Compliance
- **No eval()**: Use `devtool: false` in webpack
- **No inline scripts**: All JavaScript in separate files
- **Secure API calls**: HTTPS only, proper error handling
- **Input validation**: Sanitize all user inputs

### API Key Security
```typescript
class SecureStorage {
  private static readonly API_KEY = 'flash_tldr_api_key';
  
  static async storeApiKey(key: string): Promise<void> {
    await chrome.storage.sync.set({ [this.API_KEY]: key });
  }
  
  static async getApiKey(): Promise<string | null> {
    const result = await chrome.storage.sync.get(this.API_KEY);
    return result[this.API_KEY] || null;
  }
}
```

### Privacy Protection
- **Local Processing**: Content extraction happens locally
- **Minimal Data**: Only text content sent to AI service
- **No Tracking**: No analytics or user behavior tracking
- **Clear Policies**: Transparent privacy policy and data handling

## Performance Optimization

### Content Extraction Performance
```typescript
class PerformantExtractor {
  private static readonly EXTRACTION_TIMEOUT = 500; // ms
  
  async extractWithTimeout(document: Document): Promise<ExtractedContent> {
    return Promise.race([
      this.extractContent(document),
      this.timeoutPromise(PerformantExtractor.EXTRACTION_TIMEOUT)
    ]);
  }
}
```

### Memory Management
- **Cleanup**: Remove event listeners and DOM references
- **Lazy Loading**: Load heavy components only when needed
- **Efficient Storage**: Limit history size, compress data

### Network Optimization
- **Request Batching**: Combine multiple API calls when possible
- **Retry Logic**: Exponential backoff for failed requests
- **Caching**: Cache successful responses temporarily

## Error Handling Strategy

### Error Categories
1. **Content Extraction Errors**
   - Insufficient content
   - Blocked by CSP
   - Dynamic content issues

2. **API Errors**
   - Invalid API key
   - Rate limiting
   - Network failures
   - Service unavailable

3. **User Interface Errors**
   - Overlay injection failures
   - CSS conflicts
   - Browser compatibility issues

### Error Recovery
```typescript
class ErrorHandler {
  static async handleExtractionError(error: ExtractionError): Promise<void> {
    switch (error.type) {
      case 'insufficient_content':
        this.showUserMessage('Not enough content to summarize');
        break;
      case 'blocked_content':
        this.showUserMessage('Content blocked by website security');
        break;
      default:
        this.showUserMessage('Failed to extract content. Please try again.');
    }
  }
}
```

## Testing Strategy

### Manual Testing Checklist
- [ ] Test on top 50 websites (news, blogs, docs)
- [ ] Verify all language detection scenarios
- [ ] Test error conditions (no API key, network failures)
- [ ] Validate keyboard shortcuts across browsers
- [ ] Check overlay behavior on complex layouts

### Automated Testing (Future)
```typescript
describe('ContentExtractor', () => {
  it('should extract content from standard article layout', () => {
    // Test implementation
  });
  
  it('should detect Vietnamese language correctly', () => {
    // Test implementation
  });
});
```

## Deployment Process

### Chrome Web Store Preparation
1. **Assets Creation**
   - Icon generation (16x16, 32x32, 48x48, 128x128)
   - Screenshots for store listing
   - Promotional images

2. **Store Listing**
   - Compelling description
   - Feature highlights
   - Privacy policy link
   - Support contact information

3. **Review Preparation**
   - Security audit
   - Performance testing
   - Accessibility compliance
   - Documentation review

### Release Pipeline
```bash
# Production build
npm run build

# Quality assurance
npm run test

# Package for distribution
npm run pack

# Upload to Chrome Web Store
# (Manual process through developer dashboard)
```

## Monitoring & Analytics

### Performance Metrics
- Extension load time
- Content extraction duration
- AI response time
- Memory usage patterns

### User Experience Metrics
- Success/failure rates
- User retention
- Feature usage patterns
- Error frequency

### Implementation
```typescript
class TelemetryManager {
  static trackEvent(event: string, data?: Record<string, any>): void {
    // Privacy-respecting analytics
    // Only track essential metrics
    // No personal data collection
  }
}
```

## Maintenance & Updates

### Version Management
- **Semantic Versioning**: MAJOR.MINOR.PATCH
- **Release Notes**: Document all changes
- **Migration Scripts**: Handle settings/data migrations

### Update Strategy
- **Automatic Updates**: Chrome handles extension updates
- **Backward Compatibility**: Support previous settings formats
- **Graceful Degradation**: Handle API changes smoothly

### Long-term Maintenance
- **Dependency Updates**: Regular security updates
- **Browser API Changes**: Stay current with Chrome releases
- **Performance Monitoring**: Continuous optimization
- **User Feedback**: Regular feature improvements

---

*This technical plan provides the foundation for implementing a robust, scalable, and maintainable FlashTL;DR extension that meets all functional requirements while ensuring excellent user experience and security.*