import { StorageManager } from '../lib/storage-manager';
import { AIClient } from '../lib/ai-client';

class OptionsController {
  private storage: StorageManager;
  
  constructor() {
    this.storage = new StorageManager();
    this.initializeUI();
    this.loadSettings();
    this.loadHistory();
    this.loadUsage();
  }
  
  private async initializeUI() {
    // Form elements
    const apiKeyInput = document.getElementById('apiKey') as HTMLInputElement;
    const toneSelect = document.getElementById('tone') as HTMLSelectElement;
    const lengthSelect = document.getElementById('length') as HTMLSelectElement;
    const autoDetectCheckbox = document.getElementById('autoDetectLanguage') as HTMLInputElement;
    
    // Buttons
    const saveBtn = document.getElementById('saveBtn') as HTMLButtonElement;
    const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;
    const testApiKeyBtn = document.getElementById('testApiKey') as HTMLButtonElement;
    const clearHistoryBtn = document.getElementById('clearHistory') as HTMLButtonElement;
    const exportDataBtn = document.getElementById('exportData') as HTMLButtonElement;
    const upgradeBtn = document.getElementById('upgradeBtn') as HTMLButtonElement;
    
    // Event listeners
    saveBtn.addEventListener('click', () => this.saveSettings());
    resetBtn.addEventListener('click', () => this.resetSettings());
    testApiKeyBtn.addEventListener('click', () => this.testApiKey());
    clearHistoryBtn.addEventListener('click', () => this.clearHistory());
    exportDataBtn.addEventListener('click', () => this.exportData());
    // upgradeBtn.addEventListener('click', () => this.showUpgradeInfo()); // DISABLED FOR TESTING
    // Hide upgrade button for testing
    upgradeBtn.style.display = 'none';
    
    // Auto-save on change
    [apiKeyInput, toneSelect, lengthSelect, autoDetectCheckbox].forEach(element => {
      element.addEventListener('change', () => this.saveSettings());
    });
  }
  
  private async loadSettings() {
    const settings = await this.storage.getSettings();
    
    const apiKeyElement = document.getElementById('apiKey') as HTMLInputElement;
    const toneElement = document.getElementById('tone') as HTMLSelectElement;
    const lengthElement = document.getElementById('length') as HTMLSelectElement;
    const autoDetectElement = document.getElementById('autoDetectLanguage') as HTMLInputElement;
    
    if (apiKeyElement) apiKeyElement.value = settings.apiKey;
    if (toneElement) toneElement.value = settings.tone;
    if (lengthElement) lengthElement.value = settings.length;
    if (autoDetectElement) autoDetectElement.checked = settings.autoDetectLanguage;
  }
  
  private async loadUsage() {
    const usage = await this.storage.getUsage();
    
    const dailyUsageElement = document.getElementById('dailyUsage');
    const totalUsageElement = document.getElementById('totalUsage');
    const planTypeElement = document.getElementById('planType');
    
    if (dailyUsageElement) dailyUsageElement.textContent = usage.dailyCount.toString();
    if (totalUsageElement) totalUsageElement.textContent = usage.totalCount.toString();
    if (planTypeElement) planTypeElement.textContent = usage.isPro ? 'Pro (Unlimited)' : 'Free (10/day)';
  }
  
