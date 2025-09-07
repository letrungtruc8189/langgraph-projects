# 🔧 FlashTL;DR - Troubleshooting Guide

## "Could not establish connection" Error

This error occurs when the popup can't communicate with the content script. Here's how to fix it:

### ✅ **Quick Fix (Most Common)**
1. **Refresh the webpage** you're trying to summarize
2. **Click the extension icon** again
3. **Try summarizing** - it should work now!

### 🔍 **Why This Happens**
- Content scripts only load on pages you visit **after** installing the extension
- Pages you had open before installing need to be refreshed
- Some pages (like `chrome://` pages) can't run content scripts

### 🛠️ **Step-by-Step Solution**

#### 1. Reload the Extension
1. Go to `chrome://extensions/`
2. Find "FlashTL;DR" 
3. Click the **refresh/reload button** (🔄)
4. Go back to your webpage and try again

#### 2. Refresh the Webpage
1. Press `F5` or `Ctrl+R` (Windows) / `Cmd+R` (Mac)
2. Wait for page to fully load
3. Click extension icon and try summarizing

#### 3. Check Page Compatibility
- ✅ **Works on**: Regular websites, news sites, blogs, documentation
- ❌ **Doesn't work on**: `chrome://` pages, `file://` pages, some secure sites

#### 4. Verify Extension is Active
1. Look for the ⚡ icon in your toolbar
2. If missing, go to `chrome://extensions/` and enable it
3. Make sure it's not disabled

### 🔧 **Advanced Troubleshooting**

#### Check Console for Errors
1. Right-click on the webpage → "Inspect"
2. Go to "Console" tab
3. Look for any red error messages
4. Try the extension again and see if new errors appear

#### Silent Content Script Failures
If the extension shows errors but no console logs appear:
- **Cause**: Content script is crashing silently due to dependency issues
- **Solution**: This usually indicates a build or compatibility problem
- **Fix**: Try rebuilding the extension:
  ```bash
  rm -rf dist node_modules/.cache
  npm install
  npm run build
  ```

#### Test on Different Pages
Try the extension on:
- A news website (like CNN, BBC)
- A blog post
- Wikipedia article
- Any article with lots of text

#### Reinstall Extension
1. Go to `chrome://extensions/`
2. Remove "FlashTL;DR" (click trash icon)
3. Click "Load unpacked" again
4. Select the `dist` folder
5. Test on a fresh webpage

### 📋 **Common Error Messages & Solutions**

| Error Message | Solution |
|---------------|----------|
| "Could not establish connection" | Refresh the webpage |
| "Content script not loaded" | Reload extension + refresh page |
| "No active tab found" | Make sure you have a webpage open |
| "API key not configured" | Go to Settings and add your OpenAI API key |
| "Not enough content to summarize" | Try on a page with more text content |

### 🔨 **Build & Development Issues**

#### Python/PIL Dependency Error
If you see `ModuleNotFoundError: No module named 'PIL'` during build:
```bash
# On macOS
brew install pillow

# On other systems  
pip install Pillow
```

#### Webpack Cache Problems
If builds produce inconsistent results:
```bash
# Clear webpack cache
rm -rf node_modules/.cache/webpack
npm run build
```

#### Content Security Policy (CSP) Violations
If extension fails to load with CSP errors:
- Ensure `devtool: false` is set in `webpack.config.js`
- This prevents webpack from using `eval()` which violates Chrome extension CSP

#### Silent Content Script Failures
If extension shows errors but no console logs:
- Usually indicates dependency compatibility issues
- Try a clean rebuild:
  ```bash
  rm -rf dist node_modules/.cache
  npm install  
  npm run build
  ```

### 🎯 **Testing Steps**

1. **Install/Reload Extension**
   ```bash
   npm run build  # Rebuild if you made changes
   # Then reload in chrome://extensions/
   ```

2. **Test on a Simple Page**
   - Go to Wikipedia (any article)
   - Click extension icon ⚡
   - Should work immediately

3. **Configure API Key**
   - Click extension icon → Settings
   - Add your OpenAI API key
   - Test connection

4. **Try Summarizing**
   - Click "Summarize Page" button
   - Wait 2-5 seconds
   - Should see beautiful overlay with summary

### 🚨 **Still Not Working?**

If you're still having issues:

1. **Check Browser Console**
   - Right-click → Inspect → Console
   - Look for error messages
   - Take a screenshot of any errors

2. **Try Different Browser**
   - Test in Chrome (recommended)
   - Or try Edge (should work too)

3. **Check Extension Permissions**
   - Go to `chrome://extensions/`
   - Click "Details" on FlashTL;DR
   - Make sure all permissions are granted

4. **Verify Build**
   ```bash
   # Make sure dist folder has all files
   ls -la dist/
   # Should see: manifest.json, popup.html, content.js, etc.
   ```

### 💡 **Pro Tips**

- **Always refresh** the page after installing/reloading the extension
- **Test on simple pages** first (Wikipedia, news sites)
- **Check console** for detailed error messages
- **Make sure API key** is valid and has credits
- **Try keyboard shortcut** `Alt+S` as alternative to clicking icon

### 🆘 **Need Help?**

If nothing works:
1. Take a screenshot of the error
2. Check browser console for error messages
3. Try on a different website
4. Make sure your OpenAI API key is valid

The extension should work perfectly once the content script loads properly! 🚀
