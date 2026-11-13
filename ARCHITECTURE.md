# Arquitectura actual

**Actualizado:** 2026-11-13.

Este documento describe lo que existe hoy en la rama `staging`. Las decisiones que lo justifican están en el [registro técnico](docs/design-docs/index.md); lo que todavía es intención, en la [arquitectura objetivo](docs/design-docs/architecture-target.md); la historia, en los [planes de ejecución](docs/exec-plans/). Si este documento y el código difieren, es un error que hay que corregir.

## Resumen

Sitio estático generado con Astro 7. No hay servidor de aplicación, base de datos, API externa, analítica ni cuentas. El build produce HTML, CSS, fuentes y SVG; el único JavaScript que cargan las páginas es inline: un inicializador de apariencia y un módulo que coordina apariencia y movimiento decorativo.

| Pieza | Tecnología |
| --- | --- |
| Generación | Astro 7.4.5, salida `static` |
| Lenguaje | TypeScript 6.0.3 estricto |
| Interacción de miniapps | React 19.3.1, hidratado solo donde una herramienta lo necesite |
| Estilos | Tailwind 4.3.4 mediante `@tailwindcss/vite` |
| Pruebas | Vitest, React Testing Library, Playwright con axe |
| Alojamiento | Cloudflare Workers Static Assets |
| Entrega | GitHub Actions |
| Runtime | Node 24 (referencia 24.22.2) y npm 11, dependencias exactas y un solo lockfile |

## Mapa del código

```text
src/
  pages/          Rutas: raíz, [locale]/, [locale]/apps/[slug] y 404
  layouts/        SiteLayout: documento HTML, cabecera y pie comunes
  components/     Portada, catálogo, marca, apariencia y movimiento
  miniapps/       registry.ts y, en el futuro, una carpeta por herramienta
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

`src/lib/miniapp-registry.ts` define el contrato y `src/miniapps/registry.ts` es la lista explícita de herramientas, hoy vacía.

* Un **descriptor** es metadato puro: `id`, `slug`, `status` (`draft` o `published`), `category`, `tags` opcionales, `publishedAt` y título y descripción en ambos idiomas. Importarlo nunca carga interfaz.
* Una entrada **publicada** añade `loadEntry`, que importa de forma perezosa el `entry.astro` de la herramienta. Un borrador no puede tener cargador.
* `validateRegistry` se ejecuta en build y rechaza ids o slugs duplicados, categorías desconocidas, fechas inválidas, traducciones ausentes y borradores con cargador.
* El catálogo consume solo los metadatos publicados. Los borradores no generan rutas ni dejan rastro en `dist/`.

La [guía de miniapps](docs/miniapps.md) explica cómo añadir una. `npm run test:integration` demuestra el aislamiento: construye una copia con las herramientas sintéticas de `tests/integration/fixtures/` y comprueba que añadir una segunda no altera la primera ni los archivos comunes.

## Interfaz de plataforma

* `SiteLayout.astro` compone el documento, el enlace de salto, `SiteHeader` y `SiteFooter`.
* `Home.astro` muestra el hero y el catálogo. `EmptyCatalogue.astro` resuelve el caso de cero herramientas y `CatalogueCard.astro` el de una o varias.
* `BrandInitial`, `BrandMark`, `Wordmark` y `LaboratoryArt` dibujan la identidad con SVG propios.
* **Apariencia.** `AppearanceInit.astro` resuelve claro, oscuro o sistema antes de la primera pintura a partir de la clave `miminiapp.appearance` de `localStorage`, la única persistencia del sitio. `AppearanceControl.astro` es un botón con popover nativo. Sin JavaScript, el CSS sigue al sistema.
* **Movimiento.** `motion.css` define el ensamblaje de la marca y los bucles del hero. `scripts/motion.ts` los inicia activos, los pausa con el botón de `MotionControl.astro` y los suspende cuando la página no es visible. La pausa no se guarda.

Las páginas de plataforma no hidratan React. `EnvironmentFixture.tsx` y `lib/validation.ts` son la fixture técnica de I-01: se conservan para las regresiones y no forman parte del catálogo.

## Estilos

`global.css` importa Tailwind y declara los tokens de diseño en `@theme`. Los componentes de plataforma usan clases semánticas definidas en `@layer components`, repartidas entre `global.css`, `appearance.css` y `motion.css`. La convención para código nuevo está en [FRONTEND.md](docs/FRONTEND.md#convención-de-estilos).

Space Grotesk y DM Sans se sirven desde `public/fonts/` en WOFF2 variable, sin CDN. Su procedencia y licencia están en [public/fonts/README.md](public/fonts/README.md).

## Entrega

```text
feature/* ── PR ──> staging ── Actions ──> Worker miminiapp-staging
                       │
                       └── PR de promoción ──> main ── Actions ──> Worker miminiapp
                           (bloqueado)                 (bloqueado)
```

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
* `manifest.ts` empaqueta `dist/` con hashes. Lo que se publica es exactamente el artefacto probado, sin reconstruirlo.
* `cloudflare.ts` comprueba el acceso y publica con Wrangler.

Las credenciales de Cloudflare están en el Environment `staging` de GitHub y solo las reciben los pasos de publicación. `deploy/cloudflare/` describe los dos Workers como recursos estáticos sin script; `npm run validate:hosting` lo comprueba sin conectarse. Los JSON de `deploy/github/` son plantillas de los ajustes deseados del repositorio, no la configuración real.

La operación diaria está en la [guía de staging](docs/i03-operations.md).

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

* Producción, promoción y rollback no se han ejecutado nunca.
* El aislamiento de escritura entre los dos Workers no está probado; solo el de lectura.
* La rama por defecto de GitHub es `master`, que no participa en la entrega.
* El resto de pendientes está en el [registro de deuda](docs/exec-plans/tech-debt-tracker.md).
