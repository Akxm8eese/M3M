# Hydration & Macronutrient Tracking App

Goal:  
Build a **high-performance** hydration + macronutrient tracking interface with smooth animations, minimal re-renders, and clear user flows.

## Development

This repository includes a Vite + React + TypeScript implementation of the dashboard described below.

### Prerequisites

- Node.js 20 or newer
- npm

### Run locally

```bash
npm install
npm run dev
```

The dev server listens on `http://localhost:5173`.

### Build

```bash
npm run build
```

---

## 1. Core Features

- Hydration tracking:
  - Track **total hydration** from water + meals.
  - Quick-add buttons for common amounts.
  - Progress ring with smooth animation.
- Macronutrient tracking:
  - Track **protein, carbs, fats** toward daily goals.
  - Circular macro progress bars.
  - Meal logging with macro breakdown.
  - Smart suggestions when a macro is low.
- History:
  - Daily/weekly history for hydration + macros.
  - Simple log views (low overhead).

---

## 2. Hydration Tracking Workflow

### 2.1 Hydration Education Screen (First-Time Only)

**Goal:** Educate user that hydration comes from both food + drinks.

**Logic:**
- Show once per user on first app open or until dismissed.
- Controlled by a boolean flag in storage: `hasSeenHydrationEducation: boolean`.

**UI:**
- Illustration:
  - Left: Plate with droplets – label: “From Food”
  - Right: Glass of water – label: “From Drinks”
  - Plus sign between them.
- Text:
  - “Your body gets water from both food and drinks. Tracking both helps you stay hydrated!”
- Button:
  - `Continue` → sets `hasSeenHydrationEducation = true` and navigates to main dashboard.

**Performance notes:**
- Keep illustration as a static asset or simple vector; avoid heavy image loading.
- Only mount this screen if `hasSeenHydrationEducation === false`.

---

### 2.2 Hydration Dashboard Section

**Displayed on main dashboard.**

**UI elements:**
- Large circular progress ring (total hydration):
  - Center text: `currentHydration / hydrationGoal` (e.g., `1.5L / 2.5L`).
- Quick-add buttons:
  - `+250ml`
  - `+500ml`
- Breakdown row:
  - `Water: X L` (icon: glass)
  - `Meals: Y L` (icon: plate)
- Links/text:
  - `History` → opens hydration log.
  - Hydration tip block (rotating tips).

**State model (example):**
- `hydration`:
  - `total: number` (ml)
  - `fromWater: number` (ml)
  - `fromMeals: number` (ml)
  - `goal: number` (ml, e.g., 2500)
- `hydrationTips: string[]`
- `selectedTipIndex: number`

**Performance notes:**
- Use memoized selectors:
  - `totalHydration = fromWater + fromMeals`
  - `progress = totalHydration / goal`
- Animate progress ring only when `totalHydration` changes.
- Avoid global re-renders: isolate hydration components from macros.

---

### 2.3 Logging Hydration

**User actions:**
- Tap `+250ml` or `+500ml`.
- Or open custom input modal: `Add Custom Amount`.

**Logic:**
- When user logs water:
  - Update `fromWater += amount`.
  - Recalculate `totalHydration`.
- When hydration updates:
  - Trigger animation on progress ring.
  - Show inline feedback:
    - Example: “Great job! Only 1 cup to go!”

**Performance notes:**
- Keep logging functions pure and fast.
- Debounce or batch updates if multiple logs happen quickly.
- Use lightweight animations (e.g., CSS transform / GPU-accelerated, or simple RN animated values).

---

## 3. Macronutrient Tracking Workflow

### 3.1 Macronutrient Dashboard Section

**UI elements:**
- Three circular progress bars:
  - `Protein: current / goal (g)`
  - `Carbs: current / goal (g)`
  - `Fats: current / goal (g)`
- Each progress ring shows:
  - Label (e.g., “Protein”)
  - `60g / 80g`
- Link:
  - `Tap a macro for details`
- Button:
  - `Log Meal`
- Suggestions:
  - e.g., “Try: Tofu” under Protein if protein is low.

**State model (example):**
- `macros`:
  - `protein: { current: number, goal: number }`
  - `carbs: { current: number, goal: number }`
  - `fats: { current: number, goal: number }`
- `macroSuggestions`: { protein: string[], carbs: string[], fats: string[] }

**Performance notes:**
- Store macro totals, not every tiny operation.
- Use derived values for percentages:
  - `percentage = current / goal`.
- Avoid unnecessary re-renders of all three macros when only one changes.

---

### 3.2 Logging a Meal

**Flow:**
- User taps `Log Meal`.
- Open modal or new screen:
  - Fields:
    - Food name
    - Portion size
    - Protein (g)
    - Carbs (g)
    - Fats (g)
- On submit:
  - Update `macros.protein.current`, `macros.carbs.current`, `macros.fats.current`.
  - Push entry into `mealHistory`.

**Smart logic:**
- After update, check which macro is below, e.g.:
  - If `protein.current / protein.goal < 0.6`:
    - Show: “Consider adding more protein to your next meal.”

**Data model for meals (example):**
- `mealHistory: Array<{
    id: string;
    timestamp: string;
    name: string;
    protein: number;
    carbs: number;
    fats: number;
  }>`


**Performance notes:**
- Use IDs for meal entries to keep list updates efficient.
- Virtualize long lists if needed (for meal history screen).
- Keep modal lightweight and unmount when closed.

---

### 3.3 Macro Details & History

**When user taps a macro (e.g., Protein):**
- Navig
