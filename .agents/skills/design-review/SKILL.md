---
name: design-review
description: Review or audit a design/UI across 6 weighted dimensions with Nielsen's 10 heuristics and a prioritized findings table. Use when the user wants a design critique, quality score, heuristic evaluation, or audit of an existing screen, page, or product before/after build.
invocation: model
---

Сначала прочитать [правила Twin](PROJECT_OVERRIDE.md).


## Restored resource corpus — 2026-10-26

Recovery scope: core resources only; optional style catalogue/full upstream project test harness/MCP installer are omitted. This override takes precedence over the old mandatory accuracy_report instruction below: do not run that full suite against this partial kit. Check and run only applicable individual validators on explicit target-project paths, and report remaining verification gaps.

Resources are bundled in this skill directory, restored from `plugin87/ux-ui-agent-skills` at the commit recorded in `references/recovery-source.json`. Resolve resource paths against THIS skill directory; run script commands with that directory as cwd, passing explicit target-project paths. The original installed SKILL body is retained below; the corpus is a newer pinned upstream version, not a claim of a byte-identical historical reconstruction.

The user’s current task, the target project’s approved brand, tokens, stack and scope take precedence over sample tokens, default fonts, mandatory dark-theme suggestions and demo layouts in this corpus. Do not import the kit's CLAUDE.md as global instructions or install its plugins, MCP servers, hooks or dependencies automatically. They are reference code only. Check dependencies before using a script; absence is not a PASS. Objective gates and font metrics never prove aesthetic quality. Use an available authorized browser for visual and interaction checks, following its own skill; do not replace it with a shell-driven browser. Screenshots can be internal verification without an owner approval gate. The upstream reports, examples and screenshots are NOT proof that the user's website passed.



# Skill: Design Review

Run a structured, scored review.

## Steps
1. Read `workflows/design-review.md` (rubric, scoring guide, Nielsen heuristics, process).
2. Gather context: the screen(s)/flow, target users, platform, constraints.
3. Score the 6 dimensions (Visual Hierarchy 20%, Consistency 20%, Accessibility 20%, Usability 20%, Responsiveness 10%, Performance 10%); compute the weighted overall.
4. Run the accessibility lens with `accessibility/wcag-checklist.md`; use `scripts/contrast.py` for any color-pair doubts.
5. Check against the anti-slop tells in `taste/design-taste.md` (Banned Defaults checklist).
6. Apply Nielsen's 10 heuristics; flag violations by number.

## Output
- The 6-dimension scored table + overall score.
- A prioritized findings table: # · Severity (Critical → Major → Minor → Enhancement) · Finding · Recommendation.
- Concrete, token-referenced fixes.
