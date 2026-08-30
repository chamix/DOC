# Nota de trabajo — "El agente que nunca aprendió la Pirámide de Tests"

Material crudo para un post en technical-blog. No es el draft final — son los
hallazgos, citas y referencias reunidos durante el análisis de workflow de
`md-view`/`claude-blueprints` (agosto 2026), organizados para no perderlos.
Ángulo: metodologías de testing "de toda la vida" pasadas por el tamiz de la
codificación agéntica.

## Títulos posibles

- "El agente que nunca aprendió la Pirámide de Tests"
- "Ice-cream cone as a service: cuando tu agente de código hace exactamente lo que le dijiste, literalmente, para siempre"
- "TDD no cambió con los LLMs — lo que cambió es quién necesita que se lo digan explícito"

## La tesis en un párrafo

Un equipo humano nunca escribe en ningún lado "correr el suite completo en
cada guardado" — lo sabe tácitamente: unit en cada RGR, integración cuando
toca contrato, e2e recién antes de commit/push/PR. Un sistema de agentes
gobernado (Lead/Engineer/Reviewer + hooks determinísticos) no tiene ese
tácito: si el prompt del agente dice "run the full suite to confirm nothing
broke", el agente lo hace literalmente, en cada ciclo, para siempre, sin la
intuición de "esto es demasiado para cada edit". El costo de ese literalismo
crece con el tamaño total del suite — no con el tamaño del cambio — y en un
proyecto que crece de tarea en tarea, ese costo compuesto es exactamente el
mecanismo detrás de "una feature que antes tardaba minutos ahora tarda más
de una hora".

## La evidencia concreta (con citas reales, no parafraseadas)

**El hook que dispara en cada edit (`claude/hooks/run-tests-if-src.mjs`,
PostToolUse):**

```js
if (!rel.startsWith("src/") && !rel.startsWith("test/")) process.exit(0);
const result = spawnSync("npm", ["test", "--silent"], { ..., timeout: 110_000 });
```

`npm test` resuelve a `test:all`, que en `package.json` es literalmente
`test:unit && test:integration && test:e2e` — y `test:e2e` en sí mismo corre
`npm run build && playwright test` (recompila TODO el proyecto antes de
lanzar Playwright). Cada edit a cualquier archivo bajo `src/` paga ese costo
completo, siempre.

**Bonus hallazgo (para la narrativa: "siempre hay otro bug esperando"):** el
filtro de ese hook compara contra `test/` (singular), pero el repo real
organiza sus suites bajo `tests/` (plural) — `tests/unit`, `tests/integration`,
`tests/e2e`. Ese desajuste significa que el hook, tal como estaba, **nunca
disparó por una edición directa a un archivo de test** — solo por ediciones
bajo `src/`. Confirmado leyendo el repo real (`chamix/claude-blueprints`),
no inferido.

**De dónde sale la disciplina, en texto plano, en los propios agentes:**

- `full-stack-engineer.md`, paso REFACTOR: *"Run the full suite to confirm
  nothing broke."*
- `code-reviewer.md`, Evidence Requirement #2: *"Run the full test suite
  yourself (e.g. npm test)... Never accept the engineer's claim of passing
  tests."*

Ninguno de los dos dice "corré la capa que corresponda" — dicen "el suite
completo", sin matiz de capa ni de cadencia. Eso es exactamente lo que un
LLM ejecuta al pie de la letra.

**El crecimiento real del suite a lo largo del proyecto** (de
`DEVLOG.md`/`backlog.md`, un mismo proyecto Electron+TS, ~31 tareas
gobernadas):

| Momento | e2e | unit | integration |
|---|---|---|---|
| Scaffold | ~32 | — | — |
| Tarea 8 | 19 | 55 | 7 |
| Tarea 16 | 31 | 75 | 11 |
| Tarea 27 | 67 | 96 | 19 |
| Tarea 31 | 93 | 99 | 19 |

La capa más cara (e2e, un proceso Electron/Chromium completo por test) creció
~8x; la más barata (unit) creció ~3x. Exactamente la capa que el equipo
humano reservaría para el final es la que más creció en frecuencia efectiva
de ejecución.

