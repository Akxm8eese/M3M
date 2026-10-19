import { randomBytes } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import react from "@vitejs/plugin-react";
import type { Connect, Plugin } from "vite";
import { defineConfig } from "vitest/config";
import { validateFeedbackBody } from "./src/feedbackContract";

function handleFeedback(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    res.end(JSON.stringify({ error: "Use POST." }));
    return;
  }
  const chunks: Buffer[] = [];
  let size = 0;
  let rejected = false;
  req.on("data", (chunk: Buffer) => {
    size += chunk.length;
    if (size > 8192) {
      rejected = true;
      res.statusCode = 413;
      res.end(JSON.stringify({ error: "Feedback body is too large." }));
      req.destroy();
      return;
    }
    chunks.push(chunk);
  });
  req.on("end", () => {
    if (rejected || res.writableEnded) return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(Buffer.concat(chunks).toString("utf8") || "null");
    } catch {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Feedback must be JSON." }));
      return;
    }
    const result = validateFeedbackBody(parsed);
    if (!result.ok) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: result.error }));
      return;
    }
    const receiptId = `bz_${randomBytes(9).toString("hex")}`;
    console.log(`feedback receipt ${receiptId} category ${result.value.category}`);
    res.statusCode = 201;
    res.end(JSON.stringify({ receiptId }));
  });
}

function feedbackApi(): Plugin {
  const attach = (middlewares: Connect.Server) => {
    middlewares.use("/api/feedback", handleFeedback);
  };
  return {
    name: "feedback-api",
    configureServer(server) {
      attach(server.middlewares);
    },
    configurePreviewServer(server) {
      attach(server.middlewares);
    },
  };
}

export default defineConfig({
  plugins: [react(), feedbackApi()],
  server: { host: "0.0.0.0", port: 5173, strictPort: true },
  test: { environment: "node" },
});
