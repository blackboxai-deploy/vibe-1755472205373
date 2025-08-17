import axios from 'axios';
import { AITextResponse, AIImageResponse } from '@/types/blog';

const AI_ENDPOINT = 'https://oi-server.onrender.com/chat/completions';
const AI_HEADERS = {
  'customerId': 'cus_SGPn4uhjPI0F4w',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer xxx'
};

export class AIClient {
  static async generateText(prompt: string, systemPrompt?: string, model = 'openrouter/anthropic/claude-sonnet-4'): Promise<AITextResponse> {
    try {
      const messages = [];
      
      if (systemPrompt) {
        messages.push({
          role: 'system',
          content: systemPrompt
        });
      }
      
      messages.push({
        role: 'user',
        content: prompt
      });

      const response = await axios.post(AI_ENDPOINT, {
        model,
        messages,
        max_tokens: 4000,
        temperature: 0.7
      }, {
        headers: AI_HEADERS,
        timeout: 60000 // 1 minute timeout
      });

      return {
        content: response.data.choices[0].message.content,
        usage: response.data.usage
      };
    } catch (error) {
      console.error('AI Text Generation Error:', error);
      throw new Error('Failed to generate text content');
    }
  }

  static async generateImage(prompt: string, model = 'replicate/black-forest-labs/flux-1.1-pro'): Promise<AIImageResponse> {
    try {
      const response = await axios.post(AI_ENDPOINT, {
        model,
        messages: [{
          role: 'user',
          content: `Generate an image: ${prompt}`
        }]
      }, {
        headers: AI_HEADERS,
        timeout: 300000 // 5 minutes timeout for image generation
      });

      const imageUrl = response.data.choices[0].message.content;
      
      return {
        url: imageUrl,
        prompt
      };
    } catch (error) {
      console.error('AI Image Generation Error:', error);
      throw new Error('Failed to generate image');
    }
  }

  static async analyzeContent(content: string): Promise<string> {
    const systemPrompt = `You are a content analyst. Analyze the provided website content and return a JSON object with the following structure:
{
  "mainTopics": ["topic1", "topic2", "topic3"],
  "keyInsights": ["insight1", "insight2", "insight3"],
  "contentType": "article|blog|product|service|news|other",
  "targetAudience": "description of target audience",
  "tone": "formal|casual|professional|educational|marketing"
}

Provide only the JSON object, no additional text.`;

    const response = await this.generateText(
      `Analyze this website content: ${content.substring(0, 2000)}...`,
      systemPrompt
    );

    return response.content;
  }

  static async generateBlogPost(sourceContent: string, analysis: string, blogType: string, index: number): Promise<string> {
    const systemPrompt = `You are an expert blog writer. Generate a high-quality blog post based on the source content and analysis provided. 

Return ONLY a JSON object with this exact structure:
{
  "title": "Engaging blog post title",
  "content": "Full blog post content in markdown format (minimum 500 words)",
  "summary": "Brief 2-3 sentence summary",
  "imagePrompt": "Detailed prompt for generating a relevant hero image (be specific about style, elements, mood)"
}

Blog type: ${blogType}
Make the content unique, engaging, and valuable to readers. The content should be substantially different from the source while being inspired by it.`;

    const prompt = `Source Content Analysis: ${analysis}

Source Content: ${sourceContent.substring(0, 1500)}

Create blog post #${index + 1} of type "${blogType}".`;

    const response = await this.generateText(prompt, systemPrompt);
    return response.content;
  }
}