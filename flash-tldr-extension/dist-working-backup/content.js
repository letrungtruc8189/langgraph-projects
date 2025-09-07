// FlashTL;DR Content Script with AI Integration
console.log('⚡ FlashTL;DR content script loaded on:', window.location.href);

class AIClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async summarizeContent(content, options = {}) {
    const prompt = this.buildPrompt(content, options);
    
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a precise summarizer. Be faithful to the source. Avoid hallucinations. Return only valid JSON."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content || '{}');
      return this.validateAndFormatResult(result);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`AI summarization failed: ${errorMessage}`);
    }
  }

  buildPrompt(content, options) {
    return `Summarize this content. Output JSON with keys:
- "tldr": one 2-3 sentence summary
- "bullets": UP TO 10 concise takeaways bullets
- "actions": UP TO 10 actionable next steps (if applicable; else empty array)
- "qa": UP TO 10 Q&A pairs (question + short answer)
- "language": detected language code
- "confidence": confidence score 0-1

Return JSON only.
CONTENT:
${content.substring(0, 8000)}
Language: ${options.language || 'auto-detect'}
Tone: ${options.tone || 'neutral'}
Length: ${options.length || 'medium'}`;
  }

  validateAndFormatResult(result) {
    return {
      tldr: result.tldr || "Unable to generate summary",
      bullets: Array.isArray(result.bullets) ? result.bullets : [],
      actions: Array.isArray(result.actions) ? result.actions : [],
      qa: Array.isArray(result.qa) ? result.qa : [],
      language: result.language || 'en',
      confidence: typeof result.confidence === 'number' ? result.confidence : 0.5
    };
  }
}

class StorageManager {
  constructor() {
    this.SETTINGS_KEY = 'flash_tldr_settings';
  }

  async getSettings() {
    const result = await chrome.storage.sync.get(this.SETTINGS_KEY);
    return result[this.SETTINGS_KEY] || {
      apiKey: '',
      tone: 'neutral',
      length: 'medium',
      autoDetectLanguage: true,
      showOverlay: true
    };
  }

  async saveSettings(settings) {
    const currentSettings = await this.getSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    await chrome.storage.sync.set({ [this.SETTINGS_KEY]: updatedSettings });
  }
}

