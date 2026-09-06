## 2026-08-20 — Task 22: pollUntilStable resolvió el síntoma que midió, y destapó uno distinto

Task 21 había dejado un número concreto sobre la mesa: `marginLeft` de
`#document-container` se asienta en 230.8px, siete veces el umbral de
32px que el check (h) de `ui-shell.spec.ts` exige — el flake nunca fue
un problema de geometría, era leer el layout antes de que terminara de
asentarse tras un `waitForTimeout(100)` fijo. Esta tarea reconstruyó
ese diagnóstico descartable de Task 21 como un helper permanente y
reutilizable (`tests/e2e/support/pollUntilStable.ts`: sondea `read()`
hasta cinco lecturas consecutivas idénticas o lanza tras 5s), con
firma exacta dictada por la spec, cubierto por pruebas unitarias
deterministas en Vitest (incluida una inyección de falla real: se
introdujo temporalmente una lectura extra tras la convergencia, la
prueba de "no over-poll" se puso roja, se confirmó, se revirtió).

Lo que valió la pena no dar por cerrado sin verificar: correr la
prueba real requerida (`--repeat-each=20`, y el suite completo 5 veces
a `workers: 2`) no dio cero fallas. Un patrón nuevo apareció — no en
`marginLeft` (check g), sino en `containerBox.width` (check h),
recibiendo valores tan bajos como 126.4 en vez de >800. En vez de
asumir que era la misma clase de flake ya explicada, se escribió otro
diagnóstico descartable (mismo estilo que el de Task 21, borrado
después de usarlo) que trazó los bounds nativos de la ventana junto
al ancho computado del DOM cuadro a cuadro. Resultado: `getBounds()`
del proceso main reporta el nuevo tamaño (1600×900) de inmediato, pero
`window.innerWidth` del renderer puede quedarse hasta ~280ms atrás
bajo carga — y como ese valor viejo es perfectamente *estable* durante
ese tramo, `pollUntilStable` puede declarar convergencia sobre el
valor equivocado antes de que el resize real llegue al renderer. Es un
mecanismo distinto al que esta tarea targeteaba (un rezago de
IPC/message-pump del lado del renderer bajo contención de procesos
concurrentes, no un reflow de layout post-resize) — cae dentro del
ítem más amplio y todavía abierto de Task 19, no algo que el alcance
de esta tarea autorizara a arreglar (la firma de `pollUntilStable` y
ambos call-sites vienen dictados verbatim por la spec). Documentado
honestamente en `backlog.md` como hallazgo nuevo, no maquillado como
un pase limpio.
