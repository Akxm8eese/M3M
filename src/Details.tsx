import { useEffect } from "react";
import { foodById, sourceById } from "./catalog";
import type { Action, AppState, Sign } from "./types";
import { ANIMAL_LABEL, ELEMENT_LABEL, LAYER_LABEL, REALM_LABEL } from "./types";

type Props = {
  state: AppState;
  sign: Sign | null;
  onOpenFraming: () => void;
  dispatch: (action: Action) => void;
};

export function Details({ state, sign, onOpenFraming, dispatch }: Props) {
  useEffect(() => {
    if (!state.openFoodId) return;
    const foodId = state.openFoodId;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      dispatch({ type: "CLOSE_FOOD" });
      document.getElementById(`food-trigger-${foodId}`)?.focus();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [state.openFoodId, dispatch]);

  if (!sign) {
    return (
      <section className="details panel" aria-labelledby="details-empty">
        <h2 id="details-empty">Region details</h2>
        <p>Select a row on the schematic or a chapter card. The same chapter then opens here.</p>
        <p>From that chapter, open a food for the portion, preparation, nutrients, allergens, and sources.</p>
        <button type="button" onClick={onOpenFraming}>
          Tradition or evidence?
        </button>
      </section>
    );
  }

  const food = state.openFoodId ? foodById(state.openFoodId) : undefined;

  return (
    <section className="details panel" aria-labelledby="chapter-title">
      <p className="kicker">
        {ELEMENT_LABEL[sign.element]} · {REALM_LABEL[sign.realm]} · {sign.creature} · {ANIMAL_LABEL[sign.animal]}
      </p>
      <h2 id="chapter-title">{sign.name}</h2>
      <p className="region-name">{sign.region}</p>
      <p className="latin">Anatomical Latin: {sign.latin}. Language review is still open.</p>
      <button type="button" className="text-button" onClick={onOpenFraming}>
        Tradition or evidence?
      </button>

      <article className="block">
        <p>
          <span className="tag">Anatomy · sample pending review</span>
        </p>
        <p>{sign.functionText}</p>
        <SourceList ids={["openstax-ap"]} />
      </article>

      <article className="block">
        <p>
          <span className="tag">Traditional / Symbolic</span>
        </p>
        <p>{sign.symbolicText}</p>
      </article>

      <article className="block">
        <p>
          <span className="tag">Traditional / Symbolic</span>
        </p>
        <h3>Nature metaphor</h3>
        <p>{sign.natureMetaphor}</p>
      </article>

      <article className="block">
        <p>
          <span className="tag">Anatomy · sample pending review</span>
        </p>
        <h3>This layer · {LAYER_LABEL[state.layer]}</h3>
        <p>{sign.layers[state.layer]}</p>
        <p className="hint">{sign.viewNote}</p>
      </article>

      <article className="block">
        <p>
          <span className="tag">Traditional / Symbolic · historical</span>
        </p>
        <h3>Tissue salt</h3>
        <p className="salt-name">{sign.tissueSalt.name}</p>
        <p>{sign.tissueSalt.note}</p>
      </article>

      <article className="block">
        <h3>Food examples</h3>
        <p className="hint">
          Shared food examples for this region. They are not a diet assigned by zodiac sign. Production would withhold these notes until a named reviewer approves them. This prototype shows them with a pending label.
        </p>
        <ul className="food-list">
          {sign.foodIds.map((foodId) => {
            const item = foodById(foodId);
            const open = state.openFoodId === foodId;
            return (
              <li key={foodId}>
                <button
                  id={`food-trigger-${foodId}`}
                  type="button"
                  className="food-button"
                  aria-expanded={open}
                  aria-controls={open ? "food-panel" : undefined}
                  onClick={() => {
                    if (open) {
                      dispatch({ type: "CLOSE_FOOD" });
                      return;
                    }
                    dispatch({ type: "OPEN_FOOD", id: foodId });
                  }}
                >
                  {item ? item.name : "Missing food record"}
                </button>
              </li>
            );
          })}
        </ul>
        {state.openFoodId ? (
          <div id="food-panel" className="food-panel" role="region" aria-label="Food details">
            {food ? (
              <>
                <h3>{food.name}</h3>
                <p>
                  <span className="tag">Sample nutrition · pending review</span>
                </p>
                <dl>
                  <div>
                    <dt>Portion</dt>
                    <dd>{food.portion}</dd>
                  </div>
                  <div>
                    <dt>Preparation</dt>
                    <dd>{food.preparation}</dd>
                  </div>
                  <div>
                    <dt>Nutrients</dt>
                    <dd>
                      <ul>
                        {food.nutrients.map((nutrient) => (
                          <li key={nutrient.label}>
                            {nutrient.label}: {nutrient.value}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div>
                    <dt>Allergens</dt>
                    <dd>
                      {food.allergens.length > 0 ? food.allergens.join(", ") : "None listed as a major allergen."}{" "}
                      {food.allergenNote}
                    </dd>
                  </div>
                </dl>
                <p>{food.boundaryNote}</p>
                <p className="hint">Rounded sample figures for layout review. Not a reviewer-approved analysis.</p>
                <SourceList ids={food.sourceIds} />
                <button type="button" className="text-button" onClick={() => {
                  const foodId = state.openFoodId;
                  dispatch({ type: "CLOSE_FOOD" });
                  if (foodId) document.getElementById(`food-trigger-${foodId}`)?.focus();
                }}>
                  Close food
                </button>
              </>
            ) : (
              <p>This food record is missing from the demo catalog. The chapter list is still available.</p>
            )}
          </div>
        ) : null}
      </article>

      <p className="hint">
        Movement in a teaching session is general education. This chapter does not assign exercises from a zodiac sign.
      </p>
    </section>
  );
}

function SourceList({ ids }: { ids: string[] }) {
  return (
    <ul className="sources">
      {ids.map((id) => {
        const source = sourceById(id);
        if (!source) return <li key={id}>Source record missing.</li>;
        return (
          <li key={id}>
            <a href={source.locator} target="_blank" rel="noreferrer">
              {source.title}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
