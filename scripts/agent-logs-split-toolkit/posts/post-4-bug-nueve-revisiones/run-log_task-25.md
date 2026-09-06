# RUN_LOG — Task 25



**Date**

2026-08-22

**Task**

Task 25: Dropped/Opened Directory Establishes Tree Root Instead of Rejecting — `REQUEST_OPEN_FILE` listener (`src/main/index.ts`) now classifies the incoming path via `fs.stat`; a directory routes to the existing `establishTreeRoot` (same function "Open Folder…" already calls) instead of falling through into `renderFile`'s Markdown-only rejection. Bug found via manual packaged-build testing, not caught by Tasks 16-24's fixture-scale e2e suite

**Personas involved**

Lead, full-stack-engineer, code-reviewer

**RGR cycles to green**

1 (RED: new folder-drop test failed for the correct reason — `rootPath` resolved to the dropped folder's *parent* via the unfixed listener's fallthrough into `renderAndWatch`'s `path.dirname()`, not the folder itself; GREEN: applied the spec-mandated listener replacement verbatim, full regression suite green); within the 3-cycle cap; no follow-up fix cycle needed — reviewer approved on first pass

**Cost**

~201.3k combined subagent tokens (engineer 108,423 + reviewer 92,926; real per-agent `usage.subagent_tokens`; `/cost` not run this session)

**Wall-clock time**

~19m30s combined subagent wall-clock (engineer 595,382ms + reviewer 574,381ms, sequential; excludes Lead orchestration and user decision time)

**Outcome**

Success

**Reviewer verdict**

**Approved on first pass** — 0 Blocking, 0 Should-fix, 1 Nit. Reviewer independently reproduced the diff shape via `git diff`, confirmed `establishTreeRoot`/`renderAndWatch`/`renderFile` were byte-identical to HEAD (no parallel directory-handling implementation), re-ran the full test suite itself rather than trusting the engineer's reported numbers (32/32 scoped, 57/57 full e2e across two runs, 96/96 unit, 19/19 integration), and verified guardrail #47 (no `FILE_RENDERED`/render/watcher side effect on the directory branch) was a real assertion rather than vacuously true by reasoning through what the pre-fix code path would have produced. The one Nit: the engineer self-reported two `tree-panel.spec.ts` tests flaking transiently under a PostToolUse hook's parallel rerun, attributed to already-documented parallel-worker contention (`backlog.md`); the reviewer could not independently reproduce that specific pair across 4 of its own full/scoped reruns, though the general flakiness class is well-precedented (Tasks 16-21, 24) and unrelated to this diff

**Notes**

**Restores the first-pass-Pass pattern after Task 24's single Blocked verdict** — only 1 Blocked in the last two rows, not 2+ consecutive, so no drift flag per the log's own rule. Notable pattern instead: this is the second consecutive task (after Task 24's dark-mode CSS finding) where the review gate's value came from independently *running* something (here, the full test suite and a direct trace of the pre-fix code path) rather than accepting a restated claim — consistent with this log's recurring "verify the precondition, don't assume it" theme (Tasks 6/8/13/15/18/23/24). Logged in `.agents/DEVLOG.md` as the same finding-class as the Task 1-4 broken-image story: a real bug that survived nine tasks' worth of governance and fixture-scale e2e review, surfaced only by manual use of a packaged build.
