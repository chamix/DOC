## 2026-08-08 — La hipótesis que estaba en el backlog, y estaba mal

Task 8 dejó una hipótesis anotada en el backlog: el texto se veía negro
sobre fondo oscuro en Dark Mode porque el link `.disabled` del stylesheet
claro no se estaba desactivando, o porque el orden/especificidad dejaba
ganar su regla de color por sobre la del oscuro. Sonaba razonable. Estaba
mal.

La causa real no tenía nada que ver con specificity: Chromium no hace
fetch de un `<link rel="stylesheet" disabled>` hasta que se habilita — así
que los dos stylesheets oscuros nunca se descargaban al arrancar. Para
cuando alguien abría un archivo y prendía Dark Mode, el `<base href>`
dinámico de Task 4 (pensado para resolver imágenes relativas del
contenido) ya apuntaba a la carpeta del archivo abierto, no a
`dist/renderer/`. El navegador buscaba `./github-markdown-dark.css` en el
lugar equivocado, 404, y el texto caía al negro por defecto del browser —
dos features de tareas distintas, cada una correcta por separado,
interactuando mal.

Lo interesante no es solo que la hipótesis original estuviera mal — es
que el primer intento de diagnosticarlo en esta misma sesión también
falló, y por una razón parecida: un test rápido que togglaba Dark Mode
antes de esperar a que el archivo terminara de renderizar, así que el
`<base href>` todavía no se había movido. "No se reproduce" fue un falso
negativo, no una conclusión. Recién con el mismo archivo real, esperando
el render completo, e inspeccionando el DOM en vivo, apareció el
`net::ERR_FILE_NOT_FOUND` real — la misma disciplina de "no asumas la
causa, verificá" que este proyecto ya venía aplicando a los subagentes,
aplicada ahora al propio Lead, con el mismo resultado: corrigió una
lectura apurada antes de que se convirtiera en un fix equivocado.

Fix: los cuatro hrefs de tema se resuelven a URLs absolutas una sola vez,
capturadas antes de que exista la posibilidad de abrir un archivo —
inmune a cualquier cambio futuro de `<base href>`. El reviewer reprodujo
la prueba de fault-injection en tres variantes aisladas antes de aceptar
el fix. Segunda vez consecutiva con Pass en el primer intento (Task 8 →
Task 9).
