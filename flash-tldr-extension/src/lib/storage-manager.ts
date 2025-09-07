import { UserSettings, UsageData, SummaryHistory } from '../types';

export class StorageManager {
  private readonly SETTINGS_KEY = 'flash_tldr_settings';
  private readonly USAGE_KEY = 'flash_tldr_usage';
  private readonly HISTORY_KEY = 'flash_tldr_history';
  
  async getSettings(): Promise<UserSettings> {
    const result = await chrome.storage.sync.get(this.SETTINGS_KEY);
    return result[this.SETTINGS_KEY] || {
      apiKey: '',
      tone: 'neutral',
      length: 'medium',
      autoDetectLanguage: true,
      showOverlay: true
    };
  }
  
  async saveSettings(settings: Partial<UserSettings>): Promise<void> {
    const currentSettings = await this.getSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    await chrome.storage.sync.set({ [this.SETTINGS_KEY]: updatedSettings });
  }
  
  async getUsage(): Promise<UsageData> {
    const result = await chrome.storage.local.get(this.USAGE_KEY);
    const usage = result[this.USAGE_KEY] || {
      dailyCount: 0,
      lastResetDate: new Date().toDateString(),
      totalCount: 0,
      isPro: true // Set to true for testing purposes
    };
    
    // Reset daily count if it's a new day
    const today = new Date().toDateString();
    if (usage.lastResetDate !== today) {
      usage.dailyCount = 0;
      usage.lastResetDate = today;
      await this.saveUsage(usage);
    }
    
    return usage;
  }
  
  async saveUsage(usage: UsageData): Promise<void> {
    await chrome.storage.local.set({ [this.USAGE_KEY]: usage });
  }
  
  async incrementUsage(): Promise<void> {
    const usage = await this.getUsage();
    usage.dailyCount++;
    usage.totalCount++;
    await this.saveUsage(usage);
  }
  
  async getHistory(): Promise<SummaryHistory[]> {
    const result = await chrome.storage.local.get(this.HISTORY_KEY);
    return result[this.HISTORY_KEY] || [];
  }
  
  async saveSummary(summary: Omit<SummaryHistory, 'id'>): Promise<void> {
    const history = await this.getHistory();
    const newSummary: SummaryHistory = {
      ...summary,
      id: `summary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    history.unshift(newSummary);
    
    // Keep only last 100 summaries
    if (history.length > 100) {
      history.splice(100);
    }
    
    await chrome.storage.local.set({ [this.HISTORY_KEY]: history });
  }
  
  async deleteSummary(id: string): Promise<void> {
    const history = await this.getHistory();
    const filtered = history.filter(s => s.id !== id);
    await chrome.storage.local.set({ [this.HISTORY_KEY]: filtered });
  }
  
  async clearHistory(): Promise<void> {
    await chrome.storage.local.remove(this.HISTORY_KEY);
  }
}
