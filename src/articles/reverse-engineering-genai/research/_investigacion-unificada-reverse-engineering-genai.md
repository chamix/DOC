# Ingeniería Inversa en la Era de los LLMs: ¿Marco Teórico Vigente o Necesidad de un Nuevo Paradigma?

> **Nota del autor**: este es el documento de investigación de respaldo detrás de un futuro artículo de *Technical Logbook* sobre Ingeniería Inversa y GenAI — no es el artículo en sí. Tiene estructura y aparato de citas de pseudo-paper académico, más denso que la narrativa del blog, y lo comparto sin editar (fuentes, notas de proceso y decisiones metodológicas incluidas) para quien quiera profundizar más allá de la versión narrativa. Si llegaste acá buscando la lectura corta, el artículo del blog es la mejor puerta de entrada.

**Documento de investigación — versión pseudo-paper**
**Tipo:** Deep Research
**Fecha:** 2026-07-10 (v2, reemplaza la primera pasada de notas crudas)
**Audiencia objetivo de la pieza final:** Mixed (Technical Peers + Business/Leadership) — la arquitectura de este documento prioriza rigor citable, pero cada sección está pensada para poder narrarse sin jerga sin perder precisión.

---

## Abstract

Cuando un arquitecto de software usa un modelo de lenguaje conectado a un repositorio de módulos de infraestructura como código para reconstruir el entendimiento de un sistema que ya existe, ¿está practicando Ingeniería Inversa (RE) en el sentido que la disciplina definió hace 35 años, o el fenómeno exige un marco nuevo? Este documento revisa tres cuerpos de literatura — la taxonomía fundacional de RE (Chikofsky & Cross, 1990), los modelos cognitivos de comprensión de programas, y la evidencia empírica reciente sobre RE asistida por LLMs (2022-2026) — para argumentar que la definición formal de RE se mantiene vigente sin modificación, pero que el proceso cognitivo que la ejecuta y las herramientas que la instrumentan sí atraviesan un cambio sustantivo. Se identifica además un punto ciego específico en la literatura: la investigación sobre LLMs e Infraestructura como Código (IaC) se concentra casi enteramente en *generación*, dejando la *comprensión de infraestructura existente a escala* — el escenario más común en organizaciones grandes — subrepresentada en la literatura académica, aunque ya reconocida y nombrada como "reverse engineering" en la literatura gris de práctica profesional.

---

## 1. Introducción y pregunta de investigación

La pregunta que organiza este documento nace de un patrón cada vez más común en organizaciones con infraestructura cloud madura: equipos que heredan o mantienen sistemas complejos, razonablemente bien versionados pero pobremente comprendidos como un todo, y que empiezan a apoyarse en un LLM para llenar ese vacío sin ningún framework formal de Ingeniería Inversa de por medio. La Sección 1.1 describe, de forma autocontenida, el caso concreto que sirve de hilo conductor al resto del documento.

La pregunta no es retórica: la literatura de Ingeniería de Software tiene 35+ años de teoría sobre exactamente este tipo de actividad. La pregunta de investigación es, entonces, triple:

1. ¿La definición formal de Ingeniería Inversa aplica sin modificaciones a este tipo de caso, o requiere reinterpretación?
2. ¿Los modelos cognitivos que explican cómo un humano comprende un sistema siguen siendo válidos cuando un segundo agente —el LLM— participa activamente en el proceso?
3. ¿Qué dice la evidencia empírica reciente sobre la efectividad real de esta modalidad, y dónde están los vacíos que la literatura todavía no cubre?

### 1.1 El caso ilustrativo

Para anclar la discusión teórica en un escenario concreto, este documento usa como caso recurrente el siguiente patrón organizacional, reconstruido a partir de una situación real de la industria:

Un Senior Tech Architect asume la conducción de un equipo de Cloud Engineering responsable de una infraestructura Microsoft Azure de escala considerable, consumida por varios centenares de aplicaciones dentro de una compañía grande. El sistema lleva varios años en producción, es operado por un equipo distinto al de ingeniería, y está razonablemente desacoplado y bien estructurado — pero con un punto débil crónico: aunque los módulos de Terraform están documentados individualmente (cada uno con su propio README) y cuentan con cobertura de tests unitarios e integración, no existe una vista consolidada y vigente del sistema completo. La escala y complejidad acumuladas hacen que comprenderlo como un todo sea, en la práctica, muy difícil.

