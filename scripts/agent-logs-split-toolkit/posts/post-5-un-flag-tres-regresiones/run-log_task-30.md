# RUN_LOG — Task 30



**Date**

2026-08-24

**Task**

Task 30: Fix — Title Bar Scrolls Away With Long Documents — `#title-bar` (Task 29) was left `position: static`, the one fixed-chrome element in the app that never got `position: fixed` when introduced; on a document long enough to force a real page scroll (`body` scrolls, Task 12), the title bar and all six of its interactive elements (three menu labels, three window-control buttons) scrolled off-screen with it. Fixed with `#title-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 10; }` plus a compensating `#app-body { margin-top: var(--title-bar-height); }` — the exact two-rule shape the approved spec called for, `--title-bar-height` reused verbatim, zero diff outside `src/renderer/app.css`

**Personas involved**

Lead, full-stack-engineer, code-reviewer

**RGR cycles to green**

1 of 3 — the CSS fix itself was known/spec-exact going in; the one iteration was in test design (an early `#main-panel`-based gap-check draft was replaced with an `#app-body`-based one after discovering `#document-container`'s `margin: 1.5rem auto` was collapsing ~24px through `#main-panel`, an unrelated Task 11 offset), not a fix-cycle on the production CSS

**Cost**

~158.8k combined subagent tokens (engineer 93,935 + reviewer 64,824; real per-agent `usage.subagent_tokens`; `/cost` not run this session)

**Wall-clock time**

~24m22s combined subagent wall-clock (1,038,934ms + 422,619ms, sequential; excludes Lead orchestration and user decision time)

**Outcome**

Success

**Reviewer verdict**

**Pass on first pass** — 0 Blocking, 2 Should-fix, 0 Nits. The reviewer independently reverted just the CSS fix and reran the new `(g)` test block to reproduce RED→GREEN itself rather than trusting the engineer's report, correcting the engineer's own DEVLOG claim in the process: only 2 of the 6 delivered tests actually go RED against the reverted CSS (the title-bar-geometry-after-scroll test and the `#tree-panel`-vs-`#title-bar` regression test), not 3 as first written — the third "RED" the DEVLOG counted was from a since-superseded draft of a different test, not one of the six as shipped. The reviewer also independently re-derived, from the CSS math itself (not by trusting the engineer's code comment), that scoping the `#app-body`/`#title-bar` "no gap" check to scroll position 0 only is the sole physically meaningful reading of guardrail #77 for a fixed-vs-normal-flow pair — a document-relative alternative tested across multiple scroll positions would be tautological, true regardless of whether the fix is correct. Should-fix #1 (the DEVLOG miscount) was closed same-session by the Lead with a direct wording correction, git-diff-verified as a documentation-only change. Should-fix #2 (guardrail #77's "at every scroll position" wording is imprecise for a fixed-vs-normal-flow pair and should be tightened in a future spec pass) was deliberately left unedited and flagged to the user instead — `functional_domain.md` is an approved spec under `.agents/specs/`, read-only during task execution per `CLAUDE.md`'s Governance Integrity Rules, and the Lead does not self-edit the rulebook

**Notes**

**Second consecutive fully-clean (0 Blocking) review after Task 29** — no drift flag. Two things worth naming plainly. First, this is the first task where the review gate's value came from catching an inaccuracy in the *engineer's own governed DEVLOG entry* about its own test-authoring process (which of six delivered tests actually discriminate the bug) rather than in application code or test logic itself — the DEVLOG's honesty about the mid-cycle test-design correction was real and worth crediting, but the specific RED-count claim didn't survive an independent rerun, the same "verify, don't restate" discipline this log has flagged since Tasks 6/8/13/15/18/23/24/25/26. Second, the reviewer went a step further than reproducing the RED/GREEN transition — it evaluated whether a *stronger*, spec-literal alternative test (checking the gap invariant at multiple non-zero scroll positions, not just scroll 0) would have been possible and worth requiring, and derived mathematically that it would have been a tautology (an identity of `getBoundingClientRect()`'s own scroll math, true regardless of whether the underlying CSS fix is correct), concluding the engineer's narrower scope was correct engineering judgment, not a coverage shortcut — a genuine instance of the reviewer adjudicating a spec-vs-implementation tension on its own technical merits rather than mechanically checking the spec's literal wording against the diff.
