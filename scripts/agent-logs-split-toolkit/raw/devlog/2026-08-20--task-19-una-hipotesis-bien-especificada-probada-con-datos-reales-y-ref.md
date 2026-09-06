## 2026-08-20 — Task 19: una hipótesis bien especificada, probada con datos reales, y refutada

Cuatro entradas de backlog venían acumulando la misma sospecha: el
suite e2e es flaky bajo los 4 workers por defecto, y probablemente por
contención de recursos porque los 43 (en realidad 40, corregido al
grep) `electron.launch()` del suite comparten el mismo `userDataDir`
por defecto de Electron. La hipótesis era razonable, estaba bien
argumentada, y la decisión de arreglarla con un fixture nativo de
Playwright (`test.extend`, no un helper manual) ya estaba tomada antes
de escribir código, precisamente por la garantía de teardown que
Playwright ofrece incluso cuando un test explota a mitad de camino.

Se construyó el fixture, se migraron los 40 call sites, el reviewer
independiente lo aprobó sin bloqueantes (byte a byte contra el diseño
autoritativo, FI-1 reproducido de forma independiente: cero directorios
temporales huérfanos incluso con un test forzado a fallar). Todo el
proceso funcionó exactamente como debía.

Y el fix no cambió nada. Baseline: 8/12 corridas limpias, 4/12 con
fallo. Post-fix: 8/12 limpias, 4/12 con fallo. Mismo número exacto.
Peor todavía: las dos fallas de tipo crash de proceso (Windows
`code=3221226505`, un fastfail, no un timeout) que aparecieron en el
baseline sobre dos tests, reaparecieron post-fix sobre otros dos tests
completamente distintos — cuatro tests distintos en cuatro ocurrencias
a lo largo de 24 corridas totales. Si la causa fuera contención por
perfil compartido, aislar el perfil debería haber parado esto. Que
siga cayendo en un test al azar, ya aislado el perfil, apunta más bien
a presión de recursos crudos (CPU/memoria/handles) de correr 4 procesos
Electron/Chromium completos en simultáneo en esta máquina — algo que el
aislamiento de `userDataDir` nunca podía tocar.

Nada de esto se guardó silenciosamente. La spec (Step 1) ya declaraba
que la comparación de 12 corridas era la evidencia primaria, no una
formalidad, y que un resultado sin mejora significaba parar y reportar
en vez de adivinar una segunda hipótesis (bajar `workers`, agregar
delays). Eso es exactamente lo que pasó: se reportó el hallazgo
completo al usuario, incluyendo que la falla dominante seguía sin
explicación, y se dejó la decisión de cómo seguir en sus manos en vez
de escalar por cuenta propia. El fixture se queda igual — es una
mejora real de por sí (DRY, teardown garantizado, sin duplicar
`childEnv` catorce veces) — pero las tres entradas de backlog siguen
`[Pending]`, no `[Resolved]`, porque la causa real de la flakiness
sigue sin identificarse.
