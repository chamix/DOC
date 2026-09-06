# RUN_LOG — Task 19



**Date**

2026-08-20

**Task**

Test infrastructure for md-view: investigated the e2e parallel-load flakiness tracked in `backlog.md` since Task 6 (three recurring entries, escalated to its own task by Task 18's reviewer). Built and shipped a Playwright `test.extend` fixture (`tests/e2e/support/fixtures.ts`) giving every test its own `fs.mkdtempSync` `userDataDir`, migrating all 40 `electron.launch()` call sites across 12 spec files, to test the hypothesis that shared-profile resource contention was the cause (Task 19)

**Personas involved**

Lead, full-stack-engineer, code-reviewer, user

**RGR cycles to green**

1 delivered cycle — clean implementation, all 40 call sites migrated correctly on first write, reviewer found 0 Blocking; no post-review fix cycle needed for the code itself

**Cost**

143.7k engineer subagent tokens + 135.2k reviewer subagent tokens = ~278.9k combined (real per-agent `usage.subagent_tokens`, single turn each; `/cost` not run this session)

**Wall-clock time**

~14m26s engineer + ~7m8s reviewer = ~21m34s combined subagent wall-clock (real `duration_ms`, single turn each, sequential) + ~2 Lead-run 12-run e2e comparisons (~9-10m wall-clock each, Phase 1 baseline + Phase 2 post-fix, run directly by the Lead outside subagent time)

**Outcome**

Success (process) — **hypothesis not confirmed**

**Reviewer verdict**

**Pass on first pass** — 0 Blocking, 0 Should-fix, 1 Nit (two Lead-authored spec-file diffs outside the declared scope contract, expected — see Notes). Reviewer independently re-derived the FI-1 teardown-on-failure proof from scratch (own fault injection, own tmp-dir check) rather than trusting the engineer's report, and scrutinized the one deliberate deviation (`view-menu.spec.ts` test (d)'s manual dual-launch, since the standard fixture can't express a single test needing two sequential Electron launches against the same profile) closely enough to confirm it was a genuine architectural constraint, not a corner cut

**Notes**

**The code review passed clean, but the underlying question this task exists to answer came back negative — this is the headline finding, not a footnote.** The Lead ran a real 12-run-before/12-run-after comparison, same conditions both times (4 workers, confirmed empirically rather than assumed): baseline 8/12 clean, 4/12 failed; post-fix 8/12 clean, 4/12 failed — identical failure count, zero measured improvement. Worse, the dominant failure mode (two hard Electron worker-process crashes per 12-run sample, Windows `code=3221226505`, a fastfail rather than a soft timeout) landed on four *different* tests across the two samples (baseline: `view-menu.spec.ts:134`, `open-file-argv.spec.ts:47`; post-fix: `code-highlighting.spec.ts`, `ui-shell.spec.ts:4`) — if shared-profile-lock contention were the cause, per-test isolation should have suppressed it, and it didn't, landing on a fresh random test each time instead. This points toward raw CPU/memory/handle pressure from running 4 concurrent full Electron/Chromium processes on this machine, a cause `userDataDir` isolation structurally cannot touch. A second, previously-logged flaky test (`ui-shell.spec.ts`) also reproduced post-fix, but on a *different* assertion (`marginLeft > 32`, got `31.2`) than the one originally logged (`width > 800`) — a layout-timing race, also unrelated to profile isolation. Per the task's own explicit instruction, no second hypothesis (lowering `playwright.config.ts`'s worker count, adding delays) was guessed at and implemented silently on the strength of this result — findings were reported to the user in full, who chose to keep the fixture (a real, reviewed, zero-downside DRY/teardown improvement on its own merits) while leaving `backlog.md`'s three original flakiness entries `[Pending]` rather than marking them `[Resolved]`, and logging a new entry with the actual evidence for whoever scopes the follow-up. Worth naming as its own category, same as Task 13's Lead-override row: a task can execute its entire process cleanly — well-specified hypothesis, reviewed implementation, honest before/after measurement — and still correctly conclude "this didn't work," and that is a successful use of the process, not a failure of it. No drift flag: the code-review dimension (0 Blocking, 1 delivered cycle) shows no decline versus Task 18.
