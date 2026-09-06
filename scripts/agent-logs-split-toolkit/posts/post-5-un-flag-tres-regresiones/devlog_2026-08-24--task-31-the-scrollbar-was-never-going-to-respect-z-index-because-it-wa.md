## 2026-08-24 -- Task 31: the scrollbar was never going to respect z-index, because it was never in the page's stacking context to begin with

Third window-fundamentals fix in the same week, and worth naming plainly
rather than treating as an isolated surprise: Task 29 (frameless window) ->
Task 30 (title bar scrolling off with the document) -> this task. All three
trace back to the same root cause -- Task 12's original body-scroll model
assumed no persistent fixed chrome existed above or around it, and every
follow-up since Task 29 has been closing gaps that assumption left behind.

Task 30 made `#title-bar` `position: fixed` and gave `#app-body` a
compensating `margin-top`, and that genuinely fixed the title bar itself
scrolling off-screen. But it left one thing unexamined: no `overflow` rule
existed anywhere on `body`/`html`/`#app-body`/`#main-panel`. A long document
still overflowed `body`, and `body` was still the element that scrolled --
so the browser's *native* scrollbar still spanned the full viewport height,
including the strip directly behind `#title-bar`. This was never a z-index
bug and Task 30's `z-index: 10` on `#title-bar` was never going to fix it
even in principle: native scrollbars render in the browser/OS compositor
layer, a layer that sits structurally outside the page's own DOM/z-index
stacking context. No CSS property on any page element can reach into that
layer and make a scrollbar respect anything. The actual bug was never
"which element paints on top" -- it was "which element is scrolling in the
first place," and the fix has to relocate that, not repaint around it.

`#tree-panel` already solved exactly this class of problem for itself in
Task 26: `position: fixed`, a bounded height (`top`/`bottom` anchored to
`--title-bar-height`/the status bar's `2rem` clearance), and its own
`overflow-y: auto`, so its scrollbar is contained entirely within its own
box instead of the full viewport. This task extends the identical,
already-proven pattern to `#main-panel`:

```css
#main-panel {
  position: fixed;
  top: var(--title-bar-height);
  left: var(--tree-panel-width);
  right: 0;
  bottom: 2rem;
  overflow-y: auto;
}
```

Required companion change, not optional: Task 28's `body.tree-panel-hidden
#main-panel { margin-left: 0; }` had to become `{ left: 0; }`. `#main-panel`'s
horizontal offset moved from `margin-left` to `left` in the base rule above;
left unconverted, the override becomes dead code the instant the base rule
stops using `margin-left` -- hiding the tree panel would silently leave
`#main-panel` permanently offset by `--tree-panel-width`, reserving an
unreachable gutter. Verified this discriminates for real, not just by
pattern-by-analogy: reverted just this one rule back to `margin-left: 0`
with the rest of the fix applied, confirmed the new "`#main-panel`'s left
edge is 0 once the tree panel is hidden" test goes RED (`left` received as
`260`, the live `--tree-panel-width` value, instead of `0`), then restored
`left: 0` and confirmed GREEN again.

One regression this task's own diff introduced and fixed within the same
CSS file, caught by actually running Task 23's drag-to-resize suite rather
than trusting the pattern-by-analogy claim in the delegation prompt:
`#tree-resize-handle` sits at the exact same `left: var(--tree-panel-width)`
x-coordinate as `#main-panel`'s own new left edge. Before this task,
`#main-panel` was normal-flow (non-positioned), so it painted below any
positioned element regardless of DOM order, and `#tree-resize-handle`
(already `position: fixed` since Task 26) always won the paint order for
free. The instant `#main-panel` also became `position: fixed`, both
elements share the same implicit `z-index: auto` stacking level, and ties
at that level resolve by DOM order -- `#main-panel` comes after the handle
in `index.html`, so it started painting on top and silently intercepted
the handle's own 6px hit area. All five Task 23 drag-to-resize tests failed
deterministically (`#tree-panel` staying pinned at its 260px default no
matter where the drag targeted) the moment the base `#main-panel` fix
landed, before the companion fix was even applied. Fixed with
`z-index: 1` on `#tree-resize-handle` (matching the app's existing
`z-index: 10` precedent on `#title-bar`) -- confirmed all five Task 23
tests green immediately after.

