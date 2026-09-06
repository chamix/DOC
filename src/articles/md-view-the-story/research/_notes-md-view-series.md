# md-view — Bitácora de diseño de la serie "The Story"

> Registro de decisiones de arquitectura editorial para la serie sobre el desarrollo de md-view. Este archivo documenta *cómo* se construyó la serie, sesión por sesión. El trabajo de investigación y redacción de cada post individual vive en su propio `_notes-md-view-series-N.md`.

---

## Sesión 1 — Arquitectura y decisiones de conjunto

**Fecha:** 2026-09-06

### Contexto

La serie documenta el desarrollo completo de md-view (app de escritorio), construida de punta a punta bajo un sistema de gobernanza de agentes de IA (Lead + full-stack-engineer + code-reviewer + hooks), a lo largo de 5 semanas y 35 tareas (2026-07-31 → 2026-09). Fuentes fundacionales: nota de handoff del proyecto, `RUN_LOG.md`, `DEVLOG.md`, `backlog.md`, `functional_domain.md`, `initial_scaffold.md`, 6 ADRs y 33 reportes de revisión independientes (uno por tarea).

### Decisiones de conjunto

1. **Workflow de producción.** Esta conversación (diseño) queda separada de la redacción de cada post. Cada post, o clúster de posts muy relacionados, se escribe en su propia conversación nueva, con su propio archivo de notas `_notes-md-view-series-N.md`. Motivo: el corpus crudo pesa ~1.3 MB (~300k+ tokens), muy por encima de lo conveniente para mantener junto con la redacción iterativa de varios artículos en una sola conversación.
2. **Punto de partida.** La serie abre con una mención más desarrollada que un párrafo — pero sin repetir en profundidad — de la génesis Antigravity → claude-blueprints → json-mapper, con link directo a "Raise the Level of Abstraction" (ART-003) para quien quiera el detalle técnico completo de json-mapper.
3. **Audiencia.** Mixta: varía por post según el ángulo (detalle en la tabla de abajo).
4. **Armazón narrativo.** Cronológico, arco Día 0 → v1.0.
5. **Convención de archivos.** Este archivo se versiona en el repo `DOC`. Las notas internas de trabajo de cada sesión de escritura (investigación cruda, iteraciones de borrador) no van acá — viven localmente en `notes/_notes-*-local.md`, fuera del repo.
6. **Cantidad de posts.** 6 confirmados, 1 candidato a bonus sin numerar (ver abajo). Se decide sobre la marcha si el bonus entra a la serie numerada o queda aparte.

### Estructura de la serie

| # | Título de trabajo | Ancla temporal | Audiencia | Tesis | Fuentes primarias | Tags |
|---|---|---|---|---|---|---|
| 1 | Apertura + Día 0 | 2026-07-31/08-01 (Task 1, 4) | General Tech-Savvy | La gobernanza tuvo su primer bug antes que el producto; nace "Verify, don't restate" | `RUN_LOG.md` filas Task 1 y Task 4; handoff §1, §4 | `ai` `genai` `architecture` `case-study` |
| 2 | El reviewer que casi se come su propia revisión | 2026-08-15 (Task 14) | Technical Peers | Un subagente "read-only" con Bash real descarta 58 líneas ajenas por accidente, se autodetecta y se recupera | `RUN_LOG.md` fila Task 14; `review_report_task14.md` | `ai` `genai` `governance` `security` `case-study` |
| 3 | La tentación de saltarse un paso | ~2026-08-20 (near-miss) | Business/Leadership | El instinto de saltear una recorrida de e2e "para ir más rápido" — y por qué no | `DEVLOG.md` línea 40 | `ai` `genai` `leadership` `case-study` `opinion` |
| 4 | El bug que sobrevivió a nueve revisiones | 2026-08-22 (Task 24, 25) | General Tech-Savvy | Trust-but-verify por partida doble: el reviewer que mide en vez de creer, y el bug que ninguna suite automatizada vio | `DEVLOG.md` líneas 483, 513; `review_report_task24.md`, `review_report_task25.md` | `ai` `genai` `case-study` `opinion` |
| 5 | Un flag, tres regresiones | 2026-08-24 (Task 29-31) | Technical Peers | `frame: false` rompe dos features no relacionados; nadie lo predijo desde el spec original | `DEVLOG.md` líneas 757, 833, 932; `review_report_task29.md`, `task30.md`, `task31.md` | `ai` `genai` `frontend` `architecture` `case-study` |
| 6 | Cierre: cuando el que revisa necesita revisión | 2026-09 (Task 35) | General Tech-Savvy | El Lead comete el error exacto que el proyecto existe para atrapar; el reviewer lo atrapa pero se equivoca en otra cosa; el RUN_LOG documenta recursivamente su propio error | `backlog.md` (entrada `[Resolved 2026-08-15]` sobre `icon.ico`); handoff §4 | `ai` `genai` `governance` `case-study` |

**Candidato a bonus (sin numerar):** "Gobernar la gobernanza" — por qué `claude-blueprints` no se sometió a su propio TDD al construir el hook. Technical Peers. A decidir si entra como 7mo post numerado o queda como nota al pie del Post 2.

### Reservado / fuera de alcance de esta serie

- "El 2% que importa" (human-in-the-loop) — workstream de artículo independiente; no se mezcla contenido acá.
- Gancho de El Chapulín Colorado — sigue sin artículo asignado.

### Pendientes de verificación

- **Post 2:** la nota de handoff atribuye el hook `guard-destructive-git.mjs` a "ADR-005". El ADR-005 de este bundle (`ADR-005_md-view.md`) es en realidad sobre la ventana sin marco (Task 29). El ADR real del hook vive en `claude-blueprints`, fuera de este corpus — confirmar antes de citarlo.
- **Post 6:** no existe `review_report_task35.md` en el bundle entregado, ni fila de Task 35 explícita en `RUN_LOG.md` más allá de la mención narrativa en la nota de handoff. Confirmar contra el estado actual del repo en GitHub (`RUN_LOG.md`, `CHANGELOG.md`, `README.md`) antes de redactar.

### Feedback de Camilo — sesión 1

- De acuerdo con el workflow híbrido: esta conversación para diseño, una conversación por post (o clúster) para redacción.
- De acuerdo con la serie de 6 posts propuesta; el conteo final (6 vs. 7, con el bonus) se decide sobre la marcha a medida que avancemos.
- De acuerdo con el punto de partida en json-mapper/Antigravity, con mención desarrollada pero sin repetir la profundidad ya cubierta en ART-003.

---

## Changelog de esta bitácora

| Fecha | Cambio |
|---|---|
| 2026-09-06 | Sesión 1: arquitectura inicial de la serie, decisiones de conjunto, mapeo de 6 posts a fuentes. |
