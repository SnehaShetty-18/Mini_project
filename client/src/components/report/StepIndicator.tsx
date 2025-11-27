import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface StepIndicatorProps {
  currentStep: number;
  steps: { id: number; title: string; description: string }[];
}

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-border -z-10"></div>
        
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
              currentStep >= step.id 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-text-secondary'
            }`}>
              {currentStep > step.id ? (
                <Icon name="CheckIcon" size={16} />
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </div>
            <div className="text-center">
              <p className={`text-sm font-medium ${
                currentStep >= step.id ? 'text-foreground' : 'text-text-secondary'
              }`}>
                {step.title}
              </p>
              <p className="text-xs text-text-secondary mt-1 hidden md:block">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}