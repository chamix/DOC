# Referencias Bibliográficas y Literatura Científica

*Bibliografía de soporte para los dos ejes de investigación de este proyecto (`_eje1-aceleracion-desarrollo-software.md` y `_eje2-aceleracion-aprendizaje-fundamentos.md`). Versión v2.0 — auditoría de verificación de enlaces y de no-contaminación cruzada realizada el 2026-07-30 (ver secciones "Verificación de no-contaminación" y "Verificación de enlaces" más abajo, y el Changelog al final del documento).*

---

## Fuentes académicas verificadas — Eje 1 (desarrollo de software)

* **Becker, J., Rush, N., Barnes, E., & Rein, D. (2025).** *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity.* METR. arXiv:2507.09089.
    * *Aporte:* RCT con 16 desarrolladores experimentados (~5 años promedio en los repositorios trabajados), 246 tareas reales asignadas aleatoriamente a condición "con IA" / "sin IA". Hallazgo central: 19% más de tiempo con IA permitida, pero 20% de aceleración autopercibida — brecha directa entre productividad real y percibida. METR revisó el diseño experimental en una fase posterior (2026) al encontrar datos de más difícil interpretación; se cita ese seguimiento como nota de honestidad metodológica, no como refutación.
    * *Limitación declarada:* muestra pequeña (n=16); herramientas evaluadas (Cursor Pro + Claude 3.5/3.7 Sonnet) corresponden a una ventana tecnológica específica (feb.–jun. 2025), no necesariamente generalizable a versiones posteriores de las mismas herramientas.

* **DORA (DevOps Research and Assessment) / Google Cloud (2025).** *State of AI-assisted Software Development 2025.*
    * *Aporte:* encuesta a ~5.000 profesionales técnicos + más de 100 horas de datos cualitativos. Documenta adopción de IA del 90% (+14 pp interanual), 80%+ de productividad percibida, junto con incrementos simultáneos en tiempo de revisión de PR (+441%), tamaño de PR (+51,3%), bugs por desarrollador (+54%) e incidentes por PR (+242,7%). Formula la tesis del "efecto amplificador": la IA no corrige las debilidades de un equipo, las magnifica.
    * *Nota:* es un reporte de industria con metodología de encuesta a gran escala, no un paper peer-reviewed; se trata con ese estatus epistemológico — alto valor por tamaño de muestra y triangulación cualitativa/cuantitativa, menor control experimental que un RCT.

* **GitHub (2024).** *Does GitHub Copilot improve code quality? Here's what the data says.* GitHub Research Blog.
    * *Aporte:* estudio interno de GitHub con mejoras estadísticamente significativas en legibilidad (+3,62%), confiabilidad (+2,94%), mantenibilidad (+2,47%) y concisión (+4,16%) en código asistido por Copilot.
    * *Nota de balance:* fuente producida por la propia empresa que comercializa la herramienta evaluada — se cita junto a fuentes independientes (Uplevel, GitClear) que encuentran resultados opuestos, para no presentar una sola cara de evidencia mixta.

* **Uplevel Data Labs (2024).** Estudio citado en cobertura de *Visual Studio Magazine* (nov. 2024), "GitHub Research Claims Copilot Code Quality Gains in Addition to Productivity".
    * *Aporte:* contraevidencia independiente — usuarios de Copilot con tasa de bugs significativamente más alta, sin mejora de throughput de issues respecto del grupo sin IA.
    * *Nota:* acceso solo a través de cobertura periodística especializada, no al reporte técnico primario completo; se cita con esa salvedad.

* **GitClear (2024).** Datos de "code churn" citados en la misma cobertura de Visual Studio Magazine.
    * *Aporte:* proyección de duplicación del code churn (código reescrito/descartado poco después de escrito) en 2024 respecto de la línea base de 2021 pre-GenAI. Proxy cuantitativo de código generado con baja reflexión previa.
    * *Nota:* dato de industria, no peer-reviewed; se usa como proxy complementario, no como evidencia aislada suficiente.

* **Peng, S., Kalliamvakou, E., Cihon, P., & Demirer, M. (2023).** *The Impact of AI on Developer Productivity: Evidence from GitHub Copilot.* arXiv:2302.06590.
    * *Aporte:* experimento controlado (tarea acotada: implementar un servidor HTTP) con reducción de tiempo de ~55,8% en el grupo con Copilot. Es evidencia de ganancia de velocidad en tareas bien definidas y acotadas, un contexto distinto del ciclo completo de desarrollo.

