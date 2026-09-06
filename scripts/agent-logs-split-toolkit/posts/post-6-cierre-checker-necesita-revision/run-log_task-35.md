# RUN_LOG — Task 35



**Date**

2026-09-05

**Task**

Task 35: v1.0.0 release preparation — README.md feature-list update (folder sidebar, Preview/Code tabs, copy-raw-source button) and new CHANGELOG.md (Keep a Changelog format, first-ever tagged release), delegated to `technical-writer` + independent `technical-writer` reviewer; plus Lead-direct Windows packaging config (`electron-builder.yml` win target, `.github/workflows/release.yml` tag-triggered GitHub Actions release, `package.json` bump to 1.0.0) with no subagent involved at all

**Personas involved**

Lead, technical-writer (writer), technical-writer (independent reviewer, fresh instance), user (all git operations, plus applied the Lead's packaging-config files directly with no subagent delegation)

**RGR cycles to green**

N/A for the docs deliverable — no RGR cycle, same class as Task 19 (prose/config, not testable business logic). N/A for the packaging config too, but for a different reason: it was never delegated to `full-stack-engineer` at all — the Lead wrote `electron-builder.yml`/`.github/workflows/release.yml`/the version bump directly in-chat and the user applied them verbatim. One real correction cycle did happen post-commit (see Notes): a Lead-recommended `build/icon.ico` was generated, committed, then reverted after independent verification showed it was unnecessary

**Cost**

Not captured — the docs delegation's `technical-writer`/reviewer agents ran in a separate Claude Code session; no `usage.subagent_tokens` figures were surfaced back to this chat. The packaging-config work carries no subagent cost since no subagent touched it

**Wall-clock time**

Not captured, same reason as Cost

**Outcome**

Success, after one self-caught-and-corrected Lead error (see Notes) — not a clean first pass in the way this log usually tracks that, but the deviation was in the Lead's own recommendation, not in either subagent's delivered work

**Reviewer verdict**

**Pass, with one confirmed catch and one inaccurate claim in the same report.** The independent `technical-writer` reviewer correctly caught and removed a CHANGELOG.md bullet claiming a "packaged Windows icon" bug had been fixed — `backlog.md`'s own `[Resolved 2026-08-15]` entry on Task 13 already established, via a real `npm run package` + installer deploy, that no such bug existed (`build/icon.png` alone was always sufficient), so no user-facing "Fixed" claim about it belonged in a public changelog. It also correctly flagged (non-blocking, left for the user) a missing `npm install` step in README's Usage section, and a `package-lock.json` top-level `version` field frozen at `0.0.0-scaffold` since project scaffolding. Its report, however, also asserted `package.json` itself was "still 0.1.0" — false; the Lead independently re-cloned the live repo and confirmed `package.json` already read `1.0.0` in that same commit. Likely the reviewer conflated `package.json` with `package-lock.json`'s genuinely-stale field rather than misreading the file directly, but this was not verified further. Treated as a claim to check, not a fact to relay — logged here exactly as found, not smoothed over

**Notes**

**The real finding in this row is a Lead-side process defect, not a subagent one — logged plainly per this project's own standing rule that spec/recommendation defects trace to whoever made them.** Earlier in this session, before any delegation, the Lead told the user `build/icon.ico`'s necessity was "an open question" in `backlog.md` and generated one anyway "to be safe" — without actually reading the file. `backlog.md` in fact already carried a `[Resolved 2026-08-15]` entry, from Task 13's own review, definitively settling the opposite: a real Windows `npm run package` + installer deploy had already proven `build/icon.png` alone renders a correct, non-fallback icon in Explorer/taskbar/installed app, no `.ico` needed. The unnecessary file was committed by the user on the Lead's word, surfaced as a discrepancy by the independent reviewer's CHANGELOG catch, and only then did the Lead read the actual backlog entry — the same "read the source, don't restate a vague memory of it" discipline this log has credited engineers and reviewers for since Tasks 6/8/13/15/18/23/24/25/26/30, now recorded as a case where the Lead itself skipped it. Resolved by full reversion, at the user's explicit choice between keeping-with-a-note and reverting: `build/icon.ico` deleted, `electron-builder.yml`'s `win.icon` line removed, the CHANGELOG's now-false "dedicated Windows `.ico`" Added-bullet removed, and `package-lock.json` re-synced via `npm install`. **Second thing worth naming: this task introduces a new authorship category for this log** — `electron-builder.yml`'s `win`/`publish` config and `.github/workflows/release.yml` were never delegated to `full-stack-engineer` at all; the Lead wrote them directly in-chat and the user applied/committed them verbatim, reasoning that build/CI tooling outside `src/` has no unit-testable behavior for an RGR cycle to attach to. Unlike Task 29's Lead-direct fallback (a capacity-constrained, disclosed *deviation* from the normal engineer/reviewer split), this was the default plan from the start, not a fallback — worth the user's attention as a standing question rather than a one-off: should build/CI/config files of this kind keep going through Lead-direct authorship indefinitely, or would even non-`src/` changes benefit from the same independent-review discipline applied to code, given this very row shows the Lead's own unreviewed claim was the actual point of failure? **Third: this is `md-view`'s first-ever tagged release and the first-ever `CHANGELOG.md` in this repo** — a milestone on the scale of the Task 1-4 packaging checkpoint and the Task 21/23/24 sidebar-completion note, arguably warranting its own `.agents/DEVLOG.md` entry; not written here, left for the user to add if wanted, since DEVLOG entries are narrative/optional rather than mandatory per task
