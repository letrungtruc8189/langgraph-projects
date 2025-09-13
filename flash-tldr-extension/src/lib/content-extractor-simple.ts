// Enhanced content extractor inspired by Crawl4AI techniques
import { ExtractedContent } from '../types';

export class ContentExtractorSimple {
  static async extractContent(): Promise<ExtractedContent> {
    const url = window.location.href;
    const title = document.title;
    
    // Check if this is a PDF document
    if (this.isPDFDocument()) {
      return await this.extractPDFContent();
    }
    
    // Apply Crawl4AI's multi-strategy approach for HTML content
    const content = this.extractFitMarkdown();
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    
    // Detect content language
    const language = this.detectLanguage(content, title);
    
    return {
      title,
      url,
      content: content.trim(),
      wordCount,
      readingTime: Math.ceil(wordCount / 200),
      language
    };
  }

  /**
   * Implements Crawl4AI's "fit_markdown" concept - extracting only the main content
   * that fits the purpose, removing boilerplate and non-essential elements
   */
  private static extractFitMarkdown(): string {
    // Step 1: Remove overlay elements (Crawl4AI technique)
    this.removeOverlayElements();
    
    // Step 2: Apply content selection strategies
    const mainContent = this.selectMainContent();
    
    // Step 3: Apply content filtering and cleaning
    const cleanedContent = this.applyContentFiltering(mainContent);
    
    // Step 4: Generate fit markdown
    return this.generateFitMarkdown(cleanedContent);
  }

