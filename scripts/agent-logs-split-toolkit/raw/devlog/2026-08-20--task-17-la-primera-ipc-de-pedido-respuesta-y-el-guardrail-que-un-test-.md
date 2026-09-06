## 2026-08-20 — Task 17: la primera IPC de pedido-respuesta, y el guardrail que un test no cubría

Hasta esta tarea, cada cruce IPC de md-view —en cualquier dirección—
era fire-and-forget: `ipcMain.on`/`ipcRenderer.send` para
`FILE_RENDERED`/`VIEW_SETTINGS` (main→renderer, desde Task 1) y para
`REQUEST_OPEN_FILE` (renderer→main, Task 16). Listar una carpeta no
encaja en esa forma: quien llama necesita el resultado de vuelta, no un
broadcast posterior. `listDirectory` introduce `ipcRenderer.invoke`/
`ipcMain.handle` como un segundo patrón de primera clase, no como un
reemplazo del existente — confirmado con un grep sobre todo `src/` que
`REQUEST_LIST_DIRECTORY` es, en efecto, la única ocurrencia del patrón
en el código hoy. `BridgeApi` sigue siendo el único punto de cruce
sin importar qué transporte use un método por debajo; esto no cambia
la dirección de dependencia que ADR-001 ya fijó, solo agrega una
tercera forma mecánica de cruzarla.

Lo más interesante de esta tarea no fue el patrón nuevo en sí, sino un
guardrail que casi queda sin cubrir. La especificación pide
explícitamente que `establishTreeRoot` se llame incluso cuando el
render falla — "un render fallido igual tiene un directorio contenedor
real que vale la pena tratar como raíz del árbol"— y el código lo
implementa correctamente desde la primera entrega (la llamada vive
fuera del bloque `if (message.ok)` en `renderAndWatch`). Pero ningún
test lo probaba: nada abría un archivo inexistente o no-`.md` y
verificaba que `FOLDER_TREE_ROOT` igual se emitiera. Un refactor futuro
que moviera esa llamada adentro del `if (message.ok)` habría
regresionado esto en silencio, sin que ningún test lo detectara — el
mismo patrón de falla que este proyecto viene documentando desde las
Tasks 2, 3 y 10 (el guardrail está bien implementado, pero
indocumentado por un test). El reviewer lo encontró en la revisión
independiente (finding S2, no bloqueante), el Lead decidió cerrarlo
antes de la entrega en lugar de dejarlo en el backlog dado el bajo
costo, y el engineer agregó el caso e2e faltante con su propia prueba
de fault-injection: mover la llamada de vuelta adentro del `if
(message.ok)` produjo un RED real (timeout esperando un evento que
nunca llegó), confirmado independientemente por el mismo reviewer desde
cero antes de cerrar la tarea.

Nota aparte sobre una afirmación de precedente que no se sostuvo: el
plan técnico de esta tarea decía que un DEVLOG de "primera vez" para
IPC ya existía para Task 16 (primer cruce renderer→main). El reviewer
verificó `git log -- .agents/DEVLOG.md` y esa entrada nunca se escribió
— esta es, de hecho, la primera entrada de DEVLOG desde Task 14. Vale
la pena recordar: una afirmación de precedente en una spec es una
afirmación verificable, no un hecho asumido, incluso cuando la escribe
el propio Lead.
