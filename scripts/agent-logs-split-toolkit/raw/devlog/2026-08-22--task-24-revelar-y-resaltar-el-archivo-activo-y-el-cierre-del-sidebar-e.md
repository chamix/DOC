## 2026-08-22 — Task 24: revelar y resaltar el archivo activo, y el cierre del sidebar en tres partes

Task 24 agrega lo último que le faltaba al sidebar del árbol: cuando el
archivo activo cambia (o el root del árbol cambia mientras un archivo ya
está abierto), el panel expande automáticamente las carpetas necesarias y
resalta la fila correspondiente con `.tree-row-active`. Mecánicamente es
una función nueva (`revealAndHighlight`), un helper puro (`isPathUnder`,
separador-consciente para no confundir `/foo/bar2` con hijo de `/foo/bar`),
y un token incremental que descarta el resultado de un walk asíncrono si
otro más nuevo ya lo superó mientras esperaba un `await`. Con esto se
cierra el plan de tres partes para el sidebar que arrancó en Task 21
(árbol perezoso con caché), siguió en Task 23 (resize) y termina acá —
vale la pena marcarlo explícitamente como el proyecto ya hizo con el
checkpoint de empaquetado de Task 13/14.

Lo no obvio: `establishTreeRoot` (Task 17/18) recalcula el root del árbol
como el directorio padre de *cualquier* archivo recién abierto, sin
excepción — tree-click, File>Open, drag-and-drop y argv pasan todos por
el mismo `renderAndWatch`. Eso significa que abrir un archivo nunca deja
ese archivo anidado más de un nivel bajo el root resultante: por
construcción, termina siendo hijo directo. El único camino real para que
el walk de auto-expand tenga que atravesar más de un nivel es el orden
inverso — un archivo ya está activo, y *después* Open Folder… apunta el
root a una carpeta ancestro (que nunca toca `activeFilePath`). Los tests
de este task (y la prueba FI-1 de la condición de carrera) están
construidos sobre esa secuencia específica, no sobre "abrir el archivo
anidado directamente", porque esa segunda opción, tal como está hecho hoy
el establecimiento del root, no produce el escenario multi-nivel que la
spec describe.
