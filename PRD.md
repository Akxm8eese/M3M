# Product Requirements Document (PRD)
## Grocery Inventory + Meals + List + Budget App

## 1) Product Vision
Build one unified app that helps individuals and caregivers manage groceries, meal planning, and budget decisions across one or many households, while offering evidence-aware health guidance through the **Vegus Healthy Alternative AI Agent**.

## 2) Goals
- Reduce grocery waste with storage-aware inventory tracking.
- Improve meal success by highlighting what is available vs. missing.
- Support caregiver-led planning for families across multiple households.
- Improve nutrition outcomes with configurable health rules and safer alternatives.
- Keep budget visibility clear for lists, missing ingredients, and replenishment.

## 3) User Roles
- **Individual User**: Manages own pantry/fridge/freezer, goals, and meal decisions.
- **Patriarch/Matriarch Caregiver Admin**: Oversees multiple household members, controls shared rules/goals, and can plan or approve grocery/meal choices.
- **Household Member**: Contributes item updates, meal activity, and list requests under household settings.

## 4) Subscription Tiers
- **Core**: Single household, grocery + list + budget basics, meal generation.
- **Advanced Caregiving**: Multi-household support, servings-based planning for dependents, cross-household coordination, and expanded caregiver controls.

## 5) Core Experience Pillars
1. **Interactive Storage Mode First**: Main UI behaves like a kitchen tour.
2. **Smart Meal Generation**: Clear formatting for in-stock vs. missing ingredients.
3. **Health-Aware Guidance**: User/caregiver-defined health rules interpreted by Vegus.
4. **Budget Transparency**: Missing item quantity + estimated cost shown at planning time.

## 6) Functional Requirements

### 6.1 Multi-Household + Caregiver Model
- Users can create/manage multiple households from one account.
- Patriarch/Matriarch admin can:
  - Add/remove household members.
  - Set household-level health goals and restrictions.
  - Configure serving targets by member/group.
  - View inventory/list status across all managed homes.
- Household data boundaries remain isolated while still visible to permitted caregivers.

### 6.2 Inventory Tracking Modes
- Default mode: **Count-based** (units, packs, bottles, etc.).
- Optional mode: **Weight-based limits** for macros and meal prep planning.
- Items support:
  - Partial-use status (e.g., half-used milk).
  - Shelf-life expectation and expiry tracking.
  - Movement between storage zones.

### 6.3 Interactive Storage Mode (Primary UI)
- Kitchen-map style navigation across:
  - Cabinets
  - Cupboards
  - Refrigerator shelves
  - Refrigerator door slots
  - Produce bins
  - Drawers
  - Deep freezer
- Users can move items between sections via drag/drop or move action.
- Each zone shows quantity, freshness status, and estimated remaining shelf life.
- Experience should feel like a guided “house tour” / map navigation.

### 6.4 Meal Generation + Formatting Rules
- For generated meals/recipes:
  - **In-stock ingredients appear in bold**.
  - *Missing ingredients appear in italics* with dotted/outlined visual treatment in UI.
- For each missing ingredient, show:
  - Estimated missing quantity based on selected servings.
  - Estimated price to complete meal.
- In caregiver mode, servings can be planned for multiple members/households.

### 6.5 Budget + Grocery List
- Auto-build list from missing meal ingredients.
- Show budget breakdown by:
  - Meal
  - Household
  - Time window (weekly/monthly)
- Allow manual additions and substitutions while retaining budget totals.

### 6.6 Vegus Healthy Alternative AI Agent
- Mascot direction: ginger-root / nerve-like character.
- Vegus provides alternatives based on:
  - User- or caregiver-defined conditions and goals.
  - Rule sets (e.g., sodium limits, macro limits, glycemic concerns, additive restrictions).
  - Supported culinary/health evidence sources.
- Vegus can parse recipe facts and ingredient patterns.
- Intervention behavior:
  - Highlight/glow state when user actions exceed configured risk thresholds.
  - Explain concern and suggest safer substitutes.

### 6.7 Onboarding + “Doctor Visit” Flow
- On first login, user is prompted to start with a guided **doctor visit with Vegus**.
- Collect profile data:
  - Height
  - Weight
  - Desired body composition/build
  - Health assessment level
  - Lifestyle activity level
  - Fitness goal
- User can skip onboarding and continue with grocery-list-and-budget-only mode.

## 7) Non-Functional Requirements
- Fast interactions in Storage Mode; inventory moves should feel immediate.
- Reliable syncing for multi-household users.
- Explainable health recommendations (show reason + rule trigger).
- Privacy and role-based permissions for caregiver scenarios.

## 8) KPIs / Success Metrics
- Inventory accuracy rate.
- Grocery waste reduction (% expired items over time).
- Meal completion rate without extra shopping.
- Budget variance reduction.
- Vegus recommendation acceptance rate.
- Onboarding completion vs. skip rate.

## 9) Risks & Mitigations
- **Risk:** Overly complex UI in Storage Mode.  
  **Mitigation:** Progressive disclosure and quick-jump shortcuts.
- **Risk:** Health guidance trust.  
  **Mitigation:** Cite rationale category (rules/evidence class) per suggestion.
- **Risk:** Multi-household permission confusion.  
  **Mitigation:** Clear role badges and household context switcher.

## 10) Out of Scope (Initial Release)
- Direct medical diagnosis.
- Insurance/clinical billing integrations.
- Real-time grocery delivery checkout integrations.

