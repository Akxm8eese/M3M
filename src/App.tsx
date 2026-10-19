import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { catalog } from "./catalog";
import { Details } from "./Details";
import { FeedbackForm } from "./FeedbackForm";
import { FramingDialog, Invitation } from "./Framing";
import { initialState, reducer, visibleSigns } from "./logic";
import type { Action, AnimalId, AppState, ElementId, RealmId } from "./types";
import {
  ANIMAL_LABEL,
  ANIMALS,
  ELEMENT_LABEL,
  ELEMENTS,
  REALM_LABEL,
  REALMS,
  RELEASE_VERSION,
} from "./types";
import { Viewer } from "./Viewer";

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function Banner() {
  return (
    <p className="banner" role="note">
      Review prototype, not the final visual design. Chapter wording is sample copy because the planning kit did not include the source manuscript. Anatomy and nutrition lines are pending named reviewers. Zodiac, nature, and tissue-salt lines are traditional symbols, not clinical evidence.
    </p>
  );
}

export function App() {
  const [seen, setSeen] = useState(() => sessionStorage.getItem("bz-seen-framing") === "1");
  const [framingOpen, setFramingOpen] = useState(false);
  const framingButton = useRef<HTMLButtonElement>(null);
  const closeFraming = useCallback(() => setFramingOpen(false), []);
  const [state, dispatch] = useReducer(
    (current: AppState, action: Action) => reducer(current, action, catalog.signs),
    undefined,
    initialState,
  );
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced && state.spinning) dispatch({ type: "PAUSE_SPIN" });
  }, [reduced, state.spinning]);

  useEffect(() => {
    if (!state.spinning || state.dragging || reduced) return;
    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!document.hidden) dispatch({ type: "TICK", deltaSeconds: delta });
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [state.spinning, state.dragging, reduced]);

  if (!seen) {
    return (
      <div className="page">
        <Banner />
        <Invitation
          onContinue={() => {
            sessionStorage.setItem("bz-seen-framing", "1");
            setSeen(true);
          }}
        />
      </div>
    );
  }

  const visible = visibleSigns(catalog.signs, state.filters);
  const visibleIds = new Set(visible.map((sign) => sign.id));
  const selected = catalog.signs.find((sign) => sign.id === state.selectedSignId) ?? null;

  return (
    <div className="page">
      <a className="skip" href="#chapters">
        Skip to chapters
      </a>
      <header className="mast">
        <div>
          <p className="kicker">KORE TRUTHS · {RELEASE_VERSION}</p>
          <h1>The Body Zodiac</h1>
        </div>
        <button ref={framingButton} type="button" onClick={() => setFramingOpen(true)}>
          Tradition or evidence?
        </button>
      </header>
      <Banner />
      <main className="layout">
        <Viewer state={state} signs={catalog.signs} visibleIds={visibleIds} reduced={reduced} dispatch={dispatch} />
        <Details
          state={state}
          sign={selected}
          dispatch={dispatch}
          onOpenFraming={() => setFramingOpen(true)}
        />
        <div className="notice-slot" aria-live="polite">
          {state.notice ? (
            <p className="notice">
              {state.notice}{" "}
              <button type="button" className="text-button" onClick={() => dispatch({ type: "DISMISS_NOTICE" })}>
                Dismiss
              </button>
            </p>
          ) : null}
        </div>
        <Filters state={state} count={visible.length} dispatch={dispatch} />
        <Chapters signs={visible} selectedId={state.selectedSignId} dispatch={dispatch} />
        <FeedbackForm />
      </main>
      <footer className="foot">Schematic drawn for this demo. Side view is off. Not a medical tool.</footer>
      {framingOpen ? (
        <FramingDialog onClose={closeFraming} returnFocus={framingButton.current} />
      ) : null}
    </div>
  );
}

function Filters({
  state,
  count,
  dispatch,
}: {
  state: AppState;
  count: number;
  dispatch: (action: Action) => void;
}) {
  return (
    <section className="filters panel" aria-labelledby="filter-title">
      <div className="section-head">
        <h2 id="filter-title">Filters</h2>
        <button type="button" onClick={() => dispatch({ type: "RESET" })}>
          All 12
        </button>
      </div>
      <p aria-live="polite">Showing {count} of 12 chapters.</p>
      <p className="hint">Within a group, any selected chip matches. Across groups, every group must match. An empty group means all.</p>
      <FilterGroup
        legend="Element"
        values={ELEMENTS}
        label={(value) => ELEMENT_LABEL[value]}
        selected={state.filters.element}
        onToggle={(value) => dispatch({ type: "TOGGLE_FILTER", group: "element", value })}
      />
      <FilterGroup
        legend="Nature realm"
        values={REALMS}
        label={(value) => REALM_LABEL[value]}
        selected={state.filters.realm}
        onToggle={(value) => dispatch({ type: "TOGGLE_FILTER", group: "realm", value })}
      />
      <FilterGroup
        legend="Animal or symbol"
        values={ANIMALS}
        label={(value) => ANIMAL_LABEL[value]}
        selected={state.filters.animal}
        onToggle={(value) => dispatch({ type: "TOGGLE_FILTER", group: "animal", value })}
      />
    </section>
  );
}

function FilterGroup<T extends ElementId | RealmId | AnimalId>({
  legend,
  values,
  selected,
  label,
  onToggle,
}: {
  legend: string;
  values: readonly T[];
  selected: readonly T[];
  label: (value: T) => string;
  onToggle: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      <div className="choice-row">
        {values.map((value) => (
          <button key={value} type="button" aria-pressed={selected.includes(value)} onClick={() => onToggle(value)}>
            {label(value)}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Chapters({
  signs,
  selectedId,
  dispatch,
}: {
  signs: typeof catalog.signs;
  selectedId: AppState["selectedSignId"];
  dispatch: (action: Action) => void;
}) {
  return (
    <section className="chapters" id="chapters" aria-labelledby="chapter-list-title">
      <h2 id="chapter-list-title">Chapters</h2>
      {signs.length === 0 ? (
        <div className="panel">
          <p>No chapters match these filters.</p>
          <button type="button" onClick={() => dispatch({ type: "RESET" })}>
            Show all 12
          </button>
        </div>
      ) : (
        <ul className="chapter-grid">
          {signs.map((sign) => (
            <li key={sign.id}>
              <button
                type="button"
                className="chapter-card"
                aria-pressed={selectedId === sign.id}
                onClick={() => dispatch({ type: "SELECT_SIGN", id: sign.id })}
              >
                <span className="card-name">{sign.name}</span>
                <span className="card-region">{sign.region}</span>
                <span className="card-meta">
                  {ELEMENT_LABEL[sign.element]} · {REALM_LABEL[sign.realm]} · {sign.creature}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
