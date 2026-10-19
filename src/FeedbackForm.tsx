import { useMemo, useState, type FormEvent } from "react";
import { CATEGORY_LABEL, FEEDBACK_CATEGORIES, validateFeedbackBody, type FeedbackCategory } from "./feedbackContract";
import { RELEASE_VERSION, REQUIREMENT_IDS, REQUIREMENT_LABEL, type RequirementId } from "./types";

type Status =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "success"; receiptId: string }
  | { kind: "failure"; message: string };

export function FeedbackForm() {
  const [category, setCategory] = useState<FeedbackCategory | "">("");
  const [requirementId, setRequirementId] = useState<RequirementId | "">("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [sentKey, setSentKey] = useState<string | null>(null);

  const payloadKey = useMemo(
    () => JSON.stringify({ category, requirementId, comment: comment.trim() }),
    [category, requirementId, comment],
  );
  const duplicate = status.kind === "success" && sentKey === payloadKey;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (status.kind === "pending" || duplicate) return;
    const body = {
      category,
      releaseVersion: RELEASE_VERSION,
      comment,
      ...(requirementId ? { requirementId } : {}),
    };
    const local = validateFeedbackBody(body);
    if (!local.ok) {
      setStatus({ kind: "failure", message: local.error });
      return;
    }
    setStatus({ kind: "pending" });
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(local.value),
      });
      const data = (await response.json().catch(() => null)) as { receiptId?: string; error?: string } | null;
      if (response.status === 201 && data?.receiptId) {
        setSentKey(payloadKey);
        setStatus({ kind: "success", receiptId: data.receiptId });
        return;
      }
      const message =
        response.status === 429
          ? "Too many notes were sent. Wait a moment and try again. Your text is still here."
          : data?.error || "The note was not received. Your text is still here.";
      setStatus({ kind: "failure", message });
    } catch {
      setStatus({
        kind: "failure",
        message: "The note was not received. This demo needs the local server. Your text is still here.",
      });
    }
  }

  return (
    <section className="feedback panel" aria-labelledby="feedback-title">
      <h2 id="feedback-title">Feedback</h2>
      <p>
        Tell us what was confusing or useful. Do not include names, contact details, birth dates, or health history.
      </p>
      <form onSubmit={onSubmit} noValidate>
        <fieldset>
          <legend>Category</legend>
          <div className="choice-row">
            {FEEDBACK_CATEGORIES.map((value) => (
              <label key={value} className="choice">
                <input
                  type="radio"
                  name="category"
                  value={value}
                  checked={category === value}
                  onChange={() => setCategory(value)}
                />
                {CATEGORY_LABEL[value]}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="field">
          Requirement ID, optional
          <select
            value={requirementId}
            onChange={(event) => setRequirementId(event.target.value as RequirementId | "")}
          >
            <option value="">None</option>
            {REQUIREMENT_IDS.map((id) => (
              <option key={id} value={id}>
                {REQUIREMENT_LABEL[id]}
              </option>
            ))}
          </select>
        </label>
        <p className="hint">Release {RELEASE_VERSION}</p>
        <label className="field">
          Comment
          <textarea
            value={comment}
            maxLength={1000}
            rows={5}
            onChange={(event) => setComment(event.target.value)}
          />
        </label>
        <p className="hint">{comment.trim().length} / 1,000</p>
        <button type="submit" disabled={status.kind === "pending" || duplicate}>
          {status.kind === "pending" ? "Sending…" : duplicate ? "Received" : "Send feedback"}
        </button>
        <div className="status" role="status" aria-live="polite">
          {status.kind === "success" ? (
            <p>Received. Receipt {status.receiptId}. This demo holds the note in server memory until the process stops.</p>
          ) : null}
          {status.kind === "failure" ? <p>{status.message}</p> : null}
          {duplicate ? <p>This note was already sent. Edit it to send another.</p> : null}
        </div>
      </form>
    </section>
  );
}
