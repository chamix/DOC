## 2026-08-20 — Task 21: el sidebar del árbol, y por qué la aritmética antes de asumir importa

Task 21 fue la primera pieza de UI real construida sobre el backend
del árbol de archivos que Task 17 dejó listo sin consumidor. Nada
sorprendente en el mecanismo en sí — un panel lateral, expansión
perezosa con caché por carpeta, click para abrir reusando el canal
IPC que ya existía. Lo interesante pasó en dos lugares donde el
proceso podría haber aceptado una explicación plausible sin verificarla,
y no lo hizo.

El primero: la técnica de prueba por fault-injection que la spec
proponía para el guardrail de caché (`require()` del módulo main ya
corriendo, desde adentro de `electronApp.evaluate()`, para interceptar
el handler real) simplemente no funcionaba en esta combinación de
Electron/Playwright — `require` y `module` no existen en ese contexto
de evaluación, que corre como eval global, no como cuerpo de un módulo
CommonJS. El engineer no forzó la técnica documentada a como diera
lugar ni inventó un mock; encontró que `ipcMain._invokeHandlers` (un
Map interno, no documentado) ya contiene el handler real registrado, y
lo usó para interceptar sin reemplazar la lógica de producción. Riesgo
real — un upgrade de Electron podría romper esto en silencio — pero
el reviewer lo verificó en vivo, confirmó que el handler capturado es
literalmente el mismo closure que corre en producción (no una
reimplementación), y hasta escribió una prueba descartable propia para
cubrir el caso de carpeta vacía que el suite entregado no ejercitaba.
Riesgo documentado en backlog, no ignorado ni bloqueante.

El segundo, más interesante: el engineer reportó honestamente que
agregar el sidebar parecía aumentar la tasa de flakiness de una
aserción ya conocida (`ui-shell.spec.ts`, `marginLeft > 32`, la misma
que Task 19 ya había dejado abierta y sin explicar). Antes de aceptar
esa correlación como causal, se hizo la aritmética: a 1600px de ancho
de ventana, `max-width: 54rem` del `#document-container` limita su
ancho a ~864px sin importar si el sidebar de 260px está presente o no
— el espacio disponible sobra en ambos casos por un margen enorme. Si
la geometría no cambia sustancialmente, la explicación más simple no
es "el sidebar rompió el layout", es "hay más tests en el suite ahora,
por lo tanto más procesos Electron compitiendo por recursos al mismo
tiempo" — exactamente el mecanismo de contención que Task 19 ya había
identificado como la causa más probable de la clase de fallas por
crash, sin resolver. El reviewer no se conformó con la aritmética
como argumento — escribió una prueba descartable que espera hasta que
el layout se asiente de verdad (polling en vez del `waitForTimeout(100)`
fijo del test original) y midió el valor real: `marginLeft` se
asienta en 230.8px, siete veces el umbral. La aritmética tenía razón,
y ahora hay un número real que lo respalda, no solo una conjetura.

Ninguno de los dos hallazgos bloqueó la entrega — ambos quedaron
documentados en backlog.md con la evidencia que los respalda, no como
afirmaciones sueltas. Lo que vale la pena registrar es el patrón: una
spec puede prescribir una técnica que resulta no funcionar en la
práctica, y un hallazgo puede parecer causal sin serlo — en ambos
casos, la respuesta correcta fue medir antes de aceptar, no descartar
la spec original ni la correlación reportada sin verificar primero.
