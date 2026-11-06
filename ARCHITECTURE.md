# Arquitectura actual

**Actualizado:** 2026-11-06. **I-01:** Aceptado y archivado por el propietario. **I-02:** Aceptado expresamente por el propietario el 2026-11-05 y archivado, tras aprobación del plan/ADR-MMA-011/016/017 y autorización expresa de ejecución.

La base se mantiene en Astro 7.4.5 estático, React/DOM 19.3.1 cuando procede interacción, TypeScript 6.0.3 strict y Tailwind 4.3.4. Node 24.22.2, npm 11.19.1 y dependencias directas exactas con un único lockfile. I-02 no incorpora dependencias visuales o servicios externos.

## Componentes implementados

* `src/layouts/SiteLayout.astro`: documento HTML por idioma, título/descripción, salto al contenido, cabecera y pie comunes. No necesita hidratación React para navegar.
* `src/components/Home.astro`: hero y catálogo, con el mismo shell para cero o varias entradas. `EmptyCatalogue.astro` resuelve cero; `CatalogueCard.astro` presenta los metadatos recibidos cuando existen entradas publicadas.
* `SiteHeader.astro`, `SiteFooter.astro`, `BrandMark.astro` y `LaboratoryArt.astro`: navegación visible, selector ES/EN y gráficos locales de la segunda composición aprobada.
* `src/i18n/common/{es,en}.ts`: textos de plataforma separados de futuras traducciones de miniapps. `src/i18n/validation.ts` valida claves y texto obligatorio al importar los diccionarios durante prerender.
* `src/styles/global.css`: Tailwind mediante `@tailwindcss/vite`, tokens de Laboratorio creativo moderno, reflujo mobile-first, foco y estados comunes.
* `public/fonts/`: Space Grotesk y DM Sans variables autoalojadas en TTF, con sus avisos SIL OFL 1.1. No hay CDN de fuentes; no se añade una dependencia para convertirlas a WOFF2.
* `src/components/EnvironmentFixture.tsx` y `src/lib/validation.ts`: fixture técnica de I-01 y lógica pura conservadas para regresiones. No constituyen una miniapp pública.
* `src/lib/miniapp-registry.ts`: contrato discriminado, validación en runtime, proyección de metadatos publicados, tabla de rutas y resolución por id. `src/miniapps/registry.ts` contiene el registro público explícito vacío.
* `src/lib/locales.ts`: locales admitidos, español predeterminado y constructores de enlaces equivalentes. `src/pages/[locale]/index.astro`, `src/pages/[locale]/apps/[slug].astro`, `src/pages/index.astro` y `src/pages/404.astro` conectan esos contratos con la generación estática.

El [informe I-02](docs/i02-execution-report.md) registra pruebas y capturas reales. El build público contiene once archivos: cuatro HTML (`/`, ES, EN y 404), un CSS, un recurso genérico de integración React y cinco archivos de fuentes/avisos/documentación. Las portadas no solicitan ese JavaScript ni hidratan una isla; no hay miniapps públicas.

## Contrato modular y rutas de I-02

El contrato implementado separa descriptor puro (`id`, `slug`, estado y metadatos ES/EN) de la inscripción publicada con `loadEntry`, importación perezosa literal de `entry.astro`. Un borrador no admite loader. El catálogo consume únicamente la proyección de metadatos publicados. El registro público permanece vacío porque no se ha aprobado una miniapp real.

La portada genérica genera `/es/` y `/en/`. La ruta `pages/[locale]/apps/[slug].astro` genera únicamente publicadas × idiomas y transmite un identificador simple a la fase de render; resuelve el adaptador Astro durante prerender. Cada futura miniapp podrá separar metadatos, adaptador, UI React si procede, dominio puro, traducciones y pruebas dentro de su carpeta, sin editar rutas comunes, layouts u otras herramientas.

`/` usa HTML estático con meta refresh inmediato y enlace a `/es/`; su respuesta local es HTTP 200, no un 301 del servidor. Las rutas/locales/slugs desconocidos devuelven un 404 real en el preview comprobado y recuperación bilingüe mediante `404.html`. La política HTTP y normalización definitivas del alojamiento se comprobarán en I-03, sin configuración de Cloudflare en I-02. No se inventan canónicas ni `hreflang` absolutos sin un origen público aprobado.

Las fixtures sintéticas viven en `tests/integration/fixtures/`, con extensión de fuente de prueba `.fixture`, y el harness las materializa en un proyecto temporal que reutiliza los mismos contratos, rutas y layouts. El ensayo A+D → A+B+D pasó: dos y después cuatro rutas ES/EN; registro y carpeta B son el único delta de alta. Fuentes comunes, diccionarios y A conservan hashes; el HTML de A permanece idéntico salvo el `uid` interno de Astro derivado de la raíz temporal, normalizado solo en la comparación y conservando los hashes originales. Los once archivos del build público excluyen ids, marcas, rutas, HTML, assets y chunks sintéticos o de borrador. No hay una bandera para habilitarlas en el catálogo público.

