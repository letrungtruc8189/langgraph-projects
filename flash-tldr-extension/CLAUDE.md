# FlashTL;DR Extension - AI Development Guide

## Overview

This document serves as the comprehensive guide for AI-assisted development of the FlashTL;DR browser extension. It provides context, specifications, and implementation guidance for AI coding assistants like Claude, GPT-4, or Cursor to effectively contribute to the project.

## Project Context

### What is FlashTL;DR?
FlashTL;DR is an AI-powered browser extension that provides instant content summaries with TL;DR, key points, and action items. The extension supports multiple languages, uses advanced content extraction techniques, and prioritizes user privacy.

### Current Status
- **Phase**: Fully functional extension with comprehensive features
- **Architecture**: Chrome Manifest V3 extension with TypeScript
- **AI Integration**: OpenAI GPT-4o/GPT-4o-mini for summarization
- **Languages Supported**: 10+ languages with native prompts
- **Content Extraction**: Crawl4AI-inspired techniques for superior accuracy

## Specification Documents

### Core Specifications
1. **[Functional Specification](specs/001-flash-tldr-extension/spec.md)**
   - Complete feature requirements and user stories
   - Non-functional requirements and success metrics
   - Review and acceptance checklist

2. **[Technical Implementation Plan](specs/001-flash-tldr-extension/plan.md)**
   - Detailed architecture and component design
   - Technology stack and implementation details
   - Performance optimization and security measures

3. **[API Contracts & Data Models](specs/001-flash-tldr-extension/contracts/api-contracts.md)**
   - TypeScript interfaces and type definitions
   - Message passing contracts and error handling
   - Storage schemas and validation rules

4. **[Data Model Specification](specs/001-flash-tldr-extension/data-model.md)**
   - Storage architecture and data relationships
   - Migration strategies and lifecycle management
   - Performance optimization and security measures

### Supporting Documentation
5. **[Research & Technical Analysis](specs/001-flash-tldr-extension/research.md)**
   - Technology stack research and decisions
   - Performance analysis and optimization strategies
   - Competitive analysis and market positioning

6. **[Developer Quickstart Guide](specs/001-flash-tldr-extension/quickstart.md)**
   - Setup instructions and development workflow
   - Common tasks and debugging guide
   - Testing strategies and deployment process

### Governance Documents
7. **[Development Constitution](memory/constitution.md)**
   - Core principles and development guidelines
   - Code quality standards and review processes
   - Decision-making framework and compliance requirements

8. **[Constitution Update Checklist](memory/constitution_update_checklist.md)**
   - Process for updating development guidelines
   - Quality assurance and implementation tracking

## AI Assistant Instructions

### When Working on This Project

#### 1. Always Reference the Specifications
- **Start with**: Read the functional specification to understand requirements
- **Architecture**: Consult the technical plan for implementation details
- **Data Models**: Use the API contracts for type-safe development
- **Best Practices**: Follow the constitution for coding standards

#### 2. Maintain Consistency
- **Code Style**: Follow TypeScript strict mode and established patterns
- **Architecture**: Respect the modular component design
- **Error Handling**: Use standardized error types and messages
- **Performance**: Meet the established performance benchmarks

#### 3. Security and Privacy First
- **API Keys**: Always use secure storage methods
- **Content Processing**: Minimize data sent to external services
- **Input Validation**: Sanitize all user inputs
- **CSP Compliance**: Ensure Content Security Policy compliance

#### 4. Multilingual Excellence
- **Language Detection**: Use the established detection strategies
- **AI Prompts**: Implement language-specific prompts
- **Cultural Context**: Respect cultural differences in tone and terminology
- **Testing**: Verify functionality across different languages

### Implementation Priorities

#### High Priority
1. **Core Functionality**: Content extraction and AI summarization
2. **Performance**: Fast response times and low memory usage
3. **Reliability**: Error handling and fallback strategies
4. **Security**: Secure API key management and data protection

#### Medium Priority
1. **User Experience**: Intuitive interface and clear feedback
2. **Accessibility**: WCAG 2.1 AA compliance
3. **Internationalization**: Comprehensive language support
4. **Testing**: Automated and manual testing coverage

#### Lower Priority
1. **Advanced Features**: PDF support, team collaboration
2. **Analytics**: Usage metrics and performance monitoring
3. **Integrations**: Third-party service integrations
4. **Mobile**: Mobile browser compatibility

### Code Quality Standards

#### TypeScript Requirements
```typescript
// ✅ Good: Strict typing and clear interfaces
interface ExtractedContent {
  text: string;
  title: string;
  url: string;
  language: string;
  wordCount: number;
  readingTime: number;
  extractionMethod: 'semantic' | 'density' | 'fallback';
  confidence: number;
  extractedAt: number;
}

// ❌ Bad: Loose typing and unclear structure
interface Content {
  data: any;
  info?: string;
  meta: object;
}
```

#### Error Handling Pattern
```typescript
// ✅ Good: Comprehensive error handling
async function extractContent(): Promise<ExtractedContent> {
  try {
    const result = await primaryExtraction();
    return result;
  } catch (error) {
    console.warn('[ContentExtractor] Primary method failed, trying fallback');
    try {
      return await fallbackExtraction();
    } catch (fallbackError) {
      throw new ExtensionError(
        ErrorCode.CONTENT_EXTRACTION_FAILED,
        'Unable to extract content from page',
        { originalError: error, fallbackError }
      );
    }
  }
}
```