El arquitecto decide abordar ese vacío con la asistencia de un LLM (Claude), conectado al repositorio de código y a los pipelines de despliegue a través de un servidor MCP hacia Azure DevOps. No sigue ningún framework formal de Ingeniería Inversa — de hecho, no identifica conscientemente su actividad como tal en un primer momento. Su objetivo es pragmático: entender el sistema, descubrir dependencias ocultas, exponer deuda técnica no documentada, y enriquecer la documentación existente. El LLM asiste, recomienda y opina; el marco mental que guía la exploración —qué mirar primero, qué preguntar, cuándo una respuesta amerita más investigación— lo aporta enteramente el arquitecto, apoyado en su experiencia. En varios puntos necesita revisar decisiones de arquitectura tomadas en el pasado y reconstruir su contexto original para poder sopesar o refutar lo que el LLM sugiere. El peso final de cada decisión de trade-off sigue recayendo en él — pero ahora con considerablemente más material disponible para argumentarla y estimar riesgos. El proceso completo no se mide en horas ni días, sino en semanas y meses; el resultado es sustancialmente enriquecedor tanto para el proyecto como para su propia comprensión del sistema.

Este caso se retoma a lo largo del documento — y se analiza en profundidad en la Sección 5 — como punto de referencia común para evaluar hasta qué punto cada cuerpo teórico revisado explica lo que efectivamente ocurre en la práctica.

---

## 2. Marco teórico clásico de la Ingeniería Inversa

### 2.1 La taxonomía de Chikofsky & Cross (1990)

El artículo de referencia absoluta del campo — citado incluso en los papers de 2026 sobre LLMs como punto de partida obligatorio — es Chikofsky, E.J. y Cross, J.H. II, *"Reverse Engineering and Design Recovery: A Taxonomy"*, *IEEE Software*, 7(1), 13-17 (1990). DOI: 10.1109/52.43044.

Los autores definen y relacionan seis términos, cuya confusión coloquial es precisamente lo que el paper buscaba resolver:

| Término | Definición |
|---|---|
| **Forward engineering** | Proceso tradicional: de diseño a implementación. |
| **Reverse engineering** | Examinar un sistema para identificar sus componentes e interrelaciones, generando representaciones en otra forma o nivel de abstracción más alto. Es un proceso de **examen**, no de construcción, cambio o replicación. |
| **Redocumentation** | Creación o revisión de una representación equivalente semánticamente, dentro del mismo nivel de abstracción. |
| **Design recovery** | Subconjunto de RE donde se reincorpora conocimiento adicional — experiencia de dominio, información externa — para reconstruir *por qué* el sistema es como es, no solo *qué* es. |
| **Restructuring** | Transformación entre representaciones del mismo nivel de abstracción, preservando comportamiento externo. |
| **Reengineering** | Examen y alteración de un sistema para reconstituirlo en una nueva forma, incluyendo forward engineering posterior a la RE. |

En su formulación más amplia, los autores definen RE como *reproducir toda la información necesaria para comprender un programa dado: su propósito, su función, por qué lo hace, cómo lo logra*. Esta amplitud deliberada es lo que permite que la definición siga aplicando, sin forzar el lenguaje, a examinar módulos de Terraform con asistencia de un LLM: sigue siendo examen orientado a comprensión, no construcción.

**Resultado del análisis**: el caso descrito en la Sección 1.1 es, formalmente, Ingeniería Inversa — y específicamente con fuerte componente de **Design Recovery**, dado que el arquitecto reincorpora activamente su propio juicio experto sobre decisiones arquitectónicas pasadas. El "framework mental" que aporta sin saberlo que está siguiendo una definición académica está, en rigor, ejecutando la definición canónica del campo con notable fidelidad.

### 2.2 Objetivos y motivadores clásicos de la RE

La literatura fundacional identifica tres justificaciones técnicas para practicar RE: **mantenimiento, reutilización y aseguramiento de calidad**. Dentro del objetivo de "comprensión de software" se listan sub-objetivos específicos: lidiar con la complejidad, generar vistas alternativas, recuperar información perdida, detectar efectos secundarios y sintetizar abstracciones de mayor nivel (Chikofsky, Cross y May, capítulo posterior en la serie *Advances in Computers*, ScienceDirect).

