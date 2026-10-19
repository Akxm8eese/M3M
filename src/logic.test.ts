import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { catalog, publicStrings } from "./catalog";
import { validateFeedbackBody } from "./feedbackContract";
import { angleNear, initialState, matchesFilters, reducer, visibleSigns } from "./logic";

const signs = catalog.signs;

describe("catalog", () => {
  it("has the twelve canonical chapters and resolvable foods", () => {
    expect(signs.map((sign) => sign.name)).toEqual([
      "Aries",
      "Taurus",
      "Gemini",
      "Cancer",
      "Leo",
      "Virgo",
      "Libra",
      "Scorpio",
      "Sagittarius",
      "Capricorn",
      "Aquarius",
      "Pisces",
    ]);
    expect(new Set(signs.map((sign) => sign.id)).size).toBe(12);
    for (const sign of signs) {
      expect(sign.foodIds.length).toBeGreaterThan(0);
      for (const foodId of sign.foodIds) {
        expect(catalog.foods.some((food) => food.id === foodId)).toBe(true);
      }
      for (const claimId of sign.claimIds) {
        const claim = catalog.claims.find((item) => item.id === claimId);
        expect(claim?.status).toBe("pending");
        expect(claim?.reviewer).toBe("");
        for (const sourceId of claim?.sourceIds ?? []) {
          expect(catalog.sources.some((source) => source.id === sourceId)).toBe(true);
        }
      }
    }
    expect(catalog.assets.every((asset) => asset.approved === false)).toBe(true);
  });

  it("keeps implied-outcome wording out of the sample copy", () => {
    const banned =
      /\b(cleanse|cleanses|cleansing|detox|detoxify|protects|cures?|treats?|treatment|diagnos\w*|dosage|supplement)\b/i;
    const hits = publicStrings().filter((line) => banned.test(line));
    expect(hits).toEqual([]);
  });

  it("is rejected by the production content gate", () => {
    const dir = mkdtempSync(join(tmpdir(), "bz-gate-"));
    const file = join(dir, "demo-catalog.json");
    writeFileSync(file, JSON.stringify(catalog));
    let stderr = "";
    let failed = false;
    try {
      execFileSync("python3", ["execution/validate_content.py", file], { encoding: "utf8" });
    } catch (error) {
      failed = true;
      const err = error as { stderr?: string; stdout?: string };
      stderr = `${err.stdout ?? ""}\n${err.stderr ?? ""}`;
    }
    expect(failed).toBe(true);
    expect(stderr).toMatch(/claim not approved|Root keys|rights not approved/);
  });
});

describe("filters", () => {
  it("uses OR inside a group and AND across groups", () => {
    const fireOrEarth = visibleSigns(signs, { element: ["fire", "earth"], realm: [], animal: [] });
    expect(fireOrEarth.map((sign) => sign.id).sort()).toEqual(
      ["aries", "leo", "sagittarius", "taurus", "virgo", "capricorn"].sort(),
    );
    const fireAndLand = visibleSigns(signs, { element: ["fire"], realm: ["Land"], animal: [] });
    expect(fireAndLand.map((sign) => sign.id).sort()).toEqual(["aries", "leo"].sort());
    const none = visibleSigns(signs, { element: ["fire"], realm: ["Water"], animal: [] });
    expect(none).toHaveLength(0);
    expect(visibleSigns(signs, { element: [], realm: [], animal: [] })).toHaveLength(12);
  });

  it("clears conflicting groups when a hidden chapter is chosen from the map", () => {
    const filtered = reducer(
      initialState(),
      { type: "TOGGLE_FILTER", group: "element", value: "water" },
      signs,
    );
    const next = reducer(
      { ...filtered, angleDegrees: 33, spinning: true, orientation: "spindle" },
      { type: "SELECT_SIGN", id: "aries" },
      signs,
    );
    expect(next.selectedSignId).toBe("aries");
    expect(next.filters.element).toEqual([]);
    expect(next.notice).toMatch(/Cleared Element/);
    expect(next.angleDegrees).toBe(33);
    expect(next.spinning).toBe(true);
    expect(matchesFilters(signs.find((sign) => sign.id === "aries")!, next.filters)).toBe(true);
  });

  it("keeps a realm filter that the chosen chapter already matches", () => {
    let state = reducer(initialState(), { type: "TOGGLE_FILTER", group: "element", value: "water" }, signs);
    state = reducer(state, { type: "TOGGLE_FILTER", group: "realm", value: "Land" }, signs);
    state = reducer(state, { type: "SELECT_SIGN", id: "aries" }, signs);
    expect(state.filters.element).toEqual([]);
    expect(state.filters.realm).toEqual(["Land"]);
    expect(state.selectedSignId).toBe("aries");
  });

  it("clears a chapter that the new filter hides", () => {
    let state = reducer(initialState(), { type: "SELECT_SIGN", id: "leo" }, signs);
    state = reducer(state, { type: "OPEN_FOOD", id: "salmon" }, signs);
    state = reducer(state, { type: "TOGGLE_FILTER", group: "element", value: "water" }, signs);
    expect(state.selectedSignId).toBeNull();
    expect(state.openFoodId).toBeNull();
    expect(state.notice).toMatch(/Leo/);
  });

  it("resets filters and detail state", () => {
    let state = reducer(initialState(), { type: "SELECT_SIGN", id: "virgo" }, signs);
    state = reducer(state, { type: "TOGGLE_FILTER", group: "animal", value: "mammal" }, signs);
    state = reducer(state, { type: "RESET" }, signs);
    expect(state.filters).toEqual({ element: [], realm: [], animal: [] });
    expect(state.selectedSignId).toBeNull();
    expect(state.openFoodId).toBeNull();
    expect(visibleSigns(signs, state.filters)).toHaveLength(12);
  });
});

