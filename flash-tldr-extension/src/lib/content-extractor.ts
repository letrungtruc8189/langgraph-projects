import { Readability } from '@mozilla/readability';
import { ExtractedContent } from '../types';

export class ContentExtractor {
  static async extractContent(): Promise<ExtractedContent> {
    const url = window.location.href;
    const title = document.title;
    
    // Try Readability first
    try {
      const doc = new DOMParser().parseFromString(document.documentElement.outerHTML, 'text/html');
      const reader = new Readability(doc);
      const article = reader.parse();
      
      if (article && article.textContent && article.textContent.length > 100) {
        return {
          title: article.title || title,
          content: article.textContent,
          byline: article.byline,
          siteName: article.siteName,
          url,
          wordCount: article.textContent.split(/\s+/).length,
          readingTime: Math.ceil(article.textContent.split(/\s+/).length / 200),
          language: 'en' // Default fallback for old extractor
        };
      }
    } catch (error) {
      console.warn('Readability parsing failed, using fallback:', error);
    }
    
    // Fallback to DOM extraction
    return this.fallbackExtraction(url, title);
  }
  
  private static fallbackExtraction(url: string, title: string): ExtractedContent {
    // Remove unwanted elements
    const unwantedSelectors = [
      'nav', 'aside', 'footer', 'header', '.advertisement', 
      '.ad', '.sidebar', '.comments', '.social-share', 'script', 'style'
    ];
    
    const clone = document.cloneNode(true) as Document;
    unwantedSelectors.forEach(selector => {
      const elements = clone.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });
    
    // Extract main content
    const mainContent = clone.querySelector('main, article, .content, .post-content, .entry-content') ||
                       clone.querySelector('[role="main"]') ||
                       clone.body;
    
    const textContent = mainContent?.textContent || '';
    const paragraphs = Array.from(mainContent?.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6') || [])
      .map(el => el.textContent?.trim())
      .filter(text => text && text.length > 50)
      .join('\n\n');
    
    const content = paragraphs || textContent;
    const wordCount = content.split(/\s+/).length;
    
    return {
      title,
      content,
      url,
      wordCount,
      readingTime: Math.ceil(wordCount / 200),
      language: 'en' // Default fallback for old extractor
    };
  }
}
