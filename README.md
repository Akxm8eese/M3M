# The Body Zodiac · Beta 1 demo

Clickable client-review prototype for the KORE TRUTHS educational explorer. It follows the beta PRD in `prd/PRD.md`: invitation and framing, twelve chapters, front/back/spindle views, layers, filters, food details, and feedback.

This is a review build so the conversation can be about the product. It is not the final visual design, not a medical tool, and not an approved content release.

The previous `main` README described a hydration and macronutrient tracker. That is a different product and is not part of this demo.

## How to start

Requires Node 20 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

The dev server answers `POST /api/feedback` and keeps notes in memory until the process stops. It does not send them anywhere.

Other commands:

```bash
npm test
npm run build
```

`npm test` checks filter and viewer behavior, the feedback payload, and that this demo catalog is rejected by `execution/validate_content.py`. Rejection is expected: reviewers are not named, and the demo catalog is wider than the v0.1 gate.

## Review path

1. Read the invitation and continue.
2. Select a region on the schematic or in the chapter list.
3. Open a food and read portion, preparation, nutrients, allergens, and sources.
4. Filter, switch Front / Back / Spindle and a layer, then use All 12.
5. Send feedback without personal health details.

Side view is visible and off. Spin is off until Start spin. The body is an equal-row schematic drawn for this demo, not a licensed anatomy plate.

## Content boundary

Sample chapter copy stands in for the source manuscript, which was not in the planning kit. Anatomy and nutrition sentences are labeled pending review. Symbolic sentences are labeled Traditional / Symbolic. Tissue salts are historical names only.
