## 2026-08-15 — Task 14: por qué la ventana de Help no tiene BridgeApi

Decisión deliberada, no un descuido: la ventana de Help no recibe
`preload` en absoluto (ni `window.mdview`), porque es contenido
estático app-authored sin necesidad de cruzar la frontera main↔renderer
para nada — más estricta que la ventana principal a propósito, no una
versión recortada de ella.
