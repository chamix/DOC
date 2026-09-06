# RUN_LOG — Task 16



**Date**

2026-08-17

**Task**

Feature for md-view: drag-and-drop file open — dragging a `.md` file from the OS onto the main window opens it via the existing `renderAndWatch()` path, plus a depth-counter-based drag-over highlight (light + dark). First renderer→main IPC crossing in the app (`IPC_CHANNELS.REQUEST_OPEN_FILE`, new `BridgeApi.openDroppedFile(file: File): void`, `webUtils.getPathForFile()` called preload-side only) (Task 16)

**Personas involved**

Lead, full-stack-engineer, code-reviewer

**RGR cycles to green**

1 delivered cycle — clean implementation, all 3 test levels green on first write (75 unit + 11 integration + 31 e2e); no post-review fix cycle needed

**Cost**

109.5k engineer subagent tokens + 60.2k reviewer subagent tokens = ~169.6k combined (real per-agent `usage.subagent_tokens`, single turn each; `/cost` not run this session)

**Wall-clock time**

~24m50s engineer + ~6m18s reviewer = ~31m8s combined subagent wall-clock (real `duration_ms`, single turn each, sequential; excludes Lead orchestration and user decision time)

**Outcome**

Success

**Reviewer verdict**

**Pass on first pass** — 0 Blocking, 2 Should-fix (a `backlog.md`/`DEVLOG.md` note recording the guardrail #10 test-architecture investigation, added by the Lead at close-out; and a pre-existing, unrelated `ui-shell.spec.ts` flake under 4-worker parallel load, logged to `backlog.md`), 0 Nits

**Notes**

**First-pass-Pass following Task 15's Blocked verdict** — no drift flag (would need 2+ consecutive Blocked first passes; this is the opposite). The interesting result this task produced wasn't a catch, it was a **testing-boundary investigation done honestly up front**: this is the first renderer→main IPC crossing in the app, and the approved technical spec explicitly predicted (per functional_domain.md's own guardrail #10) that a `File` built inside Playwright's `page.evaluate()` cannot get a real resolved path from `webUtils.getPathForFile()`, closing off a literal "drop a real file, see it render" e2e proof — and instructed the engineer to verify this empirically rather than assume it, then build compensating coverage rather than fabricate a shallow test. The engineer confirmed the prediction exactly (empty-string resolution, confirmed via direct probe) and built the compensating strategy the spec described: `ipcMain.emit(...)` invoked directly from `app.evaluate()` to exercise the real main-process listener with a real path for guardrails #1/#8, and a second, test-only `ipcMain.on` counting listener coexisting with the production one to prove "exactly one open requested" for a multi-file drop through the *real* renderer→preload→ipcMain chain for guardrail #2 — genuine end-to-end coverage of everything on this app's own side of the one boundary that's actually out of reach (a true native OS-level drag). The reviewer independently re-ran the full suite, performed its own fault-injection spot-check (removed a `preventDefault()` call, confirmed RED with the exact predicted assertion failure, restored, confirmed GREEN, verified `git status` matched the pre-injection baseline), and read both new test files in full specifically checking for the one plausible way this coverage *could* have been faked — monkey-patching `window.mdview.openDroppedFile` from the page side — confirming it wasn't done. One genuine, disclosed gap remains open rather than silently dropped: the spec's one required *manual* check (physically dragging a real file onto a running dev-mode window to observe Chromium's native default-navigation behavior with/without the fix) could not be performed by either the engineer or the reviewer, since neither had GUI/mouse automation available in their sandboxed sessions — logged to `backlog.md` as a `[Pending]` item rather than claimed as done, continuing this log's standing "verify, don't restate — and say so plainly when you genuinely can't verify" discipline.
