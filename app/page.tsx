'use client';

import { TrackingProvider, useTracking } from '@/context/TrackingContext';
import { HydrationEducation } from '@/components/hydration/HydrationEducation';
import { HydrationDashboard } from '@/components/hydration/HydrationDashboard';
import { MacroDashboard } from '@/components/macros/MacroDashboard';

const AppContent = () => {
  const { hasSeenEducation, completeEducation } = useTracking();

  // Prevent flash of content by checking if we are mounted/loaded effectively
  // The context handles loading state internally but we might want to show a spinner if hydration from localStorage is slow
  // For now, it's fast enough.

  if (!hasSeenEducation) {
    return <HydrationEducation onComplete={completeEducation} />;
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="max-w-md mx-auto p-6 space-y-8">
        <header className="flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Today&apos;s Goals</h1>
            <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold border border-gray-200">
            U
          </div> 
        </header>
        <HydrationDashboard />
        <MacroDashboard />
      </div>
    </main>
  );
};

export default function Page() {
  return (
    <TrackingProvider>
      <AppContent />
    </TrackingProvider>
  );
}
