import { UserSettings, UsageData, SummaryHistory } from '../types';
export declare class StorageManager {
    private readonly SETTINGS_KEY;
    private readonly USAGE_KEY;
    private readonly HISTORY_KEY;
    getSettings(): Promise<UserSettings>;
    saveSettings(settings: Partial<UserSettings>): Promise<void>;
    getUsage(): Promise<UsageData>;
    saveUsage(usage: UsageData): Promise<void>;
    incrementUsage(): Promise<void>;
    getHistory(): Promise<SummaryHistory[]>;
    saveSummary(summary: Omit<SummaryHistory, 'id'>): Promise<void>;
    deleteSummary(id: string): Promise<void>;
    clearHistory(): Promise<void>;
}