describe("viewer state", () => {
  it("snaps front and back, and stops spin", () => {
    let state = reducer(initialState(), { type: "START_SPIN" }, signs);
    state = { ...state, angleDegrees: 40 };
    const front = reducer(state, { type: "SET_ORIENTATION", orientation: "front" }, signs);
    expect(front.spinning).toBe(false);
    expect(front.angleDegrees).toBe(0);
    expect(angleNear(front.angleDegrees, 0)).toBe(true);
    const back = reducer(state, { type: "SET_ORIENTATION", orientation: "back" }, signs);
    expect(back.spinning).toBe(false);
    expect(back.angleDegrees).toBe(180);
    expect(angleNear(back.angleDegrees, 180)).toBe(true);
  });

  it("does not rotate when the chapter changes", () => {
    const spinning = { ...initialState(), spinning: true, orientation: "spindle" as const, angleDegrees: 12 };
    const next = reducer(spinning, { type: "SELECT_SIGN", id: "pisces" }, signs);
    expect(next.angleDegrees).toBe(12);
    expect(next.spinning).toBe(true);
    expect(next.selectedSignId).toBe("pisces");
  });

  it("pauses spin on drag and advances only while spinning", () => {
    const spinning = reducer(initialState(), { type: "START_SPIN" }, signs);
    const dragging = reducer(spinning, { type: "DRAG_START" }, signs);
    expect(dragging.spinning).toBe(false);
    expect(dragging.dragging).toBe(true);
    const held = reducer({ ...dragging, angleDegrees: 10 }, { type: "TICK", deltaSeconds: 1 }, signs);
    expect(held.angleDegrees).toBe(10);
    const moved = reducer({ ...spinning, angleDegrees: 10 }, { type: "TICK", deltaSeconds: 0.5 }, signs);
    expect(moved.angleDegrees).toBe(25);
  });

  it("closes food details when the layer changes", () => {
    let state = reducer(initialState(), { type: "SELECT_SIGN", id: "aries" }, signs);
    state = reducer(state, { type: "OPEN_FOOD", id: "walnut" }, signs);
    state = reducer(state, { type: "SET_LAYER", layer: "bone" }, signs);
    expect(state.layer).toBe("bone");
    expect(state.selectedSignId).toBe("aries");
    expect(state.openFoodId).toBeNull();
    expect(state.notice).toMatch(/layer/);
  });

  it("clamps speed and ignores a food from another chapter", () => {
    const slowed = reducer(initialState(), { type: "SET_SPEED", speed: 400 }, signs);
    expect(slowed.speedDegreesPerSecond).toBe(120);
    const stopped = reducer(slowed, { type: "SET_SPEED", speed: -5 }, signs);
    expect(stopped.speedDegreesPerSecond).toBe(0);
    expect(stopped.spinning).toBe(false);
    let state = reducer(initialState(), { type: "SELECT_SIGN", id: "aries" }, signs);
    state = reducer(state, { type: "OPEN_FOOD", id: "salmon" }, signs);
    expect(state.openFoodId).toBeNull();
  });
});

describe("feedback contract", () => {
  it("accepts a valid note and rejects empty, long, and unknown fields", () => {
    expect(
      validateFeedbackBody({
        category: "suggestion",
        releaseVersion: "0.1.0-demo",
        comment: "The kidney row should say Back.",
        requirementId: "R11",
      }).ok,
    ).toBe(true);
    const empty = validateFeedbackBody({
      category: "bug",
      releaseVersion: "0.1.0-demo",
      comment: "   ",
    });
    expect(empty.ok).toBe(false);
    const long = validateFeedbackBody({
      category: "bug",
      releaseVersion: "0.1.0-demo",
      comment: "a".repeat(1001),
    });
    expect(long.ok).toBe(false);
    const extra = validateFeedbackBody({
      category: "bug",
      releaseVersion: "0.1.0-demo",
      comment: "Hello",
      email: "person@example.com",
    });
    expect(extra.ok).toBe(false);
  });
});
