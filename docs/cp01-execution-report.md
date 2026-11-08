# CP-01 — Informe de Iteración 1: identidad estática

**Fecha:** 2026-11-08. **Responsable de aceptación:** propietario de MiMiniApp.

**Resultado:** identidad estática implementada y verificada técnicamente; pendiente de aceptación visual del propietario (CP-AC06). CP-01 permanece `En curso`. **Iteración 2 no iniciada ni autorizada.** El [ExecPlan](exec-plans/active/CP-01-creative-playground.md) es la fuente canónica de estado y límites.

## Procedencia y preservación

* Base remota comprobada: `origin/staging` = `e2830fa0a5682da1660bbf5189daf62b9c90c98c`, merge del PR documental #5. Rama nueva `feature/cp01-identidad-visual` desde esa base; sin modificar directamente staging/main/master.
* Preparación local guardada antes del cambio: 18 archivos de documentación/referencia, tar, patch y manifiesto SHA-256 en `.local/verification/cp01/preparation-backup/`. Ninguna eliminación de la exploración o de documentos sin commit.
* Galerías `.local/creative-playground/` y `.local/creative-playground-v2/` intactas. El [manifiesto de aprobación](design-docs/assets/creative-playground-v2/reference-manifest.json) permite contrastar los originales y copias seleccionadas. No se alteraron los prototipos para hacerlos coincidir con el resultado.
* Aprobación formal de ADR-MMA-018 y CP-01, autorización exclusiva de Iteración 1 y permiso para PR en borrador registrados en las fuentes canónicas. La flotación central está aprobada como dirección/contrato, pero su implementación e intensidad visual quedan para Iteración 2.

## Cambios implementados

`BrandInitial.astro` contiene las cuatro piezas originales. Lo reutilizan `Wordmark.astro`, `BrandMark.astro` y `LaboratoryArt.astro`. Los ocho contornos restantes del wordmark son exactamente `iMiniApp`, tomados del SVG compacto aprobado: no hay una M adicional ni sustitución por texto de otra fuente. Cabecera y pie usan el mismo wordmark; cada enlace se llama MiMiniApp una vez en el árbol accesible.

El hero incorpora la M con la transformación seleccionada y el margen/viewBox del prototipo. Conserva sus formas, colores y distribución general. El estado vacío usa el mismo isotipo dentro del panel existente, sin cambiar copy, mensajes secundarios o disponibilidad del catálogo.

`public/brand/` contiene compacta, editorial e isotipo, claros/oscuros, idénticos a los seis SVG de referencia. La editorial es un recurso reutilizable; no hay selector de identidad o tema oscuro. El favicon SVG estático reutiliza el isotipo y se enlaza desde el layout y el documento de raíz. Se revisó a 16/32/48 px. Fuentes locales y sus avisos OFL sin cambios; no se añade una licencia general del proyecto.

Se ajustan únicamente dimensiones y reglas de la marca que antes componían icono + texto. No se implementan scripts, keyframes, ensamblaje, hover animado, movimiento continuo, control de pausa ni otras funciones de Iteración 2. No se modifican registro modular, dependencias, workflows, despliegue, Cloudflare o protecciones.

## Verificaciones locales

Entorno reutilizado sin reinstalar dependencias: Node 24.22.2, npm 11.19.1, Playwright 1.64.1 y Chromium **156.0.8078.4 / revisión 1248**. Ruta registrada por el capturador: `/workspace/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome`. Sin sustitución por Chromium del sistema.

| Comprobación | Resultado |
| --- | --- |
| `npm run verify` | Exit 0: check, lint, formato, hosting, unitarias, componentes, build/E2E e integración modular. |
| Unitarias | 314/314, 14 archivos; incluye los controles de release/CI existentes. |
| Componentes | 9/9. |
| E2E Chromium escritorio/móvil | 36/36: 26 regresiones existentes, incluidos 6 casos axe, y 10 casos nuevos de identidad/progresivo/recursos. |
| Integración modular | A+D → A+B+D pasa; 2→4 rutas ES/EN, descubrimiento de pruebas de módulos, rechazo de traducción obligatoria vacía, aislamiento y exclusión de borradores/fixtures preservados. |
| Capturas CP-01 | Exit 0: 20 vistas/detalles/comparaciones más foco de teclado y revisión de zoom real. |
| Zoom real al 200 % | ES/EN pasan mediante `chrome.tabs.setZoom(2)`, viewport/DPR acreditados, sin overflow y con enlaces de cabecera visibles y ≥48 px de alto. No se sustituye zoom por DPR. |
| Revisión final de tipos/lint/formato | Repetida al incorporar el capturador reproducible; resultados en el log final. |

Las nuevas E2E contrastan las coordenadas/contornos con la referencia externa aprobada, comprueban una única composición SVG por enlace y las mismas cuatro piezas en marca/hero/estado vacío. Comprueban activos idénticos, favicon, ausencia actual de scripts/animaciones/controles de demo, navegación ES/EN y contenido sin JavaScript a 320 px. No se borró ni debilitó ninguna aserción existente para permitir una aproximación.

Incidencia de preflight: el primer `npm run check` sin `ASTRO_TELEMETRY_DISABLED=1` terminó con ENOENT al intentar crear `/home/agent/.config/astro` en el sandbox. Se utilizó la variable ya prevista por CI, sin cambiar código o configuración de entorno; la batería posterior pasó completa. Git fetch necesitó el acceso de red del ejecutor fuera del sandbox, conservando proxy/política; después se acreditó la base remota actual. No se amplió ningún dominio o permiso.

## Capturas comparativas y revisión asistida

