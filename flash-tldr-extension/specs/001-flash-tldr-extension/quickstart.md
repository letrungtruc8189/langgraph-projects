# FlashTL;DR Extension - Developer Quickstart Guide

## Overview

This quickstart guide helps developers get up and running with the FlashTL;DR extension development environment quickly. Follow these steps to set up your development environment, understand the codebase, and start contributing.

## Prerequisites

### Required Software
- **Node.js**: Version 18.0+ (LTS recommended)
- **npm**: Version 9.0+ (comes with Node.js)
- **Python**: Version 3.8+ (for icon generation)
- **Git**: Latest version
- **Chrome Browser**: Version 88+ (for testing)

### Optional Tools
- **VS Code**: Recommended IDE with extensions:
  - TypeScript and JavaScript Language Features
  - Chrome Extension Development Tools
  - Prettier - Code formatter
  - ESLint
- **Chrome Extension Developer Tools**: For debugging

### API Requirements
- **OpenAI API Key**: Required for AI summarization
  - Sign up at [OpenAI Platform](https://platform.openai.com/)
  - Generate API key from [API Keys page](https://platform.openai.com/api-keys)
  - Ensure you have sufficient credits/quota

## Quick Setup (5 minutes)

### 1. Clone and Install
```bash
# Clone the repository
git clone <repository-url>
cd flash-tldr-extension

# Install dependencies
npm install

# Install Python dependencies for icon generation
pip3 install Pillow
# OR using Homebrew on macOS
brew install pillow
```

### 2. Build the Extension
```bash
# Development build with watch mode
npm run dev

# OR production build
npm run build
```

### 3. Load in Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked" button
4. Select the `dist/` folder from your project directory
5. The FlashTL;DR extension should appear in your extensions list

### 4. Configure API Key
1. Click the extension icon in Chrome toolbar
2. Click "⚙️ Settings" button
3. Paste your OpenAI API key
4. Click "Test Connection" to verify
5. Save settings

### 5. Test the Extension
1. Navigate to any article or blog post
2. Press `Alt+S` or click the extension icon
3. Wait for the summary to appear
4. Verify all features work correctly

## Development Workflow

### Project Structure Overview
```
flash-tldr-extension/
├── src/                    # Source code
│   ├── popup/             # Extension popup UI
│   ├── content/           # Content scripts
│   ├── background/        # Background service worker
│   ├── options/           # Settings page
│   ├── lib/               # Shared libraries
│   └── types.ts           # TypeScript type definitions
├── dist/                  # Built extension (generated)
├── specs/                 # Specification documents
├── scripts/               # Build and utility scripts
├── webpack.config.js      # Build configuration
└── package.json           # Dependencies and scripts
```

### Key Files to Understand

#### 1. Manifest (`src/manifest.json`)
- Extension configuration and permissions
- Entry points for popup, content scripts, background
- Keyboard shortcuts and commands

#### 2. Content Script (`src/content/content.ts`)
- Extracts content from web pages
- Injects summary overlay
- Handles keyboard shortcuts

#### 3. Popup (`src/popup/popup.ts`)
- Main user interface
- Settings access
- Summary history

#### 4. Background Service (`src/background/background.ts`)
- Extension lifecycle management
- Message routing between components

#### 5. AI Client (`src/lib/ai-client.ts`)
- OpenAI API integration
- Language-specific prompts
- Error handling

#### 6. Content Extractor (`src/lib/content-extractor-simple.ts`)
- DOM content extraction
- Language detection
- Content cleaning and validation

### Development Commands

```bash
# Development with hot reload
npm run dev

# Production build
npm run build

# Create distribution package
npm run pack

# Generate icons (runs automatically with build)
npm run icons

# Clean build artifacts
rm -rf dist/ node_modules/.cache/
```

### Testing Your Changes

#### Manual Testing Checklist
- [ ] Extension loads without errors in Chrome
- [ ] Popup opens and displays correctly
- [ ] Settings page functions properly
- [ ] Content extraction works on various websites
- [ ] Keyboard shortcut (Alt+S) functions
- [ ] Summary overlay appears and displays correctly
- [ ] Copy and export features work
- [ ] Error handling displays appropriate messages

#### Test Websites
Use these websites to test content extraction:
- **News**: CNN, BBC, Reuters
- **Blogs**: Medium articles, personal blogs
- **Documentation**: GitHub README files, technical docs
- **International**: Vietnamese news sites, non-English content
- **Complex layouts**: Sites with heavy advertising, complex CSS

## Architecture Deep Dive

### Message Passing System
The extension uses Chrome's message passing API for communication between components:

```typescript
// From popup to content script
chrome.tabs.sendMessage(tabId, {
  type: 'SUMMARIZE_PAGE',
  payload: { options }
});

// From content script to popup
chrome.runtime.sendMessage({
  type: 'SUMMARY_READY',
  payload: { summary }
});
```

### Content Extraction Flow
1. **Trigger**: User presses Alt+S or clicks extension
2. **Extract**: Content script analyzes DOM and extracts main content
3. **Detect**: Language detection using multiple strategies
4. **Process**: Send content to AI client for summarization
5. **Display**: Show results in overlay component

### AI Integration Flow
1. **Prepare**: Format content with language-specific prompts
2. **Request**: Send to OpenAI API with appropriate parameters
3. **Parse**: Extract structured JSON response
4. **Validate**: Ensure response meets expected format
5. **Return**: Provide formatted summary to UI

## Common Development Tasks

### Adding a New Language
1. **Update Language Detection** (`src/lib/content-extractor-simple.ts`):
```typescript
const LANGUAGE_PATTERNS = {
  // Add new language patterns
  'es': {
    diacritics: /[áéíóúñü]/i,
    commonWords: ['el', 'la', 'de', 'que', 'y', 'en'],
    urlPatterns: ['.es', '/es/', 'spanish']
  }
};
```

2. **Add AI Prompts** (`src/lib/ai-client.ts`):
```typescript
const PROMPTS = {
  es: {
    system: "Eres un experto resumidor de contenido...",
    user: "Resume este contenido. Devuelve JSON con claves..."
  }
};
```

### Adding a New Summary Format
1. **Update Types** (`src/types.ts`):
```typescript
interface SummaryResult {
  tldr: string;
  bullets: string[];
  actions: string[];
  newFormat: string[]; // Add new format
}
```

2. **Update AI Prompts** to include new format in JSON structure
3. **Update UI Components** to display new format
4. **Update Storage Schema** for backward compatibility

### Modifying Content Extraction
1. **Add New Strategy** (`src/lib/content-extractor-simple.ts`):
```typescript
private extractByNewMethod(document: Document): HTMLElement | null {
  // Implement new extraction logic
  return element;
}
```

2. **Update Strategy Priority** in extraction chain
3. **Test on Various Websites** to ensure compatibility

### Adding New Settings
1. **Update UserSettings Interface** (`src/types.ts`)
2. **Update Options Page HTML** (`src/options/options.html`)
3. **Update Options Page Logic** (`src/options/options.ts`)
4. **Update Storage Migration** if needed

## Debugging Guide

### Chrome DevTools
1. **Extension Pages**: Right-click extension icon → "Inspect popup"
2. **Content Scripts**: F12 on any webpage → Console tab
3. **Background Script**: `chrome://extensions/` → Extension details → "Inspect views: background page"

### Common Issues and Solutions

#### Extension Not Loading
```bash
# Check for build errors
npm run build

# Verify manifest.json syntax
cat dist/manifest.json | python -m json.tool

# Check Chrome extension errors
# Go to chrome://extensions/ and look for error messages
```

#### Content Script Not Injecting
- Check Content Security Policy violations in Console
- Verify webpack devtool setting: `devtool: false`
- Ensure proper permissions in manifest.json

#### API Calls Failing
- Verify API key is correctly configured
- Check network tab for request/response details
- Ensure sufficient OpenAI credits
- Test API connection in settings page

#### Overlay Not Appearing
- Check for CSS conflicts with host page
- Verify Shadow DOM implementation
- Test on different websites
- Check console for JavaScript errors

### Logging and Debugging
```typescript
// Use consistent logging throughout codebase
console.log('[FlashTLDR]', 'Component:', message, data);

// Enable debug mode in settings for verbose logging
if (settings.advanced.debugMode) {
  console.debug('[FlashTLDR Debug]', details);
}
```

## Performance Optimization

### Best Practices
1. **Lazy Loading**: Load heavy components only when needed
2. **Debouncing**: Prevent rapid successive API calls
3. **Caching**: Cache content extraction results
4. **Memory Management**: Clean up event listeners and DOM references

### Monitoring Performance
```typescript
// Measure content extraction time
const startTime = performance.now();
const content = await extractContent();
const extractionTime = performance.now() - startTime;
console.log(`Extraction took ${extractionTime}ms`);
```

## Security Considerations

### Content Security Policy
- Never use `eval()` or inline scripts
- Use `devtool: false` in webpack config
- Validate all user inputs
- Sanitize content before processing

### API Key Security
- Store API keys in Chrome's secure storage
- Never log API keys
- Use HTTPS for all API requests
- Implement proper error handling

## Contributing Guidelines

### Code Style
- Use TypeScript strict mode
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Use Prettier for code formatting

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create pull request
git push origin feature/new-feature
```

### Pull Request Checklist
- [ ] Code follows TypeScript best practices
- [ ] All features tested manually
- [ ] No console errors or warnings
- [ ] Documentation updated if needed
- [ ] Backward compatibility maintained

## Deployment

### Chrome Web Store Preparation
1. **Build Production Version**:
```bash
npm run build
npm run pack
```

2. **Test Thoroughly**:
- Test on multiple websites
- Verify all features work
- Check error handling
- Test on different screen sizes

3. **Prepare Store Assets**:
- Screenshots (1280x800, 640x400)
- Promotional images
- Store description
- Privacy policy

### Release Process
1. Update version in `package.json` and `manifest.json`
2. Create production build
3. Test extensively
4. Create release notes
5. Upload to Chrome Web Store
6. Monitor for issues after release

## Resources

### Documentation
- [Chrome Extension Developer Guide](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)

### Tools
- [Chrome Extension Source Viewer](https://chrome.google.com/webstore/detail/chrome-extension-source-v/jifpbeccnghkjeaalbbjmodiffmgedin)
- [Extension Reloader](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid)

### Community
- [Chrome Extensions Google Group](https://groups.google.com/a/chromium.org/g/chromium-extensions)
- [Stack Overflow - Chrome Extensions](https://stackoverflow.com/questions/tagged/google-chrome-extension)

## Getting Help

### Internal Resources
1. **Specification Documents**: Check `specs/` directory
2. **Development Log**: See `DEVELOPMENT_LOG.md`
3. **Troubleshooting Guide**: See `TROUBLESHOOTING.md`

### External Support
1. **GitHub Issues**: Create issue for bugs or feature requests
2. **Documentation**: Refer to Chrome extension docs
3. **Community**: Ask questions on Stack Overflow

---

*This quickstart guide should get you productive quickly. For detailed implementation guidance, refer to the complete specification documents in the `specs/` directory.*