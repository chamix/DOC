# RUN_LOG — Task 21



**Date**

2026-08-20

**Task**

UI feature for md-view: tree sidebar (`#tree-panel`) — first renderer consumer of Task 17's file-tree backend. `#app-body` flex wrapper around the existing `#empty-state`/`#document-container` pair plus a new `#tree-panel`; lazy-expand-on-click with exactly-once-per-folder `listDirectory` caching (child-node-count keyed, no separate boolean); click-to-open via new `BridgeApi.openFileByPath` reusing the existing `REQUEST_OPEN_FILE` channel verbatim, zero `src/main/**` diff (Task 21)

**Personas involved**

Lead, full-stack-engineer, code-reviewer

**RGR cycles to green**

2 delivered cycles (1: `needsFetch` unit test; 2: fixed a `.tree-node`/`.tree-label` Playwright locator ambiguity found during the file-click e2e test, plus the FI-1 RED/GREEN proof), within the 3-cycle cap

**Cost**

233.4k engineer subagent tokens + 128.6k reviewer subagent tokens = ~362.0k combined (real per-agent `usage.subagent_tokens`, single turn each; `/cost` not run this session)

**Wall-clock time**

~38m37s engineer + ~19m52s reviewer = ~58m29s combined subagent wall-clock (real `duration_ms`, single turn each, sequential; excludes Lead orchestration and user decision time)

**Outcome**

Success

**Reviewer verdict**

**Pass with non-blocking notes** — 0 Blocking, 2 Should-fix, 2 Nits. S1: the shipped FI-1 fault-injection proof only covers the non-empty-folder caching path, not the empty-folder path (which needed its own "(empty folder)" indicator row to make the child-count cache check work at all) — reviewer independently confirmed the empty-folder path works via a throwaway diagnostic, but it isn't part of the permanent suite. S2: FI-1's counting technique reads Electron's undocumented `ipcMain._invokeHandlers` internal Map (the spec's originally-proposed `require()`-based technique didn't work in this Electron/Playwright version — `require`/`module` are undefined inside `electronApp.evaluate()`'s global-eval context, discovered empirically by the engineer) — real and verified working, but an Electron upgrade could silently break it. Both logged to `backlog.md`, not fixed inline

**Notes**

**No drift flag** — first-pass clean-verdict following Task 20's first-pass clean verdict; cycle count (2) roughly flat versus Task 20's 1, proportionate to this being a real feature rather than a one-line bug fix. Two things worth naming plainly, both examples of not accepting a plausible-sounding claim without checking it. First: the spec (written by the Lead pre-delegation) prescribed a specific fault-injection technique for the caching guardrail that turned out not to work in practice — the engineer didn't force it or fake a passing test, they diagnosed why it failed and substituted a working, still-production-faithful alternative, disclosed clearly in the report. Second: the engineer reported, in good faith, that adding the sidebar seemed to increase the flake rate of an already-known, already-unexplained flaky assertion (`ui-shell.spec.ts`'s `marginLeft > 32` check, first seen in Task 19's baseline). Rather than accepting "the sidebar caused it" at face value, the Lead did the CSS arithmetic first (at 1600px window width, `max-width: 54rem` caps `#document-container` well below the available space with or without the 260px sidebar) and asked the reviewer to verify empirically — the reviewer built a polling diagnostic to read the *settled* layout value (bypassing the flaky test's own fixed 100ms wait) and measured `marginLeft` at 230.8px, ~7x the failing threshold, confirming the Lead's math and ruling out a geometry cause for this task specifically. The correlation the engineer noticed was real (flake rate did rise) but the causal story was wrong — better explained by "more tests in the suite now = more concurrent Electron processes = more of Task 19's already-open contention problem," not by anything this task's CSS changed. Both findings are logged in `backlog.md` with the supporting numbers, not as bare claims.
