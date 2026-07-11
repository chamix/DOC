# Banco de Conceptos: Ingeniería Inversa + GenAI

**Fuente:** `_investigacion-unificada-reverse-engineering-genai.md`
**Audiencia:** Mixed (Technical Peers + Business/Leadership)
**Idioma:** ES
**Formato:** Artículo único (no serie) — el pseudo-paper no se dividió en sub-preguntas tan separables como la serie de Mutación Epistemológica.
**Longitud estimada:** 1.200–1.800 palabras (rango medio-alto de tu style guide, dado que hay tres cuerpos teóricos a hilar).

---

## Qué NO entra (recordatorio de alcance)

- Nada de automation bias, confianza calibrada, retención de sugerencias de IA ni dinámica human-in-the-loop — eso es íntegramente "El 2% que importa", pieza separada del backlog.
- Nada de aparato estadístico duro en el cuerpo del artículo (F1, σ, p-valores) — quedó resuelto y explicado en el pseudo-paper; acá, si acaso, una mención cualitativa ("evaluado por ingenieros senior con resultados consistentemente mejores que la herramienta de referencia de la industria").
- Nada de citar más de una fuente de forma formal/atribuida — tu regla de una cita parafraseada máxima por artículo. El resto de la evidencia se narra sin aparato de cita.

---

## Conceptos centrales a trasladar (glosario mínimo, explicado inline para audiencia Mixed)

| Concepto técnico | Traducción narrativa / analogía candidata |
|---|---|
| Ingeniería Inversa (RE) | Examinar para comprender, no para modificar — "leer los planos que nunca se escribieron, mirando el edificio ya construido." |
| Design Recovery | No solo el *qué* del sistema, sino el *por qué* — el criterio experto que reincorpora contexto histórico. |
| Modelo cognitivo de comprensión de programas | La mente humana arma un mapa mental de cómo funciona un sistema; el LLM ahora ayuda a completar ese mapa proponiendo hipótesis — pero no lo arma solo. |
| Recuperación de arquitectura / "software archaeology" | El oficio de reconstruir la estructura de sistemas grandes y mal documentados — excavar contexto perdido, no solo dependencias. |
| El "punto ciego" editorial (IaC) | Casi toda la conversación sobre LLMs + infraestructura como código es sobre *generar* infra nueva; casi nadie habla de *entender* la que ya existe y está en producción hace años. |

---

## La cita elegida (regla: una sola, parafraseada, con atribución)

**Candidata recomendada: Chikofsky & Cross (1990).** Es la que ancla todo el argumento — sin ella el resto del artículo pierde su columna vertebral teórica. Parafraseada como algo del estilo: *"Los investigadores que en 1990 pusieron nombre a la Ingeniería Inversa la definieron como el proceso de examinar un sistema para reconstruir su lógica interna — nunca como el de cambiarlo."* Atribución simple, sin cifra ni cita textual larga.

ArchAgent (2026) y la literatura gris de IaC (los dos artículos de dev.to) quedan como datos de color narrados sin marca de cita formal — refuerzan sin competir por el espacio de "la cita del artículo".

---

## Arco narrativo (tres actos)

1. **Hook / Contexto** — abrir con el caso real (a definir: primera persona o genérico, ver preguntas abajo), sin nombrar todavía "Ingeniería Inversa". Dejar que el patrón se reconozca antes de nombrarlo — efecto "ajá" cuando aparece el término.
2. **Tensión / Desarrollo** — la pregunta que organiza el pseudo-paper: ¿esto que estoy haciendo es la misma disciplina de siempre, o es algo nuevo? Recorrido breve (no exhaustivo) por la teoría clásica, con el giro central: los modelos de comprensión de los 80-90 asumían una sola mente construyendo el mapa; ahora hay una segunda fuente generando hipótesis. Se suma el punto ciego editorial de IaC como tensión secundaria — la práctica ya lo nombra, la teoría todavía no.
3. **Resolución / Insight** — la síntesis de tres niveles del pseudo-paper (Sección 6), bajada a lenguaje llano: la definición no cambió; la forma de pensar sí necesita una extensión; las herramientas sí son genuinamente nuevas. Cierre con el insight central: el "framework mental" que el protagonista creía no tener era, en rigor, el único framework que la evidencia confirma que sigue funcionando.

