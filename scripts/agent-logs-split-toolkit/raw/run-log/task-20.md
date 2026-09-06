# RUN_LOG — Task 20



**Date**

2026-08-20

**Task**

Test-mechanics bug fix for md-view: `tests/e2e/file-tree.spec.ts`'s "Open Folder…" test (one of the three tests flagged as still-open by Task 19's negative result) registered its `onFolderTreeRoot` listener via an un-awaited, Promise-returning `window.evaluate()` immediately before an awaited `electronApp.evaluate()` menu click on a separate automation channel — a genuine race, not resource contention. Fixed by adopting the accumulate-into-array-then-`expect.poll` pattern already used correctly by four sibling tests in the same file (Task 20)

**Personas involved**

Lead, full-stack-engineer, code-reviewer

**RGR cycles to green**

1 delivered cycle — clean implementation, RED reproduced then GREEN on the first write; no post-review fix cycle needed

**Cost**

57.0k engineer subagent tokens + 82.0k reviewer subagent tokens = ~139.0k combined (real per-agent `usage.subagent_tokens`, single turn each; `/cost` not run this session)

**Wall-clock time**

~9m45s engineer + ~8m0s reviewer = ~17m45s combined subagent wall-clock (real `duration_ms`, single turn each, sequential; excludes Lead orchestration and user decision time)

**Outcome**

Success

**Reviewer verdict**

**Pass on first pass** — 0 Blocking, 0 Should-fix, 0 Nits. Reviewer independently reproduced both RED (reverted the fix by hand, got the identical "Test timeout of 30000ms exceeded... Target page, context or browser has been closed" failure, 1/30 repeats) and GREEN (30/30 at `--workers=4`, 30/30 at `--workers=2`) from scratch rather than trusting the engineer's report, and confirmed the exact same 1-in-30 failure rate the engineer had independently observed

**Notes**

**No drift flag** — first-pass Pass, cycle count (1) flat versus Task 19's clean implementation cycle. Worth naming plainly, since it's a direct correction to this project's own backlog: `backlog.md` had carried four entries since Task 6/17/18 grouping `live-reload.spec.ts`, `ui-shell.spec.ts:67`, and this "Open Folder…" test under one assumed shared cause ("parallel-worker resource contention"), purely because all three showed the same surface symptom (intermittent timeout under load). Task 19's negative isolation result already cast doubt on that grouping; this task confirms it directly for at least one of the three — the actual mechanism was a listener-registration race local to this one test's own code, with zero relation to worker count, and was fixed by copying a pattern that already existed four times over in the same file. `backlog.md` updated in place: the Task 17 entry and the "priority raised" entry both amended (not deleted) to record the corrected diagnosis, and the Task 17 occurrence marked `[Resolved 2026-08-20]`. `live-reload.spec.ts` and `ui-shell.spec.ts:67` remain open, and per this task's own finding likely do NOT share a common cause with each other either — each probably needs its own dedicated investigation rather than a bundled fix, a lesson worth carrying into whichever task picks those up next.
