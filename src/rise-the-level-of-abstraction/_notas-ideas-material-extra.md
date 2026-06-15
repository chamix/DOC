# Notas, ideas, material extra

## En este documento voy a poner las cosas que en el documento principal no puedo poner, porque no se si van o no, porque no las revise, talvez porque no las lei del todo y solo me interesa una parte de ellas o porque me parece que podrian servir para algo.

### Links para revisar:
- https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance
- https://www.deeplearning.ai/the-batch/agentic-design-patterns-part-2-reflection/
- https://www.deeplearning.ai/the-batch/agentic-design-patterns-part-3-tool-use/
- https://www.deeplearning.ai/the-batch/agentic-design-patterns-part-4-planning/
- https://www.deeplearning.ai/the-batch/agentic-design-patterns-part-5-multi-agent-collaboration/

- https://www.langchain.com/blog/how-to-build-a-custom-agent-harness
- https://www.langchain.com/blog/agentic-engineering-redefining-software-engineering
- https://www.langchain.com/blog/the-anatomy-of-an-agent-harness
- https://www.langchain.com/blog/how-to-turn-claude-code-into-a-domain-specific-coding-agent
- https://www.langchain.com/blog/custom-agents
 
- https://www.microsoft.com/en-us/research/publication/human-agent-interaction-challenges/
- https://www.microsoft.com/en-us/research/publication/magentic-ui-report/
 
- https://newsletter.pragmaticengineer.com/p/ide-that-software-engineers-love?utm_source=publication-search
- https://newsletter.pragmaticengineer.com/p/ideas-slow-down-to-speed-up-when
- https://newsletter.pragmaticengineer.com/p/typescript-c-and-turbo-pascal-with
- https://newsletter.pragmaticengineer.com/p/revisiting-no-silver-bullets-in-the
- https://newsletter.pragmaticengineer.com/p/the-pulse-did-capacity-shortages
- https://newsletter.pragmaticengineer.com/p/the-pulse-github-breaks
- https://newsletter.pragmaticengineer.com/p/the-pulse-ai-token-spending-out-of
- https://newsletter.pragmaticengineer.com/p/dhhs-new-way-of-writing-code
- https://newsletter.pragmaticengineer.com/p/building-claude-code-with-boris-cherny
 
- https://teachtogether.tech/en/index.html#s:meetings

- https://martinfowler.com/articles/sensors-for-coding-agents.html
- https://martinfowler.com/bliki/InterrogatoryLLM.html
- https://martinfowler.com/articles/what-is-code.html
- https://martinfowler.com/bliki/VibeCoding.html
- https://third-bit.com/2026/05/20/twelve-ways-to-be-wrong/

- https://github.com/ajlopez?tab=repositories

---

### La Paradoja de la Abstracción: ¿Qué ganamos y qué perdemos?
De acuerdo con investigaciones de la Harvard Business School, elevar el nivel de abstracción es la estrategia más efectiva para acelerar la adopción de tecnologías complejas. Al integrar complementos y dependencias, se libera al usuario de la orquestación minuciosa de las piezas, aumentando drásticamente la productividad del desarrollo.
Sin embargo, este avance exige un intercambio histórico (trade-off): se reduce la necesidad de entender los detalles de implementación a cambio de limitar ciertos grados de libertad de diseño.
A medida que las abstracciones se consolidan, los ingenieros que operan en los niveles superiores pierden el entendimiento profundo de las capas inferiores del "pirámide acumulativa de innovación". Esto se evidencia cuando tecnologías base quedan sepultadas: en la actualidad, habilidades críticas del pasado (como escribir un compilador desde cero) se han convertido en disciplinas de nicho o entrenamiento especializado dentro de las grandes corporaciones tecnológicas.
Además, operar a un nivel demasiado bajo tiene un costo altísimo en sistemas de software modernos de larga vida. Cuando se trabaja directamente picando código rutinario, el ingeniero se encuentra reescribiendo los mismos patrones mecánicos una y otra vez (serialización, logging, validación, tuberías de datos). La estructura del sistema se vuelve implícita en lugar de explícita, y mantener la consistencia se transforma en un esfuerzo manual propenso a errores.

### El Espejismo del Pasado: Por qué falló UML
La ingeniería de software ya intentó antes eliminar el código fuente. En los años 90 y 2000, el auge de UML (Unified Modeling Language) prometió que programaríamos dibujando diagramas de bloques y flechas, y que las herramientas generarían todo el código por debajo.
Como analiza el tecnólogo Mark Wilson, UML falló como mecanismo de abstracción porque operaba exactamente al mismo nivel que el lenguaje de programación. No ocultaba la complejidad: solo "dibujaba" clases, atributos y métodos con cajas. No describía el dominio del sistema, sino la sintaxis misma del código.
Para que una abstracción funcione, el punto de partida debe ser describir el sistema (qué datos existen, cómo fluyen, qué componentes los procesan) and no escribir la micro-sintaxis. Cuando logramos eso, el código se convierte en un artefacto derivado de salida, no en el punto de partida.

### Reflexion para cerrar el articulo?
From https://newsletter.pragmaticengineer.com/p/building-claude-code-with-boris-cherny

"Could software engineers of today be the medieval equivalents of scribes? Boris brought up an interesting analogy: in the middle ages, scribes were a tiny literate elite employed by often-illiterate kings. When the printing press was invented, scribes technically lost their jobs. Still, many of them became writers and authors, and the market for written work expanded beyond prediction!
Boris wondered if we could see the same pattern with software engineers: coding is becoming accessible to everyone. Could the software engineers of today be building systems that have far broader reach, in the future, than ever than before?"
