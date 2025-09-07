import { SummaryResult } from '../types';
export declare class AIClient {
    private apiKey;
    constructor(apiKey: string);
    summarizeContent(content: string, options: {
        tone: 'neutral' | 'friendly' | 'professional';
        length: 'short' | 'medium' | 'detailed';
        language?: string;
    }): Promise<SummaryResult>;
    private buildPrompt;
    private validateAndFormatResult;
}