RED -> GREEN evidence for the seven `window-chrome.spec.ts` tests this task
touched (five converted `(g)` tests plus two of the three new `(h)` tests --
the third, the tree-panel-hidden regression check, happened to already pass
against the old CSS since `margin-left: 0` and `left: 0` render identically
at a value of exactly `0`, and was proven to discriminate separately via
the companion-fix revert described above): built and ran
`window-chrome.spec.ts` against the *unmodified* CSS first. All seven
failed for the expected reason -- `#main-panel` had no `overflow`/bounded
height of its own yet, so `mainPanel.scrollTo(...)` never moved
`mainPanel.scrollTop` off `0` (the five converted tests each timed out
polling for `scrollTop > 0`), and the new bounding-box test's
`mainPanelRect.bottom` came back as `18372.4`, thousands of pixels past the
live viewport height -- the box was exactly as unbounded as the bug report
claimed. After applying the CSS fix (both rules, plus the
`#tree-resize-handle` z-index fix above), all seven went GREEN.

Whether the native scrollbar's own rendered pixels could be measured
directly was investigated, not assumed: Playwright/Chromium's automation
surface (`getBoundingClientRect()`, `getComputedStyle()`, the accessibility
tree, DOM locators) has no call for "the scrollbar of element X" -- it is
not a DOM node. This app applies no `::-webkit-scrollbar` override either
(confirmed via a direct grep of `app.css`), so the scrollbar `#main-panel`
grows is the browser's native, unscriptable one, not a styled/measurable
pseudo-element. The new bounding-box test proves the *containing box's*
geometry instead, documented honestly as a proxy in the test's own comment
(same "investigate, then document the real limitation" standard as Task
29's double-click investigation in this same file's `(c)` block): a native
scrollbar always renders inside the box of the element that owns it, so
bounding `#main-panel`'s own box bounds the scrollbar's maximum possible
extent to that same region, even though the scrollbar's own pixels were
never directly observed.

Full regression: `window-chrome.spec.ts` 20/20 green. `tree-panel.spec.ts`
30/31 green -- the one failure (`Task 26: ... long document vs. tree panel
independence (guardrail #51)`) drives `window.scrollTo`/reads `window.scrollY`
the same way `window-chrome.spec.ts`'s `(g)` block did before this task's
conversion, and fails deterministically (reproduced twice) for the identical
reason: `window.scrollY` genuinely stays `0` now, by design, so the old
scroll-driving mechanism can no longer move anything. This file is outside
this task's granted scope (`tests/e2e/tree-panel.spec.ts` was not in
`current_scope.json`), so it was not fixed here -- flagged to the Lead and
recorded in `backlog.md`. A second, separately-discovered regression in the
same class: `tests/e2e/view-menu.spec.ts`'s `(f)` "toggling Show File Tree"
test reads `getComputedStyle(#main-panel).marginLeft` directly, which is now
always `0` regardless of tree-panel visibility (the property this task's
fix stopped using) -- also outside scope, also flagged rather than routed
around the hook.
**Update, same session:** the Lead amended current_scope.json to add both
tests/e2e/tree-panel.spec.ts and tests/e2e/view-menu.spec.ts, and both
regressions above are now fixed with the identical conversion pattern
already proven twice in window-chrome.spec.ts. tree-panel.spec.ts's
guardrail #51 test now drives/reads #main-panel directly
(mainPanel.scrollTo(...)/mainPanel.scrollTop) and re-derives its
proof-of-scroll assertion from #main-panel.scrollHeight vs.
#main-panel.clientHeight instead of document.documentElement.scrollHeight,
which no longer overflows post-fix. view-menu.spec.ts's (f) test now reads
getComputedStyle(#main-panel).left instead of .marginLeft. Both tests'
own intent stayed unchanged -- only the underlying CSS mechanism being
observed moved. Full regression after both fixes: tree-panel.spec.ts +
view-menu.spec.ts (37 tests) green, and a final combined run of
window-chrome.spec.ts + tree-panel.spec.ts + view-menu.spec.ts (57 tests)
all green. backlog.md's entry for this finding is now marked
