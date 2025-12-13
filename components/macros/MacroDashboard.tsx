import React, { useState } from 'react';
import { useTracking } from '../../context/TrackingContext';
import { ProgressRing } from '../ui/ProgressRing';
import { Button } from '../ui/Button';
import { LogMealModal } from './LogMealModal';
import { Plus } from 'lucide-react';

export const MacroDashboard = () => {
  const { goals, getTodayMacros, addMeal } = useTracking();
  const macros = getTodayMacros();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getProgress = (current: number, goal: number) => Math.min((current / goal) * 100, 100);

  const proteinProgress = getProgress(macros.protein, goals.protein);
  const carbsProgress = getProgress(macros.carbs, goals.carbs);
  const fatsProgress = getProgress(macros.fats, goals.fats);

  const getSuggestion = () => {
    if (proteinProgress < 50) return "Try adding Tofu, Chicken, or Greek Yogurt for protein.";
    if (carbsProgress < 50) return "Whole grains or fruits are great carb sources.";
    if (fatsProgress < 50) return "Avocado or nuts can boost your healthy fats.";
    return "You're doing great on your macros today!";
  };

  return (
    <section className="space-y-6 pt-6 border-t border-gray-100">
      <h2 className="text-xl font-bold text-center text-gray-900">Macronutrients</h2>

      <div className="flex justify-between items-center px-2">
        {/* Protein */}
        <div className="flex flex-col items-center">
          <ProgressRing
            progress={proteinProgress}
            size={90}
            strokeWidth={8}
            color="text-purple-500"
            trackColor="text-purple-100"
          >
            <div className="text-center">
              <div className="text-sm font-bold text-gray-900">{macros.protein}g</div>
              <div className="text-[10px] text-gray-500">of {goals.protein}g</div>
            </div>
          </ProgressRing>
          <span className="mt-2 text-sm font-medium text-gray-700">Protein</span>
        </div>

        {/* Carbs */}
        <div className="flex flex-col items-center">
          <ProgressRing
            progress={carbsProgress}
            size={90}
            strokeWidth={8}
            color="text-yellow-500"
            trackColor="text-yellow-100"
          >
            <div className="text-center">
              <div className="text-sm font-bold text-gray-900">{macros.carbs}g</div>
              <div className="text-[10px] text-gray-500">of {goals.carbs}g</div>
            </div>
          </ProgressRing>
          <span className="mt-2 text-sm font-medium text-gray-700">Carbs</span>
        </div>

        {/* Fats */}
        <div className="flex flex-col items-center">
          <ProgressRing
            progress={fatsProgress}
            size={90}
            strokeWidth={8}
            color="text-red-500"
            trackColor="text-red-100"
          >
            <div className="text-center">
              <div className="text-sm font-bold text-gray-900">{macros.fats}g</div>
              <div className="text-[10px] text-gray-500">of {goals.fats}g</div>
            </div>
          </ProgressRing>
          <span className="mt-2 text-sm font-medium text-gray-700">Fats</span>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl text-center">
        <p className="text-sm text-gray-600 italic">{getSuggestion()}</p>
      </div>

      <Button onClick={() => setIsModalOpen(true)} className="w-full h-14 text-lg bg-gray-900 hover:bg-gray-800">
        <Plus className="w-5 h-5 mr-2" />
        Log Meal
      </Button>

      <LogMealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addMeal}
      />
    </section>
  );
};
