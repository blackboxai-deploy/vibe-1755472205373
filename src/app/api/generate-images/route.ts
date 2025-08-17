import { NextRequest, NextResponse } from 'next/server';
import { AIClient } from '@/lib/ai-client';

export async function POST(request: NextRequest) {
  try {
    const { imagePrompts } = await request.json();

    if (!imagePrompts || !Array.isArray(imagePrompts)) {
      return NextResponse.json(
        { success: false, error: 'Image prompts array is required' },
        { status: 400 }
      );
    }

    // Generate images in parallel
    const imagePromises = imagePrompts.map(async (prompt: string, index: number) => {
      try {
        // Enhance the prompt for better image generation
        const enhancedPrompt = `Professional blog header image: ${prompt}. High quality, clean design, suitable for web article. Modern, visually appealing, 16:9 aspect ratio.`;
        
        const imageResult = await AIClient.generateImage(enhancedPrompt);
        
        return {
          index,
          url: imageResult.url,
          prompt: enhancedPrompt,
          success: true
        };
      } catch (error) {
        console.error(`Error generating image ${index}:`, error);
        
        // Return a placeholder if image generation fails
        return {
          index,
          url: `https://placehold.co/800x450?text=Blog+Image+${index + 1}`,
          prompt,
          success: false,
          error: error instanceof Error ? error.message : 'Image generation failed'
        };
      }
    });

    const imageResults = await Promise.all(imagePromises);

    // Separate successful and failed generations
    const successfulImages = imageResults.filter(result => result.success);
    const failedImages = imageResults.filter(result => !result.success);

    return NextResponse.json({
      success: true,
      images: imageResults,
      stats: {
        total: imageResults.length,
        successful: successfulImages.length,
        failed: failedImages.length
      }
    });

  } catch (error) {
    console.error('Image generation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate images';
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}