El motivador típico que documenta la literatura — documentación existente pero desincronizada con el sistema real — coincide exactamente con el patrón que describe el caso (Sección 1.1): los módulos de Terraform tienen README individuales y cobertura de tests, pero carecen de una vista consolidada y vigente del sistema completo.

### 2.3 Modelos cognitivos de comprensión de programas

Paralelo al marco de Chikofsky/Cross, un segundo cuerpo teórico explica el *cómo* de la comprensión humana de código, mientras el primero explica el *qué*. La síntesis de referencia es Storey, M.A. (2006), *"Theories, tools and research methods in program comprehension: past, present and future"*, *Software Quality Journal*.

Los modelos clásicos, en orden cronológico:

- **Letovsky (1986)** — comprensión como proceso de inferencia y generación de hipótesis.
- **Shneiderman & Mayer (1979)** — distinción entre conocimiento semántico y sintáctico.
- **Brooks (1983)** — comprensión como reconstrucción de hipótesis, con el código como evidencia confirmatoria o refutatoria.
- **Soloway, Adelson & Ehrlich (1988)** — modelo *top-down*, basado en reconocimiento de "planes de programación".
- **Pennington (1987)** — modelo *bottom-up*: primero se construye un "modelo de programa" (estructura de control), luego un "modelo de situación" (semántica de dominio).
- **Von Mayrhauser & Vans (1995), *Integrated Metamodel*** — *IEEE Computer*, 28(8), 44-55. Unifica lo anterior en cuatro componentes: Program Model, Situation Model, Top-Down (Domain) Model, y una Knowledge Base que alimenta a los tres. La comprensión real combina procesos top-down y bottom-up simultáneamente, no uno u otro exclusivamente.

**El punto teórico central de este documento** surge aquí: todos estos modelos, sin excepción, describen un proceso cognitivo *interno y solitario del humano*. La "Knowledge Base" del modelo integrado es explícitamente el conocimiento previo *del programador* — lenguajes, entorno, principios, algoritmos posibles, dominio, exposición previa al código. Ningún modelo de los años 80-90 contempla un segundo agente cognitivo externo participando activamente en la construcción de esos cuatro componentes. Es precisamente ahí donde la teoría clásica necesita una **extensión**, no un reemplazo (desarrollo completo en la Sección 6).

### 2.4 Recuperación de arquitectura y "arqueología de software"

Un tercer cuerpo, más cercano al escenario de infraestructura a gran escala: la **recuperación de arquitectura de software** (*software architecture recovery*), subcampo enfocado en sistemas grandes donde el objetivo no es entender una función aislada sino reconstruir la estructura de alto nivel completa.

Las técnicas clásicas pre-LLM —ACDC (*Algorithm for Comprehension-Driven Clustering*, Tzerpos & Holt, 2000), ARC (*Architectural Recovery using Concerns*, Garcia et al., 2011) y Bunch (Mancoridis et al., 1999)— se basan en análisis estático de dependencias (llamadas, imports, herencia) y *clustering* de entidades de código en componentes arquitectónicos. Su limitación documentada es doble: sensibilidad a la granularidad de entrada (el resultado cambia según se analice a nivel de archivo o de símbolo) y ausencia de contexto semántico — no capturan lógica de negocio codificada en identificadores, comentarios o historial de cambios.

El término **"software archaeology"**, de uso extendido en literatura de industria, describe específicamente el estudio de software legacy pobremente documentado — la etiqueta más cercana en espíritu al trabajo de "tirar del ovillo" que describe el caso (Sección 1.1): no solo recuperar arquitectura sino excavar contexto perdido.

---

## 3. Evidencia empírica: RE asistida por LLMs

### 3.1 El estudio fundacional: Pearce et al. (2022)

*"Pop Quiz! Can a Large Language Model Help With Reverse Engineering?"* (Pearce, H., Tan, B., Khorrami, F., Karri, R., Krishnamurthy, P., Dolan-Gavitt, B. — NYU/University of Calgary, arXiv:2202.01142) es el primer estudio cuantitativo específico de la intersección RE+LLM y establece el punto de referencia empírico del campo.

