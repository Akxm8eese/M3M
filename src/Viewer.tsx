import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { BodyFigure } from "./BodyFigure";
import type { AppState, Sign, SignId } from "./types";
import { LAYER_INTRO, LAYER_LABEL, LAYERS, SIGN_ORDER } from "./types";
import type { Action } from "./types";

type Props = {
  state: AppState;
  signs: Sign[];
  visibleIds: Set<string>;
  reduced: boolean;
  dispatch: (action: Action) => void;
};

export function Viewer({ state, signs, visibleIds, reduced, dispatch }: Props) {
  const drag = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origin: number;
    mode: "pending" | "spin" | "scroll";
  } | null>(null);
  const suppressClick = useRef(false);
  const byId = new Map(signs.map((sign) => [sign.id, sign]));

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || state.orientation !== "spindle") return;
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: state.angleDegrees,
      mode: "pending",
    };
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const gesture = drag.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;
    if (gesture.mode === "pending") {
      if (Math.hypot(dx, dy) < 8) return;
      if (Math.abs(dy) >= Math.abs(dx)) {
        drag.current = null;
        return;
      }
      gesture.mode = "spin";
      suppressClick.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      dispatch({ type: "DRAG_START" });
    }
    if (gesture.mode === "spin") {
      event.preventDefault();
      dispatch({ type: "DRAG_TO", angle: gesture.origin + dx * 0.45 });
    }
  }

  function endPointer(event: ReactPointerEvent<HTMLDivElement>) {
    const gesture = drag.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    if (gesture.mode === "spin") dispatch({ type: "DRAG_END" });
    drag.current = null;
  }

  function selectZone(id: SignId) {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    dispatch({ type: "SELECT_SIGN", id });
  }

  const angleLabel = `Illustration angle ${Math.round(state.angleDegrees)} degrees. ${
    state.spinning ? "Spinning." : "Paused."
  }`;

  return (
    <section className="viewer" aria-labelledby="viewer-title">
      <div className="control-block">
        <h2 id="viewer-title">Body view</h2>
        <div className="control-row" role="group" aria-label="Orientation">
          <button type="button" aria-pressed={state.orientation === "front"} onClick={() => dispatch({ type: "SET_ORIENTATION", orientation: "front" })}>
            Front
          </button>
          <button type="button" aria-pressed={state.orientation === "back"} onClick={() => dispatch({ type: "SET_ORIENTATION", orientation: "back" })}>
            Back
          </button>
          <button type="button" aria-pressed={state.orientation === "spindle"} onClick={() => dispatch({ type: "SET_ORIENTATION", orientation: "spindle" })}>
            Spindle
          </button>
          <button type="button" disabled aria-describedby="side-reason">
            Side
          </button>
        </div>
        <p id="side-reason" className="hint">
          Side is off. The plates are not reviewed, and turning a flat drawing would not reveal depth.
        </p>
        <div className="control-row" role="group" aria-label="Layer">
          {LAYERS.map((layer) => (
            <button
              key={layer}
              type="button"
              aria-pressed={state.layer === layer}
              onClick={() => dispatch({ type: "SET_LAYER", layer })}
            >
              {LAYER_LABEL[layer]}
            </button>
          ))}
        </div>
        <p className="hint">{LAYER_INTRO[state.layer]}</p>
        <div className="spin-row">
          <button
            type="button"
            onClick={() => dispatch({ type: state.spinning ? "PAUSE_SPIN" : "START_SPIN" })}
            disabled={reduced}
            aria-pressed={state.spinning}
          >
            {state.spinning ? "Pause spin" : "Start spin"}
          </button>
          <label className="speed">
            Speed
            <input
              type="range"
              min={0}
              max={120}
              step={1}
              value={state.speedDegreesPerSecond}
              disabled={reduced}
              aria-valuemin={0}
              aria-valuemax={120}
              aria-valuenow={state.speedDegreesPerSecond}
              aria-valuetext={`${state.speedDegreesPerSecond} degrees per second`}
              onChange={(event) => dispatch({ type: "SET_SPEED", speed: Number(event.target.value) })}
            />
            <span>{state.speedDegreesPerSecond}°/s</span>
          </label>
        </div>
        <p className="angle">
          <span aria-hidden={state.spinning}>{angleLabel}</span>{" "}
          {reduced
            ? "Spin stays off while reduced motion is on."
            : "Spin stays off until you start it. On Spindle, drag sideways to turn the plate. Vertical movement still scrolls."}{" "}
          Rotating illustration, not a volumetric body.
        </p>
      </div>

      <div className="explorer-column">
      <div
        className="viewer-frame"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
      >
        {state.orientation === "spindle" ? (
          <div className="spindle">
            <div className="card" style={{ transform: `rotateY(${state.angleDegrees}deg)` }}>
              <div className="face">
                <BodyFigure face="front" layer={state.layer} />
              </div>
              <div className="face face-back">
                <BodyFigure face="back" layer={state.layer} />
              </div>
            </div>
          </div>
        ) : (
          <div className="plate">
            <BodyFigure face={state.orientation === "back" ? "back" : "front"} layer={state.layer} />
          </div>
        )}
        <div className="zones">
          {SIGN_ORDER.map((id, index) => {
            const sign = byId.get(id);
            if (!sign) return null;
            const muted = !visibleIds.has(sign.id);
            const selected = state.selectedSignId === sign.id;
            return (
              <button
                key={sign.id}
                type="button"
                className={`zone${selected ? " is-selected" : ""}${muted ? " is-muted" : ""}`}
                style={{ top: `${(index * 100) / 12}%` }}
                aria-pressed={selected}
                aria-label={
                  muted
                    ? `${sign.name}, ${sign.region}, outside the current filters`
                    : `${sign.name}, ${sign.region}`
                }
                onClick={() => selectZone(sign.id)}
              >
                <span className="zone-label">{sign.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      <p className="hint">
        Equal rows are tap targets, not anatomical scale. Filtered chapters stay on the schematic and look quieter. Choosing one clears the filters that hid it.
      </p>
      </div>
    </section>
  );
}
