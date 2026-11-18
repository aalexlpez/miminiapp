# Arquitectura actual

**Actualizado:** 2026-11-18.

Este documento describe el código actual: base staging 0d78dd3 (PR #29), recurso aportado en master c918c4c (PR #30) y ampliación de catálogo FE-02/I5 todavía local. Las decisiones que lo justifican están en el [registro técnico](docs/design-docs/index.md); lo que todavía es intención, en la [arquitectura objetivo](docs/design-docs/architecture-target.md); la historia, en los [planes de ejecución](docs/exec-plans). Si este documento y el código difieren, es un error que hay que corregir.

## Resumen

Sitio estático generado con Astro 7. No hay servidor de aplicación, base de datos, API externa, analítica ni cuentas. Las páginas de plataforma solo cargan JavaScript inline para apariencia, movimiento decorativo y, cuando hay herramientas, ayudas del catálogo. Las rutas de miniapps pueden hidratar su interacción React de forma aislada.

| Pieza | Tecnología |
| --- | --- |
| Generación | Astro 7.4.5, salida `static` |
| Lenguaje | TypeScript 6.0.3 estricto |
| Interacción de miniapps | React 19.3.1, hidratado solo donde una herramienta lo necesite |
| Estilos | Tailwind 4.3.4 mediante `@tailwindcss/vite` |
| Pruebas | Vitest, React Testing Library, Playwright con axe |
| Alojamiento | Cloudflare Workers Static Assets |
| Entrega | Actions para staging; promoción por snapshot entre repositorios; Workers Builds para producción |
| Runtime | Node 24 (referencia 24.22.2) y npm 11, dependencias exactas y un solo lockfile |

Las ayudas frontend de H-008 se versionan en .agents/skills como herramientas de
desarrollo, con motor/caché ignorados en .local. global.css excluye .agents y
docs/review/fe01 del
descubrimiento de utilidades Tailwind para que los ejemplos de las skills no
alteren el CSS público. [Perfil y límites comprobados](docs/guides/frontend-skills.md);
no son dependencias de la aplicación ni se sirven desde dist.

## Mapa del código

```text
src/
  pages/          Rutas: raíz, [locale]/, [locale]/apps/[slug] y 404
  layouts/        SiteLayout: documento HTML, cabecera y pie comunes
  components/     Portada, catálogo, marca, apariencia y movimiento
  miniapps/       registry.ts y plan-b/ (dominio y pruebas, aún sin publicar)
  lib/            Contrato del registro, locales y rutas
  i18n/           Textos de plataforma ES/EN y validación de paridad
  scripts/        Módulos de navegador: apariencia y movimiento
  styles/         global.css, appearance.css y motion.css
public/           Fuentes WOFF2, marca, favicon y _redirects
scripts/release/  Gate, empaquetado y publicación usados por Actions
deploy/           Configuración de Cloudflare y plantillas de ajustes de GitHub
tests/            unit, components, e2e, integration, remote y visual
```

## Rutas e idiomas

`src/lib/locales.ts` define los dos idiomas, `es` y `en`, con español por defecto. Las páginas se generan en build:

* `/es/` y `/en/`: portada con catálogo.
* `/es/apps/<slug>/` y `/en/apps/<slug>/`: una página por miniapp publicada e idioma.
* `/`: redirige a `/es/`. En Cloudflare es un 301 definido en `public/_redirects`; en el preview local es una página con meta refresh.
* Cualquier otra ruta devuelve un 404 real con recuperación bilingüe.

Los textos de plataforma viven en `src/i18n/common/`. `validateTranslationParity` se ejecuta al importarlos: si a un idioma le falta una clave o tiene un texto vacío, el build falla. No hay todavía URLs canónicas, `hreflang` ni sitemap.

## Registro de miniapps

`src/lib/miniapp-registry.ts` define el contrato y `src/miniapps/registry.ts` es la lista explícita de herramientas, con Plan B incorporada por autorización del propietario el 2026-11-17 e integrada en staging mediante PR #24.

* Un **descriptor** es metadato puro: `id`, `slug`, `status` (`draft` o `published`), `category`, `tags` opcionales, `publishedAt` y título y descripción en ambos idiomas. `presentation` es opcional (`standard` por defecto o `focused` por opción explícita, ADR-MMA-023). Importarlo nunca carga interfaz.
* Una entrada **publicada** añade `loadEntry`, que importa de forma perezosa el `entry.astro` de la herramienta. Un borrador no puede tener cargador.
* `validateRegistry` se ejecuta en build y rechaza ids o slugs duplicados, categorías desconocidas, fechas inválidas, traducciones ausentes y borradores con cargador.
* El catálogo consume solo los metadatos publicados. Los borradores no generan rutas ni dejan rastro en `dist/`.

ADR-MMA-025 añade `icon` opcional, una ruta de imagen local bajo `/brand/` validada sin URLs externas, parámetros o traversal. `CatalogueCard.astro` muestra un icono de 80 px y nombre de 14 px en una celda de hasta 128 px; el nombre/icono enlazan directamente a la herramienta. La descripción permanece en un popover nativo, accesible al hover/foco y con botón de información táctil. `CatalogueHints.astro` coordina posición, hover y foco con un módulo inline sin imports, hidratación o solicitudes adicionales; Escape y cierre exterior son nativos. No altera hero, rutas o carga perezosa. El monograma de reserva solo cubre metadatos sin recurso. Plan B referencia el original del propietario en `public/brand/plan-b/icon.png` (202×190, RGBA), renombrado sin alterar sus bytes; catálogo, cabecera y marcas de UI usan ese recurso manteniendo su proporción.

Plan B se registra con descriptor `published`, categoría `everyday`, fecha prevista de primera incorporación `2026-11-17` y loader perezoso de `src/miniapps/plan-b/entry.astro`. El build genera tarjeta y rutas `/es/apps/plan-b/` y `/en/apps/plan-b/`; la portada usa metadatos sin hidratar React/Plan B. Staging sirve esa integración, identificada por `3d28184f3c90db44fe57a7592e23a5e71c071f23` y Actions 44060190659. Las dos correcciones PB-01/I6 quedaron integradas por PR #25 (1b2046); staging actual e4b42f1 incorpora también la documentación inicial FE-01. El nuevo frontend FE-01 sigue local; su CI/staging y la aceptación del producto están pendientes.

FE-01/PR #28 está integrada en staging 7cf32ca. El contrato focused de ADR-MMA-023 compacta título/espaciado solo por opción explícita; las demás herramientas conservan su presentación estándar. FE-02/ADR-MMA-024 refina Plan B en la misma rama: pregunta directa, propósito con ideas, obstáculo con Continuar y situación/acción con radios nativos y una opción personalizada. El modo visual no se persiste: se conserva texto literal y sesión v1. La privacidad general vive en el pie fuera del workspace; avisos de almacenamiento/errores siguen en contexto. FE-02 está en regresión local, sin atribuir sus cambios todavía a staging.

Su dominio mantiene validación, fecha narrativa y generadores puros de calendario `.ics`/URL Google, sin navegador o traducciones. La UI Astro/React ES/EN conserva la clave y el esquema de sesión v1: las dos vistas de `plan` viven solo en memoria y la restauración nunca infiere un resultado completo. La fecha se captura al primer cambio real o ejemplo, no al pintar la primera pregunta; reset solo afecta a su clave. La edición del calendario mantiene un borrador local y confirma hora/días válidos conjuntamente, conservando la última preparación guardada hasta entonces. La validación comprueba también el estado nativo badInput para no aceptar una edición incompleta como hora omitida. Sesiones antiguas con horario incompleto conservan sus datos.

`ExportPanel.tsx` ofrece imagen y recordatorio como acciones visibles; este último abre un editor inline con hora nativa, presets y días. La exportación .ics/Google valida y confirma el borrador atómicamente; el candidato confirmado para Google vive en estado React hasta el consentimiento. Formatos, cuatro semanas, destinos sin opener/referrer y privacidad se conservan. Guardado PNG directo, compartir archivo y abrir imagen como alternativas; no se anuncia importación o guardado nativo no observado. El renderer canvas conserva fuentes locales, lienzo 1179×2556 y frase íntegra entre 32–72 % de alto. ADR-MMA-024 añade la identidad Plan B y firma MiMiniApp fuera de la frase; ADR-MMA-025 sustituye el símbolo por el PNG original del propietario. `domain/brand.ts` comparte su ruta entre metadatos/UI/canvas; el renderer espera su decodificación y lo dibuja con su proporción, sin dependencias o red externa. Un fallo de decodificación conserva la recuperación de imagen y el resto de salidas. Codificación clásica toBlob con máximo cinco callbacks mientras está pendiente, cancelados al resolver/fallar; libera canvas/URLs/observadores al editar/reset. No hay backend, telemetría ni llamadas previas a Google. PEND-007 mantiene el riesgo aceptado de herramientas de desarrollo/compilación y su revisión mensual.

`entry.astro` incorpora el CSS estático propio mediante `?inline` y lo emite solo en la ruta de Plan B, antes de la hidratación. El catálogo no descarga ese CSS ni hidrata la herramienta. Las traducciones completas se validan en build y se pasan según locale; las funciones de calendario del navegador importan únicamente sus textos reducidos compartidos, evitando incluir ambos diccionarios de UI en el JS.

Las pruebas conservan copias vacías/draft/publicadas y verifican el recorrido real registrado. La suite remota de Plan B comprueba identidad antes de ejecutar ese mismo recorrido crítico. Compatibilidad/importación/guardado físicos de I4 y revisiones manuales de I5 siguen pendientes; no se presentan mocks ni Chromium emulado como aceptación móvil.

La [guía de miniapps](docs/guides/miniapps.md) explica cómo añadir una. `npm run test:integration` demuestra el aislamiento: construye una copia con las herramientas sintéticas de `tests/integration/fixtures/` y comprueba que añadir una segunda no altera la primera ni los archivos comunes.

## Interfaz de plataforma

* `SiteLayout.astro` compone el documento, el enlace de salto, `SiteHeader` y `SiteFooter`.
* `Home.astro` muestra el hero y el catálogo. `EmptyCatalogue.astro` resuelve el caso de cero herramientas y `CatalogueCard.astro` el de una o varias.
* `BrandInitial`, `BrandMark`, `Wordmark` y `LaboratoryArt` dibujan la identidad con SVG propios.
* **Apariencia.** `AppearanceInit.astro` resuelve claro, oscuro o sistema antes de la primera pintura a partir de la clave `miminiapp.appearance` de `localStorage`, la preferencia persistente de plataforma; Plan B usa además su sesión temporal aprobada en ADR-MMA-020. `AppearanceControl.astro` es un botón con popover nativo. Sin JavaScript, el CSS sigue al sistema.
* **Movimiento.** `motion.css` define el ensamblaje de la marca y los bucles del hero. `scripts/motion.ts` los inicia activos, los pausa con el botón de `MotionControl.astro` y los suspende cuando la página no es visible. La pausa no se guarda.

Las páginas de plataforma no hidratan React. `EnvironmentFixture.tsx` y `lib/validation.ts` son la fixture técnica de I-01: se conservan para las regresiones y no forman parte del catálogo.

## Estilos

`global.css` importa Tailwind y declara los tokens de diseño en `@theme`. Los componentes de plataforma usan clases semánticas definidas en `@layer components`, repartidas entre `global.css`, `appearance.css` y `motion.css`. La convención para código nuevo está en [FRONTEND.md](docs/standards/FRONTEND.md#convención-de-estilos).

Space Grotesk y DM Sans se sirven desde `public/fonts/` en WOFF2 variable, sin CDN. Su procedencia y licencia están en [public/fonts/README.md](public/fonts/README.md).

## Entrega

```text
aalexlpez/miminiapp: feature → PR → staging → Actions → miminiapp-staging
                                      │ SHA completo validado
                                      ↓ dispatch manual
soycerobytes/miminiapp: snapshot → commit propio → rama/PR → quality
                                                        ↓ merge manual a main
                                               Workers Builds → miminiapp
```

Las filas siguientes describen solo los workflows del repositorio de desarrollo. Sus stubs de producción no son el publicador vigente. El [informe de contraste](docs/reports/i03/contract-verification-2026-11-16.md) acredita la implementación en el repositorio de producción, su PR #7 y la publicación satisfactoria.

| Workflow | Disparador | Estado |
| --- | --- | --- |
| `ci.yml` | PR a `staging` o `main` | Activo. Ejecuta `npm run verify` sin secretos. |
| `staging.yml` | Push a `staging` | Activo. Verifica, empaqueta, publica y prueba el sitio desplegado. |
| `promotion.yml` | PR a `main` | Falla siempre, a propósito, hasta que se autorice la promoción. |
| `production.yml` | Push a `main` | Desactivado con `if: false`. |
| `rollback.yml` | Manual | Desactivado. |

`scripts/release/` contiene la lógica que deciden los workflows:

* `gate.ts` valida `.github/deployment-policy.json` y decide quién puede publicar. El propietario puede hacerlo en cualquier destino; las cuentas listadas en `maintainers` solo en staging.
* `github.ts` y `pr-ci.ts` comprueban contra la API de GitHub que el push procede de un PR realmente fusionado y que su CI pasó. `ci.yml` está fijado por hash: cambiarlo exige actualizar `CI_WORKFLOW_BLOB_SHA`.
* `manifest.ts` empaqueta `dist/` con hashes. Staging publica exactamente el artefacto probado. Producción sincroniza fuentes y Workers Builds reconstruye; no se exige equivalencia binaria.
* `cloudflare.ts` comprueba el acceso y publica con Wrangler.

Las credenciales de Cloudflare están en el Environment `staging` de GitHub y solo las reciben los pasos de publicación. `deploy/cloudflare/` describe los dos Workers como recursos estáticos sin script; `npm run validate:hosting` lo comprueba sin conectarse. Los JSON de `deploy/github/` son plantillas de los ajustes deseados del repositorio, no la configuración real.

La operación diaria está en la [guía de staging](docs/guides/staging.md).

## Pruebas

| Carpeta | Herramienta | Cubre |
| --- | --- | --- |
| `tests/unit/` | Vitest (Node) | Registro, rutas, traducciones, apariencia y controles de publicación |
| `tests/components/` | Vitest (jsdom) | Componentes React |
| `tests/e2e/` | Playwright | Portada, catálogo, idiomas, 404, teclado, apariencia, movimiento y axe |
| `tests/integration/` | Node y Playwright | Alta aislada de miniapps sintéticas |
| `tests/remote/` | Playwright | El sitio desplegado; solo lo ejecuta Actions |
| `tests/visual/` | Playwright | Capturas para revisión; no forman parte de `verify` |

Cada miniapp guarda sus propias pruebas en `src/miniapps/<slug>/tests/`: Vitest recoge los `*.test.ts(x)` y Playwright los `*.spec.ts`.

El navegador de pruebas es el Chromium que fija Playwright 1.64.1, en perfiles de escritorio y de móvil emulado. No se han probado Firefox, WebKit ni dispositivos físicos.

## Límites conocidos

* Promoción y producción verificadas en el repositorio independiente `soycerobytes/miminiapp`; rollback antiguo de Actions no ensayado ni activado.
* quality de producción pasó, pero el ruleset observado no lo exige como check obligatorio; la revisión y el merge siguen siendo manuales.
* El aislamiento de escritura entre los dos Workers no está probado; solo el de lectura.
* La rama por defecto de GitHub es `master`, que no participa en la entrega.
* El resto de pendientes está en el [registro de deuda](docs/exec-plans/tech-debt-tracker.md).
