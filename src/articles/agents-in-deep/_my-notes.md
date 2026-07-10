<# Agentic Systems — Research Notes

> Personal notes, source: research session w/ Claude, July 2026.
> Purpose: raw material to play with before shaping into blog posts / talks.

---

## 1. How specialized should an agent be?

**Consensus: narrow specialization at agent level, generalist orchestrator on top.**

- Specialization wins on cost + debuggability, not necessarily on raw "intelligence."
- Anthropic's Research system: subagents get narrow, *bounded* mandates — objective, output format, tool guidance, explicit boundaries. Narrowness = what makes parallelism + debugging tractable.
- Generalist agents don't get expensive because they're dumb — they get expensive because they *accumulate responsibility* over time (context/prompt/toolset creep).
- Counterpoint (arXiv 2606.20877): generalist collectives > specialist collectives for tasks needing generation/choice/coordination. Specialists win for negotiation-heavy tasks. → **not universal, depends on task type.**
- Rule of thumb: specialize the *worker*, keep the *orchestrator* broad enough to decompose correctly.
- Cost reality check: multi-agent ≈ **15x tokens** of single chat call. Specialization/multi-agent = a deliberate trade, not a default.

**To explore later:** where's the actual threshold? At what task complexity does splitting into specialists start paying for itself vs. just adding coordination tax?

---

## 2. Is there a "standard" agent structure?

No ISO-style standard yet. Three converging reference points act as de facto standards:

1. **Anthropic's "augmented LLM"** (Dec 2024) — atomic building block = LLM + retrieval + tools + memory, where the model actively drives all three (own queries, own tool selection, own memory decisions).
2. **ReAct-family loop** — Observe → Reason → Act. Closest thing to a standard for single-agent internals.
3. **Component checklist** that recurs everywhere:
   - Reasoning/Planning (CoT, Plan-and-Execute)
   - Memory (now its own architectural layer, not just "longer context" — has its own benchmarks, e.g. LoCoMo)
   - Tool use / **ACI** (Agent-Computer Interface — deserves as much design care as HCI: examples, edge cases, clear boundaries between tools)
   - Control/guardrails — increasingly explicit graph state machines (LangGraph-style) rather than free LLM control flow, so you can insert human-approval nodes before irreversible actions.

**Framework choice matters less than pattern fit** — LangGraph / AutoGen / CrewAI / Claude Agent SDK / OpenAI Agents SDK all implement the same canonical patterns.

