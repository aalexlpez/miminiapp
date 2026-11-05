# Frontend — criterios y estado de aprobación

**Estado:** requisitos trasladados del [dossier v1.2](references/MiMiniApp_Inicio_Proyecto_Harness_IA_v1.2.md), secciones 4 y 6. La [definición](product-specs/index.md) y ADR-001/002/003/008 del [registro técnico](design-docs/index.md) están aprobados para el alcance de I-01 desde el 2026-11-04. La fixture técnica local está implementada y la ejecución está autorizada. Tipos, lint, formato y build pasan; los 8 E2E/axe con Chromium 156 fijado y revisión asistida visual/teclado pasan. I-01 Aceptado por el propietario el 2026-11-05 y archivado; no se declara implementada la interfaz completa de producto.
**Responsable:** propietario de MiMiniApp.

## Experiencia y contenido

La definición aprobada exige mobile-first con escritorio cuidado. Catálogo, miniapps, navegación, controles y resultados deben ser utilizables sin recortes ni scroll horizontal accidental, con estados de carga, vacío, error y éxito cuando proceda. No anunciar funciones o herramientas inexistentes.

La UI debe explicar brevemente para qué sirve cada herramienta y cómo usarla. Ejemplos reales y restablecimiento rápido permiten probar y grabar su funcionamiento; no se simula una capacidad para el vídeo. La legibilidad vertical 9:16 es un criterio de demostración y no limita la experiencia de escritorio.

## Idiomas y rutas

Español e inglés completos desde lanzamiento: contenido visible, formularios, errores, etiquetas accesibles y metadatos. El selector mantiene la miniapp equivalente. `/es/` y `/en/`, canónicas y `hreflang` son la propuesta de [arquitectura](design-docs/architecture-target.md) por concretar.

Separar traducciones y formatos de la lógica de dominio. Formatear fechas, números e importes según locale cuando corresponda, manteniendo valores computacionales consistentes. Comprobar enlaces directos, idioma y 404 real en la implementación futura.

El mecanismo propuesto por el dossier es `Intl` cuando proceda, sin mezclar el formato visual con los valores usados en cálculos; su configuración se comprobará con el stack de la iteración correspondiente.

## Accesibilidad y rendimiento

Objetivo de diseño: **WCAG 2.2 AA**, con teclado, foco visible, contraste, etiquetas, nombres accesibles y anuncios de resultado. axe u otras comprobaciones automáticas no sustituyen la revisión manual ni certifican cumplimiento completo.

Metas de referencia para datos de campo cuando exista audiencia suficiente: **LCP ≤ 2,5 s**, **INP ≤ 200 ms**, **CLS ≤ 0,1**. Una medición local o Lighthouse no demuestra el percentil 75 real. Se propone hidratar solo la interacción necesaria y comprobar presupuestos de descarga/memoria en dispositivos representativos; no se inventa un umbral de bundle sin evaluación.

## Verificación futura

Casos E2E ES/EN, navegación, teclado, demo/reset, errores y móvil/escritorio según [calidad](QUALITY_SCORE.md). Registrar navegadores realmente ejecutados: Chromium móvil/escritorio y otro motor cuando la fase lo justifique. La matriz inicial aprobada de I-01 es únicamente Chromium móvil emulado y escritorio; los otros motores y el diseño visual final se difieren. Tailwind y React están instalados en las versiones aprobadas. Se comprobaron estilos calculados y reflujo a 1280×900/393×851, con seis capturas inspeccionadas y teclado/foco asistidos en Chromium 156.0.8078.4 / revisión 1248. Sin overflow horizontal ni recortes; no se atribuye revisión humana o dispositivo físico. Ver el informe de ejecución.
