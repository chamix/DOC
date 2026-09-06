## 2026-08-24 -- Task 28: "Show File Tree" -- the first ViewSettings field with two independent write paths

`showTreePanel` joins `darkMode`/`showFrontmatter` as a third
`ViewSettings` field, but breaks an assumption both predecessors got
to rely on for free: every prior field only ever changed via its own
menu checkbox's click handler, so the menu template's `checked` value
(computed once, at `Menu.buildFromTemplate` time) never had a chance
to go stale. `showTreePanel` can also be forced `true` as a side effect
of an unrelated action -- `openFolderViaDialog()` and the directory
branch of the `REQUEST_OPEN_FILE` listener both already called
`establishTreeRoot` before this task existed; now they also call a new
`forceShowTreePanelAndRebuildMenu()` first, which forces the value and
-- this is the actually new part -- calls
`Menu.setApplicationMenu(Menu.buildFromTemplate(...))` a second time,
outside `app.whenReady()`, so the checkbox itself doesn't lie about
reality after the fact. Factored the handlers-object construction into
a single shared `applyMenu()` called from both the startup site and
this new one, rather than let two copies of the same handlers literal
exist and risk drifting.

The check-then-act guard (`if (viewSettings.showTreePanel) return;`)
is the one piece of logic this task actually adds; `establishTreeRoot`
itself has zero diff, same "extend by new caller, not by editing the
shared function" discipline this file's tree-root tasks (17/18/25/27)
have all followed.

Independent review (`review_report_task28.md`) found the implementation
itself correct on the first pass -- guard genuine, ordering correct
(force-before-`establishTreeRoot` at both call sites), Builder reused
without drift, `renderAndWatch` untouched -- but caught one real
Blocking gap: the approved spec explicitly called for a test proving
the guard's negative case (Open Folder while already visible must not
redundantly rebuild), and it was missing. Routed back for one
narrowly-scoped addition, scoped to `tests/e2e/tree-panel.spec.ts`
alone. The fix's strongest proof is a zero-broadcast-delta assertion
(`VIEW_SETTINGS` events received during the action) rather than an
end-state check, because `broadcastViewSettings()` and `applyMenu()`
sit behind the identical `if` in the identical function body -- a
zero-count assertion is logically tied to the guard short-circuiting,
not merely something that happens to look the same either way. Two
non-blocking should-fix items (coverage for the `REQUEST_OPEN_FILE`
directory branch specifically, and proving the Task 24 active-file
highlight survives a hide/show cycle) were folded into the same
follow-up since they touched the same file. Re-review confirmed all
three closed; 99 unit / 19 integration / 73 e2e all green, with one
isolated Windows parallel-worker crash on an unrelated pre-existing
Task 23 test, cleared by a clean re-run -- the same class of
environment flakiness this suite has hit before (Task 19, Task 27).
