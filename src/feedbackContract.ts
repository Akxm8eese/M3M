import { REQUIREMENT_IDS, type RequirementId } from "./types";

export const FEEDBACK_CATEGORIES = ["bug", "confusing_content", "suggestion"] as const;
export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

export const CATEGORY_LABEL: Record<FeedbackCategory, string> = {
  bug: "Bug",
  confusing_content: "Confusing content",
  suggestion: "Suggestion",
};

export type FeedbackPayload = {
  category: FeedbackCategory;
  releaseVersion: string;
  comment: string;
  requirementId?: RequirementId;
};

const ALLOWED = new Set(["category", "releaseVersion", "comment", "requirementId"]);

export function validateFeedbackBody(
  body: unknown,
): { ok: true; value: FeedbackPayload } | { ok: false; error: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, error: "Feedback must be a JSON object." };
  }
  const record = body as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (!ALLOWED.has(key)) return { ok: false, error: `Unknown field: ${key}` };
  }
  if (!FEEDBACK_CATEGORIES.includes(record.category as FeedbackCategory)) {
    return { ok: false, error: "Choose a category." };
  }
  if (
    typeof record.releaseVersion !== "string" ||
    record.releaseVersion.trim().length === 0 ||
    record.releaseVersion.length > 40
  ) {
    return { ok: false, error: "Release version is missing." };
  }
  if (typeof record.comment !== "string") return { ok: false, error: "Comment must be text." };
  const comment = record.comment.trim();
  if (comment.length < 1) return { ok: false, error: "Write a comment before sending." };
  if (comment.length > 1000) return { ok: false, error: "Comment must be 1,000 characters or fewer." };
  const payload: FeedbackPayload = {
    category: record.category as FeedbackCategory,
    releaseVersion: record.releaseVersion,
    comment,
  };
  if ("requirementId" in record && record.requirementId !== undefined) {
    if (
      typeof record.requirementId !== "string" ||
      !REQUIREMENT_IDS.includes(record.requirementId as RequirementId)
    ) {
      return { ok: false, error: "Requirement ID is not recognized." };
    }
    payload.requirementId = record.requirementId as RequirementId;
  }
  return { ok: true, value: payload };
}