**To explore later:** try mapping my `json-mapper` CLI and the blog pipeline onto the "cognitive function × execution topology" 7×6 matrix (MLflow's 2026 taxonomy) — see which cells I actually need.

---

## 3. Orchestrator-workers + other patterns

### The 5 base "workflow" patterns (Anthropic, Dec 2024)
1. **Prompt chaining** — sequential steps, each feeds the next. Fixed decomposition.
2. **Routing** — classify input → dispatch to specialized path (e.g. cheap model vs. capable model).
3. **Parallelization** — *sectioning* (independent subtasks in parallel) or *voting* (same task, multiple runs, aggregate).
4. **Orchestrator-workers** — central LLM dynamically decomposes + delegates. Subtasks NOT predefined (key diff vs. parallelization).
5. **Evaluator-optimizer** — generator + critic loop. Needs a clear quality bar + feedback that demonstrably improves output.

### Beyond that — multi-*agent* topologies
- **Hierarchical** — orchestrator-workers generalized to N layers. Best for highly ambiguous/complex problems. Cost: complexity + latency stacks per layer.
- **Swarm / peer-to-peer (mesh)** — no central supervisor, agents talk directly, iteratively refine/critique/hand off. Good for debate-style problems. Bad for predictable cost/latency.
- **Blackboard** — agents don't talk directly; read/write shared data structure, react to changes. Decoupled.
- **Market-based / auction** — agents bid for tasks. More robotics/MAS research than current LLM production use.
- **Graph-based / adaptive routing** — not really a topology, more a *mechanism*: next step chosen at runtime based on signals (uncertainty, missing info, tool availability). LangGraph = common implementation.

### ⭐ Key design insight (the one that matters most)
**The isolation boundary is the real decision, not the topology label.**
- Anthropic's workers *never* talk to each other — every decision lives in the orchestrator. That's what enables true parallelism without context cross-talk.
- **Explicit failure mode:** tasks needing shared context or with many inter-agent dependencies are NOT a good fit for orchestrator-worker multi-agent (today). Coding, debugging, most tightly-coupled workflows fail this test.
- ⚠️ **Personal implication:** my blog pipeline + json-mapper work = fairly sequential/interdependent. Orchestrator-worker w/ parallel independent subagents is probably the WRONG pattern here. Prompt-chaining or evaluator-optimizer likely fits better.

**To explore later:** hybrids dominate production (e.g., hierarchical top-level + mesh inside a leaf team). Try sketching a hybrid for the two-phase writing workflow (claude.ai research/draft → Claude Code integration).

---

## 4. Measuring efficiency in agentic systems

**Honest state of the field: this is immature. Big gap between benchmarks and reality.**
- ~37% gap between lab benchmark scores and real deployment performance (enterprise survey).
- Cost variation up to 50x for similar accuracy across approaches — benchmarks don't report this.

### Layered metrics model
**Layer 1 — Outcome:**
- Task completion / success rate (verified on end-state, not just "did it respond")
- Pass@k / reliability across repeated runs — the metric most benchmarks skip. (τ-bench: GPT-4 agents drop from 60% success @ pass@1 to 25% @ pass@8 — single successful run tells you almost nothing about production reliability!)

**Layer 2 — Trajectory:**
- Tool-call accuracy / argument correctness
- Step efficiency (loops, redundant calls)
- Plan adherence/quality
- Groundedness / faithfulness (reasoning actually supported by evidence, not hallucinated)

**Layer 3 — Operational:**
- Cost per task (token spend — matters a lot given 15x multiplier risk)
- Latency (end-to-end + per-step)
- Error/failure rate under real load

### CLEAR framework (2025 academic, worth remembering)
**C**ost, **L**atency, **E**fficacy, **A**ssurance, **R**eliability.
- Optimizing accuracy alone → agents 4.4–10.8x more expensive.
- Concrete number: 2-point accuracy gain might cost +$50k per 10k tasks. Forces cost/quality trade-off into the SAME evaluation instead of treating cost as afterthought.

### How it's actually measured (combo, none sufficient alone)
- Automated eval / LLM-as-judge (scalable, rubric-based)
- Trace-based analysis (full trajectories, not just final output — this is how Anthropic caught subagents duplicating work)
- Human review (catches things automation misses — e.g. agents favoring SEO content farms over authoritative sources)
- Standardized benchmarks as *directional* guides only (SWE-bench, GAIA, AgentBench, WebArena, τ-bench) — not predictive of my specific use case

**To explore later:** design a mini CLEAR-style scorecard for my own agent experiments (Gemini/Antigravity system + future Claude-based ones) — even informal, just cost/latency/success/reliability tracked per run.

---

## Sources worth revisiting directly
- Anthropic — "Building Effective Agents" (Dec 2024): https://www.anthropic.com/engineering/building-effective-agents
- Anthropic — "How we built our multi-agent research system": https://www.anthropic.com/engineering/multi-agent-research-system
- Google Cloud Architecture Center — "Choose a design pattern for your agentic AI system"
- CLEAR framework paper (arXiv 2511.14136) — "Beyond Accuracy: A Multi-Dimensional Framework for Evaluating Enterprise Agentic AI Systems"
- τ-bench paper (Yao et al. 2024) — pass@k reliability metric
- MLflow 2026 Developer Guide — 7x6 cognitive-function × execution-topology taxonomy

---

## Open questions / things to test myself
- [ ] Where's my json-mapper + blog pipeline on the specialization spectrum — am I over- or under-specializing?
- [ ] What pattern actually fits my two-phase writing workflow (claude.ai → Claude Code)? My guess: prompt-chaining, maybe with an evaluator-optimizer step for review.
- [ ] Build a tiny personal CLEAR-style tracker for agent experiments.
- [x] Revisit the Gemini/Antigravity system I built through this same lens — done below, could become an article.

---

## Case study: evaluating my own Gemini/Antigravity system (json-mapper)

> System: `chamix-antigravity-blueprints` — a "Configuration-as-Code" `.agents/` blueprint for Google Antigravity. 3 personas + 2 workflows, governing the `json-mapper` repo.

**Structure:** Lead Architect (orchestrator, gatekeeper) → `full-stack-engineer` (TDD worker) + `technical-writer` (docs worker). Two slash-command workflows (`/audit-design`, `/audit-docs`) — deterministic, user-triggered, not autonomous loops.

**Scored against the 4-lens framework from above:**

1. **Specialization — good fit.** Narrow workers, one broader orchestrator, matches "specialize the worker, keep orchestrator broad." Gap: SKILL.md files give rich *style* bibliography (TDD, GoF, Osmani, JS Ninja) but no explicit **task-boundary contract** (no declared file scope, no declared output format per task).
2. **Structure — solid.** Has planning (staged Step0→1→2), memory (specs persisted to `.agents/specs/*.md` — genuinely the "artifact pattern," write-to-disk + pointer instead of context dump), and a real **human-approval gate** before code generation (Step 1 requires explicit user sign-off). Missing: explicit ACI/tool documentation.
3. **Pattern — correct choice.** Sequential orchestrator → single worker + blackboard-style shared state via markdown files. NOT parallel orchestrator-workers — which is right, since coding/interdependent tasks are explicitly the case Anthropic flags as a bad fit for isolated parallel subagents. Good instinct, whether deliberate or not.
4. **Metrics — the weak point.** No CLEAR-style tracking (cost/latency/reliability) at all. Only real measurable success criterion is the "60-second onboarding" line in the docs skill. Audit workflow output is LLM-as-judge with no rubric anchor, no ground truth, no run-history log. No stopping condition on the TDD Red-Green-Refactor loop (risk of runaway iteration in an autonomous sandbox).

**Biggest structural risk identified:** the Lead Architect is author of the plan, reviewer of the code against that plan, AND author of the audit criteria used to grade itself — a single point of blind-spot entrenchment. No persona plays "independent evaluator" distinct from the planner (the gap the evaluator-optimizer pattern exists to close).

**Verdict:** genuinely above-average for a personal project — better structured than most hobbyist agent configs. Gaps are exactly where the field itself is weakest (metrics, independent review), not sloppiness.

**Article angle to develop later:** "I evaluated my own AI coding agent against Anthropic's multi-agent design principles — here's what I got right and wrong." Structure: intro (built it in Antigravity/Gemini, wanted a gut-check) → the 4-lens framework → the self-referential-reviewer problem as the hook/twist → the fix (see "Pro upgrade" below) → lessons for anyone building persona-based agent configs.

### Pro upgrade — what changed (v2)
- Added an **independent `code-reviewer` persona** — structurally forbidden from having authored the spec or the code, breaks the self-review loop.
- Added **task-boundary contracts + output-format declarations** to worker SKILL.md files.
- Added a **stopping condition** to the TDD loop (max cycles before escalating to human instead of looping forever).
- Added a lightweight **CLEAR-lite run log** (`.agents/metrics/RUN_LOG.md`) + `/log-run` workflow — manual/self-reported cost, cycles-to-green, latency, outcome, reviewer verdict per task. Not real telemetry, but a start.
- Updated `AGENTS.md` workflow: Step 2 (implement) → **new Step 2.5 (independent review, blocking)** → Step 3 (log + deliver).

**To explore later:** could the run log eventually get automated (Antigravity hooks / git commit metadata) instead of self-reported? Worth checking Antigravity's extensibility docs.

---

## Live test run: v4 feature (stream input + unconditional file output)

> Ran the full v2 pipeline (Step 0 → 1 → 2 → 2.5 → 3) against a real feature request in the actual `json-mapper` Antigravity project. Three real findings came out of it — arguably more useful than a clean pass would have been.

### What worked
- Real TDD discipline: test → run → confirm expected failure → implement → re-run, repeated per unit. Not theater.
- Full regression run (`npm test`) after all changes, not just new tests in isolation.
- Boundary contract delegation was fully compliant in its *declared* form — scope, output format, definition of done, stopping condition, all present, copied correctly from SKILL.md.
- Good instinct on layering: `bin.js` explicitly owns grabbing `process.stdin` to keep OS/runtime details out of `CLIController`/`MapJsonUseCase` — correct Clean Architecture reasoning applied to a decision most people wouldn't think to architect.
- The 3-round pushback loop (Step 0 purity nit → ISP violation → CLIPresenter/versioning gaps → container.js/CLIController wiring gap) got resolved properly each time, not papered over. Each fix cited the right principle back correctly.

### Finding 1 — Undeclared scope creep (bounded)
Engineer modified `test/unit/CLIAdapters.test.js` and `test/unit/DIContainer.test.js` — neither was in the declared in-scope file list for the delegation. Its own SKILL.md says: stop and report back if the fix requires touching something out of scope. It didn't stop. Confirmed via `git diff --stat` against the actual working tree, not just re-reading the plan.

### Finding 2 — The review gate produced a false compliance claim
`code-reviewer`'s report explicitly said *"only in-scope files approved in the delegation order were modified"* and listed 12 files — omitting the two from Finding 1. This is the most important finding of the whole exercise: **the verification step didn't verify. It reconstructed the plan and asserted it matched reality, without actually diffing the repo.** A "Pass, no findings" verdict is worse than no verdict when it's wrong — it's confident and false, and it would have shipped un-caught if `git diff --stat` hadn't been run by hand.
→ **This is the strongest argument for why "structurally independent" (different persona, no authorship stake) ≠ "actually verifies."** The reviewer avoided the conflict-of-interest problem it was designed to avoid, and still rubber-stamped, just via a different mechanism (trusting the plan document instead of trusting its own prior authorship).

### Finding 3 — Unnarrated edit to the agent's own governance file (AGENTS.md)
`.agents/AGENTS.md` picked up a new, uncommissioned section ("Repository-Local Artifact Storage Rule") — never appeared in any delegation order, never narrated in the session transcript the way every single other file edit was ("I will now edit X..."). Confirmed real via `git diff` (distinct from CRLF noise) and ruled out as manual copy-paste (I didn't type it).

Timestamp evidence (`AGENTS.md` last-written ~6 min after Step 2.5 completed, right around when the Lead Architect composed its final summary) points to this most likely being the Lead Architect **complying with an actual instruction I'd relayed a few rounds earlier** ("add a permanent rule to AGENTS.md about artifact paths") — but doing so completely silently. So the live question isn't really "did it rebel," it's:

**⭐ The core insight — narration discipline doesn't extend to config/governance files, only application code.**
Every application file touch got an "I will now edit X" announcement. The one edit to the file that defines the system's own operating rules got none. Nothing in the current design enforces that a governance-file edit — even a correct, even a requested one — must be narrated and gated the same way an application code change is. Good content executed via a bad process is still a process failure: if it happens once silently, there's no reason it couldn't happen again silently with content nobody would have approved.

### Why this run was a good outcome, not a bad one
None of these three findings were catastrophic — bounded scope creep on test files, a review report that was wrong but caught by manual `git diff`, a governance edit that was (probably) requested and (probably) correct. But all three were **invisible without a human manually cross-checking against ground truth (`git diff --stat`, raw file diffs, timestamps).** None of the agent's own self-reporting layers (task.md, review_report.md, the final summary message) surfaced any of them. That's the real result: **the gates we built catch things when a human uses them to actually verify, not when the system is left to grade itself, even one layer removed.**

### Article angle — sharpened
Original angle was "here's what I got right and wrong in my own agent config." The live test gives it a much sharper spine now:
> **"My AI coding agent silently edited its own rulebook — and the persona I built specifically to catch that kind of thing didn't."**
Structure: the 4-lens eval → the pro upgrade → the live test → the three findings in order of severity → the core insight above (narration discipline stops at the app-code boundary) → what I'd add next (see below).

### To explore/build next
- [ ] Extend the Boundary Contract concept to cover `.agents/` itself: any edit to `AGENTS.md`, any `SKILL.md`, or any `workflows/*.md` requires its own explicit delegation order + narrated announcement + (arguably) its own review gate, same as application code. Right now config is implicitly "trusted infrastructure" with no contract at all.
- [ ] Add an explicit compliance-verification instruction to `code-reviewer`'s SKILL.md: it must actually run/request `git diff --stat` (or equivalent) and compare line-by-line against the declared scope, not restate the delegation order from memory. This is probably the single highest-leverage fix available.
- [ ] Consider: should `code-reviewer` itself be barred from writing to `.agents/AGENTS.md`, `SKILL.md`, or `workflows/*` at all — i.e. governance files are read-only for every persona except via an explicit, human-approved change, never as a side effect of "helpfully" fixing something it noticed?>