#### Performance Monitoring
```typescript
// ✅ Good: Performance tracking for critical operations
async function performSummarization(content: ExtractedContent): Promise<SummaryResult> {
  const startTime = performance.now();
  try {
    const result = await aiClient.summarize(content);
    const duration = performance.now() - startTime;
    
    if (duration > 5000) {
      console.warn(`[Performance] Summarization took ${duration}ms - exceeds 5s target`);
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(`[Performance] Summarization failed after ${duration}ms`);
    throw error;
  }
}
```

## Development Workflow

### 1. Understanding Requirements
- Read the relevant specification documents
- Identify the specific component or feature being worked on
- Understand the user story and acceptance criteria
- Review any existing implementation

### 2. Implementation Approach
- Follow the established architecture patterns
- Use the defined interfaces and data models
- Implement comprehensive error handling
- Add appropriate logging and performance monitoring

### 3. Testing Strategy
- Test on multiple websites with different layouts
- Verify multilingual functionality
- Check error conditions and edge cases
- Validate performance benchmarks

### 4. Code Review Checklist
- [ ] Follows TypeScript strict mode requirements
- [ ] Uses established interfaces and patterns
- [ ] Implements proper error handling
- [ ] Includes performance monitoring
- [ ] Respects security and privacy guidelines
- [ ] Maintains backward compatibility
- [ ] Includes appropriate documentation

## Common Implementation Patterns

### Content Extraction
```typescript
class ContentExtractor {
  async extractContent(document: Document): Promise<ExtractedContent> {
    // 1. Try semantic extraction first
    let element = this.extractBySemantic(document);
    
    // 2. Fall back to density analysis
    if (!element || this.getConfidence(element) < 0.7) {
      element = this.extractByDensity(document);
    }
    
    // 3. Final fallback to basic extraction
    if (!element || this.getConfidence(element) < 0.5) {
      element = this.extractByFallback(document);
    }
    
    // 4. Process and return structured content
    return this.processExtractedElement(element, document);
  }
}
```

### AI Client Integration
```typescript
class AIClient {
  async summarize(content: ExtractedContent, options: SummaryOptions): Promise<SummaryResult> {
    // 1. Prepare language-specific prompt
    const prompt = this.buildPrompt(content.language, options);
    
    // 2. Make API request with error handling
    const response = await this.makeRequest(prompt, content.text);
    
    // 3. Parse and validate response
    const summary = this.parseResponse(response);
    
    // 4. Return structured result
    return {
      ...summary,
      language: content.language,
      options,
      generatedAt: Date.now(),
      processingTime: response.processingTime
    };
  }
}
```

### Storage Management
```typescript
class StorageManager {
  async saveSummary(summary: StoredSummary): Promise<void> {
    // 1. Validate summary data
    const validation = this.validateSummary(summary);
    if (!validation.valid) {
      throw new ValidationError('Invalid summary data', validation.errors);
    }
    
    // 2. Store in local storage
    await chrome.storage.local.set({ [`summary_${summary.id}`]: summary });
    
    // 3. Update index for efficient querying
    await this.updateSummaryIndex(summary);
    
    // 4. Manage storage quota
    await this.cleanupOldSummaries();
  }
}
```

## Testing Guidelines

### Manual Testing Checklist
- [ ] Test on news websites (CNN, BBC, Reuters)
- [ ] Test on blog platforms (Medium, WordPress)
- [ ] Test on documentation sites (GitHub, technical docs)
- [ ] Test on international sites (Vietnamese, Chinese, Japanese)
- [ ] Test error conditions (no API key, network failures)
- [ ] Test keyboard shortcuts and accessibility
- [ ] Test on different screen sizes and resolutions

### Performance Validation
- [ ] Content extraction completes within 500ms
- [ ] AI summarization completes within 5 seconds
- [ ] Memory usage stays below 50MB
- [ ] No memory leaks after repeated use
- [ ] UI remains responsive during processing

## Deployment Considerations

### Chrome Web Store Requirements
- [ ] Manifest V3 compliance verified
- [ ] All permissions justified and minimal
- [ ] Privacy policy complete and accurate
- [ ] Store listing assets prepared (screenshots, descriptions)
- [ ] Security review completed

### Release Process
1. **Version Update**: Increment version in package.json and manifest.json
2. **Build**: Create production build with `npm run build`
3. **Testing**: Comprehensive testing on target websites
4. **Package**: Create distribution package with `npm run pack`
5. **Upload**: Submit to Chrome Web Store
6. **Monitor**: Watch for issues and user feedback

## Troubleshooting Common Issues

### Build Issues
- **CSP Violations**: Ensure `devtool: false` in webpack config
- **Module Errors**: Check TypeScript configuration and imports
- **Asset Loading**: Verify CopyWebpackPlugin configuration

### Runtime Issues
- **Content Script Failures**: Check for JavaScript errors in console
- **API Errors**: Verify API key configuration and network connectivity
- **Overlay Problems**: Check for CSS conflicts and Shadow DOM issues

### Performance Issues
- **Slow Extraction**: Profile DOM queries and optimize selectors
- **Memory Leaks**: Ensure proper cleanup of event listeners
- **API Timeouts**: Implement retry logic and timeout handling

## Future Development

### Planned Enhancements
- PDF document summarization support
- YouTube transcript summarization
- Team collaboration features
- Advanced summarization templates
- Mobile app companion

### Technology Evolution
- Monitor Chrome extension API changes
- Evaluate new AI models and services
- Consider WebAssembly for performance-critical operations
- Explore local AI models for offline functionality

---

*This guide provides comprehensive context for AI-assisted development. Always refer to the detailed specification documents for complete implementation requirements and maintain alignment with the project's core principles.*