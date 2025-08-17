'use client';

import { useState } from 'react';
import { BlogPost } from '@/types/blog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BlogCardProps {
  blog: BlogPost;
  index: number;
}

export function BlogCard({ blog, index }: BlogCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getBlogTypeInfo = (index: number) => {
    const types = [
      { type: 'Educational', color: 'bg-blue-100 text-blue-700', icon: '📚' },
      { type: 'Analysis', color: 'bg-green-100 text-green-700', icon: '🔍' },
      { type: 'Commentary', color: 'bg-purple-100 text-purple-700', icon: '💭' }
    ];
    return types[index] || types[0];
  };

  const typeInfo = getBlogTypeInfo(index);

  const formatContent = (content: string) => {
    // Convert markdown-style headers to HTML
    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(?!<h[1-6]|<p)/gm, '<p class="mb-4">')
      .replace(/(<p class="mb-4">)$/g, '');
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        {/* Blog Image */}
        <div className="w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden">
          {!imageError ? (
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-4xl">{typeInfo.icon}</span>
            </div>
          )}
          
          {/* Loading skeleton */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
        </div>

        {/* Blog Type Badge */}
        <Badge className={`absolute top-3 left-3 ${typeInfo.color}`}>
          {typeInfo.icon} {typeInfo.type}
        </Badge>
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-2 text-lg">{blog.title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {blog.summary}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Content preview */}
          <div 
            className="text-sm text-gray-600 line-clamp-4"
            dangerouslySetInnerHTML={{ 
              __html: formatContent(blog.content.substring(0, 200) + '...') 
            }}
          />

          {/* Read More Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Read Full Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="text-xl">{blog.title}</DialogTitle>
                <DialogDescription>
                  Generated on {new Date(blog.createdAt).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              
              <ScrollArea className="h-[60vh] pr-4">
                {/* Full image in modal */}
                {!imageError && (
                  <div className="mb-6">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Full content */}
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatContent(blog.content) }}
                />
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* Metadata */}
          <div className="text-xs text-gray-400 pt-2 border-t">
            <p>Generated: {new Date(blog.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}