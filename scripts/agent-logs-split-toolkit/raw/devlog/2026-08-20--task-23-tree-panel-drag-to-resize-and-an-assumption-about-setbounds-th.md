## 2026-08-20 — Task 23: tree panel drag-to-resize, and an assumption about setBounds that didn't hold

Shipped the `#tree-resize-handle` between `#tree-panel` and `#main-panel`
exactly per the approved reference implementation (clientX-as-width, live
`window.innerWidth`-derived max, document-level mousemove/mouseup lifecycle,
no persistence). No deviation from the spec's JS was needed or introduced.

One real finding during test-writing: the spec's own worked example assumed
`BrowserWindow.setBounds({ width: 480 })` yields `window.innerWidth === 480`
inside the renderer. On this machine it does not — the client area comes
back at 467px, ~13px short, presumably window-chrome overhead specific to
this Electron/Windows build. A test hard-coded to the nominal `480 - 300 =
180` clamp value failed for an environmental reason, not a logic bug.
Fixed by reading the live `innerWidth` after the resize and deriving the
expected clamp from that (same pattern the "default window size" test
already used), rather than assuming the nominal value — the resulting test
is more honest about what it's actually proving (live-recompute behavior,
guardrail #34) and isn't coupled to this machine's exact chrome overhead.

Both required fault injections were run for real, not just asserted:
- FI-1 (remove the `Math.min`/`Math.max` clamp): 3 tests went RED (the two
  clamp tests plus the shrunk-window test, which also depends on the
  clamp), 8 stayed GREEN, restore brought all 11 back to GREEN.
- FI-2 (hardcode `maxTreeWidth = 600` instead of deriving it from live
  `window.innerWidth`): confirmed directly (temporary diagnostic assertion,
  removed after) that `#main-panel` collapses to a computed width of `0px`
  at the 480px window size while `#tree-panel` claims the fixed `600px` —
  proving the fixed cap is unsafe exactly where guardrail #34 says it would
  be. Restore brought the suite back to GREEN.

Full `tree-panel.spec.ts` (Task 21 + Task 23, 11 tests) passes green. The
5-test flaky-under-parallel-workers baseline noted in Task 22's devlog
entry (file-tree.spec.ts x4, one tree-panel.spec.ts click test) reproduced
identically before, during, and after this task's edits when run as part of
the full suite via the repo's pre-commit hook — confirmed unrelated to this
change by running the affected files in isolation, where all pass.
