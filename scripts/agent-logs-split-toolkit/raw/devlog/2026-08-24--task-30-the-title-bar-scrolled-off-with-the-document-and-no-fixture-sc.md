## 2026-08-24 -- Task 30: the title bar scrolled off with the document, and no fixture-scale test was ever long enough to catch it

The same class of finding as the Task 1-4 broken-image story: a governed
suite (Task 29's `window-chrome.spec.ts`, 11/11 green, real fault-injection
already performed for guardrail #69) shipped a real bug that only a real,
longer document exposed. Every other fixed-chrome element in this app --
`#tree-panel`, `#tree-resize-handle`, `#status-bar` -- was built
`position: fixed` from the task that introduced it. `#title-bar` (Task 29)
was the one element that was missed, left at its default `position: static`,
sitting in normal document flow as `body`'s first child. `body` has been
the element that scrolls since Task 12, on purpose -- so on any document
tall enough to scroll, `#title-bar` scrolled out of view along with it,
taking all six interactive elements (three menu labels, three window-control
buttons) with it. Task 29's own suite never opened a document long enough
to force a real page scroll before asserting title-bar geometry, so 11/11
green never had a chance to see it.

Two changes were required together, not independently:

1. `#title-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 10; }`
   added to the existing rule (every other declaration -- display/flex/
   height/background/border/drag/user-select -- untouched). `z-index: 10`
   is defensive: without it, paint order alone happens to put `#title-bar`
   above normal-flow content today, but nothing guarantees that stays true
   as the document's own stacking contexts change.
2. `#app-body { margin-top: var(--title-bar-height); }` added alongside the
   existing `display: flow-root`. `#app-body` had zero top offset of its
   own -- it was only ever pushed down as an incidental side effect of
   `#title-bar`'s normal-flow height. Taking `#title-bar` out of flow
   removes that push for free; without the explicit `margin-top`
   compensation, the document's content slides up and sits *behind* the
   now-fixed title bar instead of below it. `--title-bar-height` (`2rem`,
   already defined at `:root` since Task 29) was reused verbatim -- no
   second constant introduced for the same value.

`tests/e2e/window-chrome.spec.ts` gained a new `(g)` describe block using
`tests/e2e/fixtures/long-document.md` (the same fixture Task 26 built for
the analogous `#tree-panel`-vs-scroll independence proof, guardrail #51 --
not a new fixture).

**Correction (review_report_task30.md):** the paragraph originally here
claimed "3 of 6 new tests went RED... before the fix," bundling in an
early, since-superseded draft of the `#app-body`/`#title-bar` gap check
(the `#main-panel`-based version, off by ~24px, discussed below) as if it
were one of the six tests actually delivered. Independent review reverted
just the CSS fix and reran the final six `(g)` tests as shipped: only 2 of
6 go RED against the unreverted-CSS baseline --

- title-bar geometry after scrolling to the document's end: the captured
  `boundingBox()` differed (`y: -17789.6` vs. the pre-scroll `y: 0` --
  `#title-bar` had scrolled bodily off-screen along with the rest of the
  page);
- `#tree-panel` vs. `#title-bar` geometry while scrolled: off by ~9213px
  (`#tree-panel` stayed correctly viewport-pinned; `#title-bar` had moved).

The delivered `#app-body content starts exactly...` test (scroll position
0) **passes even with the fix reverted** -- at rest, pre-fix `#title-bar`
(still normal-flow) already happens to sit directly above `#app-body` with
no gap, the same "accidental byproduct" the bug report itself names. It
guards a real, different regression (a future change reintroducing
`position: fixed` on `#title-bar` without the compensating `margin-top`),
just not this historical bug at RED time. The ~24px-off draft mentioned
below was a real, independently-observed RED result, but from a superseded
version of the test that no longer exists in the delivered file.

The other 3 (button-click / menu-popup functional tests while scrolled)
passed even against the unmodified CSS -- Playwright's own auto-scroll-
into-view before `.click()` masked the bug for those specific assertions,
which is a legitimate result, not a test-writing miss: those tests exist as
functional regression coverage for the fix, not as the fix's primary
discriminator.

One test-design correction made mid-cycle, worth recording: the original
draft of the `#main-panel`-vs-`#title-bar` "no gap, no overlap" check tried
to run at the same *scrolled* state as the button/menu tests. That is
physically impossible to assert meaningfully -- `#main-panel` is
deliberately normal-flow, scrolling content (Task 12's design, `body` is
the scroller), so its `getBoundingClientRect().top` moves away from
`#title-bar`'s fixed bottom edge in direct proportion to scroll distance;
that is correct behavior, not a regression. Re-scoped the check to run at
scroll position 0 (the document's resting state) instead, which is where
the invariant is actually meaningful, and swapped the compared element from
`#main-panel` to `#app-body`: `#main-panel` isn't its own Block Formatting
Context, so `#document-container`'s `margin: 1.5rem auto` (Task 11) was
collapsing ~24px through it into the measured rect -- a real but unrelated
pre-existing presentational offset, not this task's bug. `#app-body` *is*
the `flow-root`/BFC boundary this task's `margin-top` compensation was
added to, so it's the direct, uncollapsed measurement.

After applying both CSS changes, all 6 new `(g)` tests went GREEN, and the
full `window-chrome.spec.ts` (17/17) and `tree-panel.spec.ts` (31/31) suites
both passed. One transient failure surfaced on the first `tree-panel.spec.ts`
full run -- `worker process exited unexpectedly (code=3221226505)` on the
"hide/show preserves full tree DOM state" test -- reproduced clean 1/1 in
isolation and on a full-suite rerun; this is the same documented
parallel-worker-contention crash code already recorded in Task 29's own
devlog entry against a different test in this same file, not caused by this
diff.
