# Banco de Conceptos
**Pieza en mapeo — "GenAI como herramienta para construir herramientas" (secuela / Parte 2 de "Raise the Level of Abstraction")**

*Frases y conceptos extraídos durante la conversación de ideación, con contexto de origen. Usar como anclas conceptuales (subtítulos, pull-quotes, ejes de sección) al momento de redactar.*

---

### 1. Pattern matching vs. conocimiento de arquitectura

> "La diferencia entre pattern matching y conocimiento de arquitectura."

**Origen:** Ejemplo del scaffolding de módulos Terraform. La IA puede inferir patrones por repetición en un codebase (el *qué*), pero no puede inferir fácilmente las convenciones institucionales invisibles que explican el *por qué* de esas decisiones arquitectónicas.

---

### 2. Oráculo vs. compilador de intención

> "Usar la IA como oráculo vs. usar la IA como compilador de intención."

**Origen:** Ejemplo del reporte de Azure DevOps (prompt conversacional → script PS → app HTML estática). Oráculo = preguntar y aceptar la respuesta sin participar en el cómo. Compilador de intención = el humano diseña el flujo paso a paso y la IA traduce cada paso a ejecución.

**Potencial:** Candidata fuerte a título de sección — es una oposición binaria clara y memorable.

---

### 3. El criterio de cuándo convertir algo descartable en herramienta durable

> "El criterio sobre cuándo detener algo descartable y convertirlo en herramienta durable."

**Origen:** Reflexión sobre qué aporta el ingeniero senior que el prompt de 3 líneas no captura. No es conocimiento técnico — es el juicio sobre el momento de transición entre "experimento de un solo uso" y "abstracción reutilizable".

**Potencial:** Idea más sutil y posiblemente más original que las otras — no aparece tan explícita en el artículo "Raise the Level of Abstraction". Buena candidata para el núcleo argumental.

---

### 4. La recursividad de subir el nivel de abstracción

> "Subir el nivel de abstracción es recursivo: la disciplina se aplica también a cómo usás la herramienta que sube el nivel de abstracción."

**Origen:** Ejemplo del scaffolding de Terraform, conectado con la idea de que el catálogo de módulos ya es en sí mismo una capa de abstracción construida por el equipo de Platform Engineering.

**Potencial:** La conexión más directa con el artículo anterior — le agrega una vuelta de tuerca nueva a la tesis ya planteada ("la IA es la nueva capa de abstracción"). Fuerte candidata para sección puente entre ambas piezas, o para el cierre.

---

### Mención honorable (apoyo, no eje central)

> "Violar invariantes que no están en el código."

**Origen:** Riesgo concreto del ejemplo de Terraform — un módulo generado sin contexto institucional puede ser técnicamente válido (terraform plan/apply exitoso) pero romper convenciones de tagging, boundaries de seguridad o versionado que no están documentadas en el código mismo.

**Uso sugerido:** Apoyo técnico específico dentro de la sección del ejemplo de Terraform, no como concepto central de la pieza.

---

## Casos de estudio mapeados hasta ahora

| # | Caso | Dominio | Patrón ilustrado |
|---|---|---|---|
| 1 | Reporte de Azure DevOps → script PS → app HTML estática | Reporting / automatización | Oráculo vs. compilador de intención |
| 2 | Scaffolding de módulos Terraform (experto vs. inexperto) | Infra-as-Code / Platform Engineering | Pattern matching vs. conocimiento de arquitectura; invariantes no documentadas |

*(Seguir agregando casos a medida que aparecen en la conversación.)*
