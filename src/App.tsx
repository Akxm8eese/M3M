import { CSSProperties, FormEvent, useMemo, useState } from 'react';
import './styles.css';

type Hydration = {
  fromWater: number;
  fromMeals: number;
  goal: number;
};

type MacroKey = 'protein' | 'carbs' | 'fats';

type Macro = {
  current: number;
  goal: number;
  color: string;
};

type Meal = {
  id: string;
  name: string;
  protein: number;
  carbs: number;
  fats: number;
};

const hydrationTips = [
  'Meals can provide about 20% of daily hydration.',
  'Pair each meal with a glass of water.',
  'Small, frequent sips are easier to sustain than catch-up drinking.',
];

const macroSuggestions: Record<MacroKey, string[]> = {
  protein: ['Greek yogurt', 'Tofu', 'Lentils'],
  carbs: ['Oats', 'Sweet potato', 'Brown rice'],
  fats: ['Avocado', 'Olive oil', 'Almonds'],
};

const macroLabels: Record<MacroKey, string> = {
  protein: 'Protein',
  carbs: 'Carbs',
  fats: 'Fats',
};

function formatLiters(value: number) {
  return `${new Intl.NumberFormat('en', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value / 1000)}L`;
}

function clampPercent(value: number) {
  return Math.min(Math.max(value, 0), 100);
}

function ProgressRing({
  value,
  label,
  detail,
  color,
  size = 184,
}: {
  value: number;
  label: string;
  detail: string;
  color: string;
  size?: number;
}) {
  const progress = clampPercent(value);

  return (
    <div
      className="progress-ring"
      style={{
        '--progress': `${progress}%`,
        '--ring-color': color,
        width: size,
        height: size,
      } as CSSProperties}
      aria-label={`${label}: ${Math.round(progress)} percent`}
    >
      <div className="progress-ring__inner">
        <strong>{label}</strong>
        <span>{detail}</span>
      </div>
    </div>
  );
}

