## 2026-08-22 — Task 25: another real-usage find the governed suite never surfaced

`REQUEST_OPEN_FILE` is the single shared entry point for both drag-and-drop
(`openDroppedFile`) and the tree panel's click-to-open (`openFileByPath`),
wired back in Task 16 and reused as-is by Task 21. Its listener has always
unconditionally routed whatever path arrived into `renderAndWatch` --
meaning a dropped *folder* fell straight into `renderFile`'s Markdown-only
check, which correctly rejected it, but as a document error ("Not a
Markdown file: <folder>") rather than being recognized as a valid alternate
input with its own valid, already-existing outcome ("Open Folder…"'s
`establishTreeRoot`, live since Task 17). Fixed with a single `fs.stat`
classification ahead of the existing dispatch: a directory now calls
`establishTreeRoot` and returns before any render/watch logic runs; a stat
failure falls through unchanged to today's `renderAndWatch` error path;
file behavior is otherwise byte-identical.

Worth naming plainly: this shipped through Tasks 16 (drag-and-drop's own
introduction), 17-18 (the tree-root/`establishTreeRoot` machinery this fix
now reuses), 20-21 (the tree panel that added a second real caller of the
same listener), and every review gate along the way -- nine tasks, all
green, all independently reviewed -- and the gap only surfaced on a manual,
packaged-app pass, dragging a real folder onto a running window. Same shape
as the Task 1-4 broken-image story: a fixture-scale e2e suite structurally
never drags a directory onto the window (every drag-drop fixture is a real
file, by construction, because that's what the feature was written to
handle), so no amount of re-running that suite could have caught this on
its own. Governance and adversarial review are real, necessary layers --
