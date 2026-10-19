import type { Action, AppState, Filters, Sign, SignId } from "./types";

export const emptyFilters = (): Filters => ({ element: [], realm: [], animal: [] });

export function initialState(): AppState {
  return {
    selectedSignId: null,
    layer: "skin",
    orientation: "front",
    angleDegrees: 0,
    spinning: false,
    speedDegreesPerSecond: 30,
    filters: emptyFilters(),
    openFoodId: null,
    notice: null,
    dragging: false,
  };
}

export function normalizeAngle(angle: number): number {
  const wrapped = angle % 360;
  return wrapped < 0 ? wrapped + 360 : wrapped;
}

export function matchesFilters(sign: Pick<Sign, "element" | "realm" | "animal">, filters: Filters): boolean {
  if (filters.element.length > 0 && !filters.element.includes(sign.element)) return false;
  if (filters.realm.length > 0 && !filters.realm.includes(sign.realm)) return false;
  if (filters.animal.length > 0 && !filters.animal.includes(sign.animal)) return false;
  return true;
}

export function visibleSigns(signs: Sign[], filters: Filters): Sign[] {
  return signs.filter((sign) => matchesFilters(sign, filters));
}

function toggleValue<T extends string>(current: T[], value: T): T[] {
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

const GROUP_LABEL: Record<keyof Filters, string> = {
  element: "Element",
  realm: "Nature realm",
  animal: "Animal or symbol",
};

export function reducer(state: AppState, action: Action, signs: Sign[]): AppState {
  switch (action.type) {
    case "TOGGLE_FILTER": {
      const key = action.group;
      const filters: Filters = {
        ...state.filters,
        [key]: toggleValue(state.filters[key] as string[], action.value) as Filters[typeof key],
      };
      const selected = signs.find((sign) => sign.id === state.selectedSignId) ?? null;
      if (selected && !matchesFilters(selected, filters)) {
        return {
          ...state,
          filters,
          selectedSignId: null,
          openFoodId: null,
          notice: `${selected.name} is outside these filters, so the open chapter was cleared.`,
        };
      }
      return { ...state, filters, notice: null };
    }
    case "RESET": {
      const hadDetail = state.selectedSignId !== null || state.openFoodId !== null;
      return {
        ...state,
        filters: emptyFilters(),
        selectedSignId: null,
        openFoodId: null,
        notice: hadDetail
          ? "All 12 chapters are visible. The open chapter was cleared."
          : "All 12 chapters are visible.",
      };
    }
    case "SELECT_SIGN": {
      const sign = signs.find((item) => item.id === action.id);
      if (!sign) return state;
      const conflicting = (Object.keys(state.filters) as (keyof Filters)[]).filter((key) => {
        const selected = state.filters[key] as string[];
        return selected.length > 0 && !selected.includes(sign[key]);
      });
      const filters: Filters = { ...state.filters };
      for (const key of conflicting) filters[key] = [];
      const sameSign = state.selectedSignId === sign.id;
      return {
        ...state,
        filters,
        selectedSignId: sign.id,
        openFoodId: sameSign ? state.openFoodId : null,
        notice:
          conflicting.length > 0
            ? `Showing ${sign.name}. Cleared ${conflicting.map((key) => GROUP_LABEL[key]).join(" and ")} so this chapter is visible.`
            : null,
      };
    }
    case "SET_LAYER":
      return {
        ...state,
        layer: action.layer,
        openFoodId: null,
        notice: state.openFoodId ? "Food details closed because the layer changed." : state.notice,
      };
    case "SET_ORIENTATION":
      if (action.orientation === "front") {
        return { ...state, orientation: "front", angleDegrees: 0, spinning: false, dragging: false };
      }
      if (action.orientation === "back") {
        return { ...state, orientation: "back", angleDegrees: 180, spinning: false, dragging: false };
      }
      return { ...state, orientation: "spindle", spinning: false, dragging: false };
    case "START_SPIN":
      return {
        ...state,
        orientation: "spindle",
        spinning: true,
        dragging: false,
        speedDegreesPerSecond: state.speedDegreesPerSecond > 0 ? state.speedDegreesPerSecond : 30,
      };
    case "PAUSE_SPIN":
      return { ...state, spinning: false };
    case "SET_SPEED": {
      const speed = Math.min(120, Math.max(0, action.speed));
      return { ...state, speedDegreesPerSecond: speed, spinning: speed === 0 ? false : state.spinning };
    }
    case "DRAG_START":
      return { ...state, dragging: true, spinning: false, orientation: "spindle" };
    case "DRAG_TO":
      return { ...state, angleDegrees: normalizeAngle(action.angle) };
    case "DRAG_END":
      return { ...state, dragging: false };
    case "TICK":
      if (!state.spinning || state.dragging || state.speedDegreesPerSecond <= 0) return state;
      return {
        ...state,
        angleDegrees: normalizeAngle(state.angleDegrees + state.speedDegreesPerSecond * action.deltaSeconds),
      };
    case "OPEN_FOOD": {
      const selected = signs.find((sign) => sign.id === state.selectedSignId);
      if (!selected || !selected.foodIds.includes(action.id)) return state;
      return { ...state, openFoodId: action.id };
    }
    case "CLOSE_FOOD":
      return { ...state, openFoodId: null };
    case "DISMISS_NOTICE":
      return { ...state, notice: null };
    default:
      return state;
  }
}

export function angleNear(angle: number, target: number, tolerance = 1): boolean {
  const delta = Math.abs(normalizeAngle(angle) - normalizeAngle(target));
  return Math.min(delta, 360 - delta) <= tolerance;
}

export function isSignId(value: string, signs: Sign[]): value is SignId {
  return signs.some((sign) => sign.id === value);
}
