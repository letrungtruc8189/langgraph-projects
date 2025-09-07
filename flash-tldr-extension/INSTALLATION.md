# FlashTL;DR Extension - Installation Guide

## Quick Start (5 minutes)

### 1. Build the Extension
```bash
cd flash-tldr-extension
npm install
npm run build
```

**Note**: The build process automatically generates the required icon files (16px, 32px, 48px, 128px) with a lightning bolt design.

### 2. Load in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top right)
3. Click **"Load unpacked"**
4. Select the `dist` folder from this project
5. The extension icon ⚡ should appear in your toolbar

### 3. Get OpenAI API Key
1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Sign up/login to OpenAI
3. Create a new API key
4. Copy the key (starts with `sk-`)

### 4. Configure Extension
1. Click the extension icon ⚡ in your toolbar
2. Click **"⚙️ Settings"**
3. Paste your API key in the "OpenAI API Key" field
4. Click **"Test Connection"** to verify
5. Click **"Save Settings"**

### 5. Start Summarizing!
1. Go to any webpage with content
2. Click the extension icon or press `Alt+S`
3. Wait 2-5 seconds for the summary
4. View the beautiful overlay with TL;DR, bullets, and Q&A!

## Troubleshooting

### Extension Not Working?
- **Refresh the webpage** and try again
- Check if extension is enabled in `chrome://extensions/`
- Try reloading the extension (click the refresh icon)

### API Key Issues?
- Make sure your key starts with `sk-`
- Check you have credits in your OpenAI account
- Try the "Test Connection" button in settings

### No Content Found?
- Try on pages with more text content
- Some pages may have content that's hard to extract
- Try refreshing the page and summarizing again

### Build Errors?
```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

## Features

- ⚡ **One-click summarization** - Click icon or press Alt+S
- 📄 **Multiple formats** - TL;DR, bullets, actions, Q&A
- 🎨 **Customizable** - Choose tone and length
- 📚 **History** - Save and manage summaries
- 🔒 **Privacy-first** - Data stays local
- ⌨️ **Keyboard shortcut** - Alt+S for quick access

## Usage Examples

### News Articles
Perfect for quickly understanding long news articles, getting key points and context.

### Documentation
Great for technical docs - get TL;DR and action items for implementation.

### Blog Posts
Ideal for long-form content, extracting main ideas and takeaways.

### Research Papers
Helpful for academic content, getting summaries and Q&A for understanding.

## Settings

Access via extension icon → ⚙️ Settings:

- **Tone**: Neutral, Friendly, Professional
- **Length**: Short (2-3 sentences), Medium (5 bullets), Detailed
- **Language**: Auto-detect or manual
- **API Key**: Your OpenAI API key
- **History**: View, export, or clear summaries

## Keyboard Shortcuts

- `Alt+S` - Summarize current page
- `Esc` - Close summary overlay

## Privacy & Security

- ✅ All data stored locally in your browser
- ✅ Only content text sent to OpenAI (no personal data)
- ✅ No tracking or analytics
- ✅ API key stored securely in Chrome sync storage
- ✅ You can delete all data anytime

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key is correct
3. Ensure you have OpenAI credits
4. Try on different websites

## Development

To modify the extension:
1. Edit files in `src/` directory
2. Run `npm run dev` for watch mode
3. Reload extension in Chrome
4. Test your changes

## License

MIT License - Free to use and modify
