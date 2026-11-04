# Frontend — criterios propuestos

**Estado:** requisitos trasladados del [dossier v1.2](references/MiMiniApp_Inicio_Proyecto_Harness_IA_v1.2.md), secciones 4 y 6; pendientes de aprobación de la [definición](product-specs/index.md) y las [decisiones técnicas](design-docs/index.md). No hay interfaz implementada.
**Responsable:** propietario de MiMiniApp.

## Experiencia y contenido

La propuesta es mobile-first con escritorio cuidado. Catálogo, miniapps, navegación, controles y resultados deben ser utilizables sin recortes ni scroll horizontal accidental, con estados de carga, vacío, error y éxito cuando proceda. No anunciar funciones o herramientas inexistentes.

La UI debe explicar brevemente para qué sirve cada herramienta y cómo usarla. Ejemplos reales y restablecimiento rápido permiten probar y grabar su funcionamiento; no se simula una capacidad para el vídeo. La legibilidad vertical 9:16 es un criterio de demostración y no limita la experiencia de escritorio.

## Idiomas y rutas

Español e inglés completos desde lanzamiento: contenido visible, formularios, errores, etiquetas accesibles y metadatos. El selector mantiene la miniapp equivalente. `/es/` y `/en/`, canónicas y `hreflang` son la propuesta de [arquitectura](design-docs/architecture-target.md) por concretar.

Separar traducciones y formatos de la lógica de dominio. Formatear fechas, números e importes según locale cuando corresponda, manteniendo valores computacionales consistentes. Comprobar enlaces directos, idioma y 404 real en la implementación futura.

El mecanismo propuesto por el dossier es `Intl` cuando proceda, sin mezclar el formato visual con los valores usados en cálculos; su configuración se comprobará con el stack de la iteración correspondiente.

## Accesibilidad y rendimiento

Objetivo de diseño: **WCAG 2.2 AA**, con teclado, foco visible, contraste, etiquetas, nombres accesibles y anuncios de resultado. axe u otras comprobaciones automáticas no sustituyen la revisión manual ni certifican cumplimiento completo.

Metas de referencia para datos de campo cuando exista audiencia suficiente: **LCP ≤ 2,5 s**, **INP ≤ 200 ms**, **CLS ≤ 0,1**. Una medición local o Lighthouse no demuestra el percentil 75 real. Se propone hidratar solo la interacción necesaria y comprobar presupuestos de descarga/memoria en dispositivos representativos; no se inventa un umbral de bundle sin evaluación.

## Verificación futura

Casos E2E ES/EN, navegación, teclado, demo/reset, errores y móvil/escritorio según [calidad](QUALITY_SCORE.md). Registrar navegadores realmente ejecutados: Chromium móvil/escritorio y otro motor cuando la fase lo justifique. La matriz exacta, diseño visual y versiones siguen pendientes. Tailwind y React constan como propuestas técnicas, no dependencias instaladas.
