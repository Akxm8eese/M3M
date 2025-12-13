import React from 'react';
import { Button } from '../ui/Button';
import { Droplets, GlassWater, Utensils } from 'lucide-react';

interface HydrationEducationProps {
  onComplete: () => void;
}

export const HydrationEducation = ({ onComplete }: HydrationEducationProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white text-center">
      <div className="mb-8 flex items-center justify-center space-x-4">
        {/* Plate */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center border-4 border-orange-200">
            <Utensils className="w-10 h-10 text-orange-500" />
            <Droplets className="absolute top-0 right-0 w-6 h-6 text-blue-500 animate-bounce" />
          </div>
          <span className="mt-2 text-sm font-medium text-gray-600">From Food</span>
        </div>

        <div className="text-2xl font-bold text-gray-400">+</div>

        {/* Glass */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center border-4 border-blue-200">
            <GlassWater className="w-10 h-10 text-blue-500" />
          </div>
          <span className="mt-2 text-sm font-medium text-gray-600">From Drinks</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Hydration comes from everywhere!
      </h1>
      <p className="text-gray-600 mb-8 max-w-xs mx-auto">
        Your body gets water from both food and drinks. Tracking both helps you stay hydrated!
      </p>

      <Button onClick={onComplete} size="lg" className="w-full max-w-xs">
        Continue
      </Button>
    </div>
  );
};
