## 2026-08-24 -- Task 29: frameless main window, and a DPI-scaling side effect a native chrome had been silently absorbing

`frame: false` (scoped exactly to `createWindow()`'s own options, per
ADR-005 -- `defaultWindowOptions`/`windowConfig.ts` stayed untouched)
plus a custom `#title-bar` (drag region, three menu-label popups
reusing `buildMenuTemplate` a second time via a new `POPUP_MENU`
handler, three window-control buttons) replaced the main window's
native OS chrome. `menuHandlers()` was factored out of `applyMenu()`
so both the real application menu and the popup path build from one
shared handlers object -- no second, hand-duplicated menu description
(guardrail #67).

Two required empirical investigations, both run against the real
built app rather than assumed:

1. **Accelerators under `frame:false`.** CmdOrCtrl+O and F1, dispatched
   via `webContents.sendInputEvent` (the same technique already
   established in `help-menu.spec.ts` -- CDP-level `page.keyboard.press`
   does not reliably reach Electron's native accelerator table in this
   environment), both still reach their handlers unchanged. No
   regression.
2. **Double-click-to-maximize on the drag region.** Three independent
   techniques were tried against the real window: Playwright's own
   `dblclick`, `webContents.sendInputEvent` with an explicit
   `clickCount:2` pair, and a genuine OS-level double-click injected via
   a Win32 `mouse_event` call through PowerShell (real hardware-level
   input, not a CDP synthetic event). None observed the window
   transitioning to maximized -- the third technique additionally hit a
   DPI-scaling/multi-monitor coordinate-translation problem (Electron's
   `getBounds()` is in DIP, `SetCursorPos` wants physical pixels at this
   machine's 125% scale factor) that a diagnostic mousedown counter
   confirmed meant the click never reached the app's window at all. This
   is the same class of "cannot be reliably automated in this sandboxed
   environment" gap already documented for Task 16's physical
   drag-and-drop test -- not proof the documented Electron behavior is
   absent. Per guardrail #74's own conditional (no manual handler unless
   automatic behavior is *proven absent*), no manual double-click
   handler was added; `window-chrome.spec.ts` carries a light confirming
   test of the drag-region setup instead, with the investigation
   recorded in a code comment for the next reader.

FI-1 (guardrail #69: the maximize/restore button's state must track the
real OS fact regardless of trigger path) was executed for real, not
just asserted: the two `mainWindow.on('maximize'/'unmaximize', ...)`
listeners were commented out, the suite rebuilt, and the dedicated FI-1
test (`window-chrome.spec.ts` §f -- maximizing via a direct
`BrowserWindow.maximize()` call, not the custom button) went RED as
expected (button stayed un-classed after a real OS-level maximize);
restoring the two lines brought it back GREEN, confirmed on a full
rerun of the file (11/11 green).

One real, unplanned finding, not a flake: with `frame:false`
in place, this dev machine's 125% Windows display-scale factor produces
a DPI-rounding artifact right at the `minWidth: 480` boundary --
`BrowserWindow.setBounds({ width: 480 })` comes back as `482` (confirmed
via direct `getBounds()`/`getContentBounds()` probing, reproduced 5/5 in
isolated repeat runs). With the native frame previously in place, the
title bar's own chrome overhead pushed the resulting client width well
below 480 regardless of this rounding blip (Task 23's own devlog entry
already measured ~13px of native-chrome overhead at this same
boundary), so the artifact was invisible before -- removing the frame
removed the chrome padding that had been silently absorbing it.
`tests/e2e/tree-panel.spec.ts`'s Task 23 FI-2 proof (`dragging past the
dynamic max at a shrunk (480x640) window...`) asserts a strict
`window.innerWidth <= 480` immediately after that `setBounds` call and
now fails deterministically. That file was outside this task's granted
scope (`.agents/current_scope.json` did not include it), so it was not
edited -- flagged to the Lead as a genuine, reproducible conflict
between this task's mandated `frame: false` and a pre-existing test's
exact-boundary assumption, not routed around. Every other test in the
full suite (unit 99, integration 19, e2e 84 minus this one and two
already-documented pre-existing parallel-worker-contention flakes --
`tree-panel.spec.ts`'s Task 26 FI-1 hard crash, code `3221226505`, and
`window-chrome.spec.ts`'s own close-button test, both confirmed clean
5/5 and 1/1 respectively in isolation) passed.
