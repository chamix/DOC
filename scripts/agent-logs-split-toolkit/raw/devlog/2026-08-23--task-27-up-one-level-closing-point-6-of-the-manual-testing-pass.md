## 2026-08-23 -- Task 27: "Up one level" -- closing point 6 of the manual-testing pass

Task 25's own devlog entry (2026-08-22) closed one gap from a manual,
packaged-app pass and explicitly left "navigate up"/breadcrumb noted as
out-of-scope for that task, not a new finding. Task 27 closes that gap:
a new row at the top of the tree panel (`.tree-row-up`, deliberately not
`.tree-node` so Task 24's `revealAndHighlight` sibling walk stays blind
to it) that re-roots the tree at `path.dirname(currentTreeRoot)` via a
new fire-and-forget `REQUEST_TREE_PARENT` IPC channel -- the same
message shape `openFileByPath` and the dropped-folder path already use,
result delivered through the pre-existing `FOLDER_TREE_ROOT` push,
never a new request/response round trip.

The interesting design constraint here was resisting the urge to write
a second "are we already at the top" check. `path.dirname()` already
returns its input unchanged when given an actual filesystem root
(`path.dirname('C:\\') === 'C:\\'`), and `establishTreeRoot` already
no-ops when the resolved candidate equals `currentTreeRoot` (Task 18) --
so the new main-process listener is a bare two-line pass-through with
no root-detection logic of its own. Verified directly: `establishTreeRoot`'s
body has zero diff in this task. The one guard the listener does need
(`if (!currentTreeRoot) return;`) covers a different case entirely --
no root ever established, avoiding `path.dirname(undefined)` -- not a
duplicate of the no-op check.

FI-1 required proving the no-guard design would actually fail without
`establishTreeRoot`'s existing no-op doing the work: temporarily calling
`establishTreeRoot(currentTreeRoot)` (same root, not the parent) instead
of `path.dirname(currentTreeRoot)` had to go RED. `electronApp.evaluate()`
can't reach the main process's module-level closures (no `require`/
`module` in that eval scope, re-confirmed empirically before writing the
test), so the fault was injected via `ipcMain`'s own public
`rawListeners()`/`removeAllListeners()`/`on()` API instead: capture the
real registered listener, swap in a no-op, confirm RED (0 events), swap
the real listener back, confirm GREEN. Exercises the actual production
listener object in both states, not a stand-in.

Independent review (`review_report_task27.md`) found no Blocking items
-- all six new guardrails (#54-59) held under direct inspection and
independently re-run tests (96 unit / 19 integration / 67 e2e, all
re-executed by the reviewer, not restated). Three non-blocking
Should-fix items surfaced: (1) this DEVLOG entry and the backlog note
above were missing from the engineer's delivery despite the approved
plan calling for both -- closed by the Lead after review, as recorded
here; (2) `tests/integration/preload-api-contract.test.ts`'s hand-written
`BridgeApi` literals don't include `requestTreeParent` (or, pre-existing,
`openFileByPath`) and that file sits outside both `tsconfig.json`'s
`include` and Vitest's type-checking, so the gap is silent -- logged to
`backlog.md` as its own pending item, out of this task's scope to fix;
(3) the engineer's flake report named two specific pre-existing-flake
tests the reviewer couldn't reproduce failing in two independent
full-suite runs (an unrelated test flaked once instead) -- the broader
"pre-existing, workers:1-clean, unrelated to this diff" conclusion held
up under the reviewer's own pre-Task-27 HEAD comparison, so this was
noted as an accuracy nit rather than escalated.