**Metodología**: usando `code-davinci-001` (precursor de los modelos GPT-Codex), los autores diseñaron 136.260 preguntas — verdadero/falso y de respuesta abierta — sobre 18 programas de ciberseguridad, sistemas de control industrial (ICS) y muestras reales de malware, en cuatro niveles de dificultad progresiva: código fuente original, código con identificadores aleatorizados, código compilado y descompilado (Ghidra), y código descompilado y además *stripped* de símbolos.

**Resultado agregado**: 72.754 de 136.260 preguntas (53,4%) respondidas correctamente. El desglose es más informativo que el agregado:

- Preguntas verdadero/falso sobre capacidades del programa: ~49,7% de aciertos — apenas por encima del azar en un problema binario, aunque con variación fuerte por dominio.
- Extracción de información específica (variables, constantes, protocolos): mejor desempeño con nombres significativos preservados; degradación marcada con el nivel de ofuscación.
- Hallazgo notable: el modelo retuvo capacidad de extraer *valores* correctos (p. ej. constantes de un controlador PID) incluso tras aleatorizar todos los identificadores — evidencia de que no dependía exclusivamente de pattern-matching de nombres, sino de algo más cercano a comprensión estructural del código.

**Conclusión de los autores**: los LLMs muestran potencial real pero **no están listos para RE zero-shot confiable** — la exactitud depende fuertemente de la formulación de la pregunta, y el modelo produce respuestas incorrectas con la misma confianza aparente que las correctas.

### 3.2 Comprensión semántica de código por LLMs: evidencia 2024-2025

La literatura posterior confirma y matiza el patrón de 2022:

- **Empica** (Nguyen, T.T. et al., *Information and Software Technology*, 185, 107780, 2025): framework que introduce transformaciones controladas en código de entrada para medir si los LLMs entienden semántica real o hacen matching superficial de patrones del corpus de entrenamiento.
- *"How Accurately Do Large Language Models Understand Code?"* (arXiv:2504.04372, abril 2025): encuentra que mutaciones que preservan semántica pero alteran la forma superficial del código degradan significativamente la precisión de debugging — señal de que persiste sensibilidad a la forma por encima de lo deseable para comprensión estructural genuina.
- *"Impact of Comments on LLM Comprehension of Legacy Code"* (arXiv:2506.11007, 2025): estudio específico sobre cómo la prevalencia y exactitud de comentarios en código legacy afecta la comprensión de LLMs — relevante directamente para el caso de infraestructura documentada de forma desigual (Sección 1.1), donde algunos módulos tienen README completos y otros no.

### 3.3 ArchAgent: recuperación de arquitectura a escala (2026)

El hallazgo más directamente aplicable al caso (Sección 1.1). *"ArchAgent: Scalable Legacy Software Architecture Recovery with LLMs"* (arXiv:2601.13007, enero 2026) presenta un framework de agentes que combina análisis estático, segmentación adaptativa de código y síntesis LLM para reconstruir arquitecturas multi-vista alineadas con negocio, sobre codebases cross-repositorio de escala industrial (repos de evaluación: 1.000 a 22.000 archivos fuente).

Puntos que conectan directamente con el caso descrito en la Sección 1.1:

- **El problema que atacan es "architectural drift"** — literalmente el mismo fenómeno: sistemas donde la arquitectura documentada, si existe, ya no coincide con la implementación real, por cambios de requisitos y modificaciones ad hoc acumuladas.
- **Limitación explícita reconocida por los autores**: los LLMs puros tienen sesgo de alcance local (*local-scope bias*) — entrenados en corpus de nivel de snippet, omiten funciones, malinterpretan flujo de control o alucinan identificadores al resumir archivos o paquetes completos. La ventana de contexto, incluso a ~200k tokens, no alcanza para cargar un repositorio de millones de líneas de una sola pasada.
- **Metodología de evaluación con humanos reales**: 30 ingenieros senior (≥5 años de experiencia) evaluaron diagramas generados contra ocho repositorios de gran escala con arquitectura documentada como ground truth, con diseño *within-subjects* contrabalanceado para controlar efectos de orden.

