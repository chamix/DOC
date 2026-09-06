## 2026-08-15 — El fault-injection que sí encontró algo

Task 13 (ícono de la app en dev) traía un check de fault-injection
casi de rutina: renombrar `build/icon.png`, empaquetar, confirmar que
aparece el warning "application icon is not set" de electron-builder,
restaurar, confirmar que desaparece. El brief lo describía como algo
que "ya debería pasar" — no para probar código nuevo, sino para
detectar un typo de directorio. Bajé las expectativas en consecuencia.

No apareció ningún warning, ni con el ícono ni sin él. Empaqueté los
dos casos (`electron-builder --dir --win`) y comparé el `.exe`
resultante por SHA-256: idéntico byte a byte. El ícono nunca se
estaba embebiendo, con o sin `build/icon.png` presente.

La causa: la convención de electron-builder para el target win32 pide
`build/icon.ico`, no `.png`. `build/` solo tenía el set de PNGs (que sí
cubre macOS/Linux), nunca un `.ico`. El supuesto del brief —
"packaging ya funciona por convención, no hace falta tocar
electron-builder.yml" — era cierto para el copy step de dev-mode
(alcance real de esta tarea) pero falso para el build empaquetado de
Windows, que quedaba fuera de alcance y por lo tanto nunca se había
verificado con un build real hasta hoy.

Nada de esto formaba parte del diff de Task 13 — el ícono empaquetado
estaba explícitamente fuera de alcance, así que quedó anotado en el
backlog en vez de arreglado. Lo que vale la pena registrar es que el
check "de rutina" cumplió exactamente la función para la que estaba
pensado: no asumir que un precondition declarado en el brief es
cierto solo porque suena razonable, verificarlo con una corrida real.
