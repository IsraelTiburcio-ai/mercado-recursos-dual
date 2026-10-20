# Mercado de Recursos

**Decide cuánto vale cada recurso.** Microjuego de dualidad económica con HTML, CSS, JavaScript y SVG. Seis decisiones por partida, seleccionadas de un banco de 20; la última compara inversiones bajo presupuesto explícito.

## Ejecutar

`npm start` y abrir http://localhost:4173. `npm test` comprueba modelos, dualidad fuerte, rangos y ofertas. No hay dependencias de ejecución. Las fuentes web tienen fallback local.

## Modelo académico

La matriz de recursos es [[2,1],[1,2]]. Caso inicial: c=(5,4), b=(10,8), x=(4,2), z=28; dual y=(2,1). Los otros modelos están definidos en `cases.js`.

Para un cambio aislado, x₁=(2b₁−b₂)/3 y x₂=(2b₂−b₁)/3. La base es factible mientras ambos sean no negativos. Los costos reducidos se mantienen al variar solo b. De ahí:

- ΔA ∈ [b₂/2−b₁, 2b₂−b₁].
- ΔB ∈ [b₁/2−b₂, 2b₁−b₂].

Los extremos se incluyen y pueden ser degenerados. Fuera del rango hay que resolver nuevamente. Cada ronda reinicia el modelo: las compras no se acumulan como cambios en una única fábrica. El balance acumula resultados marginales netos de oportunidades independientes y puede ser negativo por malas compras. Descartar no genera beneficio; fijar un precio máximo es una negociación y no una compra. Precio máximo = precio sombra: beneficio neto cero, no ganancia positiva.

Cada oferta contiene referencia al modelo, recurso, cantidad, costo total, beneficio marginal, neto y decisión correcta; el modelo contiene solución, disponibilidades, precios sombra y rangos. Las comparaciones ofrecen +1 unidad de un solo recurso, nunca ambas mejoras simultáneas.

## QA realizado

- 3 modelos: soluciones primal/dual, igualdad de objetivos y factibilidad.
- 606 puntos de sensibilidad cotejados contra resolución por vértices.
- 20 decisiones: 14 compras/descartes, 3 precios máximos, 3 comparaciones finales.
- 100 selecciones de partida sin decisiones repetidas, con compras, descartes y reto final.
- 5 partidas completas con Chromium/Playwright: 375×812, 390×844, 820×1180, 1180×820, 1440×1000. Resultado 6/6 en cada una; reinicio funcional; sin errores JS ni overflow horizontal; controles ≥44×44.
- Duración automatizada: 60,8 s por partida, con 10 s de lectura simulada por decisión. No equivale a medición de alumnos reales.
- Audio opcional desactivado inicialmente, controles nativos de teclado, foco visible, feedback accesible y movimiento reducido.

Para repetir el navegador: instalar Playwright fuera del proyecto, servir en puerto 4173 y ejecutar `PLAYWRIGHT_MODULE=/ruta/a/playwright/index.mjs node tests/browser.mjs`. `BASE_URL` permite probar producción. El script guarda capturas en el directorio temporal de la sesión original.

## Fuente pendiente

El archivo `GYM 4_251208_083217.pdf` no estaba disponible en la carpeta del proyecto ni en la búsqueda por nombre dentro de su carpeta padre. Por tanto, **no se ha contrastado el contenido de las páginas 15 y 19–22**. La validación matemática es independiente, basada en el modelo proporcionado y las condiciones primal-dual. Adjuntar el PDF para completar la trazabilidad documental.

## Publicación

GitHub Pages se despliega automáticamente desde `main` mediante `.github/workflows/pages.yml`, después de aprobar la validación matemática.
