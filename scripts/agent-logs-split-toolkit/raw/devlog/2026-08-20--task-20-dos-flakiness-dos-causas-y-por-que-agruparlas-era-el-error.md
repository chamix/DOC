## 2026-08-20 — Task 20: dos flakiness, dos causas, y por qué agruparlas era el error

Task 19 dejó una duda abierta a propósito: el fixture de aislamiento
por test no bajó la tasa de fallos del suite e2e, y entre las fallas
que seguían apareciendo estaba `file-tree.spec.ts`'s "Open Folder…" —
la misma prueba que backlog.md venía registrando desde Task 17 bajo la
etiqueta "contención de recursos en paralelo". Task 20 miró esa prueba
específica de cerca, línea por línea, en vez de asumir que compartía
causa con las demás.

La causa real no tenía nada que ver con cuántos procesos Electron
corrían en simultáneo. La prueba registraba su listener
`onFolderTreeRoot` con un `window.evaluate()` que devuelve una Promise
sin awaitear, y la línea siguiente disparaba, awaiteada, el click del
menú vía `electronApp.evaluate()` — un canal de automatización
distinto (el de Electron, no CDP). Nada garantizaba que el round-trip
del listener terminara antes que el del click. Si el click ganaba la
carrera, el broadcast de `FOLDER_TREE_ROOT` salía disparado hacia cero
listeners — los eventos IPC no se re-emiten — y la promesa colgada
nunca se resolvía. Timeout de 30s, y Playwright cerrando el target a
mitad del evaluate: exactamente la falla "Target page, context or
browser has been closed" que backlog.md venía anotando.

Lo que hizo el diagnóstico fácil de confirmar es que el mismo archivo
ya tenía el patrón correcto, cuatro veces. Otras cuatro pruebas en
`file-tree.spec.ts` ya registraban su listener con un `evaluate()`
awaiteado que acumula eventos en un array, y recién después disparaban
la acción — exactamente lo que un comentario en la línea 64 del mismo
archivo ya afirmaba que "Open Folder…" hacía, sin que fuera cierto. El
fix fue literalmente copiar el patrón que ya existía al lado, no
inventar uno nuevo.

La prueba no fue una sola inyección de falla — una carrera de timing
no se reproduce de forma confiable con un solo intento. Se usó
`--repeat-each=30` en su lugar, antes y después del fix, en ambos
`--workers=4` y `--workers=2`. El código roto falló 1 de 30 veces con
el engineer, y el reviewer reprodujo la misma tasa de forma
independiente (1 de 30, revirtiendo el fix a mano) antes de aceptar
que el arreglo lo resolvía — 30/30 limpio en ambas configuraciones de
concurrencia después.

Lo que vale la pena registrar es el error de encuadre en `backlog.md`,
no solo el bug. Cuatro entradas se habían escrito asumiendo que las
tres pruebas flaky (`live-reload`, `ui-shell:67`, `file-tree`'s "Open
Folder…") compartían una sola causa — "contención de recursos
compartidos bajo paralelismo" — porque las tres mostraban el mismo
síntoma superficial (timeout intermitente bajo carga). Task 19 ya
había sembrado la duda al mostrar que el fix de aislamiento no cambió
la tasa de fallos global. Task 20 confirma que al menos una de las
tres tenía una causa completamente distinta y local a su propio
código, sin relación alguna con cuántos workers corrían. Agrupar tres
síntomas parecidos bajo una sola hipótesis, sin verificar cada uno por
separado, es exactamente el tipo de atajo que este proyecto viene
evitando desde Task 4 — y esta vez el atajo ya estaba tomado en
`backlog.md` antes de que alguien lo cuestionara.
