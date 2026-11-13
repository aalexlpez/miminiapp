# MiMiniApp

Colección pública de miniapps bilingües (ES/EN): calculadoras, utilidades, experimentos y juegos que se ejecutan en el navegador, sin cuentas ni backend. Sitio estático con Astro, TypeScript y Tailwind.

**Staging:** <https://miminiapp-staging.miminiapp-lab.workers.dev>

## Estado actual

| Área | Situación |
| --- | --- |
| Plataforma | Portada y catálogo ES/EN, identidad animada y apariencia clara/oscura/sistema. |
| Miniapps | Ninguna publicada: el catálogo está vacío a propósito. La primera sigue sin elegir. |
| Staging | Publicado automáticamente con cada merge a `staging`. |
| Producción | Sin desplegar. Promoción y rollback están preparados y bloqueados. |
| Licencia | Sin decidir (`UNLICENSED`). El código no es todavía software libre. |

El detalle de cada iteración está en el [roadmap](docs/roadmap.md). Lo que existe hoy se describe en [ARCHITECTURE.md](ARCHITECTURE.md).

## Puesta en marcha

Necesitas Node 24 (≥ 24.22.1) y npm 11 (≥ 11.19.1). La versión de referencia, la misma que usa CI, está en `.node-version`.

```sh
npm ci
npx --no-install playwright install chromium
npm run dev
```

`npm run dev` sirve el sitio en <http://127.0.0.1:4321>. La segunda línea descarga el Chromium que usan las pruebas de navegador; en entornos con red restringida necesita acceso a `cdn.playwright.dev` y `storage.googleapis.com`.

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo. |
| `npm run build` | Genera el sitio estático en `dist/`. |
| `npm run preview` | Sirve `dist/` en el mismo puerto. |
| `npm run check` | Tipos de Astro y TypeScript en modo estricto. |
| `npm run lint` | ESLint sin warnings permitidos. |
| `npm run format:check` | Prettier sobre código y configuración. |
| `npm run test:unit` | Lógica, registro, traducciones y controles de publicación. |
| `npm run test:components` | Componentes React en jsdom. |
| `npm run test:e2e` | Build y pruebas en Chromium de escritorio y móvil, con accesibilidad. |
| `npm run test:integration` | Alta de miniapps sintéticas en una copia aislada. Requiere un build previo. |
| `npm run verify` | Todo lo anterior en orden. Es lo que ejecuta CI. |

`npm run verify` debe pasar antes de abrir un PR.

## Cómo se trabaja

1. Rama `feature/…` desde `staging`.
2. PR hacia `staging`; CI ejecuta `npm run verify`.
3. Revisión y merge manual.
4. GitHub Actions publica en staging y prueba el sitio desplegado.

Los detalles, incluido cómo se aprueban los cambios, están en [CONTRIBUTING.md](CONTRIBUTING.md). Para añadir una herramienta, sigue la [guía de miniapps](docs/miniapps.md).

## Documentación

| Documento | Contenido |
| --- | --- |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Entorno, ramas, PR, aprobaciones y evidencias. |
| [docs/miniapps.md](docs/miniapps.md) | Cómo añadir una miniapp. |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Mapa del código y de la infraestructura que existen. |
| [docs/product-specs/index.md](docs/product-specs/index.md) | Definición y alcance del producto. |
| [docs/design-docs/index.md](docs/design-docs/index.md) | Decisiones técnicas y su estado. |
| [docs/roadmap.md](docs/roadmap.md) | Iteraciones y su situación. |
| [docs/i03-operations.md](docs/i03-operations.md) | Operación de staging. |
| [docs/exec-plans/tech-debt-tracker.md](docs/exec-plans/tech-debt-tracker.md) | Pendientes y deuda. |

## Trabajar con agentes de IA

[AGENTS.md](AGENTS.md) contiene las reglas de gobierno compartidas; [CLAUDE.md](CLAUDE.md) y [GEMINI.md](GEMINI.md) solo lo importan. El proyecto procede de la plantilla `aalexlpez/harness-engineering` y sus adaptaciones se registran en [harness-decisions.md](docs/harness-decisions.md).

La historia de cómo se llegó hasta aquí vive en los [planes de ejecución](docs/exec-plans/) y en sus informes, no en este archivo.
