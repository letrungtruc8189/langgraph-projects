import { ContentExtractorSimple } from '../lib/content-extractor-simple';
import { AIClient } from '../lib/ai-client';
import { StorageManager } from '../lib/storage-manager';
import { SummaryResult } from '../types';

class ContentScript {
  private storage: StorageManager;
  
  constructor() {
    this.storage = new StorageManager();
    this.setupMessageListener();
    this.setupKeyboardShortcut();
  }
  
  private setupMessageListener() {
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
        return true; // Keep message channel open for async response
      }
    });
  }
  
  private setupKeyboardShortcut() {
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        this.handleSummarize();
      }
    });
  }
  
  private async handleSummarize() {
    try {
      // Show loading state
      this.showLoadingOverlay();
      
      // Extract content
      const content = await ContentExtractorSimple.extractContent();
      
      if (content.content.length < 100) {
        throw new Error('Not enough content to summarize. Please try on a page with more text.');
      }
      
      // Get AI client
      const settings = await this.storage.getSettings();
      if (!settings.apiKey) {
        throw new Error('API key not configured. Please set your OpenAI API key in the extension settings.');
      }
      
      const aiClient = new AIClient(settings.apiKey);
      
      // Generate summary
      const summary = await aiClient.summarizeContent(content.content, {
        tone: settings.tone || 'neutral',
        length: settings.length || 'medium',
        language: content.language || 'en'
      });
      
      // Show overlay
      this.hideLoadingOverlay();
      this.showSummaryOverlay(summary, content);
      
      // Save to history
      await this.storage.saveSummary({
        url: content.url,
        title: content.title,
        summary,
        timestamp: Date.now(),
        wordCount: content.wordCount,
        readingTime: content.readingTime
      });
      
      return { success: true };
      
    } catch (error) {
      this.hideLoadingOverlay();
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.showErrorOverlay(errorMessage);
      return { success: false, error: errorMessage };
    }
  }
  
  private showLoadingOverlay() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'flash-tldr-loading';
    loadingDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      ">
        <div style="
          background: white;
          padding: 40px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          max-width: 300px;
        ">
          <div style="
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          "></div>
          <h3 style="margin: 0 0 8px 0; color: #333; font-size: 18px;">⚡ Analyzing content...</h3>
          <p style="margin: 0; color: #666; font-size: 14px;">This may take a few seconds</p>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    
    document.body.appendChild(loadingDiv);
  }
  
  private hideLoadingOverlay() {
    const loadingDiv = document.getElementById('flash-tldr-loading');
    if (loadingDiv) {
      loadingDiv.remove();
    }
  }
  
  private showSummaryOverlay(summary: SummaryResult, content: any) {
    const overlay = this.createSummaryOverlay(summary, content);
    document.body.appendChild(overlay);
    
    // Animate in
    overlay.style.opacity = '0';
    overlay.style.transform = 'translateY(-20px)';
    requestAnimationFrame(() => {
      overlay.style.transition = 'all 0.3s ease';
      overlay.style.opacity = '1';
      overlay.style.transform = 'translateY(0)';
    });
  }
  
  private createSummaryOverlay(summary: SummaryResult, content: any): HTMLElement {
    const overlay = document.createElement('div');
    overlay.id = 'flash-tldr-overlay';
    overlay.innerHTML = `
      <div class="overlay-content">
        <div class="overlay-header">
          <h2>⚡ ${content.title}</h2>
          <button class="close-btn" onclick="this.closest('#flash-tldr-overlay').remove()">×</button>
        </div>
        
        <div class="overlay-body">
          <div class="section">
            <h3>📄 TL;DR</h3>
            <p class="tldr-text">${summary.tldr}</p>
          </div>
          
          <div class="section">
            <h3>📝 Key Points</h3>
            <ul class="bullets-list">
              ${summary.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
            </ul>
          </div>
          
          ${summary.actions.length > 0 ? `
          <div class="section">
            <h3>✅ Action Items</h3>
            <ul class="actions-list">
              ${summary.actions.map(action => `<li><input type="checkbox"> ${action}</li>`).join('')}
            </ul>
          </div>
          ` : ''}
          
        </div>
        
        <div class="overlay-footer">
          <button class="btn btn-secondary" onclick="navigator.clipboard.writeText(this.closest('#flash-tldr-overlay').querySelector('.summary-text').textContent)">📋 Copy</button>
          <button class="btn btn-primary" onclick="this.exportSummary()">💾 Export</button>
          <button class="btn btn-secondary" onclick="this.closest('#flash-tldr-overlay').remove()">Close</button>
        </div>
      </div>
      
      <div class="summary-text" style="display: none;">
        # ${content.title} - Summary

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
*Source: ${window.location.href}*
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #flash-tldr-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      }
      
      .overlay-content {
        background: white;
        border-radius: 12px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      }
      
      .overlay-header {
        padding: 20px 24px 16px;
        border-bottom: 1px solid #e5e5e5;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .overlay-header h2 {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin: 0;
        flex: 1;
        margin-right: 20px;
      }
      
      .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
      }
      
      .close-btn:hover {
        background-color: #f5f5f5;
      }
      
      .overlay-body {
        padding: 24px;
      }
      
      .section {
        margin-bottom: 24px;
      }
      
      .section h3 {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 12px 0;
        display: flex;
        align-items: center;
      }
      
      .tldr-text {
        font-size: 15px;
        line-height: 1.6;
        color: #555;
        background: #f8f9fa;
        padding: 16px;
        border-radius: 8px;
        border-left: 4px solid #667eea;
        margin: 0;
      }
      
      .bullets-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      .bullets-list li {
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
        position: relative;
        padding-left: 24px;
      }
      
      .bullets-list li:before {
        content: "•";
        color: #667eea;
        font-weight: bold;
        position: absolute;
        left: 0;
      }
      
      .actions-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      .actions-list li {
        padding: 8px 0;
        display: flex;
        align-items: center;
      }
      
      .actions-list input[type="checkbox"] {
        margin-right: 12px;
        transform: scale(1.2);
      }
      
      .qa-item {
        margin-bottom: 16px;
        padding: 16px;
        background: #f8f9fa;
        border-radius: 8px;
      }
      
      .qa-question {
        font-weight: 600;
        color: #333;
        margin: 0 0 8px 0;
      }
      
      .qa-answer {
        color: #555;
        margin: 0;
        line-height: 1.5;
      }
      
      .overlay-footer {
        padding: 16px 24px;
        border-top: 1px solid #e5e5e5;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }
      
      .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .btn-primary {
        background: #667eea;
        color: white;
      }
      
      .btn-primary:hover {
        background: #5a6fd8;
      }
      
      .btn-secondary {
        background: #6c757d;
        color: white;
      }
      
      .btn-secondary:hover {
        background: #545b62;
      }
    `;
    
    overlay.appendChild(style);
    
    // Add export functionality
    const exportBtn = overlay.querySelector('.btn-primary');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const summaryTextElement = overlay.querySelector('.summary-text');
        if (summaryTextElement) {
          const summaryText = summaryTextElement.textContent || '';
          const blob = new Blob([summaryText], { type: 'text/markdown' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `summary-${Date.now()}.md`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    }
    
    // Add keyboard listener for ESC
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', handleKeydown);
      }
    };
    document.addEventListener('keydown', handleKeydown);
    
    return overlay;
  }
  
  private showErrorOverlay(message: string) {
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      ">
        <h4 style="margin: 0 0 8px 0; font-size: 16px;">❌ Summarization Failed</h4>
        <p style="margin: 0; font-size: 14px; opacity: 0.9;">${message}</p>
        <button onclick="this.parentElement.parentElement.remove()" style="
          position: absolute;
          top: 8px;
          right: 8px;
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
        ">×</button>
      </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentElement) {
        errorDiv.remove();
      }
    }, 5000);
  }
  
}

// Initialize content script
console.log('⚡ FlashTL;DR content script loaded on:', window.location.href);
new ContentScript();
