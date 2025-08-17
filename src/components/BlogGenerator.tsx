'use client';

import { useState } from 'react';
import { UrlInput } from './UrlInput';
import { LoadingSpinner } from './LoadingSpinner';
import { BlogCard } from './BlogCard';
import { BlogPost, BlogGenerationResponse } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function BlogGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceTitle, setSourceTitle] = useState('');
  const [error, setError] = useState('');
  const [loadingStage, setLoadingStage] = useState('scraping');
  const [loadingProgress, setLoadingProgress] = useState(0);

  const generateBlogs = async (url: string) => {
    setIsLoading(true);
    setError('');
    setBlogs([]);
    setSourceUrl(url);
    setLoadingStage('scraping');
    setLoadingProgress(10);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev < 90) return prev + 10;
          return prev;
        });
      }, 3000);

      const response = await fetch('/api/blog-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate blogs');
      }

      const data: BlogGenerationResponse = await response.json();

      if (data.success) {
        setBlogs(data.blogs);
        setSourceTitle(data.sourceContent.title);
        setLoadingProgress(100);
        setLoadingStage('complete');
        
        // Short delay to show completion
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } else {
        throw new Error(data.error || 'Failed to generate blogs');
      }

    } catch (err) {
      console.error('Blog generation error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const resetGenerator = () => {
    setBlogs([]);
    setSourceUrl('');
    setSourceTitle('');
    setError('');
    setIsLoading(false);
    setLoadingProgress(0);
    setLoadingStage('scraping');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="container mx-auto py-12">
          <LoadingSpinner stage={loadingStage} progress={loadingProgress} />
        </div>
      </div>
    );
  }

  if (blogs.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="container mx-auto py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Generated Blog Posts
            </h1>
            <Card className="max-w-2xl mx-auto mb-6">
              <CardHeader>
                <CardTitle className="text-xl">Source Content</CardTitle>
                <CardDescription>
                  <a 
                    href={sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {sourceTitle || sourceUrl}
                  </a>
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Button 
              onClick={resetGenerator}
              variant="outline"
              className="mb-8"
            >
              Generate New Blogs
            </Button>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} index={index} />
            ))}
          </div>

          {/* Success Message */}
          <div className="mt-8 text-center">
            <Alert className="max-w-2xl mx-auto">
              <AlertDescription>
                Successfully generated {blogs.length} unique blog posts with AI-generated images!
                Each post offers a different perspective on the source content.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Blog Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform any website into engaging blog content. Our AI analyzes web pages and creates 
            unique, high-quality blog posts with custom images.
          </p>
        </div>

        <UrlInput onSubmit={generateBlogs} isLoading={isLoading} />

        {error && (
          <div className="mt-6 max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">🌐</div>
                <CardTitle>Smart Scraping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Our AI intelligently extracts and analyzes content from any website
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">✍️</div>
                <CardTitle>AI Writing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Generate unique blog posts with different perspectives and styles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">🎨</div>
                <CardTitle>Custom Images</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  AI-generated images perfectly matched to each blog post's content
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}