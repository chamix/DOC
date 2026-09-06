# RUN_LOG — Task 22



**Date**

2026-08-20

**Task**

Test infrastructure for md-view: rebuilt Task 21 review's throwaway polling diagnostic as a permanent, reusable helper — new `tests/e2e/support/pollUntilStable.ts` (`sameValues`/`pollUntilStable<T>`, N-consecutive-stable-reads-or-throw) — and wired it into `ui-shell.spec.ts` checks (g)/(h), replacing each `waitForTimeout(100)` + single-shot computed-style read; zero assertion-threshold changes anywhere (Task 22)

**Personas involved**

Lead, full-stack-engineer, code-reviewer

**RGR cycles to green**

1 delivered cycle — the engineer's own report describes one internal RGR pass (fault-injected an extra post-stability `read()` call to confirm RED on the "doesn't over-poll" unit test, reverted, confirmed GREEN) before delivery; no post-review fix cycle needed

**Cost**

107.0k engineer subagent tokens + 78.6k reviewer subagent tokens = ~185.6k combined (real per-agent `usage.subagent_tokens`, single turn each; `/cost` not run this session)

**Wall-clock time**

~11m37s engineer + ~12m2s reviewer = ~23m39s combined subagent wall-clock (real `duration_ms`, single turn each, sequential; excludes Lead orchestration and user decision time)

**Outcome**

Success

**Reviewer verdict**

**Pass on first pass** — 0 Blocking, 1 Should-fix, 1 Nit. Should-fix: `pollUntilStable`'s default stabilization window (~100ms best case: 5 reads × 20ms) is empirically too short for check (h)'s resize call site specifically — logged as a narrowly-scoped follow-up candidate, not a condition of this task's closure. Nit: `backlog.md`'s "~280ms" renderer-lag figure is likely an undercount versus the reviewer's own measured ~500ms worst case

**Notes**

**No drift flag** — third consecutive first-pass Pass (Tasks 20, 21, 22); cycle count (1) at the low end, consistent with Task 20's tier (small, mechanical test-infrastructure fix). The real story in this row isn't the implementation — it went exactly per spec, unit tests genuinely load-bearing (reviewer proved this with two independent fault injections of its own, not just re-running the engineer's) — it's that the real-world proof step surfaced a new, honestly-reported problem rather than a clean pass: `npx playwright test tests/e2e/ui-shell.spec.ts --repeat-each=20` produced 11/60 failures (engineer) and 7/60 (reviewer, independent run) on check (h)'s `width > 800` assertion, with values as low as 126.4px — not a near-miss like the old flake, a drastically wrong one. The engineer traced this to a real, previously-undocumented mechanism rather than shrugging at "still flaky": under contention, `BrowserWindow.getBounds()` (main process) reflects a resize within single-digit milliseconds, but the renderer's own `window.innerWidth`/computed layout can lag the true resize by hundreds of ms — long enough for `pollUntilStable` to lock onto 5 consecutive *stable* reads of the stale, pre-resize value and return early, confidently wrong. The reviewer did not accept this theory secondhand: it built its own throwaway diagnostic sampling both values every ~15ms across 6 runs and directly measured the lag (400-505ms in 4 of 6 runs, one run never catching up within the 500ms window) — first-hand confirmation, not a restated claim, and it found the true worst case may be worse than what the engineer's own backlog note said (500ms measured vs. "~280ms" written). Net judgment, independently reached by the reviewer and concurred with by the Lead: this is not a regression this task introduced so much as a different, worse-looking face of Task 19's still-open, already-known concurrent-process-contention problem — full-suite incidence (0-1 of 5 runs) was no worse than Task 21's own documented pre-fix baseline (4 of 6 runs failing on the old near-miss `marginLeft` assertion), so the fix is a net improvement in aggregate even though it didn't eliminate flakiness outright. Backlogged on the same still-open Task 19 bullet rather than either quietly accepted as fully fixed or escalated as blocking — exactly the "honestly reported rather than silently absorbed" outcome the task's own spec pre-authorized as acceptable.