> **Cómo leer las métricas que siguen** (para quien no trabaja con evaluación de modelos a diario): el **F1** combina en un solo número qué tan completo y qué tan preciso es un resultado — va de 0 a 1, donde 1 es perfecto. La **σ** (sigma, desviación estándar) indica cuánto varió el resultado entre los distintos repositorios evaluados: una σ chica significa que el método fue consistente, no que acertó por suerte en un caso puntual. El **p-valor** es la probabilidad de que la diferencia observada se deba al azar — por convención en investigación se considera "estadísticamente significativa" cuando es menor a 0,05, y cuanto más chico, mayor la confianza de que la diferencia es real y no ruido. El **tamaño de efecto** cuantifica qué tan grande es esa diferencia en términos prácticos, no solo si existe: por convención (Cohen, 1988), valores por encima de 0,8 ya se consideran "grandes".

- **Resultado principal**: ArchAgent alcanzó F1 = 0,966 (σ = 0,025) frente a F1 = 0,860 (σ = 0,067) de DeepWiki, la herramienta de referencia de industria — una diferencia estadísticamente significativa (prueba t pareada, p = 0,0036) y con un tamaño de efecto de 1,62, muy por encima del umbral de 0,8 considerado "grande". En criollo: no es una mejora marginal ni un resultado que podría explicarse por casualidad — es una diferencia consistente y sustancial.
- **Hallazgo metodológico clave**: el estudio de ablación confirma que **incorporar contexto de dependencias entre servicios (no solo intra-repositorio) mejora significativamente la precisión** — con datos de repositorios reales de los propios participantes (tamaño medio: 425 archivos, 38.171 líneas), la versión con contexto completo superó consistentemente a la versión sin dependencias cruzadas, tanto con Qwen 3 (p = 0,00087) como con una variante de Llama 3 (p = 0,023) — ambos por debajo del umbral convencional de 0,05, es decir con confianza estadística de que la mejora no es azar. Esto valida empíricamente un principio que el caso (Sección 1.1) ilustra de forma práctica: la RE asistida por LLM mejora cuando el agente tiene acceso al *ecosistema* completo del sistema — en ese caso, vía MCP a la totalidad del repositorio de Azure DevOps — y no solo a fragmentos aislados.

Los propios autores señalan, citando a Esposito et al. (2025, sección 3.4), que la reconstrucción arquitectónica *repo-level* end-to-end con LLMs sigue siendo escasa en la literatura — un campo activo pero todavía joven.

### 3.4 Panorama sistemático: Esposito et al. (2025)

*"Generative AI for Software Architecture: Applications, Trends, Challenges, and Future Directions"* (Esposito, M., Li, X., Moreschini, S., Ahmad, N., Cerny, T., Vaidhyanathan, K., Lenarduzzi, V., Taibi, D. — arXiv:2503.13310, marzo 2025, revisado junio 2025) es la primera revisión sistemática multivocal (literatura académica + literatura gris) específica sobre GenAI aplicada a arquitectura de software.

**Metodología**: 621 publicaciones candidatas identificadas por búsqueda sistemática, filtradas con criterios de inclusión/exclusión validados en diez artículos de prueba y con triple revisión de desacuerdos.

**Hallazgo central**: la revisión identifica **adopción significativa de GenAI tanto para soporte de decisiones arquitectónicas como para reconstrucción arquitectónica** — confirmando que el caso (Sección 1.1) no es un experimento aislado sino que se ubica dentro de una tendencia de adopción ya documentada sistemáticamente. Reportan además dominancia de modelos OpenAI GPT y uso consistente de *few-shot prompting* y RAG como técnicas predominantes, aunque señalan diversificación creciente hacia modelos abiertos (Qwen, DeepSeek) hacia 2025.

---

## 4. El punto ciego: Infraestructura como Código — la generación domina, la comprensión es todavía incipiente

Esta sección identifica una oportunidad editorial concreta y verificable.

### 4.1 El sesgo de generación en la literatura académica

Rastreando la producción reciente sobre LLMs e Infraestructura como Código, específicamente Terraform, el patrón es consistente: **casi toda la investigación se concentra en *generación* de IaC desde lenguaje natural, no en comprensión o RE de IaC ya existente**.

