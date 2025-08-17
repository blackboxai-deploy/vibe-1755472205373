'use client';

import { useState } from 'react';
import { BlogGenerator } from '@/components/BlogGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Blog Generator
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Transform any website into engaging blog content. Enter a URL and watch as AI creates three unique blog posts with custom images.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-blue-600">Smart Content Analysis</CardTitle>
            <CardDescription>
              Advanced AI analyzes website content to extract key insights and themes
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-purple-600">Multiple Perspectives</CardTitle>
            <CardDescription>
              Generates 3 unique blog posts: Educational, Opinion, and Commentary styles
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-green-600">Custom AI Images</CardTitle>
            <CardDescription>
              Creates professional header images tailored to each blog post topic
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Main Blog Generator Component */}
      <BlogGenerator />

      {/* Footer */}
      <div className="text-center text-gray-500 mt-16">
        <p>Powered by advanced AI technology for content creation and image generation</p>
      </div>
    </div>
  );
}