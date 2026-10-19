export const RELEASE_VERSION = "0.1.0-demo";

export const SIGN_ORDER = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
] as const;

export type SignId = (typeof SIGN_ORDER)[number];

export const LAYERS = ["skin", "muscle", "bone", "fascia"] as const;
export type LayerId = (typeof LAYERS)[number];

export const ORIENTATIONS = ["front", "back", "spindle"] as const;
export type Orientation = (typeof ORIENTATIONS)[number];

export const ELEMENTS = ["fire", "earth", "air", "water"] as const;
export type ElementId = (typeof ELEMENTS)[number];

export const REALMS = ["Land", "Sky", "Water", "Hybrid"] as const;
export type RealmId = (typeof REALMS)[number];

export const ANIMALS = [
  "mammal",
  "human-figure",
  "water-animal",
  "arachnid",
  "hybrid",
  "symbol",
] as const;
export type AnimalId = (typeof ANIMALS)[number];

export const ELEMENT_LABEL: Record<ElementId, string> = {
  fire: "Fire",
  earth: "Earth",
  air: "Air",
  water: "Water",
};

export const REALM_LABEL: Record<RealmId, string> = {
  Land: "Land",
  Sky: "Sky",
  Water: "Water",
  Hybrid: "Hybrid",
};

export const ANIMAL_LABEL: Record<AnimalId, string> = {
  mammal: "Mammal",
  "human-figure": "Human figure",
  "water-animal": "Water animal",
  arachnid: "Arachnid",
  hybrid: "Hybrid creature",
  symbol: "Symbol",
};

export const LAYER_LABEL: Record<LayerId, string> = {
  skin: "Skin",
  muscle: "Muscle",
  bone: "Bone",
  fascia: "Fascia",
};

export const LAYER_INTRO: Record<LayerId, string> = {
  skin: "Skin is the surface covering. This plate shows the region from the outside.",
  muscle: "Muscle is grouped movement tissue. Separate fibers are not drawn.",
  bone: "Bone is a simplified support. Marks are not measured landmarks.",
  fascia:
    "Fascia here is a dashed teaching sketch of connective tissue. Named chain systems are not reviewed, and they disagree.",
};

export type Nutrient = { label: string; value: string };

export type Food = {
  id: string;
  name: string;
  portion: string;
  preparation: string;
  nutrients: Nutrient[];
  allergens: string[];
  allergenNote: string;
  boundaryNote: string;
  sourceIds: string[];
};

export type SignRecord = {
  id: SignId;
  name: string;
  region: string;
  latin: string;
  element: ElementId;
  realm: RealmId;
  animal: AnimalId;
  creature: string;
  symbolicText: string;
  natureMetaphor: string;
  functionText: string;
  tissueSalt: { name: string; note: string };
  layers: Record<LayerId, string>;
  viewNote: string;
  foodIds: string[];
};

export type Claim = {
  id: string;
  text: string;
  sourceIds: string[];
  reviewer: string;
  reviewedAt: string;
  status: "pending";
  signId?: SignId;
  foodId?: string;
};

export type SourceRecord = {
  id: string;
  title: string;
  locator: string;
};

export type AssetRecord = {
  id: string;
  path: string;
  license: string;
  rightsEvidence: string;
  approved: false;
};

export type Sign = SignRecord & { claimIds: string[] };

export type Catalog = {
  version: string;
  contentStatus: "pending-review";
  statusNote: string;
  signs: Sign[];
  foods: Food[];
  claims: Claim[];
  sources: SourceRecord[];
  assets: AssetRecord[];
};

export type Filters = {
  element: ElementId[];
  realm: RealmId[];
  animal: AnimalId[];
};

export type AppState = {
  selectedSignId: SignId | null;
  layer: LayerId;
  orientation: Orientation;
  angleDegrees: number;
  spinning: boolean;
  speedDegreesPerSecond: number;
  filters: Filters;
  openFoodId: string | null;
  notice: string | null;
  dragging: boolean;
};

export type Action =
  | { type: "TOGGLE_FILTER"; group: keyof Filters; value: string }
  | { type: "RESET" }
  | { type: "SELECT_SIGN"; id: SignId }
  | { type: "SET_LAYER"; layer: LayerId }
  | { type: "SET_ORIENTATION"; orientation: Orientation }
  | { type: "START_SPIN" }
  | { type: "PAUSE_SPIN" }
  | { type: "SET_SPEED"; speed: number }
  | { type: "DRAG_START" }
  | { type: "DRAG_TO"; angle: number }
  | { type: "DRAG_END" }
  | { type: "TICK"; deltaSeconds: number }
  | { type: "OPEN_FOOD"; id: string }
  | { type: "CLOSE_FOOD" }
  | { type: "DISMISS_NOTICE" };

export const REQUIREMENT_IDS = [
  "R01",
  "R02",
  "R03",
  "R04",
  "R05",
  "R06",
  "R07",
  "R08",
  "R09",
  "R10",
  "R11",
  "R12",
  "R13",
  "R14",
  "R15",
] as const;

export type RequirementId = (typeof REQUIREMENT_IDS)[number];

export const REQUIREMENT_LABEL: Record<RequirementId, string> = {
  R01: "R01 Educational framing",
  R02: "R02 Twelve chapters",
  R03: "R03 Filters",
  R04: "R04 Filter reconciliation",
  R05: "R05 Orientation",
  R06: "R06 Motion and gestures",
  R07: "R07 Layers",
  R08: "R08 Food details",
  R09: "R09 Claims and sources",
  R10: "R10 Tissue salts",
  R11: "R11 Anatomy hotspots",
  R12: "R12 Feedback",
  R13: "R13 Accessibility",
  R14: "R14 Failure states",
  R15: "R15 Side view",
};