class ContentScript {
  constructor() {
    this.storage = new StorageManager();
    this.setupMessageListener();
    this.setupKeyboardShortcut();
  }
  
  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'ping') {
        sendResponse({ status: 'ready' });
        return true;
      }
      
      if (request.action === 'summarize') {
        this.handleSummarize().then(result => {
          sendResponse(result);
        }).catch(error => {
          sendResponse({ success: false, error: error.message });
        });
        return true;
      }
    });
  }
  
  setupKeyboardShortcut() {
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        this.handleSummarize();
      }
    });
  }
  
  async handleSummarize() {
    try {
      this.showLoadingOverlay();
      
      const extractedContent = this.extractContent();
      
      if (extractedContent.content.length < 100) {
        throw new Error('Not enough content to summarize. Please try on a page with more text.');
      }
      
      const settings = await this.storage.getSettings();
      if (!settings.apiKey) {
        throw new Error('API key not configured. Please set your OpenAI API key in the extension options.');
      }
      
      const aiClient = new AIClient(settings.apiKey);
      const summary = await aiClient.summarizeContent(extractedContent.content, {
        tone: settings.tone || 'neutral',
        length: settings.length || 'medium',
        language: this.detectLanguage(extractedContent.content)
      });
      
      this.hideLoadingOverlay();
      this.showSummaryOverlay(summary, extractedContent);
      
      return { success: true };
      
    } catch (error) {
      this.hideLoadingOverlay();
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.showErrorOverlay(errorMessage);
      return { success: false, error: errorMessage };
    }
  }
  
  extractContent() {
    const title = document.title;
    const url = window.location.href;
    const mainContent = document.querySelector('main, article, .content, [role="main"]') || document.body;
    const content = mainContent.textContent || '';
    const wordCount = content.split(/\s+/).length;
    
    return {
      title,
      url,
      content: content.trim(),
      wordCount,
      readingTime: Math.ceil(wordCount / 200)
    };
  }
  
  showLoadingOverlay() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'flash-tldr-loading';
    loadingDiv.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); z-index: 10000; display: flex; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
        <div style="background: white; padding: 40px; border-radius: 12px; text-align: center; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); max-width: 300px;">
          <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
          <h3 style="margin: 0 0 8px 0; color: #333; font-size: 18px;">⚡ Analyzing content...</h3>
          <p style="margin: 0; color: #666; font-size: 14px;">This may take a few seconds</p>
        </div>
      </div>
      <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
    `;
    document.body.appendChild(loadingDiv);
  }
  
  hideLoadingOverlay() {
    const loadingDiv = document.getElementById('flash-tldr-loading');
    if (loadingDiv) {
      loadingDiv.remove();
    }
  }
  
  showSummaryOverlay(summary, content) {
    const overlay = document.createElement('div');
    overlay.id = 'flash-tldr-overlay';
    overlay.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
        <div style="background: white; border-radius: 12px; max-width: 600px; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);">
          <div style="padding: 20px 24px 16px; border-bottom: 1px solid #e5e5e5; display: flex; justify-content: space-between; align-items: center;">
            <h2 style="font-size: 18px; font-weight: 600; color: #333; margin: 0; flex: 1; margin-right: 20px;">⚡ ${content.title}</h2>
            <button class="close-btn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666; padding: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background-color 0.2s;">×</button>
          </div>
          
          <div style="padding: 24px;">
            <div style="margin-bottom: 24px;">
              <h3 style="font-size: 16px; font-weight: 600; color: #333; margin: 0 0 12px 0;">📄 TL;DR</h3>
              <p style="font-size: 15px; line-height: 1.6; color: #555; background: #f8f9fa; padding: 16px; border-radius: 8px; border-left: 4px solid #667eea; margin: 0;">${summary.tldr}</p>
            </div>
            
            <div style="margin-bottom: 24px;">
              <h3 style="font-size: 16px; font-weight: 600; color: #333; margin: 0 0 12px 0;">📝 Key Points</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                ${summary.bullets.map(bullet => `
                  <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; position: relative; padding-left: 24px;">
                    <span style="color: #667eea; font-weight: bold; position: absolute; left: 0;">•</span>
                    ${bullet}
                  </li>
                `).join('')}
              </ul>
            </div>
            
            ${summary.actions.length > 0 ? `
            <div style="margin-bottom: 24px;">
              <h3 style="font-size: 16px; font-weight: 600; color: #333; margin: 0 0 12px 0;">✅ Action Items</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                ${summary.actions.map(action => `
                  <li style="padding: 8px 0; display: flex; align-items: center;">
                    <input type="checkbox" style="margin-right: 12px; transform: scale(1.2);">
                    ${action}
                  </li>
                `).join('')}
              </ul>
            </div>
            ` : ''}
            
            <div style="margin-bottom: 24px;">
              <h3 style="font-size: 16px; font-weight: 600; color: #333; margin: 0 0 12px 0;">❓ Q&A</h3>
              ${summary.qa.map(qa => `
                <div style="margin-bottom: 16px; padding: 16px; background: #f8f9fa; border-radius: 8px;">
                  <p style="font-weight: 600; color: #333; margin: 0 0 8px 0;"><strong>Q:</strong> ${qa.question}</p>
                  <p style="color: #555; margin: 0; line-height: 1.5;"><strong>A:</strong> ${qa.answer}</p>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div style="padding: 16px 24px; border-top: 1px solid #e5e5e5; display: flex; gap: 12px; justify-content: flex-end;">
            <button class="copy-btn" style="padding: 10px 20px; border: none; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; background: #6c757d; color: white;">📋 Copy</button>
            <button class="close-btn-footer" style="padding: 10px 20px; border: none; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; background: #6c757d; color: white;">Close</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Add event listeners
    const closeBtn = overlay.querySelector('.close-btn');
    const closeBtnFooter = overlay.querySelector('.close-btn-footer');
    const copyBtn = overlay.querySelector('.copy-btn');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => overlay.remove());
    }
    if (closeBtnFooter) {
      closeBtnFooter.addEventListener('click', () => overlay.remove());
    }
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const summaryText = `# ${content.title} - Summary

## TL;DR
${summary.tldr}

## Key Points
${summary.bullets.map(bullet => `• ${bullet}`).join('\n')}

## Action Items
${summary.actions.map(action => `- [ ] ${action}`).join('\n')}

## Q&A
${summary.qa.map(qa => `**Q:** ${qa.question}\n**A:** ${qa.answer}`).join('\n\n')}

---
*Generated by FlashTL;DR on ${new Date().toLocaleString()}*
*Source: ${content.url}*`;
        
        navigator.clipboard.writeText(summaryText).then(() => {
          copyBtn.textContent = '✅ Copied!';
          setTimeout(() => {
            copyBtn.textContent = '📋 Copy';
          }, 2000);
        });
      });
    }
    
    // Add keyboard listener for ESC
    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', handleKeydown);
      }
    };
    document.addEventListener('keydown', handleKeydown);
    
    // Animate in
    overlay.style.opacity = '0';
    requestAnimationFrame(() => {
      overlay.style.transition = 'opacity 0.3s ease';
      overlay.style.opacity = '1';
    });
  }

  showErrorOverlay(message) {
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #dc3545; color: white; padding: 16px 24px; border-radius: 8px; z-index: 10000; font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 400px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
        <h4 style="margin: 0 0 8px 0; font-size: 16px;">❌ Summarization Failed</h4>
        <p style="margin: 0; font-size: 14px; opacity: 0.9;">${message}</p>
        <button class="close-btn" style="position: absolute; top: 8px; right: 8px; background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0; width: 24px; height: 24px;">×</button>
      </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Add close button functionality
    const closeBtn = errorDiv.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => errorDiv.remove());
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentElement) {
        errorDiv.remove();
      }
    }, 5000);
  }

  detectLanguage(text) {
    const words = text.toLowerCase().split(/\s+/);
    const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const spanishWords = ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le'];
    const frenchWords = ['le', 'de', 'et', 'à', 'un', 'il', 'être', 'et', 'en', 'avoir', 'que', 'pour', 'dans', 'ce'];
    const vietnameseWords = ['có', 'là', 'và', 'trong', 'như', 'cho', 'với', 'thế', 'nên', 'cũng', 'vào'];
    
    const englishCount = englishWords.reduce((count, word) => 
      count + words.filter(w => w === word).length, 0);
    const spanishCount = spanishWords.reduce((count, word) => 
      count + words.filter(w => w === word).length, 0);
    const frenchCount = frenchWords.reduce((count, word) => 
      count + words.filter(w => w === word).length, 0);
    const vietnameseCount = vietnameseWords.reduce((count, word) => 
      count + words.filter(w => w === word).length, 0);
    
    if (spanishCount > englishCount && spanishCount > frenchCount) return 'es';
    if (frenchCount > englishCount && frenchCount > spanishCount) return 'fr';
    if (vietnameseCount > englishCount && vietnameseCount > spanishCount && vietnameseCount > frenchCount) return 'vi';
    return 'en';
  }
}

// Initialize content script
new ContentScript();
