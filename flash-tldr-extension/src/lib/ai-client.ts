import { SummaryResult } from '../types';

export class AIClient {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async summarizeContent(
    content: string,
    options: {
      tone: 'neutral' | 'friendly' | 'professional';
      length: 'short' | 'medium' | 'detailed';
      language?: string;
    }
  ): Promise<SummaryResult> {
    const prompt = this.buildPrompt(content, options);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a precise summarizer. Be faithful to the source. Avoid hallucinations. Return only valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1000
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content || '{}');
      return this.validateAndFormatResult(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`AI summarization failed: ${errorMessage}`);
    }
  }
  
  private buildPrompt(content: string, options: any): string {
    const detectedLang = options.language || 'en';
    const languageInstructions = this.getLanguageInstructions(detectedLang);
    
    return `${languageInstructions.systemPrompt}

Output JSON with keys:
- "tldr": ${languageInstructions.tldrDesc}
- "bullets": ${languageInstructions.bulletsDesc}
- "actions": ${languageInstructions.actionsDesc}
- "language": detected language code (${detectedLang})
- "confidence": confidence score 0-1

${languageInstructions.instructions}

CONTENT:
${content.substring(0, 8000)}

Tone: ${options.tone}
Length: ${options.length}`;
  }

  private getLanguageInstructions(langCode: string) {
    const instructions = {
      'vi': {
        systemPrompt: 'Tóm tắt nội dung này bằng tiếng Việt. Hãy trung thực với nguồn và tránh bịa đặt.',
        tldrDesc: 'một đoạn tóm tắt 2-3 câu bằng tiếng Việt',
        bulletsDesc: 'TỐI ĐA 10 điểm chính ngắn gọn bằng tiếng Việt',
        actionsDesc: 'TỐI ĐA 10 bước hành động cụ thể (nếu có; nếu không thì để mảng rỗng) bằng tiếng Việt',
        instructions: 'Trả lời chỉ bằng JSON. Tất cả nội dung phải bằng tiếng Việt.'
      },
      'zh': {
        systemPrompt: '用中文总结这个内容。请忠实于原文，避免虚构信息。',
        tldrDesc: '一个2-3句话的中文摘要',
        bulletsDesc: '最多10个简洁的中文要点',
        actionsDesc: '最多10个具体的行动步骤（如果适用；否则为空数组）用中文',
        instructions: '只返回JSON格式。所有内容必须用中文。'
      },
      'ja': {
        systemPrompt: 'この内容を日本語で要約してください。元の内容に忠実で、虚偽の情報は避けてください。',
        tldrDesc: '2-3文の日本語要約',
        bulletsDesc: '最大10個の簡潔な日本語要点',
        actionsDesc: '最大10個の具体的なアクションステップ（該当する場合；そうでなければ空の配列）日本語で',
        instructions: 'JSONのみを返してください。すべての内容は日本語である必要があります。'
      },
      'ko': {
        systemPrompt: '이 내용을 한국어로 요약해주세요. 원문에 충실하고 허위 정보는 피해주세요.',
        tldrDesc: '2-3문장의 한국어 요약',
        bulletsDesc: '최대 10개의 간결한 한국어 요점',
        actionsDesc: '최대 10개의 구체적인 행동 단계 (해당하는 경우; 그렇지 않으면 빈 배열) 한국어로',
        instructions: 'JSON만 반환하세요. 모든 내용은 한국어여야 합니다.'
      },
      'en': {
        systemPrompt: 'Summarize this content in English. Be faithful to the source and avoid hallucinations.',
        tldrDesc: 'one 2-3 sentence English summary',
        bulletsDesc: 'UP TO 10 concise English takeaway bullets',
        actionsDesc: 'UP TO 10 actionable next steps in English (if applicable; else empty array)',
        instructions: 'Return JSON only. All content must be in English.'
      }
    };

    return instructions[langCode as keyof typeof instructions] || instructions['en'];
  }
  
  private validateAndFormatResult(result: any): SummaryResult {
    return {
      tldr: result.tldr || 'Unable to generate summary',
      bullets: Array.isArray(result.bullets) ? result.bullets : [],
      actions: Array.isArray(result.actions) ? result.actions : [],
      qa: [], // Keep empty for backward compatibility
      language: result.language || 'en',
      confidence: typeof result.confidence === 'number' ? result.confidence : 0.5
    };
  }
}