  /**
   * Removes overlay elements that interfere with content extraction
   * Based on Crawl4AI's remove_overlay_elements functionality
   */
  private static removeOverlayElements(): void {
    const overlaySelectors = [
      // Fixed position overlays
      '[style*="position: fixed"]',
      '[style*="position:fixed"]',
      // Common overlay classes
      '.modal', '.popup', '.overlay', '.lightbox', '.dialog',
      '.cookie-banner', '.newsletter-popup', '.subscription-modal',
      '.ad-overlay', '.video-overlay', '.social-overlay',
      // Z-index based overlays
      '[style*="z-index: 999"]', '[style*="z-index:999"]',
      '[style*="z-index: 9999"]', '[style*="z-index:9999"]',
      // Hidden/invisible elements that might become visible
      '[style*="opacity: 0"]', '[style*="opacity:0"]',
      '[style*="visibility: hidden"]', '[style*="visibility:hidden"]'
    ];

    overlaySelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (this.isOverlayElement(el as HTMLElement)) {
            el.remove();
          }
        });
      } catch (e) {
        // Continue if selector fails
      }
    });
  }

  /**
   * Determines if an element is likely an overlay
   */
  private static isOverlayElement(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    // Check for overlay characteristics
    return (
      style.position === 'fixed' ||
      style.position === 'absolute' && parseInt(style.zIndex) > 100 ||
      rect.width > window.innerWidth * 0.8 && rect.height > window.innerHeight * 0.8 ||
      element.classList.toString().match(/modal|popup|overlay|dialog/i) !== null
    );
  }

  /**
   * Selects main content using Crawl4AI's target_elements approach
   */
  private static selectMainContent(): Element | null {
    // Strategy 1: Semantic HTML5 elements (highest priority)
    const semanticSelectors = [
      'article',
      'main', 
      '[role="main"]',
      '[role="article"]',
      'section[class*="content"]',
      'section[class*="article"]',
      'section[class*="post"]'
    ];

    for (const selector of semanticSelectors) {
      const element = document.querySelector(selector);
      if (element && this.hasSubstantialContent(element)) {
        return element;
      }
    }

    // Strategy 2: Common content class patterns (Crawl4AI's baseSelector approach)
    const contentSelectors = [
      '.post-content', '.entry-content', '.article-content',
      '.content-body', '.post-body', '.article-body',
      '.story-body', '.news-content', '.article-text',
      '.post-text', '.content-main', '.main-content',
      '.page-content', '.single-content', '.blog-content',
      // Vietstock and Vietnamese news sites
      '.news-detail', '.detail-content', '.article-detail',
      '.tin-tuc-content', '.bai-viet-content'
    ];

    for (const selector of contentSelectors) {
      const element = document.querySelector(selector);
      if (element && this.hasSubstantialContent(element)) {
        return element;
      }
    }

    // Strategy 3: Content density analysis (Crawl4AI's scoring approach)
    return this.findHighestContentDensityElement();
  }

  /**
   * Finds element with highest content density using Crawl4AI's scoring techniques
   */
  private static findHighestContentDensityElement(): Element | null {
    const candidates: Array<{element: Element, score: number}> = [];
    
    // Analyze all potential content containers
    const containerSelectors = 'div, section, article, main, aside';
    const elements = document.querySelectorAll(containerSelectors);
    
    elements.forEach(element => {
      const score = this.calculateContentScore(element);
      if (score > 0) {
        candidates.push({ element, score });
      }
    });
    
    // Sort by score and return the highest
    candidates.sort((a, b) => b.score - a.score);
    return candidates.length > 0 ? candidates[0].element : null;
  }

  /**
   * Calculates content score using Crawl4AI's methodology
   */
  private static calculateContentScore(element: Element): number {
    const text = element.textContent || '';
    const textLength = text.length;
    
    if (textLength < 100) return 0; // Minimum content threshold
    
    let score = textLength;
    
    // Positive scoring factors (Crawl4AI's approach)
    
    // 1. Semantic HTML bonus
    const tagName = element.tagName.toLowerCase();
    if (tagName === 'article') score *= 2.0;
    else if (tagName === 'main') score *= 1.8;
    else if (tagName === 'section') score *= 1.5;
    
    // 2. Content indicators in class/id
    const classAndId = `${element.className} ${element.id}`.toLowerCase();
    const contentKeywords = ['content', 'article', 'post', 'story', 'news', 'text', 'body', 'main'];
    const contentMatches = contentKeywords.filter(keyword => classAndId.includes(keyword)).length;
    score *= (1 + contentMatches * 0.2);
    
    // 3. Paragraph density
    const paragraphs = element.querySelectorAll('p');
    const paragraphRatio = paragraphs.length / Math.max(1, text.split('\n').length);
    score *= (1 + paragraphRatio);
    
    // 4. Link density (lower is better for main content)
    const links = element.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
    const linkText = Array.from(links).reduce((sum, link) => sum + (link.textContent?.length || 0), 0);
    const linkDensity = linkText / Math.max(1, textLength);
    score *= (1 - Math.min(0.8, linkDensity));
    
    // Negative scoring factors (Crawl4AI's filtering)
    
    // 1. Non-content indicators
    const nonContentKeywords = [
      'nav', 'menu', 'sidebar', 'footer', 'header', 'advertisement', 'ad',
      'comment', 'social', 'share', 'related', 'recommend', 'popup',
      'modal', 'overlay', 'banner', 'promo', 'widget', 'tag', 'category',
      'breadcrumb', 'pagination', 'search', 'filter', 'toolbar', 'form'
    ];
    
    const nonContentMatches = nonContentKeywords.filter(keyword => classAndId.includes(keyword)).length;
    if (nonContentMatches > 0) {
      score *= Math.pow(0.5, nonContentMatches);
    }
    
    // 2. Hidden or invisible elements
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return 0;
    }
    
    // 3. Size constraints
    const rect = element.getBoundingClientRect();
    if (rect.width < 200 || rect.height < 100) {
      score *= 0.5;
    }
    
    return score;
  }

  /**
   * Checks if element has substantial content worth extracting
   */
  private static hasSubstantialContent(element: Element): boolean {
    const text = element.textContent || '';
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    return wordCount >= 50; // Minimum word threshold
  }

  /**
   * Applies Crawl4AI's content filtering techniques
   */
  private static applyContentFiltering(element: Element | null): Element | null {
    if (!element) return null;
    
    // Clone to avoid modifying original DOM
    const clone = element.cloneNode(true) as Element;
    
    // Apply excluded_tags filtering (Crawl4AI's excluded_tags)
    const excludedTags = [
      'script', 'style', 'noscript', 'iframe', 'embed', 'object',
      'nav', 'header', 'footer', 'aside', 'form', 'button',
      'input', 'select', 'textarea', 'label'
    ];
    
    excludedTags.forEach(tag => {
      const elements = clone.querySelectorAll(tag);
      elements.forEach(el => el.remove());
    });
    
    // Apply excluded_selector filtering
    const excludedSelectors = [
      '.advertisement', '.ad', '.ads', '.social-share', '.comments',
      '.related-posts', '.sidebar', '.menu', '.navigation', 
      '.breadcrumb', '.tags', '.categories', '.author-bio',
      '.popup', '.modal', '.overlay', '.banner', '.promo',
      '[class*="ad-"]', '[id*="ad-"]', '[class*="advertisement"]',
      '[class*="social"]', '[class*="share"]', '[class*="comment"]',
      '[class*="related"]', '[class*="recommend"]', '[class*="widget"]',
      // Vietnamese news site specific
      '.quang-cao', '.sidebar', '.lien-quan', '.binh-luan',
      '.chia-se', '.mxh', '.banner'
    ];
    
    excludedSelectors.forEach(selector => {
      try {
        const elements = clone.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      } catch (e) {
        // Continue if selector fails
      }
    });
    
    // Remove external links if they dominate content
    const links = clone.querySelectorAll('a[href^="http"]') as NodeListOf<HTMLAnchorElement>;
    const totalText = clone.textContent?.length || 0;
    const linkText = Array.from(links).reduce((sum, link) => sum + (link.textContent?.length || 0), 0);
    
    if (linkText > totalText * 0.3) { // If links make up >30% of content
      links.forEach(link => {
        if (!link.href.includes(window.location.hostname)) {
          link.remove();
        }
      });
    }
    
    return clone;
  }

  /**
   * Generates clean markdown-style text (Crawl4AI's fit_markdown output)
   */
  private static generateFitMarkdown(element: Element | null): string {
    if (!element) {
      // Fallback to body content with heavy filtering
      return this.generateFitMarkdown(this.applyContentFiltering(document.body));
    }
    
    let text = element.textContent || '';
    
    // Apply word_count_threshold (Crawl4AI feature)
    const words = text.split(/\s+/).filter(word => word.length > 0);
    if (words.length < 10) {
      return ''; // Below minimum threshold
    }
    
    // Normalize whitespace (Crawl4AI's text cleaning)
    text = text
      .replace(/\s+/g, ' ')                    // Multiple spaces to single space
      .replace(/\n\s*\n\s*\n/g, '\n\n')       // Multiple newlines to double newline
      .replace(/^\s+|\s+$/g, '')              // Trim start and end
      .replace(/\t/g, ' ')                    // Tabs to spaces
      .replace(/\u00A0/g, ' ')                // Non-breaking spaces to regular spaces
      .replace(/[\u2000-\u200B]/g, ' ')       // Various Unicode spaces
      .replace(/\u00AD/g, '')                 // Soft hyphens
      .replace(/\uFEFF/g, '');                // Zero-width no-break space
    
    // Remove repeated patterns that might indicate boilerplate
    const lines = text.split('\n');
    const uniqueLines = [];
    const seenLines = new Set();
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.length > 10 && !seenLines.has(trimmedLine)) {
        uniqueLines.push(line);
        seenLines.add(trimmedLine);
      } else if (trimmedLine.length <= 10) {
        uniqueLines.push(line); // Keep short lines (might be titles, etc.)
      }
    }
    
    return uniqueLines.join('\n').trim();
  }

  /**
   * Detects the language of the content using multiple strategies
   */
  private static detectLanguage(content: string, title: string): string {
    // Strategy 1: Check HTML lang attribute
    const htmlLang = document.documentElement.lang || document.querySelector('html')?.getAttribute('lang');
    if (htmlLang) {
      const normalizedLang = this.normalizeLanguageCode(htmlLang);
      if (normalizedLang) return normalizedLang;
    }

    // Strategy 2: Check meta tags
    const metaLang = document.querySelector('meta[http-equiv="content-language"]')?.getAttribute('content') ||
                     document.querySelector('meta[name="language"]')?.getAttribute('content');
    if (metaLang) {
      const normalizedLang = this.normalizeLanguageCode(metaLang);
      if (normalizedLang) return normalizedLang;
    }

    // Strategy 3: URL-based detection
    const urlLang = this.detectLanguageFromUrl(window.location.href);
    if (urlLang) return urlLang;

    // Strategy 4: Content-based detection
    const contentLang = this.detectLanguageFromContent(content + ' ' + title);
    if (contentLang) return contentLang;

    // Default fallback
    return 'en';
  }

  /**
   * Normalizes language codes to standard format
   */
  private static normalizeLanguageCode(langCode: string): string | null {
    if (!langCode) return null;
    
    const normalized = langCode.toLowerCase().split('-')[0].split('_')[0];
    
    // Map common language codes
    const languageMap: { [key: string]: string } = {
      'vi': 'vi',
      'vn': 'vi',
      'vietnamese': 'vi',
      'en': 'en',
      'english': 'en',
      'zh': 'zh',
      'chinese': 'zh',
      'ja': 'ja',
      'japanese': 'ja',
      'ko': 'ko',
      'korean': 'ko',
      'fr': 'fr',
      'french': 'fr',
      'de': 'de',
      'german': 'de',
      'es': 'es',
      'spanish': 'es',
      'pt': 'pt',
      'portuguese': 'pt',
      'ru': 'ru',
      'russian': 'ru',
      'ar': 'ar',
      'arabic': 'ar',
      'hi': 'hi',
      'hindi': 'hi',
      'th': 'th',
      'thai': 'th'
    };

    return languageMap[normalized] || null;
  }

  /**
   * Detects language from URL patterns
   */
  private static detectLanguageFromUrl(url: string): string | null {
    // Vietnamese domains and patterns
    if (url.includes('.vn/') || url.includes('vietstock.vn') || url.includes('vnexpress.vn') || 
        url.includes('dantri.com.vn') || url.includes('tuoitre.vn') || url.includes('thanhnien.vn') ||
        url.includes('/vi/') || url.includes('/vn/')) {
      return 'vi';
    }

    // Other language patterns
    if (url.includes('/en/') || url.includes('.com/') || url.includes('.org/')) {
      return 'en';
    }

    if (url.includes('/zh/') || url.includes('.cn/') || url.includes('.tw/')) {
      return 'zh';
    }

    if (url.includes('/ja/') || url.includes('.jp/')) {
      return 'ja';
    }

    if (url.includes('/ko/') || url.includes('.kr/')) {
      return 'ko';
    }

    return null;
  }

  /**
   * Detects language from content using character patterns and common words
   */
  private static detectLanguageFromContent(text: string): string | null {
    if (!text || text.length < 50) return null;

    const sample = text.substring(0, 1000).toLowerCase();

    // Vietnamese detection
    const vietnamesePatterns = [
      // Vietnamese diacritics
      /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/g,
      // Common Vietnamese words
      /\b(và|của|trong|với|cho|từ|đến|về|sau|trước|theo|như|để|khi|nếu|vì|nhưng|mà|hay|hoặc|các|những|này|đó|được|có thể|sẽ|đã|đang|việt nam|tổng thống|chính phủ|doanh nghiệp|thị trường|kinh tế|tài chính|chứng khoán)\b/g
    ];

    let vietnameseScore = 0;
    vietnamesePatterns.forEach(pattern => {
      const matches = sample.match(pattern);
      if (matches) vietnameseScore += matches.length;
    });

    // English detection
    const englishPatterns = [
      /\b(the|and|of|in|to|for|with|on|at|by|from|as|is|was|are|were|be|been|have|has|had|do|does|did|will|would|could|should|may|might|can|must|shall|this|that|these|those|a|an)\b/g
    ];

    let englishScore = 0;
    englishPatterns.forEach(pattern => {
      const matches = sample.match(pattern);
      if (matches) englishScore += matches.length;
    });

    // Chinese detection (simplified check)
    const chinesePattern = /[\u4e00-\u9fff]/g;
    const chineseMatches = sample.match(chinesePattern);
    const chineseScore = chineseMatches ? chineseMatches.length : 0;

    // Japanese detection
    const japanesePattern = /[\u3040-\u309f\u30a0-\u30ff]/g;
    const japaneseMatches = sample.match(japanesePattern);
    const japaneseScore = japaneseMatches ? japaneseMatches.length : 0;

    // Korean detection
    const koreanPattern = /[\uac00-\ud7af]/g;
    const koreanMatches = sample.match(koreanPattern);
    const koreanScore = koreanMatches ? koreanMatches.length : 0;

    // Determine language based on highest score
    const scores = {
      'vi': vietnameseScore,
      'en': englishScore,
      'zh': chineseScore,
      'ja': japaneseScore,
      'ko': koreanScore
    };

    const maxScore = Math.max(...Object.values(scores));
    if (maxScore < 5) return null; // Not enough evidence

    const detectedLang = Object.keys(scores).find(lang => scores[lang as keyof typeof scores] === maxScore);
    return detectedLang || null;
  }

  // ===== PDF EXTRACTION METHODS =====

  /**
   * Detects if the current page is displaying a PDF document
   */
  private static isPDFDocument(): boolean {
    const url = window.location.href.toLowerCase();
    
    // Check URL for PDF extension
    if (url.includes('.pdf')) {
      return true;
    }
    
    // Check for Chrome's built-in PDF viewer elements
    if (document.querySelector('embed[type="application/pdf"]')) {
      return true;
    }
    
    // Check for PDF.js viewer elements
    if (document.querySelector('#viewer.pdfViewer') || 
        document.querySelector('.page[data-page-number]') ||
        document.querySelector('#viewerContainer')) {
      return true;
    }
    
    // Check document title for PDF indicators
    if (document.title.toLowerCase().includes('.pdf') ||
        document.title.includes('PDF')) {
      return true;
    }
    
    // Check for PDF viewer specific classes
    if (document.querySelector('.textLayer') && 
        document.querySelector('.canvasWrapper')) {
      return true;
    }
    
    return false;
  }

  /**
   * Extracts content from PDF documents
   */
  private static async extractPDFContent(): Promise<ExtractedContent> {
    try {
      const url = window.location.href;
      const title = this.extractPDFTitle();
      
      // Extract text content from PDF
      const content = await this.extractPDFText();
      
      if (content.length < 50) {
        throw new Error('Unable to extract sufficient text from this PDF. The PDF might be image-based, protected, or still loading.');
      }
      
      const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
      const language = this.detectLanguage(content, title);
      
      return {
        title,
        url,
        content: content.trim(),
        wordCount,
        readingTime: Math.ceil(wordCount / 200),
        language
      };
      
    } catch (error) {
      console.error('[ContentExtractor] PDF extraction failed:', error);
      throw new Error(`PDF extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extracts the PDF title from various sources
   */
  private static extractPDFTitle(): string {
    // Try to get title from document title
    let title = document.title;
    
    // Clean up common PDF viewer title patterns
    title = title
      .replace(/\.pdf.*$/i, '') // Remove .pdf extension and anything after
      .replace(/\s*-\s*(Google Chrome|Mozilla Firefox|Microsoft Edge).*$/i, '') // Remove browser name
      .replace(/\s*\|\s*.*$/i, '') // Remove anything after pipe
      .trim();
    
    // If title is empty or generic, try to extract from URL
    if (!title || title.length < 3 || title.toLowerCase().includes('untitled')) {
      const urlParts = window.location.pathname.split('/');
      const filename = urlParts[urlParts.length - 1];
      if (filename && filename.includes('.')) {
        title = decodeURIComponent(filename).replace(/\.[^.]*$/, ''); // Remove extension
      }
    }
    
    // Final fallback
    if (!title || title.length < 3) {
      title = 'PDF Document';
    }
    
    return title;
  }

  /**
   * Extracts text content from PDF using multiple strategies
   */
  private static async extractPDFText(): Promise<string> {
    let extractedText = '';
    
    // Strategy 1: Extract from Chrome's PDF viewer text layers
    extractedText = this.extractFromPDFTextLayers();
    
    if (extractedText.length > 100) {
      return this.cleanPDFText(extractedText);
    }
    
    // Strategy 2: Extract from PDF.js text layers (if available)
    extractedText = this.extractFromPDFJSTextLayers();
    
    if (extractedText.length > 100) {
      return this.cleanPDFText(extractedText);
    }
    
    // Strategy 3: Wait for content to load and try again
    await this.waitForPDFContent();
    extractedText = this.extractFromPDFTextLayers() || this.extractFromPDFJSTextLayers();
    
    if (extractedText.length > 100) {
      return this.cleanPDFText(extractedText);
    }
    
    // Strategy 4: Fallback to visible text extraction
    extractedText = this.extractVisiblePDFText();
    
    return this.cleanPDFText(extractedText);
  }

  /**
   * Extracts text from Chrome's built-in PDF viewer text layers
   */
  private static extractFromPDFTextLayers(): string {
    const textLayers = document.querySelectorAll('.textLayer');
    let fullText = '';
    
    textLayers.forEach((layer, pageIndex) => {
      const spans = layer.querySelectorAll('span');
      let pageText = '';
      
      spans.forEach(span => {
        const text = span.textContent || '';
        if (text.trim()) {
          pageText += text + ' ';
        }
      });
      
      if (pageText.trim()) {
        fullText += pageText.trim() + '\n\n';
      }
    });
    
    return fullText;
  }

  /**
   * Extracts text from PDF.js viewer text layers
   */
  private static extractFromPDFJSTextLayers(): string {
    // Look for PDF.js specific selectors
    const pages = document.querySelectorAll('.page[data-page-number]');
    let fullText = '';
    
    pages.forEach((page, pageIndex) => {
      const textLayer = page.querySelector('.textLayer');
      if (textLayer) {
        const spans = textLayer.querySelectorAll('span');
        let pageText = '';
        
        spans.forEach(span => {
          const text = span.textContent || '';
          if (text.trim()) {
            pageText += text + ' ';
          }
        });
        
        if (pageText.trim()) {
          fullText += pageText.trim() + '\n\n';
        }
      }
    });
    
    return fullText;
  }

  /**
   * Waits for PDF content to load
   */
  private static async waitForPDFContent(maxWaitTime: number = 3000): Promise<void> {
    const startTime = Date.now();
    
    return new Promise((resolve) => {
      const checkForContent = () => {
        const hasTextLayers = document.querySelectorAll('.textLayer').length > 0;
        const hasPages = document.querySelectorAll('.page[data-page-number]').length > 0;
        const timeElapsed = Date.now() - startTime;
        
        if (hasTextLayers || hasPages || timeElapsed > maxWaitTime) {
          resolve();
        } else {
          setTimeout(checkForContent, 100);
        }
      };
      
      checkForContent();
    });
  }

  /**
   * Extracts visible text as fallback method
   */
  private static extractVisiblePDFText(): string {
    // Try to extract from any visible text elements
    const contentSelectors = [
      '#viewer',
      '#viewerContainer', 
      '.pdfViewer',
      'embed[type="application/pdf"]',
      'object[type="application/pdf"]'
    ];
    
    for (const selector of contentSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const text = element.textContent || '';
        if (text.length > 100) {
          return text;
        }
      }
    }
    
    // Final fallback - get all visible text
    const bodyText = document.body.textContent || '';
    return bodyText;
  }

  /**
   * Cleans and normalizes extracted PDF text
   */
  private static cleanPDFText(text: string): string {
    if (!text) return '';
    
    return text
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      // Remove excessive line breaks
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      // Remove page numbers and headers/footers (common patterns)
      .replace(/^\s*\d+\s*$/gm, '') // Standalone page numbers
      .replace(/^Page \d+ of \d+$/gm, '') // "Page X of Y" patterns
      // Remove repeated patterns that might be headers/footers
      .replace(/(.{1,50})\n\1\n\1/g, '$1\n') // Remove if same line appears 3+ times
      // Clean up spacing
      .replace(/^\s+|\s+$/g, '') // Trim start and end
      .replace(/\t/g, ' ') // Tabs to spaces
      .replace(/\u00A0/g, ' ') // Non-breaking spaces
      .replace(/[\u2000-\u200B]/g, ' ') // Various Unicode spaces
      .replace(/\u00AD/g, '') // Soft hyphens
      .replace(/\uFEFF/g, '') // Zero-width no-break space
      .trim();
  }
}