function App() {
  const [hasSeenEducation, setHasSeenEducation] = useState(
    () => localStorage.getItem('hasSeenHydrationEducation') === 'true',
  );
  const [hydration, setHydration] = useState<Hydration>({
    fromWater: 900,
    fromMeals: 450,
    goal: 2500,
  });
  const [selectedTipIndex, setSelectedTipIndex] = useState(0);
  const [macros, setMacros] = useState<Record<MacroKey, Macro>>({
    protein: { current: 52, goal: 90, color: '#7c3aed' },
    carbs: { current: 148, goal: 240, color: '#0891b2' },
    fats: { current: 42, goal: 70, color: '#ea580c' },
  });
  const [meals, setMeals] = useState<Meal[]>([
    { id: '1', name: 'Oat bowl', protein: 18, carbs: 64, fats: 14 },
    { id: '2', name: 'Lentil salad', protein: 24, carbs: 48, fats: 16 },
  ]);

  const totalHydration = useMemo(
    () => hydration.fromWater + hydration.fromMeals,
    [hydration.fromMeals, hydration.fromWater],
  );
  const hydrationProgress = useMemo(
    () => (totalHydration / hydration.goal) * 100,
    [hydration.goal, totalHydration],
  );

  const lowestMacro = useMemo(() => {
    return (Object.keys(macros) as MacroKey[]).reduce((lowest, key) => {
      const currentRatio = macros[key].current / macros[key].goal;
      const lowestRatio = macros[lowest].current / macros[lowest].goal;
      return currentRatio < lowestRatio ? key : lowest;
    }, 'protein');
  }, [macros]);

  function completeEducation() {
    localStorage.setItem('hasSeenHydrationEducation', 'true');
    setHasSeenEducation(true);
  }

  function addWater(amount: number) {
    setHydration((current) => ({
      ...current,
      fromWater: current.fromWater + amount,
    }));
    setSelectedTipIndex((current) => (current + 1) % hydrationTips.length);
  }

  function addMeal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextMeal: Meal = {
      id: crypto.randomUUID(),
      name: String(data.get('name') || 'Meal'),
      protein: Number(data.get('protein') || 0),
      carbs: Number(data.get('carbs') || 0),
      fats: Number(data.get('fats') || 0),
    };

    setMeals((current) => [nextMeal, ...current]);
    setMacros((current) => ({
      protein: {
        ...current.protein,
        current: current.protein.current + nextMeal.protein,
      },
      carbs: { ...current.carbs, current: current.carbs.current + nextMeal.carbs },
      fats: { ...current.fats, current: current.fats.current + nextMeal.fats },
    }));
    event.currentTarget.reset();
  }

  if (!hasSeenEducation) {
    return (
      <main className="education-screen">
        <section className="education-card">
          <div className="education-illustration" aria-hidden="true">
            <div className="plate">Food</div>
            <span>+</span>
            <div className="glass">Drinks</div>
          </div>
          <h1>Your body gets water from both food and drinks.</h1>
          <p>Tracking both sources helps you understand your daily hydration more clearly.</p>
          <button onClick={completeEducation}>Continue</button>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">Daily dashboard</p>
        <h1>Hydration & macros at a glance</h1>
        <p>Fast updates, focused cards, and lightweight progress visuals for daily tracking.</p>
      </header>

      <section className="dashboard-grid" aria-label="Tracking dashboard">
        <article className="card hydration-card">
          <div>
            <p className="eyebrow">Hydration</p>
            <h2>{formatLiters(totalHydration)} logged</h2>
          </div>
          <ProgressRing
            value={hydrationProgress}
            label="Total"
            detail={`${formatLiters(totalHydration)} / ${formatLiters(hydration.goal)}`}
            color="#0d9488"
          />
          <div className="quick-actions" aria-label="Quick add water">
            <button onClick={() => addWater(250)}>+250ml</button>
            <button onClick={() => addWater(500)}>+500ml</button>
          </div>
          <div className="breakdown">
            <span>Water: {formatLiters(hydration.fromWater)}</span>
            <span>Meals: {formatLiters(hydration.fromMeals)}</span>
          </div>
          <p className="tip">{hydrationTips[selectedTipIndex]}</p>
        </article>

        <article className="card macro-card">
          <div>
            <p className="eyebrow">Macronutrients</p>
            <h2>Today&apos;s intake</h2>
          </div>
          <div className="macro-list">
            {(Object.keys(macros) as MacroKey[]).map((key) => {
              const macro = macros[key];
              return (
                <ProgressRing
                  key={key}
                  value={(macro.current / macro.goal) * 100}
                  label={macroLabels[key]}
                  detail={`${macro.current}g / ${macro.goal}g`}
                  color={macro.color}
                  size={132}
                />
              );
            })}
          </div>
          <p className="tip">
            Low on {macroLabels[lowestMacro].toLowerCase()}? Try{' '}
            {macroSuggestions[lowestMacro][0]} next.
          </p>
        </article>
      </section>

      <section className="meal-section">
        <form className="card meal-form" onSubmit={addMeal}>
          <p className="eyebrow">Log meal</p>
          <label>
            Food name
            <input name="name" placeholder="Chickpea bowl" required />
          </label>
          <div className="form-row">
            <label>
              Protein
              <input name="protein" type="number" min="0" placeholder="grams" />
            </label>
            <label>
              Carbs
              <input name="carbs" type="number" min="0" placeholder="grams" />
            </label>
            <label>
              Fats
              <input name="fats" type="number" min="0" placeholder="grams" />
            </label>
          </div>
          <button type="submit">Add meal</button>
        </form>

        <article className="card history-card">
          <p className="eyebrow">Recent meals</p>
          <ul>
            {meals.map((meal) => (
              <li key={meal.id}>
                <strong>{meal.name}</strong>
                <span>
                  {meal.protein}g P / {meal.carbs}g C / {meal.fats}g F
                </span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}

export default App;
