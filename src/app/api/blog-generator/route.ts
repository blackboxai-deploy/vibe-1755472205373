import { NextRequest, NextResponse } from 'next/server';
import { WebScraper } from '@/lib/scraper';
import { AIClient } from '@/lib/ai-client';
import { BlogPost, BlogGenerationResponse } from '@/types/blog';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    if (!WebScraper.validateUrl(url)) {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    console.log('Starting blog generation for URL:', url);

    // Step 1: Scrape the website content
    const sourceContent = await WebScraper.scrapeUrl(url);
    console.log('Content scraped successfully');

    // Step 2: Analyze the source content
    const analysisResult = await AIClient.analyzeContent(sourceContent.content);
    console.log('Content analyzed successfully');

    // Step 3: Generate blog posts
    const blogTypes = [
      'Educational/How-to Guide',
      'Opinion/Analysis Piece', 
      'News/Trends Commentary'
    ];

    const blogPromises = blogTypes.map(async (blogType, index) => {
      try {
        const blogJson = await AIClient.generateBlogPost(
          sourceContent.content,
          analysisResult,
          blogType,
          index
        );

        const blogData = JSON.parse(blogJson);
        
        return {
          id: `blog_${Date.now()}_${index}`,
          title: blogData.title,
          content: blogData.content,
          summary: blogData.summary,
          imageUrl: '', // Will be populated after image generation
          imagePrompt: blogData.imagePrompt,
          createdAt: new Date().toISOString()
        } as BlogPost;

      } catch (error) {
        console.error(`Error generating blog ${index}:`, error);
        
        // Return a fallback blog if generation fails
        return {
          id: `blog_${Date.now()}_${index}_fallback`,
          title: `Insights from ${sourceContent.title}`,
          content: `# Insights from ${sourceContent.title}\n\nBased on the content from ${url}, here are some key insights:\n\n${sourceContent.content.substring(0, 800)}...\n\n## Key Takeaways\n\n- Understanding the main concepts\n- Practical applications\n- Future implications\n\nThis analysis provides valuable perspectives on the topic and its broader context.`,
          summary: `Key insights and analysis based on content from ${sourceContent.title}.`,
          imageUrl: '',
          imagePrompt: `Professional blog header image representing insights and analysis, modern design with data visualization elements`,
          createdAt: new Date().toISOString()
        } as BlogPost;
      }
    });

    const blogs = await Promise.all(blogPromises);
    console.log('Blogs generated successfully');

    // Step 4: Generate images for each blog
    const imagePrompts = blogs.map(blog => blog.imagePrompt);
    
    const imagePromises = imagePrompts.map(async (prompt: string, index: number) => {
      try {
        const enhancedPrompt = `Professional blog header image: ${prompt}. High quality, clean design, suitable for web article. Modern, visually appealing, 16:9 aspect ratio.`;
        const imageResult = await AIClient.generateImage(enhancedPrompt);
        return imageResult.url;
      } catch (error) {
        console.error(`Error generating image ${index}:`, error);
        return `https://placehold.co/800x450?text=Blog+Image+${index + 1}`;
      }
    });

    const imageUrls = await Promise.all(imagePromises);
    console.log('Images generated successfully');

    // Step 5: Combine blogs with their images
    const completedBlogs = blogs.map((blog, index) => ({
      ...blog,
      imageUrl: imageUrls[index]
    }));

    const response: BlogGenerationResponse = {
      success: true,
      blogs: completedBlogs,
      sourceContent
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Blog generation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate blogs';
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        blogs: [],
        sourceContent: {
          url: '',
          title: '',
          description: '',
          content: '',
          keywords: []
        }
      } as BlogGenerationResponse,
      { status: 500 }
    );
  }
}