  private async loadHistory() {
    const history = await this.storage.getHistory();
    const historyList = document.getElementById('historyList');
    
    if (!historyList) return;
    
    if (history.length === 0) {
      historyList.innerHTML = `
        <div class="empty-state">
          <h3>📚 No summaries yet</h3>
          <p>Start summarizing pages to see your history here</p>
        </div>
      `;
      return;
    }
    
    historyList.innerHTML = history.map(item => `
      <div class="history-item" data-id="${item.id}">
        <div class="history-title">${item.title}</div>
        <div class="history-url">${item.url}</div>
        <div class="history-meta">
          <span>${new Date(item.timestamp).toLocaleString()}</span>
          <div class="history-actions">
            <button onclick="this.viewSummary('${item.id}')">View</button>
            <button onclick="this.deleteSummary('${item.id}')">Delete</button>
          </div>
        </div>
      </div>
    `).join('');
    
    // Add click handlers
    historyList.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!(e.target as HTMLElement).closest('button')) {
          const id = item.getAttribute('data-id');
          if (id) this.viewSummary(id);
        }
      });
    });
  }
  
  private async saveSettings() {
    const settings = {
      apiKey: (document.getElementById('apiKey') as HTMLInputElement).value,
      tone: (document.getElementById('tone') as HTMLSelectElement).value as any,
      length: (document.getElementById('length') as HTMLSelectElement).value as any,
      autoDetectLanguage: (document.getElementById('autoDetectLanguage') as HTMLInputElement).checked
    };
    
    await this.storage.saveSettings(settings);
    this.showStatus('Settings saved!', 'success');
  }
  
  private async resetSettings() {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      await this.storage.saveSettings({
        apiKey: '',
        tone: 'neutral',
        length: 'medium',
        autoDetectLanguage: true,
        showOverlay: true
      });
      await this.loadSettings();
      this.showStatus('Settings reset to defaults', 'success');
    }
  }
  
  private async testApiKey() {
    const apiKey = (document.getElementById('apiKey') as HTMLInputElement).value;
    
    if (!apiKey) {
      this.showApiStatus('Please enter an API key', 'error');
      return;
    }
    
    const testBtn = document.getElementById('testApiKey') as HTMLButtonElement;
    const originalText = testBtn.textContent;
    testBtn.textContent = 'Testing...';
    testBtn.disabled = true;
    
    try {
      const aiClient = new AIClient(apiKey);
      await aiClient.summarizeContent('Test content for API validation.', {
        tone: 'neutral',
        length: 'short'
      });
      
      this.showApiStatus('✅ API key is valid!', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.showApiStatus(`❌ API test failed: ${errorMessage}`, 'error');
    } finally {
      testBtn.textContent = originalText;
      testBtn.disabled = false;
    }
  }
  
  private async clearHistory() {
    if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      await this.storage.clearHistory();
      await this.loadHistory();
      this.showStatus('History cleared', 'success');
    }
  }
  
  private async exportData() {
    const history = await this.storage.getHistory();
    const settings = await this.storage.getSettings();
    const usage = await this.storage.getUsage();
    
    const exportData = {
      settings: {
        tone: settings.tone,
        length: settings.length,
        autoDetectLanguage: settings.autoDetectLanguage
      },
      usage: {
        totalCount: usage.totalCount,
        isPro: usage.isPro
      },
      history: history.map(item => ({
        title: item.title,
        url: item.url,
        timestamp: item.timestamp,
        summary: item.summary
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flash-tldr-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    this.showStatus('Data exported successfully!', 'success');
  }
  
  private showUpgradeInfo() {
    alert('Pro features coming soon!\n\n- Unlimited daily summaries\n- Advanced summarization options\n- Team collaboration features\n- Priority support');
  }
  
  private async viewSummary(id: string) {
    const history = await this.storage.getHistory();
    const item = history.find(h => h.id === id);
    
    if (item) {
      const summaryWindow = window.open('', '_blank', 'width=600,height=500');
      if (summaryWindow) {
        summaryWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${item.title} - Summary</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; line-height: 1.6; }
            h1 { color: #333; margin-bottom: 20px; }
            h2 { color: #667eea; margin-top: 30px; margin-bottom: 15px; }
            .tldr { background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; }
            ul { margin: 10px 0; }
            li { margin: 5px 0; }
            .qa-item { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 8px; }
            .qa-question { font-weight: 600; margin-bottom: 8px; }
            .meta { color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <h1>${item.title}</h1>
          <p><strong>Source:</strong> <a href="${item.url}" target="_blank">${item.url}</a></p>
          
          <h2>📄 TL;DR</h2>
          <div class="tldr">${item.summary.tldr}</div>
          
          <h2>📝 Key Points</h2>
          <ul>
            ${item.summary.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
          </ul>
          
          ${item.summary.actions.length > 0 ? `
          <h2>✅ Action Items</h2>
          <ul>
            ${item.summary.actions.map(action => `<li>${action}</li>`).join('')}
          </ul>
          ` : ''}
          
          <h2>❓ Q&A</h2>
          ${item.summary.qa.map(qa => `
            <div class="qa-item">
              <div class="qa-question">${qa.question}</div>
              <div>${qa.answer}</div>
            </div>
          `).join('')}
          
          <div class="meta">
            Generated on ${new Date(item.timestamp).toLocaleString()}<br>
            Word count: ${item.wordCount} | Reading time: ${item.readingTime} min
          </div>
        </body>
        </html>
      `);
      }
    }
  }
  
  private async deleteSummary(id: string) {
    if (confirm('Are you sure you want to delete this summary?')) {
      await this.storage.deleteSummary(id);
      await this.loadHistory();
      this.showStatus('Summary deleted', 'success');
    }
  }
  
  private showStatus(message: string, type: 'success' | 'error') {
    // Create a temporary status message
    const status = document.createElement('div');
    status.textContent = message;
    status.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#28a745' : '#dc3545'};
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      z-index: 1000;
      font-size: 14px;
    `;
    
    document.body.appendChild(status);
    setTimeout(() => status.remove(), 3000);
  }
  
  private showApiStatus(message: string, type: 'success' | 'error') {
    const statusElement = document.getElementById('apiStatus');
    if (statusElement) {
      statusElement.textContent = message;
      statusElement.className = `status-text ${type}`;
    }
  }
}

// Initialize options page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => new OptionsController());
