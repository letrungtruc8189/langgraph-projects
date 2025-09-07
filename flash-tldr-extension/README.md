# FlashTL;DR - AI Content Summarizer Extension

A Chrome/Edge extension that provides instant AI-powered content summaries with TL;DR, key points, and action items.

## Features

- ⚡ **One-click summarization** - Summarize any webpage instantly
- 📄 **Three focused formats** - TL;DR, bullet points, and action items
- 🎨 **Customizable tone** - Neutral, friendly, or professional
- 📏 **Adjustable length** - Short, medium, or detailed summaries
- ⌨️ **Keyboard shortcut** - Alt+S to summarize quickly
- 📚 **History tracking** - Save and manage your summaries
- 🔒 **Privacy-first** - Your data stays local
- 🌍 **Smart Language Detection** - Auto-detects and responds in source language
  - **Vietnamese**: Full support with diacritic detection
  - **Chinese, Japanese, Korean**: Unicode-based detection
  - **English, French, German, Spanish**: Word pattern analysis
  - **10+ Languages**: Comprehensive multilingual support

## Installation

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   cd flash-tldr-extension
   npm install
   ```

2. **Build the extension:**
   ```bash
   npm run build
   ```

3. **Load in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked" and select the `dist` folder
   - The extension icon should appear in your toolbar

### Production Build

```bash
npm run pack
```

This creates a `flash-tldr-extension.zip` file ready for the Chrome Web Store.

## Configuration

1. **Get OpenAI API Key:**
   - Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key (starts with `sk-`)

2. **Configure Extension:**
   - Click the extension icon in your toolbar
   - Click "⚙️ Settings"
   - Paste your API key in the "OpenAI API Key" field
   - Click "Test Connection" to verify
   - Save settings

## Usage

### Basic Usage

1. **Navigate to any webpage** with content you want to summarize
2. **Click the extension icon** or press `Alt+S`
3. **Wait for processing** (usually 2-5 seconds)
4. **View the summary** in the overlay that appears
5. **Copy or export** the summary as needed

### Keyboard Shortcut

- Press `Alt+S` on any webpage to instantly summarize it

### Summary Formats

- **TL;DR**: 2-3 sentence overview
- **Key Points**: Up to 10 bullet points with main ideas
- **Action Items**: Up to 10 actionable next steps (when applicable)

## Settings

Access settings by clicking the extension icon and then "⚙️ Settings":

- **Tone**: Choose between neutral, friendly, or professional
- **Length**: Select short, medium, or detailed summaries
- **Auto-detect language**: Automatically detect content language
- **API Key**: Configure your OpenAI API key
- **History**: View, export, or clear your summary history

## Privacy & Security

- **Local storage**: All settings and history stored locally in your browser
- **API calls**: Only content text is sent to OpenAI for processing
- **No tracking**: No analytics or user tracking
- **Secure**: API key stored securely in Chrome's sync storage

## Troubleshooting

### Common Issues

1. **"API key not configured" error:**
   - Go to extension settings and add your OpenAI API key
   - Make sure the key starts with `sk-`

2. **"Not enough content to summarize" error:**
   - Try on pages with more text content
   - Some pages may have content that's hard to extract

3. **Extension not working:**
   - Refresh the webpage and try again
   - Check if the extension is enabled in Chrome
   - Try reloading the extension in `chrome://extensions/`

4. **API errors:**
   - Check your OpenAI API key is valid
   - Ensure you have sufficient API credits
   - Try the "Test Connection" button in settings

### Getting Help

- Check the extension settings for error messages
- View the browser console for detailed error logs
- Ensure your OpenAI API key has sufficient credits

## Development

### Project Structure

```
src/
├── manifest.json          # Extension manifest
├── popup/                 # Popup interface
├── content/               # Content script
├── background/            # Background service worker
├── options/               # Settings page
├── lib/                   # Shared utilities
│   ├── ai-client.ts       # OpenAI integration
│   ├── content-extractor.ts # Content extraction (with Readability)
│   ├── content-extractor-simple.ts # Simplified content extraction
│   └── storage-manager.ts # Data storage
└── types.ts               # TypeScript types
```

### Development Documentation

- 📋 **[DEVELOPMENT_LOG.md](./DEVELOPMENT_LOG.md)** - Complete debugging and development history
- 🔧 **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions
- 📖 **[INSTALLATION.md](./INSTALLATION.md)** - Setup and installation guide

### Building

```bash
# Development build with watch mode
npm run dev

# Production build
npm run build

# Create distribution package
npm run pack
```

### Testing

1. Load the extension in Chrome
2. Test on various websites (news, blogs, documentation)
3. Verify all features work correctly
4. Check error handling with invalid API keys

### Key Technical Notes

- **Content Extraction**: Enhanced with **Crawl4AI-inspired techniques** for superior content focus
  - 🎯 **Fit Markdown**: Implements Crawl4AI's proven content extraction methodology
  - 📊 **Advanced Scoring**: Multi-factor content quality analysis with semantic HTML bonuses
  - 🚫 **Overlay Removal**: Automatically removes popups, modals, and interference elements
  - 🔍 **Multi-Strategy**: Semantic selectors → Content patterns → Density analysis fallback
  - 🧹 **Smart Filtering**: Removes ads, navigation, social elements, and boilerplate content
  - ✨ **Text Normalization**: Unicode handling, pattern detection, and whitespace optimization
  - 🌍 **Vietnamese Support**: Special handling for Vietnamese news sites and content patterns
  - ⚡ **No Dependencies**: Pure JavaScript implementation for maximum compatibility
- **Language Intelligence**: Advanced multilingual detection and response system
  - 🔍 **Multi-Strategy Detection**: HTML attributes, URL patterns, content analysis
  - 🇻🇳 **Vietnamese Excellence**: Diacritic detection, domain patterns, cultural context
  - 🌏 **Asian Language Support**: Chinese, Japanese, Korean Unicode detection
  - 🤖 **Native AI Prompts**: Language-specific prompts for natural, contextual summaries
  - 📝 **Cultural Adaptation**: Proper terminology, tone, and formatting per language
- **CSP Compliance**: `devtool: false` in webpack config prevents `eval()` usage
- **Build Process**: Includes automatic icon generation via Python script
- **Architecture**: Lightweight, fast, and reliable with comprehensive fallback strategies

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Roadmap

- [ ] PDF support
- [ ] YouTube transcript summarization
- [ ] Team collaboration features
- [ ] Advanced summarization options
- [ ] Mobile app companion
- [ ] Integration with note-taking apps