* **Waseem, M., Ahmad, A., Kemell, K.-K., Rasku, J., Lahti, S., Mäkelä, K., & Abrahamsson, P. (2025).** *Vibe Coding in Practice: Flow, Technical Debt, and Guidelines for Sustainable Use.* arXiv:2512.11922.
    * *Aporte:* formaliza el "flow–debt trade-off": la ausencia de fricción en la generación de código acumula inconsistencias arquitectónicas, vulnerabilidades y sobrecarga de mantenimiento. Fuente central para el argumento de deuda técnica invisible en el momento de generación.
    * *Corrección v2:* autores localizados y agregados — la versión anterior de esta entrada citaba la fuente sin autoría individual.

* **Perry, N., Srivastava, M., Kumar, D., & Boneh, D. (2023).** *Do Users Write More Insecure Code with AI Assistants?* Proceedings of the 2023 ACM SIGSAC Conference on Computer and Communications Security (CCS '23), 2785–2799. https://doi.org/10.1145/3576915.3623157
    * *Aporte:* paper seminal del campo. Participantes con asistente de IA basado en Codex escribieron código significativamente menos seguro que el grupo control, y además creyeron estar escribiendo código más seguro — la versión objetivamente verificable (vulnerabilidades reales) del sesgo de sobreconfianza documentado también por METR. Dato adicional: menor confianza declarada en la IA y mayor reformulación de prompts se asoció con menos vulnerabilidades en el código resultante.

* **Dorner, M., Bauer, A., Šmite, D., Thode, L., Mendez, D., Britto, R., Lukasczyk, S., Zabardast, E., & Kormann, M. (2025).** *Quo Vadis, Code Review? Exploring the Future of Code Review.* arXiv:2508.06879. (Sometido a JSS New Ideas and Trends Papers.)
    * *Aporte:* encuesta transversal a 100 desarrolladores de 5 empresas. Documenta que las sugerencias de agentes de IA se integran al codebase a una tasa mucho menor (16,6%) que las sugerencias humanas (56,5%), evidencia de que el escepticismo estructural hacia el output de IA en revisión de código ya está presente en equipos de práctica.
    * *Corrección v2:* autores localizados y agregados.

* **Tomaz, R., Guenes, P., Araújo, A. A., Baldassarre, M. T., & Kalinowski, M. (2026).** *Impacts of Generative AI on Agile Teams' Productivity: A Multi-Case Longitudinal Study.* Proceedings of the 2026 IEEE/ACM Third International Conference on AI Foundation Models and Software Engineering. arXiv:2602.13766. https://doi.org/10.1145/3793655.3793728
    * *Aporte:* seguimiento de 3 equipos ágiles de una consultora tecnológica durante 13 meses, con telemetría de Jira/SonarQube/Git. Encuentra crecimiento sustancial en volumen de artefactos (PRs, commits, branches) sin aceleración proporcional del ritmo al que el valor integrado llega a producción.
    * *Corrección v2:* autores y DOI localizados y agregados.

## Fuentes académicas verificadas — marco teórico transversal (automation bias)

* **Parasuraman, R., & Manzey, D. H. (2010).** *Complacency and Bias in Human Use of Automation: An Attentional Integration.* Human Factors, 52(3), 381–410. https://doi.org/10.1177/0018720810376055
    * *Aporte:* paper de síntesis del campo de factores humanos. Distingue complacencia (reducción del monitoreo activo por confianza en el sistema automatizado) de sesgo de automatización propiamente dicho (adopción de la recomendación automatizada sin verificación independiente), explicando ambos por asignación de recursos atencionales bajo carga de tareas múltiples. Hallazgo relevante: la complacencia aparece en novatos y expertos por igual, y no se resuelve solo con práctica.

* **Mosier, K. L., Skitka, L. J., Burdick, M. D., & Heers, S. T. (1996).** *Automation Bias, Accountability, and Verification Behaviors.* Proceedings of the Human Factors and Ergonomics Society Annual Meeting, 40(4), 204–208. https://doi.org/10.1177/154193129604000413
    * *Aporte:* con pilotos profesionales, define errores de omisión (no actuar ante un problema no señalado por el sistema automatizado) y de comisión (actuar según la recomendación automatizada aun contradiciendo entrenamiento e indicadores disponibles). Encuentra que la responsabilización explícita (accountability) del operador por la exactitud de sus decisiones reduce los errores de comisión.

* **Skitka, L. J., & Mosier, K. L. (1999–2000, línea de investigación).** *Does automation bias decision-making?* International Journal of Human-Computer Studies.
    * *Aporte:* confirma en población no experta (estudiantes) el mismo patrón de error de comisión/omisión encontrado en pilotos, y muestra que entrenar explícitamente sobre el fenómeno del sesgo de automatización (no solo sobre el uso de la herramienta) reduce los errores de comisión.

* **Romeo, G., & Conti, D. (2025).** *Exploring automation bias in human–AI collaboration: a review and implications for explainable AI.* AI & Society, 41, 259–278. https://doi.org/10.1007/s00146-025-02422-7
    * *Aporte:* revisión sistemática (PRISMA 2020) de 35 estudios peer-reviewed (2015–2025) que traslada el marco clásico de automation bias (aviación, medicina, contextos militares) al escenario contemporáneo de colaboración humano-IA generativa. Hallazgo relevante: las explicaciones del sistema (XAI) pueden aumentar la aceptabilidad percibida sin mejorar la exactitud de la decisión ni mitigar el sesgo — el punto de intervención más viable es el compromiso activo del usuario, no la explicabilidad técnica en sí misma.
    * *Corrección v2:* autores y datos de volumen/páginas localizados y agregados.

---

## Fuentes académicas verificadas — Eje 2 (aprendizaje y fundamentos)

* **Kosmyna, N., Hauptmann, E., Yuan, Y. T., Situ, J., Liao, X.-H., Beresnitzky, A. V., Braunstein, I., & Maes, P. (2025).** *Your Brain on ChatGPT: Accumulation of Cognitive Debt when Using an AI Assistant for Essay Writing Task.* arXiv:2506.08872. MIT Media Lab.
    * *Aporte:* estudio con EEG sobre 32 regiones cerebrales, cuatro meses, tres grupos (LLM / buscador / "solo cerebro"). El grupo LLM mostró la menor conectividad neuronal, el menor sentido de autoría sobre el propio texto —incluida dificultad para citar correctamente lo que habían escrito— y peor desempeño lingüístico/conductual sostenido en las tres sesiones evaluadas.
    * *Nota de balance:* Stanković, M., Hirche, E., Kollatzsch, S., & Doetsch, J. N. (2026). *Comment on: Your Brain on ChatGPT.* arXiv:2601.00856. Señala limitaciones de tamaño muestral, cuestiones de metodología EEG y de reproducibilidad. Se cita junto al paper original por honestidad intelectual: el hallazgo es influyente pero no está exento de objeciones serias dentro de la comunidad académica.

* **Lee, H.-P. (H.), Sarkar, A., Tankelevitch, L., Drosos, I., Rintel, S., Banks, R., & Wilson, N. (2025).** *The Impact of Generative AI on Critical Thinking: Self-Reported Reductions in Cognitive Effort and Confidence Effects From a Survey of Knowledge Workers.* Proceedings of the 2025 CHI Conference on Human Factors in Computing Systems (CHI '25). Microsoft Research. https://doi.org/10.1145/3706598.3713778
    * *Aporte:* encuesta a 319 trabajadores del conocimiento, 936 casos de uso reales analizados. Hallazgo central: mayor confianza en la GenAI se asocia con menor pensamiento crítico aplicado, mientras que mayor autoconfianza se asocia con más. Documenta un desplazamiento de "buscar y resolver" a "verificar y supervisar" en el tipo de actividad cognitiva predominante.

* **Vorfolomeyeva, O. (2026).** *Fluency Illusion: A Review on Influence of ChatGPT in Classroom Settings.* Information, 17(3), 299. https://doi.org/10.3390/info17030299
    * *Aporte:* revisión narrativa conceptual sobre 41 publicaciones (2022–inicios de 2026: 28 estudios empíricos, 9 análisis conceptuales/teóricos, 4 artículos de revisión). Formaliza el mecanismo de "fluency illusion": información fácil de procesar se juzga —erróneamente— como bien comprendida, riesgo que se agrava cuando la fluidez es generada externamente por un sistema de IA en lugar de por el propio sujeto que aprende.
    * *Corrección v2:* autora localizada y agregada (fuente de autoría única).

* **Bjork, R. A., & Bjork, E. L. (2020).** *Desirable Difficulties in Theory and Practice.* Journal of Applied Research in Memory and Cognition, 9(4), 475–479. https://doi.org/10.1016/j.jarmac.2020.09.003
    * *Aporte:* formulación consolidada de la teoría de dificultades deseables (Bjork, 1994): condiciones de aprendizaje que se sienten más difíciles en el momento (espaciado, práctica de recuperación, interleaving) pero producen mejor retención a largo plazo. Distingue *performance learning* (rendir bien de forma inmediata) de aprendizaje real (recuperación y transferencia a contextos distintos). Dato crítico: estas dificultades requieren una base de conocimiento previa para ser productivas — sin fundamentos, la dificultad deja de ser "deseable" y se vuelve solo frustración.

* **Bertsch, S., Pesta, B. J., Wiscott, R., & McDaniel, M. A. (2007).** *The Generation Effect: A Meta-Analytic Review.* Memory & Cognition, 35(2), 201–210. https://doi.org/10.3758/BF03193441
    * *Aporte:* meta-análisis que confirma que la información autogenerada se retiene sustancialmente mejor que la información simplemente leída (d = 0,40 agregado).

* **Roediger, H. L., & Karpicke, J. D. (2006).** *Test-Enhanced Learning: Taking Memory Tests Improves Long-Term Retention.* Psychological Science, 17(3), 249–255. https://doi.org/10.1111/j.1467-9280.2006.01693.x
    * *Aporte:* estudio de referencia del "testing effect" — la recuperación activa de información mediante evaluación supera ampliamente al re-estudio pasivo del mismo material para la retención a largo plazo, específicamente en la retención diferida (no en la evaluación inmediata, donde el re-estudio repetido puede incluso superar a la evaluación repetida).
    * *Corrección v2:* DOI localizado y agregado.

* **Kestin, G., Miller, K., Klales, A., Milbourne, T., & Ponti, G. (2025).** *AI Tutoring Outperforms In-Class Active Learning: An RCT Introducing a Novel Research-Based Design in an Authentic Educational Setting.* Scientific Reports, 15, 17458. https://doi.org/10.1038/s41598-025-97652-6
    * *Aporte:* RCT en curso universitario de Harvard con 194 estudiantes, comparando tutor de IA con andamiaje pedagógico deliberado (guardrails contra alucinación, razonamiento guiado paso a paso, diseño de docentes) contra sesiones de aprendizaje activo en aula. Resultado: ganancias de aprendizaje más del doble a favor del tutor de IA.

* **Brake, J. (2025).** *AI Tutors Can't Solve Bloom's Two Sigma Problem.* Ensayo crítico, Substack.
    * *Aporte:* voz disidente que cuestiona la generalización del resultado de Kestin et al. más allá del contexto específico de un curso universitario con recursos de diseño instruccional dedicados. Se cita para no sobre-vender el contraejemplo positivo.
    * *Nota:* fuente de ensayo/opinión, no paper peer-reviewed; se usa explícitamente como contrapeso argumentativo, no como evidencia empírica independiente.

---

## Fuentes de industria / periodísticas citadas con esa salvedad explícita

Estas fuentes no son papers peer-reviewed. Se incorporan porque aportan datos de contexto relevantes (sentimiento de mercado, cifras agregadas de seguridad), pero cualquier afirmación que dependa exclusivamente de ellas debe presentarse como dato de industria, no como hallazgo científico:

* Reportes de consultoras de seguridad (2026) sobre prevalencia de vulnerabilidades en código generado por IA en producción (cifra de ~45% citada en cobertura especializada) — no se identificó el reporte primario completo, solo cobertura secundaria.
* Datos de sentimiento de desarrolladores hacia herramientas de IA (caída de >70% positivo en 2023 a 29% en 2025) — cifra de encuesta de industria citada en cobertura especializada, sin acceso al informe metodológico completo.
* Cobertura periodística/de comunidad (Hack Reactor y similares, 2025–2026) sobre el debate "aprender a programar en la era de la IA" — se usa como evidencia de consenso profesional emergente, no como literatura académica.

---

## Notas metodológicas generales

* Donde existe evidencia contradictoria sobre un mismo fenómeno (p. ej., calidad de código con Copilot: GitHub vs. Uplevel/GitClear), ambas líneas se mantienen citadas explícitamente en lugar de resolver la tensión a favor de una sola — es una decisión editorial deliberada, no un vacío de investigación.
* El estudio de Kosmyna et al. (2025) y su crítica metodológica (Stanković et al., 2026) se citan siempre juntos, por honestidad intelectual: el hallazgo es influyente pero no está exento de objeciones serias dentro de la comunidad académica.

## Verificación de no-contaminación entre proyectos de investigación

Este proyecto (`genai-como-acelerador`) y el proyecto previo `human-ai-interaction` comparten al mismo autor y abordan temas afines (interacción humano-IA, cognición, escritura/aprendizaje asistido), por lo que se auditó específicamente si alguna fuente del proyecto anterior se había trasladado por error a esta bibliografía. Resultado de la auditoría, línea por línea contra `../../human-ai-interaction/research/_fuentes.md`:

* **Única fuente compartida entre ambos proyectos:** Kosmyna et al. (2025) y su crítica Stanković et al. (2026). Esto **no es contaminación**: es el mismo estudio real (verificado de forma independiente en esta auditoría, ver tabla de verificación de enlaces más abajo), genuinamente relevante para ambas investigaciones por abordar directamente el costo cognitivo del uso de LLMs — se cita en ambos proyectos porque corresponde citarlo en ambos, no por arrastre accidental.
* **Fuentes exclusivas de `human-ai-interaction` que se confirmó que NO aparecen en este documento:** Rezwana & Maher (2022), Lee, Liang & Yang (2022, "CoAuthor" — nótese que es un Lee distinto y un paper distinto del "Lee et al. 2025, CHI, pensamiento crítico" citado en este documento; ambos son reales pero no deben confundirse entre sí), Rogowsky, Calhoun & Tallal (2016), Biber (1988), Brynjolfsson, Li & Raymond (2023/2025), Lin et al. (2024, "Rambler"), Phinnemore et al. (2022), Windl et al. (2022), Schleith et al. (2022), Kraus et al. (2023). Ninguna de estas diez fuentes aparece en esta bibliografía.
* Conclusión de la auditoría: no se detectó mezcla accidental de fuentes entre proyectos.

## Verificación de enlaces (auditoría 2026-07-30)

Cada entrada de este documento fue re-verificada de forma independiente contra su fuente primaria (fetch directo del DOI/arXiv o búsqueda dirigida confirmando título, autores y venue). Resultado:

| Fuente | Método de verificación | Resultado |
|---|---|---|
| Becker, Rush, Barnes & Rein (METR, 2025) — arXiv:2507.09089 | Fetch directo de la página de abstract en arXiv | ✅ Confirmada — abstract, autores y cifras (19%/20%/24%) coinciden exactamente |
| Mosier, Skitka, Burdick & Heers (1996) — DOI 10.1177/154193129604000413 | Fetch directo vía resolución del DOI (SAGE Journals) | ✅ Confirmada — abstract, autores, volumen/páginas (40(4), 204–208) coinciden exactamente |
| Peng, Kalliamvakou, Cihon & Demirer (2023) — arXiv:2302.06590 | Búsqueda dirigida con confirmación cruzada (arXiv + Hugging Face + ResearchGate) | ✅ Confirmada |
| Waseem et al. (2025, vibe coding) — arXiv:2512.11922 | Búsqueda dirigida, autores confirmados vía ResearchGate | ✅ Confirmada — autoría corregida en esta auditoría |
| Dorner et al. (2025, Quo Vadis Code Review) — arXiv:2508.06879 | Búsqueda dirigida, autores confirmados vía página del autor principal y SSRN | ✅ Confirmada — autoría corregida en esta auditoría |
| Tomaz et al. (2026, agile longitudinal) — arXiv:2602.13766 | Búsqueda dirigida, cruzada con ficha ACM DL (DOI 10.1145/3793655.3793728) | ✅ Confirmada — autoría y DOI agregados en esta auditoría |
| Perry, Srivastava, Kumar & Boneh (2023) — DOI 10.1145/3576915.3623157 | Búsqueda dirigida, cruzada con versión arXiv:2211.03622 | ✅ Confirmada |
| Kosmyna et al. (2025) — arXiv:2506.08872 | Búsqueda dirigida, autores completos confirmados | ✅ Confirmada |
| Stanković, Hirche, Kollatzsch & Doetsch (2026) — arXiv:2601.00856 | Búsqueda dirigida, autores y contenido de la crítica confirmados | ✅ Confirmada |
| Romeo & Conti (2025, automation bias review) — DOI 10.1007/s00146-025-02422-7 | Búsqueda dirigida, autores y datos de volumen confirmados | ✅ Confirmada — autoría corregida en esta auditoría |
| Vorfolomeyeva (2026, Fluency Illusion) — DOI 10.3390/info17030299 | Fetch directo de la ficha del artículo en MDPI | ✅ Confirmada — autoría (única autora) agregada en esta auditoría |
| Roediger & Karpicke (2006) — DOI 10.1111/j.1467-9280.2006.01693.x | Búsqueda dirigida, cruzada con SAGE/APS | ✅ Confirmada — DOI agregado en esta auditoría |
| Parasuraman & Manzey (2010) — DOI 10.1177/0018720810376055 | Búsqueda dirigida, volumen/páginas confirmados (Human Factors 52(3), 381–410) | ✅ Confirmada |
| Bjork & Bjork (2020) — DOI 10.1016/j.jarmac.2020.09.003 | Búsqueda dirigida, cruzada con múltiples repositorios (incl. bjorklab.psych.ucla.edu) | ✅ Confirmada |
| Bertsch, Pesta, Wiscott & McDaniel (2007) — DOI 10.3758/BF03193441 | Búsqueda dirigida, cruzada con Springer/SciRP | ✅ Confirmada |
| Kestin, Miller, Klales, Milbourne & Ponti (2025) — DOI 10.1038/s41598-025-97652-6 | Búsqueda dirigida, cruzada con Nature.com y Semantic Scholar | ✅ Confirmada |
| Lee, Sarkar, Tankelevitch, Drosos, Rintel, Banks & Wilson (2025, CHI) — DOI 10.1145/3706598.3713778 | Búsqueda dirigida, autores completos confirmados vía Microsoft Research y ACM DL | ✅ Confirmada |
| DORA / Google Cloud, *State of AI-assisted Software Development 2025* | Reporte de organización, sin DOI — URL de dora.dev confirmada en múltiples resultados de búsqueda independientes | ✅ Confirmada como reporte real; no es peer-reviewed (ver salvedad ya declarada en la entrada) |
| GitHub Research (2024), blog de calidad de código | Reporte de organización, sin DOI — URL de github.blog confirmada | ✅ Confirmada como reporte real; no es peer-reviewed (ver salvedad ya declarada) |
| Uplevel Data Labs, GitClear, cifra de "45% vulnerabilidades", cifra de sentimiento 70%→29%, cobertura Hack Reactor | Solo accesibles vía cobertura periodística secundaria (Visual Studio Magazine y similares); no se localizó el reporte primario completo | ⚠️ No verificadas contra fuente primaria — mantenidas con la salvedad explícita ya declarada en la sección "Fuentes de industria / periodísticas", no se citan como hallazgo científico independiente |
| Brake, J. (2025), ensayo *AI Tutors Can't Solve Bloom's Two Sigma Problem* | Búsqueda dirigida | ✅ Confirmada como ensayo de opinión real (Substack); citada explícitamente como tal, no como paper |

No se identificó ninguna fuente inventada, alucinada o mal atribuida en esta auditoría. Las diez correcciones de autoría/DOI señaladas arriba se aplicaron directamente a las entradas correspondientes en este documento.

---

## Changelog

| Versión | Fecha | Cambio |
|---|---|---|
| v1.0 | 2026-07-30 | Bibliografía original compilada durante la investigación de los ejes 1 y 2. Ocho entradas quedaron citadas sin autoría individual identificada ("autores no identificados en la cobertura consultada"), pendientes de verificación directa. |
| v2.0 | 2026-07-30 | Auditoría completa de verificación de enlaces y de no-contaminación cruzada con el proyecto `human-ai-interaction`. Se agregó autoría completa y/o DOI a seis entradas que la tenían pendiente (Vibe Coding/Waseem et al., Quo Vadis/Dorner et al., estudio longitudinal ágil/Tomaz et al., revisión de automation bias/Romeo & Conti, Fluency Illusion/Vorfolomeyeva, Roediger & Karpicke). Se confirmó, mediante fetch directo o búsqueda dirigida contra fuente primaria, que las 21 fuentes académicas y de organización citadas en este documento son reales y están correctamente atribuidas — no se encontró ninguna fuente inventada. Se confirmó que la única fuente compartida con el proyecto `human-ai-interaction` (Kosmyna et al. 2025 + Stanković et al. 2026) es una reutilización legítima y no una mezcla accidental; se verificó que ninguna de las diez fuentes exclusivas de aquel proyecto se filtró a este documento. Se agregaron las secciones "Verificación de no-contaminación entre proyectos" y "Verificación de enlaces" como nuevo estándar de auditoría para este documento. |
