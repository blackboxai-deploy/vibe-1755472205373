'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function UrlInput({ onSubmit, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL (must start with http:// or https://)');
      return;
    }

    setError('');
    onSubmit(url.trim());
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Blog Generator
        </CardTitle>
        <CardDescription className="text-lg">
          Enter any website URL and we'll generate 3 unique blog posts with AI-generated images
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              className="text-lg h-12"
            />
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading || !url.trim()}
            className="w-full h-12 text-lg font-semibold"
          >
            {isLoading ? 'Generating Blogs...' : 'Generate Blog Posts'}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>We'll analyze the content and create:</p>
          <div className="mt-2 flex justify-center space-x-6">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Educational Guide
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Opinion Analysis
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              News Commentary
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}