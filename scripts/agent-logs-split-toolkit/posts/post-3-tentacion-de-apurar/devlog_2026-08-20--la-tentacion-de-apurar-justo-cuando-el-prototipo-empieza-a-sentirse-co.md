## 2026-08-20 — La tentación de apurar, justo cuando el prototipo empieza a sentirse como un producto

A mitad de Task 22 surgieron preguntas operativas legítimas: ¿por qué
el reviewer vuelve a correr lo que el engineer ya corrió, si no hubo
cambios en el medio? ¿No se está poniendo pesado el ciclo de e2e? La
respuesta a la primera ya tenía precedente propio en este mismo
proyecto — el hallazgo S1 de Task 21 (el caso de carpeta vacía que el
suite entregado nunca cubrió) y el claim de casing de Task 20 nunca
reproducido por dos reviewers independientes en dos tareas distintas
— existen específicamente porque alguien re-verificó en vez de confiar
en el reporte. Re-leer no atrapa lo que el propio autor no vio para
empezar.

Pero hubo una segunda capa, más honesta, debajo de la pregunta: el
impulso de aligerar la verificación apareció en un momento muy
específico — justo cuando la app empezó a sentirse fluida, tangible,
"cerca de estar lista" — y casi se justificó solo. Nombrarlo tal cual
es lo que vale: no es un defecto de carácter, es la dinámica humana más
predecible que existe frente a un prototipo que empieza a andar.

Lo que lo frenó fue recordar el propósito real, doble, de este
proyecto: no es solo shippear md-view — es también material crudo para
comparar enfoques de desarrollo agéntico. Bajo ese propósito, la
verificación pesada por tarea no es overhead sobre "el entregable de
verdad" — es uno de los dos entregables. Aligerarla por velocidad no es
una optimización gratis, es un trade-off real contra un objetivo
explícito del proyecto, no contra nada.

Lo que salió de la conversación no fue "no cambiar nada" — apareció un
ajuste legítimo, ya presente a medias sin estar declarado: el peso de
la verificación debería escalar con el radio de impacto real del
cambio, no aplicarse parejo siempre. Tasks 17/18/20/22 (backend puro,
sin tocar el renderer compartido) nunca necesitaron correr el suite
completo siete veces — eso fue específicamente Task 21, porque tocó
layout compartido, exactamente la clase de cambio con blast radius
impredecible. Formalizar esa distinción es una mejora real, compatible
con el propósito doble, no una concesión a la impaciencia.

Vale la pena nombrar el paralelo: es la misma disciplina de "verificar
antes de asumir" que este proyecto ya viene aplicando a los subagentes
y a las propias afirmaciones del Lead (Task 8, Task 21) — aplicada una
vez más, esta vez al propio impulso de apurar, atrapado por quien lo
tuvo, no por otro.