**El costo medido, no estimado:** con datos reales de `RUN_LOG.md` (tokens y
wall-clock de subagente por tarea, CLEAR-lite), el promedio de la segunda
mitad del proyecto (~291k tokens / ~34.6 min) es +44%/+50% sobre la primera
mitad (~202.5k tokens / ~23.1 min) — y los picos individuales (tareas de
layout con más superficie afectada) llegan a 2-3x el promedio temprano. Una
tarea llegó a chocar contra un límite de gasto de API a mitad de ejecución.

## El armazón conceptual (para no reinventar la rueda — citar bien)

- **Test Pyramid** — Mike Cohn, *Succeeding with Agile* (2009). Muchos tests
  rápidos en la base, capas más lentas y caras hacia arriba, en menor
  cantidad y con menor frecuencia de ejecución.
- **"Ice-cream cone" anti-pattern** — la inversión de la pirámide: pocos
  tests rápidos, muchos tests lentos/e2e ejecutados con la misma frecuencia
  que los rápidos. Es justo lo que este hook hacía sin querer.
- **Test Impact Analysis (TIA)** — productizado por Microsoft en Azure
  DevOps/Visual Studio: mapea cambios de código al subconjunto mínimo de
  tests que los ejercitan, usando datos de cobertura runtime.
- **Predictive Test Selection** — Meta/Facebook, publicado en ISSTA/FSE
  2018-19: selección de tests vía modelos entrenados sobre historial de
  fallas, no solo cobertura estática.
- **Tooling de selección por "affected"** — `nx affected` (Nx), Turborepo,
  Bazel's test selection, y el propio Playwright con `--only-changed`
  (basado en git diff).
- **Feedback loop rápido** — la raíz XP/Kent Beck: el valor de TDD depende
  de que el ciclo RED-GREEN-REFACTOR sea rápido; un ciclo que carga con el
  costo de la capa e2e deja de ser TDD real y pasa a ser "corré todo y esperá".

## El giro genAI (esto es lo que hace el post distinto de "acordate de la pirámide de tests")

Un ingeniero senior no necesita que le escriban "no corras e2e en cada
save" — lo sabe porque internalizó el costo/beneficio con los años. Un
agente no tiene esa internalización: ejecuta literalmente la instrucción
que tiene enfrente, sin el margen de "che, esto es demasiado para un
keystroke". La consecuencia práctica para cualquiera diseñando pipelines de
desarrollo agéntico: la disciplina de testing por capas no es algo que el
agente vaya a inferir del contexto — tiene que estar **codificada
explícitamente**, tanto en el prompt/persona (qué corre en qué paso) como en
el hook determinístico (qué se dispara automáticamente y con qué alcance).
Lo "tácito" del desarrollador senior tiene que volverse texto explícito y,
donde se pueda, código — o el agente, con la mejor de las intenciones,
literalmente re-descubre el anti-patrón ice-cream-cone por aplicación
consistente y disciplinada de una instrucción mal calibrada.

## Para verificar antes de publicar (no asumir)

- Medir `npm run test:unit`/`test:integration`/`test:e2e` reales en HEAD
  (tiempo de pared) para poner un número real al "antes/después" de este
  cambio — no solo la lógica.
- Confirmar en la próxima sesión de `md-view` si el nuevo hook + los agent
  files editados efectivamente bajan el costo/tiempo por tarea en `RUN_LOG.md`
  — esto es un dato que se puede medir con la misma disciplina CLEAR-lite que
  el proyecto ya usa, cerrando el loop de la propia metodología del post.
- Sería honesto mencionar el precedente ya existente: `playwright.config.ts`
  ya tiene `workers: 2` (no el default), con un comentario citando
  exactamente el hallazgo de la Tarea 19 — es evidencia de que el propio
  sistema ya había aplicado una mitigación empírica una vez; el post puede
  usarlo como "esto no es la primera vez que el proceso se corrige a sí
  mismo con datos reales", reforzando el ángulo de disciplina científica
  más que "todo estaba roto".
