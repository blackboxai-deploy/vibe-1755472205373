'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface LoadingSpinnerProps {
  stage: string;
  progress: number;
}

export function LoadingSpinner({ stage, progress }: LoadingSpinnerProps) {
  const stages = [
    { id: 'scraping', label: 'Scraping website content', icon: '🌐' },
    { id: 'analyzing', label: 'Analyzing content with AI', icon: '🧠' },
    { id: 'generating_blogs', label: 'Generating blog posts', icon: '✍️' },
    { id: 'generating_images', label: 'Creating AI images', icon: '🎨' },
    { id: 'complete', label: 'Finalizing results', icon: '✅' }
  ];

  const currentStageIndex = stages.findIndex(s => s.id === stage);
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          {/* Main spinner */}
          <div className="relative">
            <div className="w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-3">
            <Progress value={progress} className="w-full h-2" />
            <p className="text-lg font-medium text-gray-700">
              {stages[currentStageIndex]?.icon} {stages[currentStageIndex]?.label || 'Processing...'}
            </p>
            <p className="text-sm text-gray-500">{progress}% complete</p>
          </div>

          {/* Stage indicators */}
          <div className="grid grid-cols-5 gap-2 mt-6">
            {stages.map((stageItem, index) => (
              <div
                key={stageItem.id}
                className={`text-center p-2 rounded transition-colors ${
                  index < currentStageIndex
                    ? 'bg-green-100 text-green-700'
                    : index === currentStageIndex
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <div className="text-lg">{stageItem.icon}</div>
                <div className="text-xs mt-1 leading-tight">{stageItem.label}</div>
              </div>
            ))}
          </div>

          {/* Estimated time */}
          <div className="text-sm text-gray-500 mt-4">
            <p>This usually takes 2-3 minutes</p>
            <p className="text-xs">Please don't close this window</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}