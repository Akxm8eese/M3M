import { useEffect, useRef } from "react";

export function FramingCopy({ headingId }: { headingId?: string }) {
  return (
    <>
      <p className="kicker">KORE TRUTHS · Beta 1</p>
      <h2 id={headingId}>How to read this</h2>
      <p className="lede">
        Two kinds of sentences share the screen. The label tells you which kind you are reading.
      </p>
      <div className="framing-grid">
        <article className="panel">
          <h3>Anatomy and nutrition</h3>
          <p>
            These sentences name a body region or a food. In a finished beta they would carry a reviewed source. In this prototype they are sample copy, marked pending review.
          </p>
        </article>
        <article className="panel">
          <h3>Tradition and symbol</h3>
          <p>
            Zodiac chapters, creatures, nature metaphors, and tissue-salt names are traditional interpretation. They are not clinical evidence that a birth sign causes a condition or that a salt changes one.
          </p>
        </article>
      </div>
      <ul className="plain-list">
        <li>A nutrition line is something you can ask to see a source for.</li>
        <li>A symbolic line is labeled Traditional / Symbolic and is not evidence about a person’s body.</li>
        <li>The schematic is an equal-row teaching diagram, not a medical plate and not a 3D model.</li>
      </ul>
    </>
  );
}

export function Invitation({ onContinue }: { onContinue: () => void }) {
  return (
    <main className="invitation">
      <p className="kicker">Beta invitation</p>
      <h1>The Body Zodiac</h1>
      <p className="lede">
        An educational explorer for twelve traditional chapters, body regions, nature symbols, and food notes. This is a clickable review prototype, not the final visual design and not a medical tool.
      </p>
      <FramingCopy />
      <h2>What you can do</h2>
      <ol className="plain-list">
        <li>Choose a body region and read the anatomy beside the symbol.</li>
        <li>Open a food and check the portion, preparation, nutrients, allergens, and source.</li>
        <li>Filter the twelve chapters, change view and layer, then return to all twelve.</li>
        <li>Send a feedback note without personal health details.</li>
      </ol>
      <button type="button" className="primary" onClick={onContinue}>
        Continue to the explorer
      </button>
    </main>
  );
}

export function FramingDialog({
  onClose,
  returnFocus,
}: {
  onClose: () => void;
  returnFocus: HTMLElement | null;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    const previous = returnFocus;
    const focusable = () =>
      [...node.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea")].filter(
        (element) => !element.hasAttribute("disabled"),
      );
    focusable()[0]?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [onClose, returnFocus]);

  return (
    <div className="dialog-backdrop" onMouseDown={onClose}>
      <div
        className="dialog panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="framing-dialog-title"
        ref={dialogRef}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className="primary" onClick={onClose}>
          Back to the chapter
        </button>
        <FramingCopy headingId="framing-dialog-title" />
      </div>
    </div>
  );
}
