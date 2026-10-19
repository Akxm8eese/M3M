# Beta release SOP
Revision 0.1 • 2026-10-18 22:45 America/New_York
Goal: publish a reproducible private beta and preserve a recovery path.
Inputs: reviewed commit, approved content, rights ledger, named release owner.
1. Run content validator, implementation CI, dependency checks and clean build.
2. Record artifact ID, commit, content version and environment configuration IDs.
3. Run every P0 acceptance case; attach browser/device and evidence to QA record.
4. Verify private access, feedback validation, storage access and deletion job.
5. Run rollback rehearsal on staging; restore current candidate after rehearsal.
6. Product/content/engineering owners sign readiness checklist; resolve blockers.
7. Promote exact artifact, smoke-test front/back, region, filter, food, feedback.
8. Invite approved cohort through the chosen channel only with explicit send authorization.
9. Review feedback daily; apply severity handling in README; record beta metrics.
10. Close beta with expand/fix/stop decision and denominators for every metric.
Failure: disable access for serious exposure or misleading content; revert app and
content together; preserve minimal incident evidence without public user data.
Outputs: release record, QA evidence, approval record and tested rollback target.
