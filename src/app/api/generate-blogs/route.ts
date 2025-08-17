import { NextRequest, NextResponse } from 'next/server';
import { AIClient } from '@/lib/ai-client';
import { BlogPost } from '@/types/blog';

export async function POST(request: NextRequest) {
  try {
    const { sourceContent } = await request.json();

    if (!sourceContent || !sourceContent.content) {
      return NextResponse.json(
        { success: false, error: 'Source content is required' },
        { status: 400 }
      );
    }

    // Analyze the source content
    const analysisResult = await AIClient.analyzeContent(sourceContent.content);
    
    // Define different blog types for variety
    const blogTypes = [
      'Educational/How-to Guide',
      'Opinion/Analysis Piece', 
      'News/Trends Commentary'
    ];

    // Generate blogs in parallel
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
          imageUrl: '', // Will be populated by image generation
          imagePrompt: blogData.imagePrompt,
          createdAt: new Date().toISOString()
        } as BlogPost;

      } catch (error) {
        console.error(`Error generating blog ${index}:`, error);
        // Return a fallback blog if generation fails
        return {
          id: `blog_${Date.now()}_${index}_fallback`,
          title: `Insights from ${sourceContent.title || 'Web Content'}`,
          content: `# Insights from ${sourceContent.title || 'Web Content'}\n\nBased on the analyzed content, here are some key insights and perspectives...\n\n${sourceContent.content.substring(0, 500)}...`,
          summary: 'A blog post generated from web content analysis.',
          imageUrl: '',
          imagePrompt: 'Professional blog header image with modern design elements',
          createdAt: new Date().toISOString()
        } as BlogPost;
      }
    });

    const blogs = await Promise.all(blogPromises);

    return NextResponse.json({
      success: true,
      blogs,
      analysis: analysisResult
    });

  } catch (error) {
    console.error('Blog generation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate blogs';
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}