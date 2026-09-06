## 2026-08-23 — Task 26: viewport-fixed tree panel, and a spec snippet that silently reintroduced margin collapsing

`#tree-panel`/`#tree-resize-handle` switched from `flex: 0 0 auto` sizing
(borrowed from `#app-body`'s flex row, in turn driven by whichever sibling
was tallest) to `position: fixed; top: 0; left: 0/var(--tree-panel-width);
bottom: 2rem` -- a genuinely viewport-bound height, independent of both the
tree's own row count and `#main-panel`/`#document-container`'s Task-12
content-driven growth. `#main-panel` dropped its flex properties for
`margin-left: var(--tree-panel-width)`. Both `bottom` values reuse `body`'s
existing `padding-bottom: 2rem` status-bar clearance verbatim, per spec --
no new constant introduced.

The delegation's own snippet called for removing `#app-body`'s
`display: flex; flex-direction: row;` with "no replacement properties
needed." At the time I suspected that didn't hold up: a flex container is
also a block-formatting-context boundary, and I hypothesized that dropping
it would let rendered Markdown content's own top-margin (e.g. an opening
`<h1>`) collapse straight up through `#main-panel`/`#app-body` into `body`
-- a guardrail #51 regression (Task 12's content-driven layout must stay
completely unaffected). The guardrail #50/#51 tests did go RED with numbers
that didn't add up (a near-empty test document producing a 686px-tall page
in a 258px-tall test window), which read at the time as confirmation, so I
added `display: flow-root` on `#app-body` to restore the BFC boundary and
logged it as a proven fix.

Independent review (`.agents/specs/review_report_task26.md`, SF-1/SF-2)
didn't hold up that causal story: `#content` carries `markdown-body`, and
`github-markdown-css` already zeroes a `.markdown-body`'s first child's
top margin with `!important`, so there was no h1 margin available to
collapse in the first place. The reviewer reproduced the exact 686px/258px
figure with `flow-root` present and with it removed -- identical either
way -- and traced it to the narrow `#main-panel` forcing word-wrap on the
tree-many fixture text at that window size, the same confound I'd already
correctly diagnosed and worked around elsewhere for the guardrail #50
before/after-delta design, not margin collapsing. Full-suite screenshots
and scrollHeight/maxScrollY measurements came back identical with and
without the rule in every scenario tested. `display: flow-root` is kept
regardless -- it's a harmless, standard, zero-cost BFC idiom (unlike
`overflow: hidden`, it doesn't clip positioned/negative-margin content) --
but as defensive CSS, not as a demonstrated fix for a reproduced
regression. app.css's own comment at the point of change has been
corrected to match.

Required FI-1 proof (guardrail #52) run twice: once as the literal manual
edit the task assignment described (`bottom: 2rem` -> `bottom: 0` on both
elements in `app.css`, confirm RED — a real 31.2px overlap, exactly `2rem`
-- restore, confirm GREEN), and once as a permanent automated regression
test using a runtime-injected `<style>` override (`page.addStyleTag`) so
the same fault is re-provable on every future run without hand-editing
source. The first manual pass also surfaced a self-inflicted bug worth
naming: a `replace_all` revert of `bottom: 0;` back to `bottom: 2rem;`
collaterally rewrote `#status-bar`'s own unrelated `bottom: 0;` rule (it
matched the same literal string) to `2rem`, silently floating the status
bar 32px above the true window bottom. Caught immediately by the very next
test run going red for a different, larger (31.2px, then still 31.2px after
a "fix" that hadn't touched the real cause) discrepancy than expected --
fixed by a scoped, non-`replace_all` edit instead once isolated via a
direct computed-style dump of both elements.

Also caught and fixed before it shipped: the first draft of the guardrail
#50 (internal-scroll) test asserted an absolute `docScrollHeight <=
viewportHeight` bound after shrinking the test window to 480x320 and
expanding 40 tree rows. It failed even against the corrected CSS -- not
because the tree panel leaked into the page, but because a 480px-wide
window left `#main-panel`'s reading column so narrow that its own short
fixture paragraph word-wrapped into dozens of lines, legitimately growing
the page independent of the tree panel entirely. Rewritten to compare
`docScrollHeight` before vs. after expanding the tree (isolating exactly
what the tree panel's own overflow contributes) rather than asserting an
absolute threshold that any window/content combination could confound.

One more self-caught bug worth naming: the first draft of the "no folder
open" test forgot to override the file's default `electronArgs` (which
always opens a fixture file, and so always establishes a tree root) --
without an override, the test raced the async `FOLDER_TREE_ROOT` message
instead of genuinely exercising the permanent empty-state, so it passed or
failed depending on exactly when Playwright's assertion polled relative to
that message's arrival. Looked solid on the first few green runs; only
surfaced as a real, deterministic failure on a later re-run once the timing
happened to land the other way. Fixed with a nested `test.describe` +
`test.use({ electronArgs: [] })`, then re-ran the full spec file three
times back-to-back to confirm the flakiness was actually gone, not just
not-hit this time.

Full `tree-panel.spec.ts` (22 tests: Task 17/21 base + Task 23 + Task 24 +
new Task 26, all in one file per the task's "extend, don't fork" 
instruction) passes green, including Task 23's full drag-to-resize suite
run byte-for-byte unmodified (guardrail #53). Full e2e suite (63 tests
across every spec file) and unit/integration suites (96 + 19 tests) also
green. One test (`tree-panel.spec.ts`'s "clicking a file row" test) showed
its already-known flaky-under-parallel-workers behavior when run through
the repo's own post-edit test hook mid-session -- same previously-logged
baseline flake (Task 23's devlog entry), reproduced identically before this
task's edits and confirmed unrelated by running the full suite standalone,
where it passed cleanly both times.
neither is a substitute for someone actually using the built app.

**Corrección (2026-08-23):** el párrafo de arriba sobre `display: flow-root`
afirma un mecanismo específico (colapso del margen superior de un `<h1>`,
con las cifras 686px/258px como evidencia) que la revisión independiente de
Task 26 (`review_report_task26.md` §5) no pudo sostener empíricamente —
`github-markdown-css` ya neutraliza ese margen específico
(`.markdown-body>*:first-child{margin-top:0}`), y `#document-main`'s
`padding-top` bloquea cualquier colapso de todos modos, independientemente
de `flow-root`. Las cifras citadas resultaron ser un confound no
relacionado (word-wrap en una columna angosta), reproducible idéntico con
o sin `flow-root`. La línea se mantiene — es un guardrail de BFC sin costo
real, y no viola ningún guardrail mantenerla — pero como fix demostrado
para una regresión real, la narrativa original no se sostiene. Ningún
código de producción cambia por esta corrección, solo la explicación de
por qué existe esa línea.
