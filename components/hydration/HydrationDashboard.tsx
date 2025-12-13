import React from 'react';
import { useTracking } from '../../context/TrackingContext';
import { ProgressRing } from '../ui/ProgressRing';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Plus, GlassWater, Utensils, History } from 'lucide-react';

export const HydrationDashboard = () => {
  const { goals, addHydration, getTodayHydration } = useTracking();
  const { total, water, meal } = getTodayHydration();
  const progress = Math.min((total / goals.hydration) * 100, 100);

  return (
    <section className="space-y-6">
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hydration</h2>
        
        <ProgressRing 
          progress={progress} 
          size={200} 
          strokeWidth={16}
          color="text-cyan-500"
          trackColor="text-cyan-100"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {(total / 1000).toFixed(1)}L
            </div>
            <div className="text-sm text-gray-500">
              of {(goals.hydration / 1000).toFixed(1)}L goal
            </div>
          </div>
        </ProgressRing>
        
        {/* Inline Feedback */}
        {progress < 100 ? (
          <p className="mt-4 text-sm font-medium text-cyan-600 animate-pulse">
            Great job! Only {((goals.hydration - total) / 250).toFixed(0)} cup{((goals.hydration - total) / 250) > 1 ? 's' : ''} to go!
          </p>
        ) : (
          <p className="mt-4 text-sm font-medium text-green-600">
            Goal reached! Stay hydrated!
          </p>
        )}
      </div>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          onClick={() => addHydration(250, 'water')}
          className="flex items-center space-x-2 h-14 border-cyan-200 text-cyan-700 hover:bg-cyan-50"
        >
          <Plus className="w-4 h-4" />
          <span>250ml</span>
        </Button>
        <Button 
          variant="outline" 
          onClick={() => addHydration(500, 'water')}
          className="flex items-center space-x-2 h-14 border-cyan-200 text-cyan-700 hover:bg-cyan-50"
        >
          <Plus className="w-4 h-4" />
          <span>500ml</span>
        </Button>
      </div>

      {/* Breakdown */}
      <Card className="p-4 bg-cyan-50/50 border-cyan-100">
        <div className="flex justify-around items-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 text-cyan-600 mb-1">
              <GlassWater className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Water</span>
            </div>
            <span className="text-lg font-bold text-gray-900">{(water / 1000).toFixed(1)}L</span>
          </div>
          <div className="w-px h-8 bg-cyan-200" />
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 text-orange-600 mb-1">
              <Utensils className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Meal</span>
            </div>
            <span className="text-lg font-bold text-gray-900">{(meal / 1000).toFixed(1)}L</span>
          </div>
        </div>
      </Card>

      {/* Tip & History */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-gray-500 italic">"Sip water throughout the day."</p>
        <button className="flex items-center space-x-1 text-cyan-600 font-medium hover:underline">
          <History className="w-4 h-4" />
          <span>History</span>
        </button>
      </div>
    </section>
  );
};
