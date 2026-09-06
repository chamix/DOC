## 2026-08-20 — Task 18: dos APIs de realpath, probadas antes de elegir, no asumidas

`establishTreeRoot` (Task 17) comparaba raíces de árbol por igualdad
cruda de string. En un filesystem case-insensitive —Windows, esta
máquina de desarrollo, y también macOS/APFS por default— la misma
carpeta real puede llegar como dos strings distintos según cómo se
abrió: el casing que devuelve `dialog.showOpenDialog` no es
necesariamente el mismo que produce `path.dirname()` sobre un archivo
abierto por drag-and-drop o argv. El guard fallaba en reconocerlos como
la misma raíz, causando un re-listado y re-broadcast espurio de
`FOLDER_TREE_ROOT` — un usuario real podía dispararlo con solo abrir un
archivo de dos maneras distintas desde la misma carpeta. El gap estaba
ausente de la spec de Task 17, de la implementación, y de las dos
rondas de revisión independiente; solo apareció al investigarlo
explícitamente para esta tarea.

La resolución en sí es de una línea (`fs.realpath` antes de comparar/
guardar/emitir, con fallback al path crudo si la canonicalización
falla). Lo que vale la pena registrar es el paso previo: existen dos
APIs de Node para esto, `fs.promises.realpath` y `fs.realpath.native`
(esta última solo por callback, sin variante `fs.promises` documentada),
y no están garantizadas intercambiables respecto a preservación de
casing en Windows entre versiones de Node. En vez de asumir cuál
"debería" funcionar, el engineer corrió un probe descartable
comparando ambas contra un path real en mayúsculas — ambas devolvieron
el casing correcto en esta máquina (Node v24.15.0) — y el reviewer
reprodujo el mismo probe de forma independiente antes de aceptar la
elección. Se optó por `fs.promises.realpath` por no requerir el
wrapping extra de `util.promisify`, no porque fuera la única opción
válida. Misma disciplina que la confirmación de `removeMenu()` en Task
15 y el chequeo de existencia de los CSS de tema en Task 6: verificar
en la máquina real antes de comprometerse, no confiar en qué API
"suena" correcta.

Un solo ciclo RGR, verde a la primera. FI-5 (revertir el fix, confirmar
RED con dos broadcasts de casing distinto, restaurar, confirmar GREEN)
reproducido de forma independiente por el reviewer desde cero, no solo
leído del reporte del engineer. `renderAndWatch`/`openFolderViaDialog`
quedaron con diff cero — la resolución vive enteramente adentro de
`establishTreeRoot`, tal como pedía la spec.
