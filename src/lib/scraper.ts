import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScrapedContent } from '@/types/blog';

export class WebScraper {
  static async scrapeUrl(url: string): Promise<ScrapedContent> {
    try {
      // Validate URL format
      new URL(url);
      
      // Fetch the webpage
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // Remove script and style elements
      $('script, style, nav, footer, aside, .advertisement, .ad, .social-share').remove();

      // Extract title
      const title = $('title').text().trim() || 
                   $('h1').first().text().trim() || 
                   'Untitled';

      // Extract meta description
      const description = $('meta[name="description"]').attr('content') ||
                         $('meta[property="og:description"]').attr('content') ||
                         $('meta[name="twitter:description"]').attr('content') ||
                         '';

      // Extract main content
      let content = '';
      
      // Try common content selectors
      const contentSelectors = [
        'article',
        '.content',
        '.post-content',
        '.entry-content', 
        '.main-content',
        'main',
        '.container',
        'body'
      ];

      for (const selector of contentSelectors) {
        const element = $(selector);
        if (element.length > 0) {
          content = element.text().trim();
          if (content.length > 200) {
            break;
          }
        }
      }

      // If no substantial content found, try to get all paragraphs
      if (content.length < 200) {
        content = $('p').map((i, el) => $(el).text().trim()).get().join(' ');
      }

      // Clean up content
      content = content.replace(/\s+/g, ' ').trim();
      
      // Limit content length
      if (content.length > 5000) {
        content = content.substring(0, 5000) + '...';
      }

      // Extract keywords from meta tags
      const keywords = $('meta[name="keywords"]').attr('content')?.split(',').map(k => k.trim()) || [];

      // Add keywords from title and headings
      $('h1, h2, h3').each((i, el) => {
        const headingText = $(el).text().trim();
        if (headingText) {
          keywords.push(headingText);
        }
      });

      if (!content || content.length < 50) {
        throw new Error('Unable to extract meaningful content from the webpage');
      }

      return {
        url,
        title,
        description,
        content,
        keywords: [...new Set(keywords)].slice(0, 10) // Remove duplicates and limit
      };

    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid URL')) {
        throw new Error('Please provide a valid URL');
      }
      if (axios.isAxiosError(error)) {
        if (error.code === 'ENOTFOUND') {
          throw new Error('Website not found or unreachable');
        }
        if (error.response?.status === 404) {
          throw new Error('Page not found (404)');
        }
        if (error.response?.status === 403) {
          throw new Error('Access forbidden - website blocks automated access');
        }
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout - website took too long to respond');
        }
      }
      throw new Error('Failed to scrape website content');
    }
  }

  static validateUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }
}