import { ExtractedContent } from '../types';
export declare class ContentExtractor {
    static extractContent(): Promise<ExtractedContent>;
    private static fallbackExtraction;
}
