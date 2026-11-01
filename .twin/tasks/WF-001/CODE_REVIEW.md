# WF-001 — independent code review

Date: 2026-11-01. Reviewer execution ID: `/root/workflow_final_review` (actual collaboration task ID). Assigned by `/root`; reviewer did not author or edit implementation. This report is the reviewer's only repository edit.

Input: working tree over local text-snapshot commit `aedfdc4950fea739be7cf2591328b8131235e866` (`Snapshot text inputs from 981b957`). This is not a full clone or a new runtime baseline: binary assets are absent and remote is not configured locally. Source provenance is the coordinator's exact GitHub `981b957` text snapshot. Reviewed state has workflow WF-001 / candidate VIS-005 / branch `work/workflow-foundation-20261029`, retained source baseline `56905ee4030f25cf6e992e7c5049e63e373ddc3e`, and open `VIS005-MASK-001`.

Scope: AGENTS/start/state/aliases; WF-001 task; migrated VIS-005 task/run/contract/review; workflow-state/check, visual-gate-v2, publish-v2, twin-system, workflow tests, Python compatibility routing, CI and changed browser-test code. No implementation, browser, site build, generation or deploy executed. No site visual PASS is claimed.

## Final verdict: PASS for reviewed workflow changes after corrections

All three findings below are CLOSED after independent retest on 2026-11-01. Initial failures are retained to make the review traceable. This is code/contract acceptance for WF-001, not visual acceptance, owner approval or deployment of Twin.

Initial verdict was CHANGES REQUESTED.

### WF-REV-001 — P1, CLOSED: release guard accepts missing final approval evidence and preparation scope

`scripts/workflow-state.mjs:14–24` only checks a nonempty `ownerAcceptance.evidence.length`; it does not require an array of existing in-repository files. It also ignores workflow/run mode. `publish-v2.mjs` and the release branch of `visual-gate-v2.mjs` use this guard without calling the canonical Python state router or workflow validation. Thus a valid fresh visual review does not prevent a final release with a dangling owner-approval reference, or publication in a prepare/review workflow whose publication boolean was retained accidentally.

Pure-function reproduction (no files changed, no deployment): use current fixtures, set state.workflowTask `{...existing, mode:'prepare', publicationAllowed:true}`, candidate publication kind `final`, run fingerprints to nonempty matching strings, and ownerAcceptance `{status:'approved', runtimeFingerprint:run.runtimeFingerprint, contractFingerprint:run.contractFingerprint, evidence:['DOES-NOT-EXIST.md']}`. `publicationErrors(state,task,run,'final')` returns `[]`.

Required correction: validate execution mode and canonical workflow scope at the publish boundary; require explicit existing evidence files for final acceptance and authorization. Keep preview and final separate. Add negative tests for missing/non-array evidence, prepare/review scope, and stale scope projections. The existing WF-001 state remains safely blocked; this finding concerns the reusable release boundary after publication is enabled.

### WF-REV-002 — P2, CLOSED: CI validator accepts run states rejected by its canonical router

`scripts/workflow-check.mjs:42–43` validates schema version/mode and one job status comparison, but not `targetStage`, mode/target compatibility, required stage structure, accepted output/evidence, or completed-stage evidence. On the current fixtures, both `run.mode='prepare'; run.targetStage='release'` and `run.stages.assets.status='done'; run.assetJobs[0].status='accepted'` with existing empty outputs/null acceptedBy/null observed return `[]` from `validateContract`. The generic Python router rejects these states, but its unit-test success does not validate the real candidate, and `workflow-check` never invokes equivalent validation.

Required correction: validate schema and completed claims consistently while allowing honest pending/blocked candidate states. Do not require VIS-005 to be complete merely to pass WF-001; reject impossible mode/target and unsupported acceptance claims. Add fixtures that exercise the actual JS/CLI path.

### WF-REV-003 — P2, CLOSED: configured source-branch push conflicts with mandatory working branch

`.github/workflows/workflow-foundation.yml:4` enables pushes on both workflow-foundation and hero-journey source branches. `scripts/workflow-check.mjs:11,71–73` rejects an attached branch other than `state.workingBranch`, currently workflow-foundation. A normal push checkout on `work/hero-journey-original-render` therefore fails before useful validation, even though the workflow explicitly opts into that branch. Detached pull-request checkout behaves differently.

