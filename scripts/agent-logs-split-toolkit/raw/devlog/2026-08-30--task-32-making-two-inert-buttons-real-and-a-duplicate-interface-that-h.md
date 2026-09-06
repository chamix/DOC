## 2026-08-30 -- Task 32: making two inert buttons real, and a duplicate interface that had been drifting since Task 28

`#tab-preview`/`#tab-code` had existed since Task 11 as pure chrome --
styled, visible, zero listeners. This task wired them up: Code shows the
literal on-disk file (frontmatter included, not the frontmatter-stripped
`body` `html` already uses), Markdown-highlighted via a second,
independent `highlightMarkdownSource` export in `markdown.ts` that never
touches `markdown-it` -- same file, same `hljs` import, but structurally
unconnected to `markdownToHtml` so neither can regress the other. Guardrail
#93's pre-check (`hljs.getLanguage('markdown')` against the pinned
`highlight.js@11.11.1`) came back `true` before any code was written, so
the brief's own documented `highlightAuto` fallback branch stayed
intentionally dead -- confirmed, not assumed.

Found and fixed in the same task, not treated as separate: `ViewSettings`
had been declared twice since Task 28 -- once in `menu.ts` (with
`showTreePanel`), once in `preload/api.ts` (without it) -- silently out of
sync because `renderer.js` is untyped and nothing ever exercised the gap
directly. Worth naming plainly: this is exactly the kind of drift a typed
renderer would have caught at compile time the moment Task 28 shipped, two
tasks ago, and instead it sat unnoticed until a new field (`currentTab`)
needed adding to both copies and forced the question. Fixed by deleting
`menu.ts`'s local declaration and importing from `preload/api.ts`, the
project's own established canonical contract module for every other
cross-process shape.

The interesting design constraint was guardrail #89: a tab switch can be
triggered from two places -- the renderer's own tab buttons, or the native
View menu -- and both must leave the menu's checked state accurate
afterward, including right after a direct button click with no menu
interaction at all. The classic failure mode here is a renderer click that
only updates local DOM and never tells main, leaving main's `currentTab`
(and therefore the menu's `checked` value, computed once per
`applyMenu()` rebuild) stale. Closed structurally, not just tested for:
one shared `applyTab(tab)` function in `renderer.js` that both the click
handlers and `onViewSettings` call, but only the click handlers also call
`window.mdview.selectTab(...)` (reaching main via the new `SELECT_TAB`
channel) -- `onViewSettings` never re-sends, so there is no feedback loop
and the two paths cannot drift by construction. The independent reviewer's
own round-trip test proves this the hard way: click `#tab-code` in the
renderer, then read the *real* `Menu.getMenuItemById('menu-view-code')
.checked` via `electronApp.evaluate()` -- not a renderer-side assumption,
the actual native menu object main just rebuilt.

Mid-task scope amendment, done with the same escalation shape as prior
tasks' follow-ups (Task 30/31): the approved View-menu change (a
separator plus two new radio items) is exactly the kind of addition that
breaks any pre-existing exact-count assertion over that same submenu, and
two files elsewhere in the suite had one each -- `tests/unit/menu.test.ts`
(`toHaveLength(3)` on the View submenu) and `tests/e2e/window-chrome.spec.ts`
(two `toEqual([...3 ids...])` assertions). Both were out of this task's
original `in_scope` list. The implementing engineer stopped and reported
back rather than editing around the hook, per the Task Boundary Contract's
own designed path; the manifest was amended to add both files, with the
user made aware of the amendment before delegating the narrow follow-up.
Both were updated to the real 6-item order and both went green, plus new
coverage for the two radio items' own `checked`/`click` behavior was added
to `menu.test.ts` rather than just patched to stop failing.

The independent review (`review_report_task32.md`) came back Pass, 0
Blocking, but caught one real thing worth keeping: the `ViewSettings`
de-duplication fix left `index.ts` importing `ViewSettings` indirectly
through `menu.ts`'s re-export while importing the sibling type
`DocumentTab` directly from `preload/api.ts` in the same diff -- two
import paths into one canonical interface family, satisfying guardrail
#92's literal wording ("exactly one declaration") while quietly
contradicting the spec's own stated intent ("both `index.ts` and
`menu.ts` depend on `preload/api.ts`, never the reverse"). Not blocking,
but cheap and clearly correct, so it was fixed in a small follow-up rather
than carried as debt: `index.ts` and `menu.test.ts` now both import
`ViewSettings` directly from `preload/api.ts`, and the now-pointless
re-export line in `menu.ts` was deleted. `tsc --strict` stayed clean and
`tests/unit`/`tests/integration` stayed at 130/130 throughout -- a
type-only import reorganization with no runtime behavior to regress.

Full regression at delivery: `tests/unit` + `tests/integration` 130/130,
`test:e2e` 97/97 (93 pre-existing + 4 new Task 32 tests), all executed
directly by the independent reviewer from a fresh `git diff`, not
restated from the implementing engineer's own report.
[Resolved 2026-08-24].