Las capturas de implementación provienen del build ordinario servido solo en loopback. Las referencias se abren desde la galería original **sin modificarla**, con reduced-motion, y están rotuladas para distinguirlas del producto. Los [PNG seleccionados y su manifiesto](review/cp01-iteration-1/manifest.json) se conservan para revisión en el repositorio; no se sirven en el build público.

| Vista | Aplicación real | Comparación con v2 |
| --- | --- | --- |
| Escritorio ES | [Captura](review/cp01-iteration-1/desktop-es.png) | [Lado a lado](review/cp01-iteration-1/comparison-desktop-es.png) |
| Escritorio EN | [Captura](review/cp01-iteration-1/desktop-en.png) | [Lado a lado](review/cp01-iteration-1/comparison-desktop-en.png) |
| Móvil ES | [Captura](review/cp01-iteration-1/mobile-es.png) | [Lado a lado](review/cp01-iteration-1/comparison-mobile-es.png) |
| Móvil EN | [Captura](review/cp01-iteration-1/mobile-en.png) | [Lado a lado](review/cp01-iteration-1/comparison-mobile-en.png) |
| Favicon 16/32/48 px | [Tamaños reales](review/cp01-iteration-1/favicon-sizes.png) | Mismas piezas del isotipo seleccionado |
| Vertical 9:16 | [Portada](review/cp01-iteration-1/vertical-9x16-home.png), [catálogo tras scroll](review/cp01-iteration-1/vertical-9x16-catalogue.png) | Viewport móvil real 360 × 640 a DPR 3 → 1080 × 1920 |

Revisión asistida realizada: M integrada y legible, sin hueco de isotipo separado; cabecera/pie coherentes; símbolo central idéntico en lenguaje y geometría; estados vacío y bilingüe conservados; favicon reconocible pequeño. Los PNG apoyan la revisión, no sustituyen la aceptación visual del propietario ni certifican WCAG completa.

**Diferencias visibles respecto a la galería:** la web conserva los márgenes, tamaños responsive del hero, colores de navegación, subrayado del titular, texto secundario del catálogo y composición del estado vacío/pie del producto I-02. La galería era una reconstrucción aislada con CSS de exploración; no se copian sus barras de demo ni sus simplificaciones de catálogo. El nuevo wordmark y la M central conservan los contornos y proporciones seleccionados. El viewBox ampliado conserva el margen de dibujo previsto para la identidad aprobada. Todas las formas están estáticas porque las animaciones pertenecen a Iteración 2. No se atribuye al hito actual la validación de su intensidad o ritmo.

## Matriz de criterios y punto de parada

| Criterio | Estado en esta entrega |
| --- | --- |
| CP-AC01 | Verificado técnicamente: geometría coincidente, compacta/editorial e isotipo claros/oscuros. |
| CP-AC02 | Verificado técnicamente: nombres/enlaces únicos, cabecera/pie y favicon. |
| CP-AC03 | Verificado técnicamente: M central y coherencia del catálogo, sin publicación de fixtures. |
| CP-AC04 | Verificado técnicamente/asistido: ES/EN, matriz responsive, teclado/axe y zoom real. |
| CP-AC05 | Verificado: batería completa e independencia modular. |
| CP-AC06 | Comparaciones entregadas; **pendiente aceptación visual del propietario**. |
| CP-AC07–14 | No ejecutados como criterios finales: corresponden a Iteración 2 o al cierre completo. Evidencia estática parcial de AC14 disponible, sin afirmar cumplimiento del resultado animado. |

PR **[#6](https://github.com/aalexlpez/miminiapp/pull/6)** abierto en borrador hacia staging. Commit de implementación `007534ce15b3f34c2b90da7674c767bb6e5552b1`; **CI quality success** en [run 42512670663](https://github.com/aalexlpez/miminiapp/actions/runs/42512670663), evento pull_request del PR #6 y SHA de head coincidente, comprobado mediante API. Todos los pasos requeridos terminaron satisfactoriamente. Las actualizaciones posteriores de este informe son exclusivamente documentales; el resultado del SHA vigente se consulta en los checks del PR antes de su entrega. La descarga del ZIP de logs desde Codex recibió 403 en `results-receiver.actions.githubusercontent.com`; no se amplió la red. La evidencia API de run/job/steps sí está disponible, y los logs íntegros se consultan en GitHub. Los conteos anteriores pertenecen a la ejecución local registrada; no se sustituye la evidencia remota por una ejecución local. El PR debe permanecer en borrador, sin merge/auto-merge. El merge a staging puede disparar el publicador ya existente: requiere decisión humana posterior; esta entrega no realiza despliegues. Producción, promoción y rollback siguen bloqueados y master permanece predeterminada.

## Reproducción y evidencia completa

```sh
export PATH=/workspace/.tools/node-v24.22.2-linux-x64/bin:$PATH
export ASTRO_TELEMETRY_DISABLED=1
export PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright
npm run verify
node tests/visual/cp01.ts
```

El capturador requiere el build producido por verify, el Chromium fijado y la galería v2 original para las comparaciones. Un clon limpio dispone de las referencias conservadas en docs y las capturas seleccionadas; no se presume que contenga `.local/`. Si falta la galería, restaurar el ZIP de revisión original y verificar sus hashes; no generar una referencia distinta silenciosamente. La reproducción de capturas requiere permitir procesos de navegador/servidor local en el ejecutor.

Evidencia completa ignorada en `.local/verification/cp01/iteration-1/`: `verify.log`, `final-checks.log`, `capture.log`, `visual/capture.json`, `visual/zoom.json`, foco, tablet y detalles. El informe y el manifiesto seleccionado son durables; no se incluyen node_modules, dist, perfiles de navegador, logs temporales o prototipos de laboratorio en el commit. La suite remota no se ejecuta contra el staging actual como si sirviera esta identidad; no se ha publicado el candidato.
