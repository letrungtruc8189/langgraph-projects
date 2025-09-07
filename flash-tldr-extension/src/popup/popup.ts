import { AIClient } from '../lib/ai-client';
import { StorageManager } from '../lib/storage-manager';

class PopupController {
  private storage: StorageManager;
  private aiClient: AIClient | null = null;
  
  constructor() {
    this.storage = new StorageManager();
    this.initializeUI();
    this.loadSettings();
  }
  
  private async initializeUI() {
    const summarizeBtn = document.getElementById('summarizeBtn') as HTMLButtonElement;
    const optionsBtn = document.getElementById('optionsBtn') as HTMLButtonElement;
    const historyBtn = document.getElementById('historyBtn') as HTMLButtonElement;
    const toneSelect = document.getElementById('tone') as HTMLSelectElement;
    const lengthSelect = document.getElementById('length') as HTMLSelectElement;
    
    summarizeBtn.addEventListener('click', () => this.handleSummarize());
    optionsBtn.addEventListener('click', () => chrome.runtime.openOptionsPage());
    historyBtn.addEventListener('click', () => this.showHistory());
    
    toneSelect.addEventListener('change', () => this.saveSettings());
    lengthSelect.addEventListener('change', () => this.saveSettings());
    
    await this.updateUsageInfo();
  }
  
  private async loadSettings() {
    const settings = await this.storage.getSettings();
    const apiKey = settings.apiKey;
    
    // Set UI values
    (document.getElementById('tone') as HTMLSelectElement).value = settings.tone;
    (document.getElementById('length') as HTMLSelectElement).value = settings.length;
    
    if (apiKey) {
      this.aiClient = new AIClient(apiKey);
    } else {
      this.showApiKeyRequired();
    }
  }
  
  private async saveSettings() {
    const tone = (document.getElementById('tone') as HTMLSelectElement).value;
    const length = (document.getElementById('length') as HTMLSelectElement).value;
    
    await this.storage.saveSettings({ 
      tone: tone as 'neutral' | 'friendly' | 'professional', 
      length: length as 'short' | 'medium' | 'detailed' 
    });
  }
  
  private async handleSummarize() {
    if (!this.aiClient) {
      this.showApiKeyRequired();
      return;
    }
    
    const button = document.getElementById('summarizeBtn') as HTMLButtonElement;
    const buttonText = button.querySelector('.btn-text') as HTMLSpanElement;
    const buttonLoader = button.querySelector('.btn-loader') as HTMLSpanElement;
    
    try {
      button.disabled = true;
      buttonText.style.display = 'none';
      buttonLoader.style.display = 'inline';
      
      // Check usage limits - DISABLED FOR TESTING
      const usage = await this.storage.getUsage();
      // if (usage.dailyCount >= 10 && !usage.isPro) {
      //   this.showUpgradePrompt();
      //   return;
      // }
      
      // Send message to content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.id) {
        throw new Error('No active tab found');
      }
      
      try {
        // First, check if content script is loaded
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'ping' });
        
        if (!response) {
          throw new Error('Content script not loaded. Please refresh the page and try again.');
        }
        
        // Now send the actual summarize request
        const summarizeResponse = await chrome.tabs.sendMessage(tab.id, { action: 'summarize' });
        
        if (summarizeResponse && summarizeResponse.success) {
          // Update usage
          await this.storage.incrementUsage();
          await this.updateUsageInfo();
          
          // Show success message
          this.showStatus('✅ Summary generated!', 'success');
          
          // Close popup after successful summary
          setTimeout(() => window.close(), 1500);
        } else {
          throw new Error(response?.error || 'Failed to generate summary');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        if (errorMessage.includes('Could not establish connection')) {
          throw new Error('Please refresh the page and try again. The extension needs to reload on this page.');
        }
        throw error;
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.showStatus(`❌ Error: ${errorMessage}`, 'error');
    } finally {
      button.disabled = false;
      buttonText.style.display = 'inline';
      buttonLoader.style.display = 'none';
    }
  }
  
  private async updateUsageInfo() {
    const usage = await this.storage.getUsage();
    const usageCount = document.getElementById('usageCount') as HTMLSpanElement;
    const upgradeLink = document.getElementById('upgradeLink') as HTMLAnchorElement;
    
    usageCount.textContent = usage.dailyCount.toString();
    // Hide upgrade link for testing
    upgradeLink.style.display = 'none'; // usage.isPro ? 'none' : 'inline';
  }
  
  private showApiKeyRequired() {
    const main = document.querySelector('.popup-main') as HTMLElement;
    const warning = document.createElement('div');
    warning.className = 'api-key-warning';
    warning.innerHTML = `
      <strong>🔑 API Key Required</strong>
      Please configure your OpenAI API key in settings to use this extension.
    `;
    main.insertBefore(warning, main.firstChild);
  }
  
  private showUpgradePrompt() {
    // DISABLED FOR TESTING
    // this.showStatus('💎 Upgrade to Pro for unlimited summaries', 'warning');
  }
  
  private showStatus(message: string, type: 'success' | 'error' | 'warning') {
    const status = document.getElementById('status') as HTMLDivElement;
    status.textContent = message;
    status.className = `status-indicator ${type}`;
    
    setTimeout(() => {
      status.textContent = '';
      status.className = 'status-indicator';
    }, 3000);
  }
  
  private showHistory() {
    // Open history page or show in popup
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html#history') });
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => new PopupController());