- **TerraFormer** (Jana, P., Davidson, S., Bhasker, B., Kan, A., Deoras, A., Callot, L. — ICSE-SEIP '26, arXiv:2601.08734): framework neuro-simbólico que afina LLMs con feedback de verificadores formales para *generar* y *mutar* configuraciones Terraform desde prompts en lenguaje natural, con datasets de 152.000 y 52.000 instancias NL-to-IaC respectivamente. El propio paper cita que Terraform crece más de 30% anual en adopción y que ingenieros experimentados tardan en promedio ~100 minutos en crear una configuración multi-cloud moderadamente compleja — dato útil de contexto sobre la escala del esfuerzo manual que la generación busca reducir.
- Literatura adicional sobre evaluación de LLMs generando Terraform para GCP/AWS vía RAG sobre documentación y catálogos de módulos — de nuevo, dirección generación.

### 4.2 La literatura gris ya usa el término correcto — evidencia de mercado

A diferencia de la literatura académica, la literatura gris de práctica profesional (blogs técnicos de ingeniería, publicaciones de comunidad) sí ha empezado a nombrar explícitamente esta actividad como lo que es. Dos ejemplos recientes (2026) son particularmente reveladores:

- *"Reverse Engineering Existing Cloud Infrastructure into Terraform"* (dev.to, febrero 2026): describe con precisión el escenario — recursos creados manualmente o vía ClickOps, sin código ni documentación confiable, con el objetivo de producir "un código de infraestructura que represente con precisión lo que está corriendo, habilite cambios seguros mediante flujos estándar, y sirva como documentación viva del entorno". El artículo usa herramientas de generación asistida (Terraformer de Google, Former2) como punto de partida, pero es explícito en que "producen código funcional pero a menudo con valores hardcodeados y estructura mínima" — es decir, la generación automática resuelve la sintaxis, no la comprensión.
- *"Working with Terraform: Where LLMs actually help"* (dev.to, abril 2026): reporta específicamente que **importar infraestructura existente** es uno de los dos workflows donde los LLMs "genuinamente reducen el trabajo" — con una anécdota operativa de un proyecto Terragrunt multi-región donde el estado de Terraform, el entorno real y la configuración HCL no coincidían entre sí, y nadie tenía una imagen confiable de qué estaba gestionado y qué no. La conclusión explícita del artículo: *"ninguno [de los dos workflows] reemplaza el juicio [experto]"*.

**Implicación editorial**: existe ya, en 2026, reconocimiento de mercado de que este es un problema de Ingeniería Inversa —incluso se usa el término explícitamente— pero la investigación académica formal que conecte ese reconocimiento de práctica con el aparato teórico de Chikofsky/Cross y con la evidencia empírica de recuperación de arquitectura (ArchAgent, Sección 3.3) todavía no existe de forma dedicada. El artículo que se derive de este documento puede posicionarse explícitamente en ese cruce, con evidencia de ambos lados citada de forma verificable.

### 4.3 Documentación desigual como variable de dificultad

El paper sobre impacto de comentarios en comprensión de código legacy (Sección 3.2) es relevante aquí en un sentido específico: el caso (Sección 1.1) describe módulos de Terraform *individualmente* bien documentados (README por módulo) pero sin vista consolidada del sistema. Esto sugiere una hipótesis verificable para trabajo futuro: la comprensión LLM de infraestructura a escala podría beneficiarse desproporcionadamente de documentación local de alta calidad (a nivel de módulo) incluso cuando falta documentación de sistema completo — un matiz que la literatura general de "documentación mejora comprensión" no distingue todavía a nivel de granularidad.

---

## 5. Análisis del caso a la luz del marco teórico

El caso descrito en la Sección 1.1 funciona como ilustración de los tres cuerpos teóricos revisados operando simultáneamente:

- Formalmente, es **Design Recovery** en el sentido de Chikofsky & Cross (Sección 2.1): el arquitecto no solo examina el sistema, sino que reincorpora activamente conocimiento de dominio y contexto histórico de decisiones pasadas para interpretar lo que encuentra.
- Cognitivamente, ilustra la extensión necesaria al modelo de Von Mayrhauser & Vans (Sección 2.3): el LLM no construye el Program/Situation/Domain Model del arquitecto — pero sí alimenta activamente esos modelos con candidatos que el arquitecto debe validar, refutar o iterar, en particular cuando necesita revisar una decisión de arquitectura pasada para sopesar lo que el LLM sugiere.
- A nivel de herramienta, se alinea con el patrón empíricamente validado por ArchAgent (Sección 3.3): el acceso del LLM al ecosistema completo del repositorio, no a fragmentos aislados, es precisamente la variable que la ablación de ArchAgent confirma como determinante de la precisión.

La duración del proceso —semanas o meses, no horas ni días, según se describe en la Sección 1.1— es consistente con la naturaleza iterativa que la teoría de comprensión de programas predice para sistemas de esta escala y complejidad, con o sin asistencia de LLM: los modelos cognitivos clásicos (Sección 2.3) documentan que la comprensión de sistemas grandes es inherentemente un proceso extendido de construcción y revisión de hipótesis, no un evento puntual.

---

## 6. Discusión: tres niveles de respuesta a la pregunta de investigación

Con la evidencia reunida, la respuesta defendible a la pregunta que organiza este documento tiene tres capas, evitando tanto el boosterismo acrítico como el cinismo reflexivo:

**Nivel 1 — La definición formal se sostiene sin cambios.** Lo que describe el caso (Sección 1.1) sigue siendo, por definición de Chikofsky & Cross (1990), Ingeniería Inversa — examen, no construcción, orientado a generar representaciones de mayor abstracción de un sistema existente, con fuerte componente de Design Recovery. No hace falta renombrar el fenómeno ni reclamar una disciplina nueva.

**Nivel 2 — Los modelos cognitivos de comprensión necesitan una extensión, no un reemplazo.** Todos los modelos revisados (Sección 2.3) asumen un único agente cognitivo construyendo el Program Model, Situation Model y Domain Model. La RE asistida por LLM introduce un segundo agente que alimenta activamente esos modelos con candidatos — pero no los construye por el humano; los modelos siguen siendo *del humano*, verificados contra una fuente externa nueva y falible. El trabajo cognitivo no desaparece: se desplaza de "leer y sintetizar desde cero" a "generar hipótesis con ayuda y arbitrar su validez" (la mecánica específica de esa arbitración —cuándo confiar, cuándo no— es objeto de la pieza separada del backlog, no de este documento).

**Nivel 3 — Las herramientas y técnicas sí están siendo activamente reconstruidas, y ahí está la novedad real.** Los métodos clásicos de recuperación de arquitectura (ACDC, Bunch, ARC — Sección 2.4) eran estáticos, sensibles a granularidad, ciegos a semántica de negocio. Los frameworks emergentes (ArchAgent — Sección 3.3) agregan una capa de síntesis semántica cualitativamente nueva, validada empíricamente con F1 = 0,966 contra ground truth verificado por expertos. Pero ningún estudio serio revisado a la fecha reporta estos sistemas como sustitutos del criterio experto — se documentan, sistemáticamente, como amplificadores de alcance y velocidad que dejan intacta la necesidad de verificación humana estructurada, incluso cuando no se profundiza aquí en la mecánica de esa verificación.

**Tesis defendible, en una frase**: no se trata de una nueva Ingeniería Inversa, sino de la misma disciplina de siempre con una nueva fuente de hipótesis — más rápida y más amplia que cualquier herramienta previa —, pero sin evidencia hasta la fecha de que reduzca la exigencia de criterio experto para arbitrar los trade-offs reales del sistema.

---

## 7. Limitaciones y alcance de esta revisión

- Este documento excluye deliberadamente la literatura sobre confianza calibrada, automation bias y dinámica de aceptación humana de sugerencias de IA — un cuerpo de evidencia sustancial que existe y es directamente relevante al fenómeno descrito, pero que se reserva íntegramente para la pieza separada del backlog ("El 2% que importa") para mantener el foco teórico de este documento en la pregunta de RE propiamente dicha.
- La evidencia empírica de la Sección 3 proviene predominantemente de benchmarks de código (C, Java, Go, Python) y de un caso de recuperación de arquitectura multi-lenguaje (ArchAgent incluye YAML); no hay, a julio de 2026, un estudio con la misma rigurosidad metodológica (ground truth verificado, evaluación con ingenieros senior reales) específico de Terraform/HCL a escala de producción. Esta es precisamente la brecha señalada en la Sección 4.
- La revisión no incluye literatura sobre RE de infraestructura en otros paradigmas de IaC (Pulumi, CloudFormation, Ansible, Kubernetes/Helm), que podría matizar o reforzar las conclusiones.

---

## 8. Conclusión

La Ingeniería Inversa, como disciplina formalmente definida en 1990, no necesita reinvención para dar cuenta de la RE asistida por LLMs — su definición, deliberadamente amplia, ya contempla el fenómeno. Lo que sí exige actualización es la teoría de cómo ocurre la comprensión cognitiva cuando un segundo agente participa activamente en la generación de hipótesis, y las herramientas concretas con las que se practica, que están evolucionando rápido y con evidencia empírica creciente de su efectividad —siempre condicionada a la verificación experta. El caso específico de Infraestructura como Código a escala de producción representa, a la fecha, un espacio de investigación académica todavía abierto, pese a que la práctica profesional ya lo reconoce y lo nombra correctamente.

---

## Referencias

**Teoría clásica de RE y comprensión de programas**

1. Chikofsky, E.J. y Cross, J.H. II (1990). "Reverse Engineering and Design Recovery: A Taxonomy." *IEEE Software*, 7(1), 13-17. https://doi.org/10.1109/52.43044
2. Chikofsky, E.J., Cross, J.H. II, y May, C.H. Jr. "Reverse Engineering." Capítulo en *Advances in Computers* (ScienceDirect). https://www.sciencedirect.com/science/article/pii/S0065245808605963
3. Von Mayrhauser, A. y Vans, A.M. (1995). "Program Comprehension During Software Maintenance and Evolution." *IEEE Computer*, 28(8), 44-55.
4. Storey, M.A. (2006). "Theories, tools and research methods in program comprehension: past, present and future." *Software Quality Journal*. https://link.springer.com/article/10.1007/s11219-006-9216-4
5. "Software Architecture Recovery." Wikipedia (definición general y fuente del dato sobre documentación arquitectónica desincronizada citado en la Sección 2.2). https://en.wikipedia.org/wiki/Software_architecture_recovery
6. "Software Archaeology - Software Architectural Recovery for Legacy Code." Lattix. https://www.lattix.com/software-archaeology-software-architectural-recovery-for-legacy-code/

**RE asistida por LLMs — evidencia empírica**

7. Pearce, H., Tan, B., Khorrami, F., Karri, R., Krishnamurthy, P., Dolan-Gavitt, B. (2022). "Pop Quiz! Can a Large Language Model Help With Reverse Engineering?" arXiv:2202.01142. https://arxiv.org/pdf/2202.01142
8. Nguyen, T.T. et al. (2025). "An empirical study on capability of Large Language Models in understanding code semantics." *Information and Software Technology*, 185, 107780.
9. "How Accurately Do Large Language Models Understand Code?" (2025). arXiv:2504.04372. https://arxiv.org/html/2504.04372v1
10. "Impact of Comments on LLM Comprehension of Legacy Code." (2025). arXiv:2506.11007.

**Recuperación de arquitectura con LLMs**

11. "ArchAgent: Scalable Legacy Software Architecture Recovery with LLMs." (2026). arXiv:2601.13007. https://arxiv.org/html/2601.13007
12. Esposito, M., Li, X., Moreschini, S., Ahmad, N., Cerny, T., Vaidhyanathan, K., Lenarduzzi, V., Taibi, D. (2025). "Generative AI for Software Architecture: Applications, Trends, Challenges, and Future Directions." arXiv:2503.13310. https://arxiv.org/abs/2503.13310

**LLMs + Infraestructura como Código**

13. Jana, P., Davidson, S., Bhasker, B., Kan, A., Deoras, A., Callot, L. (2026). "TerraFormer: Automated Infrastructure-as-Code with LLMs Fine-Tuned via Policy-Guided Verifier Feedback." ICSE-SEIP '26. arXiv:2601.08734. https://doi.org/10.1145/3786583.3786898
14. "Reverse Engineering Existing Cloud Infrastructure into Terraform." dev.to (febrero 2026). https://dev.to/slaughter/reverse-engineering-existing-cloud-infrastructure-into-terraform-3e3m
15. "Working with Terraform: Where LLMs actually help." dev.to (abril 2026). https://dev.to/polarsquad/working-with-terraform-where-llms-actually-help-2a4p
