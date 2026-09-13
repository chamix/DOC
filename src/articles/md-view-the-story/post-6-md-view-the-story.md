---
title: "El día en que md-view dejó de ser solo mío"
description: "En la tarea que empaquetó el release, el propio Lead cometió el error que el proyecto existe para atrapar — y hasta el reviewer que lo atrapó tuvo que ser revisado."
publishDate: 2026-XX-XX
tags: ["ai", "genai", "architecture", "devops", "case-study"]
layout: medium-editorial.njk
series: "md-view app: de 0 a release con agentic AI"
seriesPart: 6
---

*[Sugerencia de imagen de cabecera: mismo estilo diorama de juguete luminoso de la serie — una pequeña caja de regalo saliendo de una cinta transportadora de juguete hacia una puerta abierta, dejando atrás el taller a oscuras. Sin marca de agua, sin texto.]*

# El día en que md-view dejó de ser solo mío

*por Camilo — [fecha] · [LinkedIn](https://www.linkedin.com/in/ernestocamilovera/)*

### En la tarea que empaquetó el release, el propio Lead cometió el error que el proyecto existe para atrapar — y hasta el reviewer que lo atrapó tuvo que ser revisado.

Durante treinta y cuatro tareas, md-view existió para una sola persona. Yo lo abría, yo lo probaba, yo decidía si un color de fondo se veía bien en modo oscuro. El Lead —mi socio de pensamiento en este proyecto, el que escribe los prompts de delegación y evalúa lo que vuelve— y los subagentes que hacen el trabajo real en Claude Code existían para servir esa audiencia de una sola persona.

La tarea 35 rompió eso. No agregó una función nueva a la lista. Convirtió md-view en algo que cualquiera puede bajar, instalar y usar sin saber que existo. Ese cambio de escala —de "funciona en mi máquina" a "funciona en la máquina de un desconocido"— resultó ser un tipo de trabajo genuinamente distinto al de construir features, y trajo consigo un capítulo que vale la pena cerrar la serie contándolo completo, con sus partes incómodas incluidas.

## Dos decisiones, treinta segundos, cero ceremonia

Antes de tocar un solo archivo, aparecieron dos preguntas genuinas que no tenía sentido delegar a nadie: ¿dónde debía correr el build de Windows —en mi máquina con una carga manual, o en un runner de GitHub Actions disparado por un tag de versión?— y ¿qué debía publicarse: un instalador NSIS tradicional, un `.exe` portable sin instalación, o ambos?

Elegí Actions, por reproducibilidad y por no depender de mi notebook. Elegí ambos formatos. Ninguna de las dos decisiones necesitó debate ni una tanda de tests que las respaldara — un par de opciones sobre la mesa, una elección, y a seguir. Vale la pena decirlo explícitamente porque es fácil idealizar un proceso riguroso como uno donde todo se delibera: la disciplina de este proyecto no consiste en tratar cada decisión como si fuera crítica, sino en distinguir cuáles sí lo son.

## Cuándo no usar la maquinaria pesada

El resto de la tarea 35 —la configuración de `electron-builder.yml` para el target de Windows y el workflow de GitHub Actions disparado por tag— tampoco pasó por el circuito habitual. En todas las tareas anteriores, el patrón fue el mismo: el Lead escribe un prompt de delegación, `full-stack-engineer` implementa, `code-reviewer` verifica de forma independiente, el Lead evalúa. Acá no. El Lead escribió esos archivos de configuración directamente, en conversación conmigo, y yo los apliqué sin que ningún subagente los tocara.

No fue un atajo. Fue una decisión consciente, con un precedente propio: cuando `claude-blueprints` —el repositorio que define toda esta maquinaria de gobernanza— construyó su propio hook `guard-destructive-git.mjs`, la razón para no someterlo al mismo ciclo de TDD y revisión fue que ese ciclo existe para producir comportamiento verificable en código de aplicación, y aplicarlo a un puñado de archivos de configuración estática sin lógica testeable resuelve un problema que ese tipo de archivo no tiene. La misma lógica aplicó acá: un YAML que describe un target de Windows no se beneficia de un ciclo de code review. Reconocer cuándo el proceso pesado es la herramienta equivocada, y decirlo en voz alta en lugar de aplicarlo por reflejo, es tan parte de la disciplina de este proyecto como aplicarlo en todos los demás casos.

Ese mismo buen criterio es, también, la ironía que viene después.

## El error que el proyecto existe para atrapar

Mientras evaluaba qué le faltaba al repositorio para un release limpio, el Lead me dijo que si hacía falta un ícono específico de Windows (`build/icon.ico`) era "una pregunta abierta" en el backlog del proyecto. Sobre esa base, generó el archivo y lo hice commitear.

No era una pregunta abierta. El backlog ya tenía una entrada resuelta, semanas atrás, respaldada por una prueba real: un empaquetado de Windows completo había confirmado que la app mostraba el ícono correcto en el explorador, la barra de tareas y la aplicación instalada, sin necesidad de ningún `.ico` dedicado. La afirmación del Lead no vino de leer el archivo. Vino de confiar en un recuerdo aproximado de lo que probablemente decía. Es exactamente el atajo que el principio central de este proyecto —verificar contra la fuente real, no repetir un recuerdo de ella— existe para impedir. Y esta vez, quien lo cometió fue la misma instancia que normalmente se lo señala a todos los demás.

## Cuando el que revisa también necesita que lo revisen

El error no se descubrió de inmediato ni de forma prolija. Un reviewer independiente, revisando la exactitud del `CHANGELOG.md` recién creado, encontró una inconsistencia que a primera vista no tenía nada que ver con el ícono —y que solo tuvo sentido una vez que alguien leyó, de verdad, la entrada real del backlog. A partir de ahí, todo lo que dependía del error salió: el archivo `.ico` innecesario, la línea de configuración que lo referenciaba en `electron-builder.yml`, el bullet del changelog que describía un arreglo que nunca existió. Todo revertido, todo documentado.

Lo interesante no es que hubo un error. Es que el sistema no se diseñó para que "el Lead tenga razón y les corrija los errores a los subagentes" — se diseñó para que todo se verifique contra la fuente real, incluido el Lead, incluso cuando resulta incómodo. Esta fue la primera vez en la vida del proyecto en que esa disciplina tuvo que aplicarse a quien normalmente la aplica sobre todos los demás. Y funcionó. Eso es una prueba más sólida de que la práctica es real que otra revisión limpia de un subagente cualquiera.

Hay todavía una capa más. El mismo reporte del reviewer que atrapó el error del ícono contenía, a su vez, una afirmación equivocada: que `package.json` seguía en la versión `0.1.0`, cuando ya estaba en `1.0.0`. La explicación más probable —aunque no confirmada— es que el reviewer confundió ese archivo con `package-lock.json`, cuyo campo de versión sí había quedado congelado en un valor viejo desde el scaffolding inicial del proyecto. No lo doy por hecho porque no se verificó más a fondo; lo dejo anotado como lo que es, una hipótesis razonable y no una conclusión. Lo que sí es un hecho es cómo se resolvió: volviendo al repositorio en vivo una vez más, en lugar de darle al reporte del reviewer el mismo trato de verdad automática que el Lead le había dado, minutos antes, a su propio recuerdo del backlog.

Dos errores, dos capas distintas, el mismo método para atraparlos ambos.

## Escribir el propio error en un registro que no se puede borrar

El `RUN_LOG` de este proyecto es de solo-agregado por diseño: las correcciones son filas nuevas, nunca ediciones retroactivas, precisamente para que el registro no pueda retocarse en silencio. La entrada de la tarea 35 usa esa permanencia para documentar el error del propio Lead, atribuido explícitamente al Lead y no a ningún subagente — siguiendo una regla que el proyecto se había dado a sí mismo mucho antes de que este incidente ocurriera: un defecto de especificación o de recomendación pertenece a quien lo hizo, no a quien lo ejecutó.

Mecánicamente es poca cosa: una fila más en una tabla. Pero es la respuesta más concreta que puedo dar a una pregunta que vale la pena hacerse en serio: ¿cómo se ve, en la práctica, un proceso que dice valorar atrapar errores por sobre esconderlos? Se ve así. El error queda con una línea permanente, atribuida, imposible de borrar, en el mismo archivo que registra todo lo demás.

## De un check verde a una descarga pública

Una vez corregido todo, publicar fue casi anticlimático — y eso, después de todo lo anterior, es en sí mismo un buen final. Un push del tag `v1.0.0` disparó el workflow de GitHub Actions automáticamente. Corrió sin supervisión en un runner `windows-latest`, terminó en menos de dos minutos y volvió en verde, con una única advertencia de deprecación inofensiva sobre la migración del propio runtime de Node.js de GitHub, sin relación alguna con el código del proyecto.

`electron-builder` publicó directo a un GitHub Release — como **borrador**, por diseño: una red de seguridad que permitió inspeccionar los artefactos reales, un instalador NSIS y un `.exe` portable de unos 79 MB cada uno (normal para un runtime de Chromium empaquetado), antes de que nadie más pudiera verlos. El último paso real fue reescribir el `CHANGELOG.md` interno y orientado al proceso en notas de release pensadas para alguien que nunca vio una fila de este `RUN_LOG` y solo quiere saber si vale la pena instalar la app. Los mismos hechos, otra audiencia. Después: publicar.

Fue, hasta donde tengo registro, el primer release con tag y el primer `CHANGELOG.md` que tuvo este repositorio en su historia.

## El principio, aplicado una última vez sobre sí mismo

El primer día de este proyecto, antes de que md-view tuviera una sola función, la gobernanza ya se había roto: dos hooks fallaban silenciosamente antes de que existiera código de producto al que proteger. De ahí nació, unas tareas después, "verificar, no repetir" — la idea de que un test que pasa no es prueba de nada hasta que uno intentó, a propósito, hacerlo fallar de la manera correcta.

La tarea que cerró la serie aplicó ese mismo principio una vez más, pero sobre un sujeto distinto a todos los anteriores: no un test, no un subagente, no un hook — el propio Lead. Y el hecho de que haya hecho falta aplicarlo ahí también, justo en la tarea que hizo público todo lo construido hasta ese punto, es un cierre más honesto que cualquier historia de un release perfecto.

Gracias por acompañar esta serie hasta acá.
