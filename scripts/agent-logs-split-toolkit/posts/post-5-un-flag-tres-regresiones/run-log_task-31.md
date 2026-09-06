# RUN_LOG — Task 31



**Date**

2026-08-24

**Task**

Task 31: Main Content Scrolls Within Its Own Bounded Region (Not Body) — `#main-panel` extends the exact `position: fixed` + bounded box + own `overflow-y: auto` pattern `#tree-panel` already proved for itself in Task 26, fixing the real root cause behind Task 30's remaining symptom: with no `overflow` rule anywhere on `body`/`html`/`#app-body`/`#main-panel`, a long document still overflowed `body`, so the browser's *native* scrollbar (a compositor-layer element, structurally outside the page's own DOM/z-index stacking context) still spanned the full viewport height behind `#title-bar` regardless of Task 30's fix. `#document-container`'s own sizing/styling is untouched — only which ancestor owns overflow/scroll moved

**Personas involved**

Lead, full-stack-engineer, code-reviewer

**RGR cycles to green**

1 initial delivery cycle (RED confirmed against unmodified CSS, GREEN after the fix, plus a targeted micro-cycle isolating the self-caught `#tree-resize-handle` `z-index: 1` companion fix specifically) + 1 follow-up delegation (same engineer, resumed via SendMessage, not a fresh spawn) for two out-of-scope test regressions the engineer self-discovered and self-reported rather than routing around the Task Boundary Contract hook — `tree-panel.spec.ts`'s Task 26 guardrail #51 test and `view-menu.spec.ts`'s `(f)` test both assumed pre-Task-31 `window.scrollY`/`marginLeft` semantics this fix correctly retires; the Lead amended `current_scope.json` to add both files before the follow-up, per `CLAUDE.md`'s Scope Contract amendment process

**Cost**

~472.9k combined subagent tokens (initial engineer 151,417 + follow-up engineer 174,684 + reviewer 146,794; real per-agent `usage.subagent_tokens`; `/cost` not run this session)

**Wall-clock time**

~49m45s combined subagent wall-clock (1,490,411ms + 447,627ms + 1,046,491ms, sequential; excludes Lead orchestration and user decision time)

**Outcome**

Success

**Reviewer verdict**

**Pass on first review pass** — 0 Blocking, 0 Should-fix, 1 Nit. The reviewer independently fault-injected and reproduced RED→GREEN for two separate mechanisms rather than trusting either the engineer's comments or the DEVLOG's claims: (1) reverted just the `#main-panel` base-rule CSS hunk, confirmed the new guardrail #80-82/85 tests fail for the right reason (including a pixel-exact match, `18372.400390625`, against the engineer's own independently-reported figure — strong corroboration, not coincidence), restored, confirmed green; (2) separately removed only the `z-index: 1` companion fix on `#tree-resize-handle`, confirmed 5 of 6 Task 23 drag-to-resize tests fail for the claimed reason (a stacking-order pointer-interception bug the engineer self-caught by actually running the regression suite, not predicted in the Lead's own spec), restored, confirmed green. The reviewer also ran the full suite itself (93 e2e + 99 unit + 19 integration, all green) rather than citing the engineer's reported counts. The one Nit (N-1: `tree-panel.spec.ts`'s pre-existing Task 26 guardrail #50 test has arguably-reduced discriminating power now that both panels are fully `position: fixed`) was traced back to a zero-diff, pre-existing test and explicitly *not* attributed to this task's diff — logged to `backlog.md` for future awareness, not fixed

**Notes**

**Third consecutive fully-clean (0 Blocking) review (Tasks 29/30/31)** — no drift flag on the Blocked-verdict axis. Cycle count did rise (Task 30's 1 delegation round → this task's 2), but per the drift rule's own intent ("specs getting vaguer, not quality dropping") this rise has a different, better shape than that pattern: both required follow-up files were structurally *impossible* for the Lead's own Step 1 spec to have named in advance (their breakage is a downstream, mechanical consequence of guardrail #80 succeeding at all — any pre-existing test anywhere in the suite that asserted `window.scrollY`/`#main-panel`'s `marginLeft` semantics was going to need this exact conversion, discoverable only by actually running those files), and the engineer surfaced both by running the full regression suite and self-reporting through the Task Boundary Contract's own designed escalation path rather than being caught by the reviewer or routing around the hook — the same escalation shape Task 29's S-1 established as precedent. Worth naming plainly per this task's own process notes, not as an isolated surprise: this is the **second consecutive same-week follow-up fix in the window-fundamentals area** (Task 29 → Task 30 → this task), and both Task 30 and Task 31 trace to the same underlying root cause — Task 12's original page-scroll model assumed no persistent fixed-position chrome existed above/around the scrolling content, an assumption Task 29's `frame: false` change invalidated in one shot for two different reasons (title-bar geometry under scroll, and native-scrollbar containment) that then had to be discovered and fixed one at a time rather than both being caught by Task 29's own review. Also worth crediting: the `z-index: 1` fault-injection proof is the second time in two consecutive tasks (after Task 30's own RED-count correction) that this project's review gate caught its value not in the production code's correctness — which was right both times — but in independently re-deriving *why* a claimed causal mechanism was true rather than accepting a plausible-sounding comment.
