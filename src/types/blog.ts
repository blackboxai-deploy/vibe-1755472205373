export interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  imageUrl: string;
  imagePrompt: string;
  createdAt: string;
}

export interface ScrapedContent {
  url: string;
  title: string;
  description: string;
  content: string;
  keywords: string[];
}

export interface BlogGenerationRequest {
  url: string;
}

export interface BlogGenerationResponse {
  success: boolean;
  blogs: BlogPost[];
  sourceContent: ScrapedContent;
  error?: string;
}

export interface AITextResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIImageResponse {
  url: string;
  prompt: string;
}

export interface GenerationProgress {
  step: 'scraping' | 'analyzing' | 'generating_blogs' | 'generating_images' | 'complete';
  message: string;
  progress: number;
}