## 2026-09-01 -- Task 33: a governed suite that checked for the class, not the layout, and a `<pre>` inside a `<pre>`

Found by hand, not by CI: Task 32's own e2e coverage asserted the Code
tab's `.hljs` class was present, but never opened a document with a real
long line and asserted anything about wrap or overflow -- so 4/4 green
never had a chance to see this. Same shape as Task 25/30's finds: the
governed suite proves the feature exists, not that it behaves at the
scale a real file actually reaches.

Root cause was one level of nesting nobody noticed: `#code-content` in
`index.html` is declared `<pre id="code-content" hidden></pre>` and
already carried the correct `white-space: pre-wrap` since Task 32. But
`highlightMarkdownSource` returned its own complete
`<pre><code class="hljs language-markdown">...</code></pre>` block, which
lands inside that outer `<pre>` via `innerHTML` -- a `<pre>` nested in a
`<pre>`. The inner one's *specified* user-agent default (`white-space:
pre`) wins over the outer's *inherited* `pre-wrap` for every visible text
node, so the correct CSS rule was sitting right there the whole time,
just never reaching the text it was meant to govern. Fix was a single
return-statement narrowing -- `highlightMarkdownSource` now returns a bare
`<code class="hljs language-markdown">` fragment, letting `#code-content`
be the only `<pre>` in the tree, the same shape `#frontmatter` and
Preview's own fenced-code-block rendering already used without anyone
having to say so.

The independent review (`review_report_task33.md`) came back Pass, 0
Blocking, 0 Should-fix, and is worth citing for its own process finding:
the reviewer's first fault-injection attempt (revert the fix, expect the
new e2e test to go red) *falsely passed*, because `test:e2e` launches a
pre-built `dist/` bundle and the reviewer re-ran the targeted Playwright
test without rebuilding first -- so it was still exercising the old,
already-compiled `dist/main/markdown.js` from before the revert. Caught
by the reviewer's own discipline of re-deriving rather than trusting a
first green, not by any instruction that told them to expect it; `npm run
build` after the revert produced the true red, then the true green after
restoring the fix. Worth remembering for any future e2e-based fault
injection in this repo: reverting source alone is not enough between
runs, `dist/` has to be regenerated too.

Full regression at delivery: `tests/unit` 109/109 (108 baseline + 1 new),
`tests/integration` 22/22 (untouched), `test:e2e` 98/98 (97 baseline + 1
new Task 33 test), all executed directly by the independent reviewer from
a fresh `git diff`. One pre-existing, extensively pre-documented flake
(a rotating Windows worker access-violation crash, logged since Task 10)
surfaced once in the reviewer's own full-suite run and was confirmed
non-reproducing via 3 isolated re-runs -- not attributable to this diff.
