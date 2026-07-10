---
marp: true
theme: technical-logbook
paginate: true
header: 'Technical Logbook · Manual de presentaciones'
footer: 'technical-blog-6xs.pages.dev'
---

<!-- _class: lead -->
<!-- _header: '' -->
<!-- _footer: '' -->

# PRS-000: manual de presentaciones
### Cómo armar un deck con el tema technical-logbook
<p class="byline">por Camilo — Julio 2026 · <a href="https://www.linkedin.com/in/ernestocamilovera/">LinkedIn</a></p>

---

## Qué es este archivo

Este deck cumple dos roles a la vez: es un **ejemplo funcional** que podés exportar y ver renderizado, y es la **documentación** de cómo armar cualquier presentación nueva dentro del repo `DOC`.

Cada slide siguiente muestra el snippet de Markdown/frontmatter necesario, junto con el resultado ya aplicado en esa misma slide.

<p class="small">Guardalo como referencia rápida. No hace falta memorizar la sintaxis de Marp: copiá el bloque de la slide que necesites.</p>

---

## 1. Frontmatter mínimo

Todo deck arranca con estas tres líneas. Sin esto, Marp no sabe qué tema aplicar.

```yaml
---
marp: true
theme: technical-logbook
paginate: true
---
```

- `marp: true` — activa el modo presentación para este archivo.
- `theme: technical-logbook` — referencia el archivo `_themes/technical-logbook.css`.
- `paginate: true` — numera las slides automáticamente (podés verlo abajo a la derecha).

---

<!-- _class: tech-deep -->

## 2. Separador de slides

Tres guiones en una línea propia separan una slide de la siguiente. Nada más.

```markdown
## Slide anterior

contenido...

---

## Slide siguiente

más contenido...
```

<p class="small">Ojo: el mismo <code>---</code> también se usa para cerrar el frontmatter al principio del archivo — Marp distingue por posición, no hay ambigüedad real.</p>

---

## 3. Clases de slide (variantes por audiencia)

Cada slide puede llevar una clase, escrita como comentario HTML **al principio de la slide**:

```markdown
<!-- _class: tech-deep -->

## Título de la slide
```

| Clase | Uso |
|---|---|
| `lead` | apertura del deck (fondo invertido, título grande) |
| `invert` | slide de énfasis o cierre |
| `tech-deep` | Technical Peers — texto más denso, espacio para código |
| `exec-brief` | Business/Leadership — texto grande, poco por slide |

<p class="small">El guion bajo antes de <code>class</code> aplica la clase solo a esa slide. Sin guion bajo, aplicaría a todas las siguientes.</p>

---

<!-- _class: exec-brief -->

## Así se ve exec-brief

Texto más grande, más padding, pensado para que una slide tenga una sola idea y se lea desde el fondo de una sala.

- Menos bullets por slide
- Menos texto por bullet
- La idea, no el detalle

---

<!-- _class: invert -->

## Así se ve invert

Útil para marcar una transición de sección o cerrar con una frase que quede resonando.

**El punto que querés que se recuerden.**

---

## 4. Columnas: dos

```markdown
<div class="columns">
<div>

Contenido columna izquierda

</div>
<div>

Contenido columna derecha

</div>
</div>
```

<div class="columns">
<div>

**Antes**
Prompt como oráculo: se le pide una respuesta y se confía en el resultado.

</div>
<div>

**Ahora**
Prompt como compilador de intención: se itera, se revisa, se corrige.

</div>
</div>

---

<!-- _class: tech-deep -->

## 5. Columnas: tres

Mismo patrón, clase `columns3` en vez de `columns`.

<div class="columns3">
<div>

**Reflection**
El agente revisa su propia salida.

</div>
<div>

**Tool use**
El agente invoca herramientas externas.

</div>
<div>

**Planning**
El agente descompone la tarea en pasos.

</div>
</div>

---

<!-- _class: tech-deep -->

## 6. Código

Los bloques de código estándar de Markdown funcionan tal cual, con resaltado de sintaxis y la fuente monoespaciada del tema.

````markdown
```javascript
const orchestrator = (agents) => {
  return agents.map(a => a.run());
};
```
````

```javascript
const orchestrator = (agents) => {
  return agents.map(a => a.run());
};
```

---

## 7. Tablas

Markdown estándar. El tema ya define bordes y header con la tipografía de títulos.

```markdown
| Framework | Fuente | Export |
|---|---|---|
| Marp | Markdown | HTML, PDF, PPTX |
| Reveal.js | HTML/JS | HTML, PDF |
```

| Framework | Fuente | Export |
|---|---|---|
| Marp | Markdown | HTML, PDF, PPTX |
| Reveal.js | HTML/JS | HTML, PDF |

---

## 8. Callout de alerta

Para un riesgo, advertencia o punto crítico que necesita destacarse del resto del contenido.

```markdown
<div class="alert">
<strong>Ojo:</strong> este paso es irreversible en producción.
</div>
```

<div class="alert">
<strong>Ojo:</strong> este paso es irreversible en producción.
</div>

---

## 9. Byline (apertura de deck)

Mismo formato que usás en los artículos del blog, para consistencia entre canales.

```markdown
<p class="byline">por Camilo — Julio 2026 · <a href="https://www.linkedin.com/in/ernestocamilovera/">LinkedIn</a></p>
```

Se usa una sola vez, en la slide `lead` de apertura — no hace falta repetirla en cada slide.

---

<!-- _class: tech-deep -->

## 10. Estructura de carpetas en DOC

```
DOC/
└── src/
    └── presentations/
        ├── _themes/
        │   └── technical-logbook.css
        └── PRS-000-sample-deck/
            ├── slides.md
            └── img/
```

- Cada presentación vive en su propia carpeta, numerada como `PRS-XXX` (mismo esquema que el Content Index).
- `_themes/` es infraestructura compartida — no se publica como contenido, igual que tus KB files `_`-prefixed.

---

## 11. Exportar el deck

Con el Marp CLI instalado (`npm install -g @marp-team/marp-cli`), desde la carpeta de la presentación:

```bash
# HTML navegable (para compartir un link)
marp slides.md -o index.html

# PDF (para adjuntar o imprimir)
marp slides.md -o deck.pdf --allow-local-files

# PPTX (si alguien necesita editarlo en PowerPoint)
marp slides.md -o deck.pptx
```

<p class="small"><code>--allow-local-files</code> es necesario si el deck referencia imágenes locales en <code>img/</code>.</p>

---

## 12. Registrar en el Content Index

Último paso, igual que con los artículos: agregar la fila correspondiente en la sección **Presentations** del Content Index, con ID `PRS-XXX`, audiencia, tags, status y fecha.

<p class="small">Commit de "contenido creado" y commit de "contenido publicado" siguen siendo commits separados, misma disciplina que ya usás para el blog.</p>

---

<!-- _class: lead -->
<!-- _header: '' -->
<!-- _footer: '' -->

# Listo para armar tu primer deck real
### Copiá esta carpeta como punto de partida
<p class="byline">Technical Logbook — manual interno</p>