---

## Decisiones tomadas

1. **Gancho Chapulín Colorado**: sigue pendiente — se reserva para otra sesión/artículo futuro. No se usa acá.
2. **Título**: *"Arqueología de infraestructura: RE con un LLM de copiloto"*
3. **Voz narrativa del caso**: genérico, tercera persona ("un Senior Tech Architect..."), como en el pseudo-paper — no primera persona.

---

## Estructura propuesta

**Título:** Arqueología de infraestructura: RE con un LLM de copiloto

| Bloque | Función narrativa | Contenido | ~Palabras |
|---|---|---|---|
| **Apertura (sin H2)** | Hook / Contexto | El caso genérico, tercera persona: Sr. Tech Architect, infra Azure, módulos de Terraform bien documentados individualmente pero sin vista de sistema, conecta un LLM vía MCP a Azure DevOps sin saber todavía que lo que hace tiene nombre formal. | 150–200 |
| **H2 — "Un nombre de hace 35 años para algo que parece nuevo"** | Tensión (arranque) | La única cita atribuida del artículo: Chikofsky & Cross (1990), parafraseada. Revelar que lo que el protagonista hace ya tiene definición formal — con el matiz de *Design Recovery* (el "por qué", no solo el "qué"). | 250–300 |
| **H2 — "El mapa mental que ahora se arma de a dos"** | Tensión (desarrollo) | Los modelos cognitivos clásicos asumían una sola mente construyendo el mapa de comprensión. El giro: ahora hay una segunda fuente de hipótesis, pero el mapa lo sigue armando el humano. Sin citar autores por nombre — se narra el concepto, no el paper. | 250–300 |
| **H2 — "La industria ya lo llama ingeniería inversa. La academia, todavía no."** | Tensión (punto ciego editorial) | El contraste generación-vs-comprensión en literatura de IaC. ArchAgent y los posts de dev.to como dato de color sin aparato de cita formal — mencionar cualitativamente ("evaluado por ingenieros senior, con resultados consistentemente mejores que la herramienta de referencia"). | 300–350 |
| **H2 — "Lo que cambia y lo que no"** | Resolución / Insight | Síntesis de tres niveles del pseudo-paper (Sección 6) en lenguaje llano: la definición no cambió, la forma de pensar necesita extenderse, las herramientas sí son genuinamente nuevas. | 250–300 |
| **Cierre** | Takeaway + invitación | Insight final de cierre + frase de invitación al research crudo en GitHub (ver patrón exacto en la sección "Cabecera y cierre" más abajo). La firma NO va acá — va en la cabecera, debajo del subtítulo H3. | 100 |

**Total estimado:** ~1.300–1.450 palabras — dentro del rango medio de tu style guide.

**Recordatorio de disciplina de cita:** solo Chikofsky & Cross llevan atribución formal parafraseada; ArchAgent y la literatura gris de IaC se narran sin marca de cita, como hechos del texto.

---

## Cabecera y cierre (patrón verificado contra ART-005 publicado)

**Cabecera** (inmediatamente debajo del H2/título y la imagen):
- Subtítulo en H3 (la `description`/gancho conceptual del artículo).
- Línea de firma en itálica, pegada debajo, sin espacio de por medio: *"por Camilo — [fecha] · [LinkedIn](https://www.linkedin.com/in/ernestocamilovera/)"*.
- Luego el separador (`---`) y arranca el cuerpo.

**Cierre** (último párrafo del cuerpo, no una sección aparte):
- Una frase de invitación a profundizar, en el mismo tono que usaste en ART-005: *"Si querés ver de dónde sale todo esto con más detalle académico —fuentes, contraevidencia y el desarrollo completo—, sigue disponible sin editar en [mi repositorio de investigación](https://github.com/chamix/DOC/blob/main/src/articles/reverse-engineering-genai/research/_investigacion-unificada-reverse-engineering-genai.md)."*
- **Nota**: el link va a quedar roto hasta que pushees `_investigacion-unificada-reverse-engineering-genai.md` al repo — dejar como pendiente explícito antes de publicar, no antes de escribir.
