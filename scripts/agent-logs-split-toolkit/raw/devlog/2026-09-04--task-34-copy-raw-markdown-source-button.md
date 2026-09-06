## 2026-09-04 — Task 34: Copy Raw Markdown Source Button

Shipped a "copy raw source" button in `#document-header`, opposite the
Preview/Code tabs via a `#title-bar-spacer`-shaped flex spacer. Clicking it
copies the on-disk file's exact content — frontmatter and body, whatever
`#code-content`'s `textContent` already holds since Task 32/33 — to the
system clipboard, regardless of which tab is currently visible. Two
decisions were made and disclosed up front rather than discovered mid-task:
the icon is a hand-authored inline SVG (ADR-006, a scoped exception to the
app's usual CSS-drawn-icon default — the two-state copy→check transition
was judged meaningfully harder to express as a second `::before`/`::after`
pair than as two toggled `<svg>`s), and the clipboard write had to cross
into `main/index.ts` via a new `ipcMain.handle`/`ipcRenderer.invoke` pair
(the second request-response shape in the app, after Task 17's
`REQUEST_LIST_DIRECTORY`) because Electron's sandboxed-preload `require()`
polyfill does not expose the `clipboard` module at all — confirmed against
Electron's own sandbox docs before writing any code, not discovered by a
failed `require()` call at runtime.

The load-bearing guarantee here — byte-for-byte fidelity to the real
on-disk file — was proven, not assumed. A synthesized fixture deliberately
carried a trailing EOF newline, a blank line, and a line with both leading
and trailing spaces (exactly the whitespace a naive markup/highlighting
path would be most likely to silently normalize), and the e2e test reads
the *real* OS clipboard via `electronApp.evaluate(() => clipboard.readText())`
and compares it against `fs.readFileSync` on that fixture directly — never
against `#code-content`'s DOM string standing in for the clipboard. The
independent review re-derived this itself with a real fault injection
(swapped the click handler's `codeContentEl.textContent` for
`codeContentEl.innerHTML`, rebuilt, watched rendered `<code class="hljs...">`
markup leak into the clipboard, then restored and confirmed green) rather
than trusting the engineer's narrated sequence — the same "re-derive, don't
restate" discipline this project's reviews have held to since Task 6.

One process note worth keeping: the delegation brief for this task
referenced "16 pre-existing drive-letter-casing failures" in
`tree-panel`/`file-tree`/`drag-drop` specs as expected background noise.
The reviewer found no such `backlog.md` entry and reproduced none of that
pattern in its own full-suite run — only a single, already well-documented
`ui-shell.spec.ts` timing flake occurred, non-reproducing at 2/3 on
isolated reruns. The reviewer flagged the discrepancy explicitly rather
than silently reconciling it, and the verdict rests on what was actually
observed. Approved for delivery: 0 Blocking, 1 Should-fix (guardrail #100's
mid-session success→error re-disable transition has no e2e/integration
test, though the pure predicate and the pre-first-file case are both
proven — logged as debt, not fixed this session), 1 Nit (an untracked,
auto-generated metrics telemetry file, harmless).