Reproduction: `validatePointers` using all current fixtures and branch `work/hero-journey-original-render` returns `['Working branch differs from state registry']`.

Required correction: reconcile CI trigger/checkout policy with the canonical interactive working branch; preserve wrong-branch protection for interactive use and test supported CI event behavior.

## Executed verification

| Command | Actual result |
|---|---|
| `node scripts/workflow-check.mjs` | PASS; explicitly says site visual acceptance/deployment NOT RUN |
| `node --test tests/workflow*.test.mjs tests/visual-gate-v2.test.mjs scripts/twin-system.test.mjs` | 19/19 PASS |
| `python -m unittest discover -s .agents/skills/web-production/scripts -p 'test_*.py'` | 17/17 PASS |
| `python -m unittest discover -s .agents/skills/frontend-engineer/scripts -p 'test_*.py'` | 7/7 PASS |
| `python .agents/skills/twin-site/scripts/production_next.py .twin/tasks/VIS-005/run.json .` | Correctly routes to assets / original-facade-alpha scene acceptance |
| `git diff --check` | PASS |
| `git diff --name-only -- src public package.json package-lock.json` | Empty |
| `git status --short -- src public package.json package-lock.json` | Empty |
| In-memory negative probes described above | Confirmed all three findings |

Positive observations: migration retains historical review separately and current review pending; mask defect and pending final acceptance remain visible; current publication is blocked by WF-001; actual runtime byte fingerprints include tracked and untracked src/public plus package/config/build inputs; schema-2 review requires independent evidence records, contract hash, viewport/state; reference hashes and photo evidence checks remain. Canonical typography matches inspected hero/Journey CSS; no runtime src/public/package edit is present in this text checkout. Existing V1 tests remain.

Limits: no browser/visual execution, build, live verification, release or full asset hash audit; missing binaries prevent those conclusions. Unit fixtures use synthetic image-signature buffers and demonstrate structural gates, not authentic visual evidence. Structural validation cannot prove a human approval or agent identity; this report records the actual independently launched reviewer ID.

## Independent correction retest

The coordinator authored the corrections; this reviewer read the changed source and reran the commands independently. Reviewer remained non-author of implementation.

- WF-REV-001: publication guard now requires workflow/candidate/run execute mode and explicit release target. Final approval evidence must be a nonempty array of relative existing files, rejecting missing files, strings, directories and parent traversal in independent probes. Publish also validates workflow consistency and invokes the canonical Python router before release. Original preparation/missing-evidence reproduction now fails.
- WF-REV-002: invalid mode/target, invalid stage status, missing completed-stage evidence and empty accepted-job fields now fail. Completed-stage evidence paths are checked on disk. Publish routes remaining production obligations through the canonical validator. The original two reproductions now fail; legitimate current blocked VIS-005 remains valid metadata.
- WF-REV-003: both explicitly recorded workflow and candidate-source branches are now accepted; unrelated branches remain rejected. Reproduced the supported source-branch check successfully. This establishes validator behavior, not an actual hosted Actions run.
- Preview regression check: `releaseRun` creates a temporary projection only for explicitly mapped job/defect exceptions present in canonical authorization and unresolved review. Independent integration probe fed this projection to the actual Python `next_action`: a fixture with all other obligations complete reaches pending release; final mode and an additional required blocked job stop at assets. The original run bytes are unchanged and visual verdict remains fix. This is a synthetic orchestration fixture, not evidence of site acceptance.

| Retest | Result |
|---|---|
| `node scripts/workflow-check.mjs` | PASS, current site acceptance/deployment NOT RUN |
| `node --test tests/workflow*.test.mjs tests/visual-gate-v2.test.mjs scripts/twin-system.test.mjs` | 23/23 PASS |
| WP Python unit suite (same command above) | 17/17 PASS |
| FE Python unit suite (same command above) | 7/7 PASS |
| Independent original negative probes + evidence string/directory/traversal variants | All correctly rejected |
| Independent `releaseRun` → canonical Python router integration probes | Mapped preview supported; final/unmapped obligation blocked; source run unchanged |
| `git diff --check` and runtime/package diff | PASS; no src/public/package changes |

No blocking finding remains in the reviewed workflow changes. Full runtime/build/browser/release validation remains outside this infrastructure review and must not be reported as performed.
