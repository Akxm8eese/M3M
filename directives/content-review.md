# Content review SOP
Revision 0.1 • 2026-10-18 22:45 America/New_York
Goal: publish only attributed, reviewed educational content.
Inputs: prototype records, anatomy assets, primary evidence sources, rights ledger.
1. Assign stable IDs to signs, regions, foods, claims, sources and assets.
2. Record each factual statement independently with source locator, reviewer,
   review date and status. Specify food portion/preparation for numeric amounts.
3. Separate Traditional/Symbolic statements from anatomical and nutritional facts.
4. Review allergies and wording for implied diagnosis, prevention or treatment.
5. Check anatomy hotspots in each view against approved landmarks at three widths.
6. Record asset owner, license, allowed distribution, attribution and proof path.
7. Run execution/validate_content.py CONTENT_JSON. Correct errors; rerun.
8. Reviewer approves content revision; CI deploys only the approved revision.
Outputs: reviewed content JSON, source/rights ledger, approval evidence.
Edge cases: missing source → withhold claim; missing rights → replace asset;
conflicting sources → reviewer resolves and records reasoning; changed claim →
reset review to pending. Do not substitute an LLM judgment for reviewer approval.
Learning loop: log failure and fix; update this SOP through reviewed version control.