## Verificación y límites

Vitest conserva la cobertura técnica de I-01 y añade contratos de catálogo/idiomas; Playwright cubre la interfaz ES/EN, rutas, navegación, responsive y axe con Chromium 156.0.8078.4 / revisión 1248, fijado por Playwright 1.64.1. La validación incremental final pasa con 59 unitarias (14 de I-01, 32 del registro, 13 de i18n), 9 componentes y 26 E2E, incluidos 6 casos axe, además de check/lint/formato/build e integración aislada. El harness descubre 2→4 pruebas propias de los módulos, rechaza un build con traducción obligatoria vacía y ejecuta regresiones de navegador de I-01 en ambos perfiles y tres estados axe. No se atribuye exit 0 a una repetición completa de `verify`; se conserva el fallo inicial de accesibilidad y la repetición de comprobaciones afectadas.

`tests/visual/capture.ts` y `tests/visual/zoom.ts` generan las capturas reales y comprueban el zoom del navegador al 200 %. Se revisaron ES/EN en móvil, tablet y escritorio y ensayos 1080×1920 de la portada y scroll al catálogo. Los estados de una y dos tarjetas tienen doce capturas sintéticas separadas. El propietario revisó personalmente las capturas de escritorio/móvil y aceptó I-02 el 2026-11-05. Las superposiciones concretas de futuras grabaciones se conservan como comprobación editorial posterior, sin reabrir la aceptación.

La base I-01 aceptada tiene evidencia histórica de 14 unitarias, 9 componentes y 8 E2E/axe, más revisión asistida de teclado/foco y seis capturas. El [informe I-01](docs/i01-execution-report.md), el [plan archivado](docs/exec-plans/completed/I-01-base-local-y-testing.md) y su [guía de continuación](docs/i01-handoff.md) conservan checkpoints, autorización de traslado, cierre y limitaciones.

No hay miniapp real, backend, base de datos, API externa, persistencia de usuario, analítica, CI remoto, Cloudflare ni despliegue. La primera miniapp, licencia general del proyecto, infraestructura, otros motores/dispositivos físicos y decisiones aún propuestas conservan sus pendientes. Se mantiene PEND-007 y el resto de la deuda documentada. El [objetivo de arquitectura](docs/design-docs/architecture-target.md) y los [ADR](docs/design-docs/index.md) conservan la distinción entre implementación local, contrato aprobado y propuestas futuras.

El propietario autoriza expresamente un commit local de cierre de I-02, sin pushes o despliegues. Solo se prepara el borrador de I-03; no se ejecuta. Su [ExecPlan aceptado y archivado](docs/exec-plans/completed/I-02-catalogo-responsive-e-i18n.md) es la fuente canónica del estado.

Las decisiones objetivo de alojamiento/operación I-03 se aprueban posteriormente con tokens account-owned Editor por Worker y protección nativa de main hasta demostrar el gate y aprobar expresamente su sustitución. No se implementan: cuenta/subdominio preparados según el propietario, sin Workers/tokens/configuración remota creados por el agente. La aprobación técnica y el ExecPlan Aprobado no autorizan provisión, sincronización o despliegues; la arquitectura ejecutable anterior permanece intacta.

## Infraestructura preparada en I-03, Fase A

`.github/workflows/ci.yml` ejecuta la batería local en PR a staging/main y en la rama técnica de I-03. `promotion.yml` evalúa el candidato desde código de base confiable, sin secretos. Los jobs de staging/producción/rollback conservan `if: false` literal: su presencia no equivale a activación. `.github/deployment-policy.json` registra Fase A y deshabilita publicaciones.

`scripts/release/` implementa empaquetado determinista, manifiesto público inocuo, verificación de bytes/procedencia y gates de candidato/merge. La promoción utiliza el mismo artefacto, sin reconstrucción. Las comprobaciones negativas son locales; no sustituyen ensayos de carreras, permisos, rollback o despliegues reales.

`deploy/cloudflare/` contiene dos configuraciones de Static Assets sin script/SSR, con HTML de barra final y 404 real. `public/_redirects` reserva el 301 de raíz a /es/ del proveedor; el preview Astro conserva su raíz 200. No hay Workers creados o publicados por esta ejecución. `playwright.remote.config.ts` separa pruebas públicas de las locales y requiere destino e identidad explícitos. `deploy/github/` conserva cuerpos de configuración deseada, cuya existencia no demuestra protecciones remotas aplicadas.

El [informe Fase A](docs/i03-phase-a-report.md) es la evidencia actual; [I-03](docs/exec-plans/active/I-03-github-actions-y-cloudflare.md) continúa En curso y Fase B requiere autorización expresa.
