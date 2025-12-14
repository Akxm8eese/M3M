import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { X } from 'lucide-react';

interface LogMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meal: { name: string; protein: number; carbs: number; fats: number; waterContent: number }) => void;
}

export const LogMealModal = ({ isOpen, onClose, onSave }: LogMealModalProps) => {
  const [name, setName] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [waterContent, setWaterContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name || 'Meal',
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fats: Number(fats) || 0,
      waterContent: Number(waterContent) || 0,
    });
    // Reset
    setName('');
    setProtein('');
    setCarbs('');
    setFats('');
    setWaterContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md p-6 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Log Meal</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meal Name</label>
            <input
              type="text"
              className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. Chicken Salad"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">Protein (g)</label>
              <input
                type="number"
                className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="0"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-700 mb-1">Carbs (g)</label>
              <input
                type="number"
                className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-yellow-500 outline-none"
                placeholder="0"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-700 mb-1">Fats (g)</label>
              <input
                type="number"
                className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="0"
                value={fats}
                onChange={(e) => setFats(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-700 mb-1">Water Content (ml)</label>
            <input
              type="number"
              className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="Optional"
              value={waterContent}
              onChange={(e) => setWaterContent(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Estimated water in this meal (adds to hydration)
            </p>
          </div>

          <Button type="submit" className="w-full h-12 mt-2">
            Save Meal
          </Button>
        </form>
      </Card>
    </div>
  );
};
