# RUN_LOG — Task 18



**Date**

2026-08-20

**Task**

Bug fix for md-view: `establishTreeRoot`'s (Task 17) tree-root no-op guard compared raw path strings, so on a case-insensitive filesystem (Windows, this dev machine) the same real directory arriving with two different casings — `dialog.showOpenDialog`'s casing vs. `path.dirname()`'s casing — caused a spurious `FOLDER_TREE_ROOT` re-broadcast; fixed by canonicalizing via `fs.promises.realpath` before comparing/storing/broadcasting, with a try/catch fallback to the raw path if canonicalization itself fails (Task 18)

**Personas involved**

Lead, full-stack-engineer, code-reviewer

**RGR cycles to green**

1 delivered cycle — clean implementation, RED (pre-fix code) → GREEN (fix applied) on the first write; no post-review fix cycle needed

**Cost**

104.0k engineer subagent tokens + 88.3k reviewer subagent tokens = ~192.4k combined (real per-agent `usage.subagent_tokens`, single turn each; `/cost` not run this session)

**Wall-clock time**

~4m56s engineer + ~8m24s reviewer = ~13m20s combined subagent wall-clock (real `duration_ms`, single turn each, sequential; excludes Lead orchestration and user decision time)

**Outcome**

Success

**Reviewer verdict**

**Pass on first pass** — 0 Blocking, 1 Should-fix, 1 Nit. Should-fix: e2e suite flakiness under 4-worker parallel load recurred a 4th time during this review (same pre-existing, zero-diff `file-tree.spec.ts` "Open Folder…" test already tracked since Task 17) — reviewer recommended prioritizing it as its own effort rather than continuing to log fresh occurrences; `backlog.md` entry updated with "priority raised" framing per that recommendation. Nit: a new test's event-counter pattern duplicates an existing idiom already used twice in the same file — no action needed

**Notes**

**No drift flag** — first-pass Pass following Task 17's first-pass Pass (with a pre-delivery Should-fix follow-up); cycle count (1) dropped from Task 17's 3-4, consistent with this being a small, narrowly-scoped bug fix rather than a new feature. Two things worth naming. First, the required empirical API-choice verification (`fs.promises.realpath` vs. `fs.realpath.native` — not documented as interchangeable regarding Windows case-preservation across Node versions) was performed twice independently: once by the engineer before choosing, once by the reviewer from scratch before accepting the choice — neither party treated "the docs probably mean X" as sufficient, continuing this project's standing empirical-verification discipline (Task 15's `removeMenu()` check, Task 6's theme-CSS check, now explicitly named as precedent in this task's own DEVLOG entry). Second, the reviewer went beyond the spec's own required fault-injection list and independently constructed and ran its own throwaway probe test to exercise guardrail #10 (canonicalization-failure fallback) against a genuinely nonexistent directory at runtime, rather than accepting the try/catch's presence in the diff as sufficient proof — cleaned up after itself (`git status` confirmed no residue) before filing the report.
